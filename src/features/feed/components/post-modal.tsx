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
import type { ApiPostDetail } from "../types/feed.api.types";
import { COMMENTS_LIMIT } from "../types/feed.api.types";
import {
  useCreateCommentMutation,
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
  currentUserImage: string;
  canDelete?: boolean;
  onDelete?: () => void;
}

function mediaSrc(filePath: string) {
  return `/storage/${filePath}`;
}

export function PostModal({
  post,
  open,
  onOpenChange,
  currentUserImage,
  canDelete = false,
  onDelete,
}: PostModalProps) {
  const postId = post?.id ?? "";

  const { data: commentsData, isLoading: commentsLoading } =
    useGetCommentsQuery(
      { postId, limit: COMMENTS_LIMIT },
      { skip: !open || !postId },
    );

  const [likePost] = useLikePostMutation();
  const [createComment] = useCreateCommentMutation();
  const [likeComment] = useLikeCommentMutation();

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

  const onLike = async () => {
    try {
      await likePost(post.id).unwrap();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not like post"));
    }
  };

  const onComment = async (content: string) => {
    try {
      await createComment({ postId: post.id, content }).unwrap();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not post comment"));
      throw error;
    }
  };

  const onLikeComment = async (commentId: string) => {
    try {
      await likeComment({ commentId, postId: post.id }).unwrap();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not like comment"));
    }
  };

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
              authorImage={post.author.avatar || "/assets/images/post_img.png"}
              timeAgo={post.created_at}
              privacy={post.visibility}
              canDelete={canDelete}
              onDelete={onDelete}
            />
            <PostContent
              content={post.content ?? ""}
              image={imagePath ? mediaSrc(imagePath) : undefined}
              video={videoPath ? mediaSrc(videoPath) : undefined}
            />
          </div>

          <PostStats likes={post.likes} comments={post.comments} shares={0} />
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
