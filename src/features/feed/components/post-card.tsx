"use client";

import { useState } from "react";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api/error";
import { mediaUrl } from "@/lib/media-url";
import { formatRelativeTime } from "@/lib/format-time";
import type { ApiPostDetail } from "../types/feed.api.types";
import {
  useCreateCommentMutation,
  useDeletePostMutation,
  useLikeCommentMutation,
  useLikePostMutation,
} from "../api/feed.api";
import { PostModal } from "./post-modal";
import { CommentThread } from "./post/comment-thread";
import { PostActions } from "./post/post-actions";
import { PostCommentInput } from "./post/post-comment-input";
import { PostContent } from "./post/post-content";
import { PostHeader } from "./post/post-header";
import { PostStats } from "./post/post-stats";

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
  const [modalOpen, setModalOpen] = useState(false);
  const [likePost] = useLikePostMutation();
  const [deletePost] = useDeletePostMutation();
  const [createComment] = useCreateCommentMutation();
  const [likeComment] = useLikeCommentMutation();

  const openModal = () => setModalOpen(true);

  const onLike = async () => {
    try {
      await likePost(post.id).unwrap();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not like post"));
    }
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

  const onComment = async (content: string) => {
    try {
      await createComment({ postId: post.id, content }).unwrap();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not post comment"));
      throw error;
    }
  };

  const onReply = async (payload: {
    content: string;
    parent_id: string;
    reply_to_user_id: string;
  }) => {
    try {
      await createComment({
        postId: post.id,
        content: payload.content,
        parent_id: payload.parent_id,
        reply_to_user_id: payload.reply_to_user_id,
      }).unwrap();
      openModal();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not post reply"));
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

  const image = post.attachments.find(
    (a) => a.type === "IMAGE" || a.mime_type?.startsWith("image/"),
  )?.file_path;

  const video = post.attachments.find(
    (a) => a.type === "VIDEO" || a.mime_type?.startsWith("video/"),
  )?.file_path;

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
            onDelete={canDelete ? onDelete : undefined}
          />
          <PostContent
            content={post.content ?? ""}
            image={image ? mediaUrl(image) : undefined}
            video={video ? mediaUrl(video) : undefined}
          />
        </div>

        <PostStats
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
            onReply={onReply}
            currentUserImage={currentUserImage}
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
    </>
  );
}
