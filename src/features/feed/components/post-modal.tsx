"use client";

import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getApiErrorMessage } from "@/lib/api/error";
import { mediaUrl } from "@/lib/media-url";
import { formatRelativeTime } from "@/lib/format-time";
import { useAuth } from "@/features/auth";
import type { ApiPostDetail } from "../types/feed.api.types";
import { COMMENTS_LIMIT } from "../types/feed.api.types";
import {
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useGetCommentsQuery,
  useLikeCommentMutation,
  useLikePostMutation,
} from "../api/feed.api";
import { CommentThread } from "./post/comment-thread";
import { PostActions } from "./post/post-actions";
import { PostCommentInput } from "./post/post-comment-input";
import { PostContent } from "./post/post-content";
import { PostHeader } from "./post/post-header";
import { PostStats } from "./post/post-stats";

interface PostModalProps {
  post: ApiPostDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUserImage?: string;
  canDelete?: boolean;
  onDelete?: () => void;
}

export function PostModal({
  post,
  open,
  onOpenChange,
  currentUserImage,
  canDelete = false,
  onDelete,
}: PostModalProps) {
  const { user } = useAuth();
  const postId = post?.id ?? "";

  // Skip fetch if we already have comments in cache — RTK will serve from cache
  const { data: commentsData, isLoading: commentsLoading } =
    useGetCommentsQuery(
      { postId, limit: COMMENTS_LIMIT },
      { skip: !open || !postId },
    );

  const [likePost] = useLikePostMutation();
  const [createComment] = useCreateCommentMutation();
  const [likeComment] = useLikeCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();

  if (!post) return null;

  const authorName =
    [post.author.first_name, post.author.last_name].filter(Boolean).join(" ") ||
    "User";

  const imagePath = post.attachments.find(
    (a) => a.type === "IMAGE" || a.mime_type?.startsWith("image/"),
  )?.file_path;

  const videoPath = post.attachments.find(
    (a) => a.type === "VIDEO" || a.mime_type?.startsWith("video/"),
  )?.file_path;

  // Fire-and-forget — optimistic update handles UI immediately
  const onLike = () => {
    likePost(post.id).catch(() => toast.error("Could not like post"));
  };

  const onComment = (content: string) => {
    createComment({ postId: post.id, content }).catch(() =>
      toast.error("Could not post comment"),
    );
  };

  const onReply = (payload: {
    content: string;
    parent_id: string;
    reply_to_user_id: string;
  }) => {
    createComment({
      postId: post.id,
      content: payload.content,
      parent_id: payload.parent_id,
      reply_to_user_id: payload.reply_to_user_id,
    }).catch(() => toast.error("Could not post reply"));
  };

  const onLikeComment = (commentId: string) => {
    likeComment({ commentId, postId: post.id }).catch(() =>
      toast.error("Could not like comment"),
    );
  };

  const onDeleteComment = (commentId: string) => {
    deleteComment({ commentId, postId: post.id }).catch(() =>
      toast.error("Could not delete comment"),
    );
  };

  // Merge: if the RTK cache already has comments (from before modal was opened)
  // commentsLoading will be false and commentsData will be populated immediately.
  const comments = commentsData?.data ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0">
        <DialogHeader>
          <DialogTitle>{authorName}&apos;s post</DialogTitle>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto py-4">
          <div className="px-6">
            <PostHeader
              authorName={authorName}
              authorImage={mediaUrl(post.author.avatar)}
              timeAgo={formatRelativeTime(post.created_at)}
              privacy={post.visibility}
              canDelete={canDelete}
              onDelete={onDelete}
            />
            <PostContent
              content={post.content ?? ""}
              image={mediaUrl(imagePath)}
              video={mediaUrl(videoPath)}
            />
          </div>

          <PostStats
            likes={post.likes}
            comments={post.comments}
            shares={0}
            recentLikes={post.recent_likes}
          />
          <PostActions has_liked={post.has_liked} onLike={onLike} />

          <div className="border-border mt-2 border-t px-0 pt-2">
            {commentsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="text-muted-foreground size-5 animate-spin" />
              </div>
            ) : comments.length === 0 ? (
              <p className="text-muted-foreground px-6 py-6 text-center text-sm">
                No comments yet. Be the first to comment.
              </p>
            ) : (
              <CommentThread
                comments={comments}
                onLikeComment={onLikeComment}
                onDeleteComment={onDeleteComment}
                onReply={onReply}
                currentUserImage={currentUserImage}
                postAuthorId={post.author.id}
              />
            )}
          </div>
        </div>

        <div className="border-border shrink-0 border-t">
          <PostCommentInput
            userImage={currentUserImage}
            onSubmit={onComment}
            autoFocus
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
