"use client";

import { MessageCircle, Share2, ThumbsUp } from "lucide-react";

import { cn } from "@/lib/utils";

interface PostActionsProps {
  has_liked?: boolean;
  onLike?: () => void;
  onComment?: () => void;
}

export function PostActions({
  has_liked = false,
  onLike,
  onComment,
}: PostActionsProps) {
  return (
    <div className="bg-reaction mt-4 flex gap-1 p-2">
      <button
        type="button"
        onClick={onLike}
        className={cn(
          "text-content hover:bg-reaction-hover flex h-12 flex-1 items-center justify-center rounded-md text-sm transition-colors",
          has_liked && "bg-reaction-hover text-primary",
        )}
      >
        <ThumbsUp
          className={cn(
            "mr-2 size-5",
            has_liked && "fill-primary text-primary",
          )}
        />
        Like
      </button>

      <button
        type="button"
        onClick={onComment}
        className="text-content hover:bg-reaction-hover flex h-12 flex-1 items-center justify-center rounded-md text-sm transition-colors"
      >
        <MessageCircle className="mr-2 size-5" />
        Comment
      </button>

      <button
        type="button"
        className="text-content hover:bg-reaction-hover flex h-12 flex-1 items-center justify-center rounded-md text-sm transition-colors"
      >
        <Share2 className="mr-2 size-5" />
        Share
      </button>
    </div>
  );
}
