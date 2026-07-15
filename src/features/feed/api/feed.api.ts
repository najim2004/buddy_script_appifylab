import { apiSlice } from "@/lib/api/api-slice";
import { unwrapData, unwrapList, type ApiListResponse } from "@/lib/api/unwrap";
import type { ApiResponse } from "@/types/api.types";
import type { RootState } from "@/store";

import type {
  ApiComment,
  ApiPostDetail,
  CommentsPage,
  LikeToggleResult,
  PostsPage,
  FeedListArg,
  ApiUserBrief,
} from "../types/feed.api.types";
import { COMMENTS_LIMIT, FEED_LIST_ARG } from "../types/feed.api.types";

export const feedApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query<PostsPage, FeedListArg | void>({
      query: (arg) => ({
        url: "/posts",
        params: {
          cursor: arg?.cursor,
          limit: arg?.limit ?? FEED_LIST_ARG.limit,
        },
      }),
      serializeQueryArgs: ({ queryArgs }) => {
        const limit = queryArgs?.limit ?? FEED_LIST_ARG.limit;
        const cursor = queryArgs?.cursor;
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
      { content?: string; files?: File[]; visibility?: string }
    >({
      query: ({ content, files, visibility }) => {
        const body = new FormData();
        const text = content?.trim();
        if (text) body.append("content", text);
        if (visibility) body.append("visibility", visibility);
        files?.forEach((file) => body.append("attachments", file));
        return { url: "/posts", method: "POST", body };
      },
      transformResponse: (response: ApiResponse<ApiPostDetail>) =>
        unwrapData(response),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data: post } = await queryFulfilled;
          dispatch(
            feedApi.util.updateQueryData("getPosts", FEED_LIST_ARG, (draft) => {
              if (draft.data.some((p) => p.id === post.id)) return;
              draft.data.unshift(post);
            }),
          );
          dispatch(feedApi.util.upsertQueryData("getPost", post.id, post));
        } catch {}
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

    getPostLikes: builder.query<{ id: string; user: ApiUserBrief }[], string>({
      query: (postId) => `/posts/${postId}/likes`,
      transformResponse: (
        response: ApiResponse<{ id: string; user: ApiUserBrief }[]>,
      ) => unwrapData(response),
      providesTags: (_result, _err, postId) => [
        { type: "Post", id: `${postId}-likes` },
      ],
    }),

    deletePost: builder.mutation<void, string>({
      query: (id) => ({ url: `/posts/${id}`, method: "DELETE" }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const listPatch = dispatch(
          feedApi.util.updateQueryData("getPosts", FEED_LIST_ARG, (draft) => {
            draft.data = draft.data.filter((p) => p.id !== id);
          }),
        );
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
      invalidatesTags: (_result, _err, id) => [
        { type: "Post", id: `${id}-likes` },
      ],
      async onQueryStarted(id, { dispatch, queryFulfilled, getState }) {
        const user = (getState() as RootState).auth.user;
        const feedData = feedApi.endpoints.getPosts.select(FEED_LIST_ARG)(
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

        const listPatch = dispatch(
          feedApi.util.updateQueryData("getPosts", FEED_LIST_ARG, (draft) => {
            const post = draft.data.find((p) => p.id === id);
            if (post) applyLike(post, nextLiked);
          }),
        );
        const detailPatch = dispatch(
          feedApi.util.updateQueryData("getPost", id, (post) =>
            applyLike(post, nextLiked),
          ),
        );

        try {
          const { data } = await queryFulfilled;
          const sync = (post: ApiPostDetail) => applyLike(post, data.liked);
          dispatch(
            feedApi.util.updateQueryData("getPosts", FEED_LIST_ARG, (draft) => {
              const post = draft.data.find((p) => p.id === id);
              if (post) sync(post);
            }),
          );
          dispatch(feedApi.util.updateQueryData("getPost", id, sync));
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
          replies: 0,
          has_liked: false,
          _optimistic: true,
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
          if (!rootParentId) {
            post.latest_comment = optimisticComment;
          }
        };

        const listPatch = dispatch(
          feedApi.util.updateQueryData("getPosts", FEED_LIST_ARG, (draft) => {
            const post = draft.data.find((p) => p.id === postId);
            if (post) applyOptimistic(post);
          }),
        );
        const detailPatch = dispatch(
          feedApi.util.updateQueryData("getPost", postId, applyOptimistic),
        );
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
          const realComment = { ...comment, _optimistic: false };
          const applyReal = (post: ApiPostDetail) => {
            if (comment.parent_id) return;
            post.latest_comment = { ...realComment };
          };
          dispatch(
            feedApi.util.updateQueryData("getPosts", FEED_LIST_ARG, (draft) => {
              const post = draft.data.find((p) => p.id === postId);
              if (post) applyReal(post);
            }),
          );
          dispatch(feedApi.util.updateQueryData("getPost", postId, applyReal));
          dispatch(
            feedApi.util.updateQueryData(
              "getComments",
              { postId, limit: COMMENTS_LIMIT },
              (draft) => {
                const idx = draft.data.findIndex(
                  (c) => c.id === optimisticComment.id,
                );
                if (idx >= 0) draft.data[idx] = realComment;
                else if (!draft.data.some((c) => c.id === comment.id)) {
                  draft.data.push(realComment);
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
        const feedData =
          feedApi.endpoints.getPosts.select(FEED_LIST_ARG)(state).data;

        const fromComments = commentsCache?.data.find(
          (c) => c.id === commentId,
        )?.has_liked;
        const fromFeed =
          feedData?.data.find((p) => p.id === postId)?.latest_comment?.id ===
          commentId
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

        const listPatch = dispatch(
          feedApi.util.updateQueryData("getPosts", FEED_LIST_ARG, (draft) => {
            const post = draft.data.find((p) => p.id === postId);
            if (post?.latest_comment?.id === commentId) {
              applyOnComment(post.latest_comment, nextLiked);
            }
          }),
        );
        const detailPatch = dispatch(
          feedApi.util.updateQueryData("getPost", postId, (post) => {
            if (post.latest_comment?.id === commentId) {
              applyOnComment(post.latest_comment, nextLiked);
            }
          }),
        );
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

          dispatch(
            feedApi.util.updateQueryData("getPosts", FEED_LIST_ARG, (draft) => {
              const post = draft.data.find((p) => p.id === postId);
              if (post?.latest_comment?.id === commentId) {
                sync(post.latest_comment);
              }
            }),
          );
          dispatch(
            feedApi.util.updateQueryData("getPost", postId, (post) => {
              if (post.latest_comment?.id === commentId) {
                sync(post.latest_comment);
              }
            }),
          );
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

    updatePost: builder.mutation<
      ApiPostDetail,
      { id: string; content?: string; visibility?: string }
    >({
      query: ({ id, content, visibility }) => ({
        url: `/posts/${id}`,
        method: "PATCH",
        body: { content, visibility },
      }),
      transformResponse: (response: ApiResponse<ApiPostDetail>) =>
        unwrapData(response),
      async onQueryStarted(
        { id, content, visibility },
        { dispatch, queryFulfilled },
      ) {
        const listPatch = dispatch(
          feedApi.util.updateQueryData("getPosts", FEED_LIST_ARG, (draft) => {
            const post = draft.data.find((p) => p.id === id);
            if (!post) return;
            if (content !== undefined) post.content = content;
            if (visibility !== undefined)
              post.visibility = visibility as ApiPostDetail["visibility"];
          }),
        );
        const detailPatch = dispatch(
          feedApi.util.updateQueryData("getPost", id, (post) => {
            if (content !== undefined) post.content = content;
            if (visibility !== undefined)
              post.visibility = visibility as ApiPostDetail["visibility"];
          }),
        );
        try {
          const { data: updated } = await queryFulfilled;
          dispatch(
            feedApi.util.updateQueryData("getPosts", FEED_LIST_ARG, (draft) => {
              const idx = draft.data.findIndex((p) => p.id === id);
              if (idx >= 0) draft.data[idx] = updated;
            }),
          );
          dispatch(feedApi.util.upsertQueryData("getPost", id, updated));
        } catch {
          listPatch.undo();
          detailPatch.undo();
        }
      },
    }),

    deleteComment: builder.mutation<
      { id: string; soft_deleted: boolean; deleted_at: string | null },
      { commentId: string; postId: string }
    >({
      query: ({ commentId }) => ({
        url: `/posts/comments/${commentId}`,
        method: "DELETE",
      }),
      transformResponse: (
        response: ApiResponse<{
          id: string;
          soft_deleted: boolean;
          deleted_at: string | null;
        }>,
      ) => unwrapData(response),
      async onQueryStarted(
        { commentId, postId },
        { dispatch, queryFulfilled },
      ) {
        const commentsPatch = dispatch(
          feedApi.util.updateQueryData(
            "getComments",
            { postId, limit: COMMENTS_LIMIT },
            (draft) => {
              const comment = draft.data.find((c) => c.id === commentId);
              if (comment) {
                if (comment.replies > 0) {
                  comment.is_deleted = true;
                  comment.deleted_at = new Date().toISOString();
                } else {
                  draft.data = draft.data.filter((c) => c.id !== commentId);
                }
              }
            },
          ),
        );

        const listPatch = dispatch(
          feedApi.util.updateQueryData("getPosts", FEED_LIST_ARG, (draft) => {
            const post = draft.data.find((p) => p.id === postId);
            if (!post) return;
            post.comments = Math.max(0, post.comments - 1);
            if (post.latest_comment?.id === commentId) {
              if (post.latest_comment.replies > 0) {
                post.latest_comment.is_deleted = true;
                post.latest_comment.deleted_at = new Date().toISOString();
              } else {
                post.latest_comment = null;
              }
            }
          }),
        );
        const detailPatch = dispatch(
          feedApi.util.updateQueryData("getPost", postId, (post) => {
            post.comments = Math.max(0, post.comments - 1);
            if (post.latest_comment?.id === commentId) {
              if (post.latest_comment.replies > 0) {
                post.latest_comment.is_deleted = true;
                post.latest_comment.deleted_at = new Date().toISOString();
              } else {
                post.latest_comment = null;
              }
            }
          }),
        );
        try {
          const { data } = await queryFulfilled;
          dispatch(
            feedApi.util.updateQueryData(
              "getComments",
              { postId, limit: COMMENTS_LIMIT },
              (draft) => {
                const comment = draft.data.find((c) => c.id === commentId);
                if (comment) {
                  if (data.soft_deleted) {
                    comment.is_deleted = true;
                    comment.deleted_at = data.deleted_at;
                  } else {
                    draft.data = draft.data.filter((c) => c.id !== commentId);
                  }
                }
              },
            ),
          );
        } catch {
          commentsPatch.undo();
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
  useGetPostLikesQuery,
  useCreatePostMutation,
  useDeletePostMutation,
  useLikePostMutation,
  useCreateCommentMutation,
  useLikeCommentMutation,
  useUpdatePostMutation,
  useDeleteCommentMutation,
} = feedApi;
