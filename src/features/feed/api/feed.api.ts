import { apiSlice } from "@/lib/api/api-slice";
import { unwrapData, unwrapList, type ApiListResponse } from "@/lib/api/unwrap";
import type { ApiResponse } from "@/types/api.types";
import type { RootState } from "@/store";
import type { AppDispatch } from "@/store";

import type {
  ApiComment,
  ApiPostDetail,
  CommentsPage,
  LikeToggleResult,
  PostsPage,
} from "../types/feed.api.types";
import { COMMENTS_LIMIT, FEED_LIST_ARG } from "../types/feed.api.types";

export type FeedListArg = { limit?: number; cursor?: string };

export function normalizeFeedListArg(
  arg: FeedListArg | typeof FEED_LIST_ARG | void,
): FeedListArg {
  if (!arg) return { ...FEED_LIST_ARG };
  const limit =
    "limit" in arg && arg.limit != null ? arg.limit : FEED_LIST_ARG.limit;
  const cursor = "cursor" in arg && arg.cursor ? arg.cursor : undefined;
  return {
    limit,
    ...(cursor ? { cursor } : {}),
  };
}

const ROOT_FEED_ARG = normalizeFeedListArg(FEED_LIST_ARG);

type CachePatch = { undo: () => void };

function patchFeedList(
  dispatch: AppDispatch,
  update: (draft: PostsPage) => void,
): CachePatch {
  return dispatch(
    feedApi.util.updateQueryData("getPosts", ROOT_FEED_ARG, update),
  );
}

function patchPostDetail(
  dispatch: AppDispatch,
  id: string,
  update: (draft: ApiPostDetail) => void,
): CachePatch {
  return dispatch(feedApi.util.updateQueryData("getPost", id, update));
}

