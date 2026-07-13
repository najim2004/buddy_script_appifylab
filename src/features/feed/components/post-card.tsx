"use client";

import { useState } from "react";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api/error";
import type { ApiPostDetail } from "../types/feed.api.types";
import {
  useDeletePostMutation,
  useLikeCommentMutation,
  useLikePostMutation,
} from "../api/feed.api";
import { PostModal } from "./post-modal";
import { CommentThread } from "./post/comment-thread";
import { PostActions } from "./post/post-actions";
import { PostContent } from "./post/post-content";
import { PostHeader } from "./post/post-header";
import { PostStats } from "./post/post-stats";

interface PostCardProps {
  post: ApiPostDetail;
  currentUserImage: string;
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
            authorImage={post.author.avatar || "/assets/images/post_img.png"}
            timeAgo={post.created_at}
            privacy={post.visibility}
            canDelete={canDelete}
            onDelete={canDelete ? onDelete : undefined}
          />
          <PostContent
            content={post.content ?? ""}
            image={image ? `/storage/${image}` : undefined}
            video={video ? `/storage/${video}` : undefined}
          />
        </div>

        <PostStats
          likes={post.likes}
          comments={post.comments}
          shares={0}
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
          />
        ) : null}
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
