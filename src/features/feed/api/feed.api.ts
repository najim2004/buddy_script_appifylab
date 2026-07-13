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
        } catch {
          listPatch.undo();
        }
      },
    }),

    likePost: builder.mutation<LikeToggleResult, string>({
      query: (id) => ({ url: `/posts/${id}/like`, method: "POST" }),
      transformResponse: (response: ApiResponse<LikeToggleResult>) =>
        unwrapData(response),
      async onQueryStarted(id, { dispatch, queryFulfilled, getState }) {
        const user = (getState() as RootState).auth.user;
        const feedData = feedApi.endpoints.getPosts.select(ROOT_FEED_ARG)(
          getState() as RootState,
        ).data;
        const before =
          feedData?.data.find((p) => p.id === id)?.has_liked ?? false;
        const nextLiked = !before;

        const applyLike = (post: ApiPostDetail, liked: boolean) => {
          const wasLiked = post.has_liked;
          if (wasLiked === liked) return;
          post.has_liked = liked;
          post.likes = Math.max(0, post.likes + (liked ? 1 : -1));
          if (!user) return;
          if (liked) {
            post.recent_likes = [
              { id: user.id, avatar: user.avatar ?? null },
              ...post.recent_likes.filter((l) => l.id !== user.id),
            ].slice(0, 5);
          } else {
            post.recent_likes = post.recent_likes.filter(
              (l) => l.id !== user.id,
            );
          }
        };

        const listPatch = patchFeedList(dispatch, (draft) => {
          const post = draft.data.find((p) => p.id === id);
          if (post) applyLike(post, nextLiked);
        });
        const detailPatch = patchPostDetail(dispatch, id, (post) =>
          applyLike(post, nextLiked),
        );

        try {
          const { data } = await queryFulfilled;
          const sync = (post: ApiPostDetail) => applyLike(post, data.liked);
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
      {
        postId: string;
        content: string;
        parent_id?: string;
        reply_to_user_id?: string;
      }
    >({
      query: ({ postId, content, parent_id, reply_to_user_id }) => ({
        url: `/posts/${postId}/comments`,
        method: "POST",
        body: {
          content,
          ...(parent_id ? { parent_id } : {}),
          ...(reply_to_user_id ? { reply_to_user_id } : {}),
        },
      }),
      transformResponse: (response: ApiResponse<ApiComment>) =>
        unwrapData(response),
      async onQueryStarted(
        { postId, content, parent_id },
        { dispatch, queryFulfilled, getState },
      ) {
        const user = (getState() as RootState).auth.user;
        const commentsCache = feedApi.endpoints.getComments.select({
          postId,
          limit: COMMENTS_LIMIT,
        })(getState() as RootState).data;

        const replyTarget = parent_id
          ? commentsCache?.data.find((c) => c.id === parent_id)
          : undefined;

        // Keep nested replies under the root parent (2-level tree).
        const rootParentId = replyTarget?.parent_id ?? parent_id ?? null;

        const optimisticComment: ApiComment = {
          id: `temp-${Date.now()}`,
          created_at: new Date().toISOString(),
          post_id: postId,
          content,
          parent_id: rootParentId,
          deleted_at: null,
          is_deleted: false,
          likes: 0,
          has_liked: false,
          user: {
            id: user?.id ?? "me",
            first_name: user?.first_name || "You",
            last_name: user?.last_name ?? "",
            avatar: user?.avatar ?? null,
          },
          reply_to_user: rootParentId ? (replyTarget?.user ?? null) : null,
        };

        const applyOptimistic = (post: ApiPostDetail) => {
          post.comments += 1;
          // Feed preview only tracks top-level latest comment.
          if (!rootParentId) {
            post.latest_comment = optimisticComment;
          }
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
              draft.data.push(optimisticComment);
            },
          ),
        );

        try {
          const { data: comment } = await queryFulfilled;
          const applyReal = (post: ApiPostDetail) => {
            if (comment.parent_id) return;
            post.latest_comment = {
              id: comment.id,
              created_at: String(comment.created_at),
              post_id: comment.post_id,
              content: comment.content,
              parent_id: comment.parent_id,
              deleted_at: comment.deleted_at
                ? String(comment.deleted_at)
                : null,
              is_deleted: comment.is_deleted,
              likes: comment.likes,
              has_liked: comment.has_liked ?? false,
              user: comment.user,
              reply_to_user: comment.reply_to_user ?? null,
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
                  draft.data.push(comment);
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
        { dispatch, queryFulfilled, getState },
      ) {
        const state = getState() as RootState;
        const commentsCache = feedApi.endpoints.getComments.select({
          postId,
          limit: COMMENTS_LIMIT,
        })(state).data;
        const feedData = feedApi.endpoints.getPosts.select(ROOT_FEED_ARG)(
          state,
        ).data;

        const fromComments = commentsCache?.data.find((c) => c.id === commentId)
          ?.has_liked;
        const fromFeed = feedData?.data.find((p) => p.id === postId)
          ?.latest_comment?.id === commentId
          ? feedData?.data.find((p) => p.id === postId)?.latest_comment
              ?.has_liked
          : undefined;
        const before = Boolean(fromComments ?? fromFeed);
        const nextLiked = !before;

        const applyOnComment = (
          comment: { likes: number; has_liked?: boolean },
          liked: boolean,
        ) => {
          const was = Boolean(comment.has_liked);
          if (was === liked) return;
          comment.has_liked = liked;
          comment.likes = Math.max(0, comment.likes + (liked ? 1 : -1));
        };

        const listPatch = patchFeedList(dispatch, (draft) => {
          const post = draft.data.find((p) => p.id === postId);
          if (post?.latest_comment?.id === commentId) {
            applyOnComment(post.latest_comment, nextLiked);
          }
        });
        const detailPatch = patchPostDetail(dispatch, postId, (post) => {
          if (post.latest_comment?.id === commentId) {
            applyOnComment(post.latest_comment, nextLiked);
          }
        });
        const commentsPatch = dispatch(
          feedApi.util.updateQueryData(
            "getComments",
            { postId, limit: COMMENTS_LIMIT },
            (draft) => {
              const comment = draft.data.find((c) => c.id === commentId);
              if (comment) applyOnComment(comment, nextLiked);
            },
          ),
        );

        try {
          const { data } = await queryFulfilled;
          const sync = (comment: { likes: number; has_liked?: boolean }) =>
            applyOnComment(comment, data.liked);

          patchFeedList(dispatch, (draft) => {
            const post = draft.data.find((p) => p.id === postId);
            if (post?.latest_comment?.id === commentId) {
              sync(post.latest_comment);
            }
          });
          patchPostDetail(dispatch, postId, (post) => {
            if (post.latest_comment?.id === commentId) {
              sync(post.latest_comment);
            }
          });
          dispatch(
            feedApi.util.updateQueryData(
              "getComments",
              { postId, limit: COMMENTS_LIMIT },
              (draft) => {
                const comment = draft.data.find((c) => c.id === commentId);
                if (comment) sync(comment);
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