export const feedApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query<PostsPage, FeedListArg | void>({
      query: (arg) => {
        const normalized = normalizeFeedListArg(arg);
        return {
          url: "/posts",
          params: {
            cursor: normalized.cursor,
            limit: normalized.limit,
          },
        };
      },
      serializeQueryArgs: ({ queryArgs }) => {
        const { limit, cursor } = normalizeFeedListArg(queryArgs);
        return `posts-list:${limit}:${cursor ?? "root"}`;
      },
      keepUnusedDataFor: 120,
      transformResponse: (response: ApiListResponse<ApiPostDetail[]>) =>
        unwrapList(response),
      providesTags: (result) =>
        result
          ? [
              { type: "Post", id: "LIST" },
              ...result.data.map(({ id }) => ({ type: "Post" as const, id })),
            ]
          : [{ type: "Post", id: "LIST" }],
    }),

    getPost: builder.query<ApiPostDetail, string>({
      query: (id) => `/posts/${id}`,
      keepUnusedDataFor: 120,
      transformResponse: (response: ApiResponse<ApiPostDetail>) =>
        unwrapData(response),
      providesTags: (_result, _err, id) => [{ type: "Post", id }],
    }),

    createPost: builder.mutation<
      ApiPostDetail,
      { content?: string; files?: File[] }
    >({
      query: ({ content, files }) => {
        const body = new FormData();
        const text = content?.trim();
        if (text) body.append("content", text);
        files?.forEach((file) => body.append("attachments", file));
        return { url: "/posts", method: "POST", body };
      },
      transformResponse: (response: ApiResponse<ApiPostDetail>) =>
        unwrapData(response),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data: post } = await queryFulfilled;
          patchFeedList(dispatch, (draft) => {
            if (draft.data.some((p) => p.id === post.id)) return;
            draft.data.unshift(post);
          });
          dispatch(feedApi.util.upsertQueryData("getPost", post.id, post));
        } catch {
          // caller shows toast
        }
      },
    }),

    getComments: builder.query<
      CommentsPage,
      { postId: string; cursor?: string; limit?: number }
    >({
      query: ({ postId, cursor, limit = COMMENTS_LIMIT }) => ({
        url: `/posts/${postId}/comments`,
        params: { cursor, limit },
      }),
      transformResponse: (response: ApiListResponse<ApiComment[]>) =>
        unwrapList(response),
      providesTags: (_result, _err, { postId }) => [
        { type: "Comment", id: postId },
      ],
    }),

    deletePost: builder.mutation<void, string>({
      query: (id) => ({ url: `/posts/${id}`, method: "DELETE" }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const listPatch = patchFeedList(dispatch, (draft) => {
          draft.data = draft.data.filter((p) => p.id !== id);
        });
        try {
          await queryFulfilled;
          dispatch(apiSlice.util.invalidateTags([{ type: "Post", id }]));
        } catch {
          listPatch.undo();
        }
      },
    }),

    likePost: builder.mutation<LikeToggleResult, string>({
      query: (id) => ({ url: `/posts/${id}/like`, method: "POST" }),
      transformResponse: (response: ApiResponse<LikeToggleResult>) =>
        unwrapData(response),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const toggle = (post: ApiPostDetail) => {
          post.has_liked = !post.has_liked;
          post.likes = Math.max(0, post.likes + (post.has_liked ? 1 : -1));
        };

        const listPatch = patchFeedList(dispatch, (draft) => {
          const post = draft.data.find((p) => p.id === id);
          if (post) toggle(post);
        });
        const detailPatch = patchPostDetail(dispatch, id, toggle);

        try {
          const { data } = await queryFulfilled;
          const sync = (post: ApiPostDetail) => {
            if (post.has_liked === data.liked) return;
            post.has_liked = data.liked;
            post.likes = Math.max(0, post.likes + (data.liked ? 1 : -1));
          };
          patchFeedList(dispatch, (draft) => {
            const post = draft.data.find((p) => p.id === id);
            if (post) sync(post);
          });
          patchPostDetail(dispatch, id, sync);
        } catch {
          listPatch.undo();
          detailPatch.undo();
        }
      },
    }),

    createComment: builder.mutation<
      ApiComment,
      { postId: string; content: string }
    >({
      query: ({ postId, content }) => ({
        url: `/posts/${postId}/comments`,
        method: "POST",
        body: { content },
      }),
      transformResponse: (response: ApiResponse<ApiComment>) =>
        unwrapData(response),
      async onQueryStarted(
        { postId, content },
        { dispatch, queryFulfilled, getState },
      ) {
        const user = (getState() as RootState).auth.user;
        const optimisticComment = {
          id: `temp-${Date.now()}`,
          created_at: new Date().toISOString(),
          content,
          parent_id: null as string | null,
          deleted_at: null as string | null,
          is_deleted: false,
          likes: 0,
          user: {
            id: user?.id ?? "me",
            first_name: user?.first_name || "You",
            last_name: user?.last_name ?? "",
            avatar: null,
          },
        };

        const applyOptimistic = (post: ApiPostDetail) => {
          post.comments += 1;
          post.latest_comment = optimisticComment;
        };

        const listPatch = patchFeedList(dispatch, (draft) => {
          const post = draft.data.find((p) => p.id === postId);
          if (post) applyOptimistic(post);
        });
        const detailPatch = patchPostDetail(dispatch, postId, applyOptimistic);
        const commentsPatch = dispatch(
          feedApi.util.updateQueryData(
            "getComments",
            { postId, limit: COMMENTS_LIMIT },
            (draft) => {
              draft.data.unshift({ ...optimisticComment, post_id: postId });
            },
          ),
        );

        try {
          const { data: comment } = await queryFulfilled;
          const applyReal = (post: ApiPostDetail) => {
            post.latest_comment = {
              id: comment.id,
              created_at: String(comment.created_at),
              content: comment.content,
              parent_id: comment.parent_id,
              deleted_at: comment.deleted_at
                ? String(comment.deleted_at)
                : null,
              is_deleted: comment.is_deleted,
              likes: comment.likes,
              user: comment.user,
            };
          };
          patchFeedList(dispatch, (draft) => {
            const post = draft.data.find((p) => p.id === postId);
            if (post) applyReal(post);
          });
          patchPostDetail(dispatch, postId, applyReal);
          dispatch(
            feedApi.util.updateQueryData(
              "getComments",
              { postId, limit: COMMENTS_LIMIT },
              (draft) => {
                const idx = draft.data.findIndex(
                  (c) => c.id === optimisticComment.id,
                );
                if (idx >= 0) draft.data[idx] = comment;
                else if (!draft.data.some((c) => c.id === comment.id)) {
                  draft.data.unshift(comment);
                }
              },
            ),
          );
        } catch {
          listPatch.undo();
          detailPatch.undo();
          commentsPatch.undo();
        }
      },
    }),

    likeComment: builder.mutation<
      LikeToggleResult,
      { commentId: string; postId: string }
    >({
      query: ({ commentId }) => ({
        url: `/posts/comments/${commentId}/like`,
        method: "POST",
      }),
      transformResponse: (response: ApiResponse<LikeToggleResult>) =>
        unwrapData(response),
      async onQueryStarted(
        { commentId, postId },
        { dispatch, queryFulfilled },
      ) {
        const bump = (post: ApiPostDetail, delta: number) => {
          if (!post.latest_comment || post.latest_comment.id !== commentId)
            return;
          post.latest_comment.likes = Math.max(
            0,
            post.latest_comment.likes + delta,
          );
        };

        const listPatch = patchFeedList(dispatch, (draft) => {
          const post = draft.data.find((p) => p.id === postId);
          if (post) bump(post, 1);
        });
        const detailPatch = patchPostDetail(dispatch, postId, (draft) =>
          bump(draft, 1),
        );

        try {
          const { data } = await queryFulfilled;
          if (data.liked) return;
          patchFeedList(dispatch, (draft) => {
            const post = draft.data.find((p) => p.id === postId);
            if (post) bump(post, -2);
          });
          patchPostDetail(dispatch, postId, (draft) => bump(draft, -2));
        } catch {
          listPatch.undo();
          detailPatch.undo();
        }
      },
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostQuery,
  useGetCommentsQuery,
  useCreatePostMutation,
  useDeletePostMutation,
  useLikePostMutation,
  useCreateCommentMutation,
  useLikeCommentMutation,
} = feedApi;
