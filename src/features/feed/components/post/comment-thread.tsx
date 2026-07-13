"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { mediaUrl } from "@/lib/media-url";
import { formatRelativeTime } from "@/lib/format-time";
import { useAuth } from "@/features/auth";

import type { ApiComment, ApiLatestComment, ApiUserBrief } from "../../types/feed.api.types";
import { PostCommentInput } from "./post-comment-input";

type CommentItem = ApiComment | ApiLatestComment;

export type ReplyTarget = {
  /** Comment clicked — used as parent_id (backend collapses to root). */
  commentId: string;
  user: ApiUserBrief;
};

interface CommentThreadProps {
  comments?: CommentItem[];
  comment?: CommentItem;
  previousCount?: number;
  onViewAll?: () => void;
  onLikeComment?: (commentId: string) => void;
  onReply?: (payload: {
    content: string;
    parent_id: string;
    reply_to_user_id: string;
  }) => Promise<void>;
  currentUserImage?: string;
  /** Flat feed preview — hide nested reply input if false. */
  allowReply?: boolean;
}

function displayName(user: ApiUserBrief) {
  return [user.first_name, user.last_name].filter(Boolean).join(" ") || "User";
}

function CommentRow({
  comment,
  isReply = false,
  onLikeComment,
  onReplyClick,
}: {
  comment: CommentItem;
  isReply?: boolean;
  onLikeComment?: (commentId: string) => void;
  onReplyClick?: (comment: CommentItem) => void;
}) {
  const { user } = useAuth();
  const name = displayName(comment.user);
  const avatar = mediaUrl(comment.user.avatar);
  const liked = Boolean(comment.has_liked);
  const myAvatar = liked ? mediaUrl(user?.avatar) : undefined;
  const mentionName = comment.reply_to_user
    ? displayName(comment.reply_to_user)
    : null;

  return (
    <li className={cn("flex gap-3", isReply && "ml-10")}>
      <Avatar className={cn("shrink-0", isReply ? "size-8" : "size-10")}>
        {avatar ? <AvatarImage src={avatar} alt={name} /> : null}
        <AvatarFallback>{name.slice(0, 1)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="bg-comment relative rounded-[18px] px-3.5 py-2.5">
          <h4 className="text-title text-sm font-semibold">
            <Link href="#0" className="hover:underline">
              {name}
            </Link>
          </h4>
          {comment.is_deleted ? (
            <p className="text-muted-foreground text-sm">
              This comment was deleted.
            </p>
          ) : (
            <p className="text-muted-foreground text-sm">
              {mentionName ? (
                <>
                  <span className="text-primary font-medium">@{mentionName}</span>{" "}
                </>
              ) : null}
              {comment.content}
            </p>
          )}
          {comment.likes > 0 ? (
            <span className="bg-card text-subtle absolute -right-1 -bottom-2 flex items-center gap-1 rounded-xl px-1.5 py-0.5 text-xs shadow-sm">
              {myAvatar ? (
                // eslint-disable-next-line @next/next/no-img-element -- tiny badge avatar
                <img
                  src={myAvatar}
                  alt=""
                  className="size-3.5 rounded-full object-cover"
                />
              ) : null}
              {comment.likes}
            </span>
          ) : null}
        </div>
        <ul className="text-subtle mt-2 flex flex-wrap gap-3 px-1 text-xs">
          <li>
            <button
              type="button"
              className={cn(
                "hover:underline",
                liked && "text-primary font-medium",
              )}
              onClick={() => onLikeComment?.(comment.id)}
            >
              Like
            </button>
          </li>
          {onReplyClick ? (
            <li>
              <button
                type="button"
                className="hover:underline"
                onClick={() => onReplyClick(comment)}
              >
                Reply
              </button>
            </li>
          ) : null}
          <li>
            <span>{formatRelativeTime(comment.created_at)}</span>
          </li>
        </ul>
      </div>
    </li>
  );
}

function byCreatedAtAsc(a: CommentItem, b: CommentItem) {
  return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
}

function byCreatedAtDesc(a: CommentItem, b: CommentItem) {
  return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
}

export function CommentThread({
  comments,
  comment,
  previousCount = 0,
  onViewAll,
  onLikeComment,
  onReply,
  currentUserImage,
  allowReply = true,
}: CommentThreadProps) {
  const [replyTo, setReplyTo] = useState<ReplyTarget | null>(null);
  const flat = comments ?? (comment ? [comment] : []);

  const roots = useMemo(
    () =>
      flat
        .filter((c) => !c.parent_id)
        .slice()
        .sort(byCreatedAtDesc),
    [flat],
  );

  const repliesByParent = useMemo(() => {
    const map = new Map<string, CommentItem[]>();
    for (const c of flat) {
      if (!c.parent_id) continue;
      const list = map.get(c.parent_id) ?? [];
      list.push(c);
      map.set(c.parent_id, list);
    }
    for (const list of map.values()) {
      list.sort(byCreatedAtAsc);
    }
    return map;
  }, [flat]);

  if (!flat.length) return null;

  const startReply = (item: CommentItem) => {
    if (!allowReply || !onReply) return;
    setReplyTo({ commentId: item.id, user: item.user });
  };

  const submitReply = async (content: string) => {
    if (!replyTo || !onReply) return;
    await onReply({
      content,
      parent_id: replyTo.commentId,
      reply_to_user_id: replyTo.user.id,
    });
    setReplyTo(null);
  };

  return (
    <div className="px-6 pb-2">
      {previousCount > 0 ? (
        <button
          type="button"
          onClick={onViewAll}
          className="text-muted-foreground mb-3 text-sm font-normal hover:underline"
        >
          View {previousCount} previous comments
        </button>
      ) : null}

      <ul className="space-y-4">
        {roots.map((root) => {
          const replies = repliesByParent.get(root.id) ?? [];
          return (
            <li key={root.id} className="space-y-3">
              <ul className="space-y-3">
                <CommentRow
                  comment={root}
                  onLikeComment={onLikeComment}
                  onReplyClick={
                    allowReply && onReply ? () => startReply(root) : undefined
                  }
                />
                {replies.map((reply) => (
                  <CommentRow
                    key={reply.id}
                    comment={reply}
                    isReply
                    onLikeComment={onLikeComment}
                    onReplyClick={
                      allowReply && onReply
                        ? () => startReply(reply)
                        : undefined
                    }
                  />
                ))}
              </ul>

              {replyTo &&
              (replyTo.commentId === root.id ||
                replies.some((r) => r.id === replyTo.commentId)) ? (
                <div className="ml-10">
                  <PostCommentInput
                    userImage={currentUserImage}
                    autoFocus
                    placeholder={`Reply to ${displayName(replyTo.user)}...`}
                    onSubmit={submitReply}
                    onCancel={() => setReplyTo(null)}
                  />
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
