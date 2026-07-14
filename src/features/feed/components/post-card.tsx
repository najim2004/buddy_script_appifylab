"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Globe, Lock, Users, X } from "lucide-react";

import { getApiErrorMessage } from "@/lib/api/error";
import { mediaUrl } from "@/lib/media-url";
import { formatRelativeTime } from "@/lib/format-time";
import { useAuth } from "@/features/auth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { ApiPostDetail, PostVisibility } from "../types/feed.api.types";
import {
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useDeletePostMutation,
  useLikeCommentMutation,
  useLikePostMutation,
  useUpdatePostMutation,
} from "../api/feed.api";
import { PostModal } from "./post-modal";
import { CommentThread } from "./post/comment-thread";
import { PostActions } from "./post/post-actions";
import { PostCommentInput } from "./post/post-comment-input";
import { PostContent } from "./post/post-content";
import { PostHeader } from "./post/post-header";
import { PostStats } from "./post/post-stats";

const VISIBILITY_OPTIONS: { value: PostVisibility; label: string; icon: React.ElementType }[] = [
  { value: "PUBLIC", label: "Public", icon: Globe },
  { value: "PRIVATE", label: "Only me", icon: Lock },
];

interface EditPostModalProps {
  post: ApiPostDetail;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function EditPostModal({ post, open, onOpenChange }: EditPostModalProps) {
  const [content, setContent] = useState(post.content ?? "");
  const [visibility, setVisibility] = useState<PostVisibility>(post.visibility);
  const [updatePost, { isLoading }] = useUpdatePostMutation();

  const handleSave = async () => {
    try {
      await updatePost({ id: post.id, content, visibility }).unwrap();
      toast.success("Post updated");
      onOpenChange(false);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not update post"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="px-6 pt-5 pb-3 border-b border-border">
          <DialogTitle>Edit post</DialogTitle>
        </DialogHeader>
        <div className="px-6 py-4 space-y-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="min-h-[120px] resize-none text-base border-0 bg-transparent shadow-none focus-visible:ring-0 p-0"
            autoFocus
          />
          {post.attachments && post.attachments.length > 0 && (
            <div className="rounded-md border border-border p-2 pointer-events-none opacity-80">
              <p className="text-xs text-muted-foreground mb-2">Attached Media (cannot be changed)</p>
              <PostContent
                content=""
                attachments={post.attachments}
              />
            </div>
          )}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Audience</p>
            <div className="flex gap-2">
              {VISIBILITY_OPTIONS.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setVisibility(value)}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium border transition-colors ${
                    visibility === value
                      ? "bg-primary text-white border-primary"
                      : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                  }`}
                >
                  <Icon className="size-3.5" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-border">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={() => void handleSave()} disabled={isLoading}>
            {isLoading ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface PostCardProps {
  post: ApiPostDetail;
  currentUserImage?: string;
  canDelete?: boolean;
}

export function PostCard({
  post,
  currentUserImage,
  canDelete = false,
}: PostCardProps) {
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [likePost] = useLikePostMutation();
  const [deletePost] = useDeletePostMutation();
  const [createComment] = useCreateCommentMutation();
  const [likeComment] = useLikeCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();

  // The current user can edit if they are the post author
  const isAuthor = user?.id === post.author.id;

  const openModal = () => setModalOpen(true);

  const onLike = () => {
    likePost(post.id).catch(() =>
      toast.error("Could not like post"),
    );
  };

  const onDelete = async () => {
    try {
      await deletePost(post.id).unwrap();
      setModalOpen(false);
      toast.success("Post deleted");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not delete post"));
    }
  };

  // Fire-and-forget — optimistic update handles UI immediately
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
    openModal();
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

  return (
    <>
      <article className="bg-card mb-4 rounded-md py-6">
        <div className="px-6">
          <PostHeader
            authorName={
              [post.author.first_name, post.author.last_name]
                .filter(Boolean)
                .join(" ") || "User"
            }
            authorImage={mediaUrl(post.author.avatar)}
            timeAgo={formatRelativeTime(post.created_at)}
            privacy={post.visibility}
            canDelete={canDelete}
            canEdit={isAuthor}
            onDelete={canDelete ? onDelete : undefined}
            onEdit={isAuthor ? () => setEditOpen(true) : undefined}
          />
          <PostContent
            content={post.content ?? ""}
            attachments={post.attachments}
          />
        </div>

        <PostStats
          postId={post.id}
          likes={post.likes}
          comments={post.comments}
          shares={0}
          recentLikes={post.recent_likes}
          onCommentsClick={openModal}
        />

        <PostActions
          has_liked={post.has_liked}
          onLike={onLike}
          onComment={openModal}
        />

        {post.latest_comment ? (
          <CommentThread
            comment={post.latest_comment}
            previousCount={Math.max(0, post.comments - 1)}
            onViewAll={openModal}
            onLikeComment={onLikeComment}
            onDeleteComment={onDeleteComment}
            onReply={onReply}
            currentUserImage={currentUserImage}
            postAuthorId={post.author.id}
          />
        ) : null}

        <PostCommentInput
          userImage={currentUserImage}
          onSubmit={onComment}
        />
      </article>

      <PostModal
        post={post}
        open={modalOpen}
        onOpenChange={setModalOpen}
        currentUserImage={currentUserImage}
        canDelete={canDelete}
        onDelete={canDelete ? onDelete : undefined}
      />

      {isAuthor ? (
        <EditPostModal
          post={post}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
      ) : null}
    </>
  );
}
