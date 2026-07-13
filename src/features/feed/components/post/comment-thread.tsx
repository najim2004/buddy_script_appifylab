"use client";

import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { mediaUrl } from "@/lib/media-url";
import { formatRelativeTime } from "@/lib/format-time";
import { useAuth } from "@/features/auth";

import type { ApiComment, ApiLatestComment } from "../../types/feed.api.types";

type CommentItem = ApiComment | ApiLatestComment;

interface CommentThreadProps {
  comments?: CommentItem[];
  comment?: CommentItem;
  previousCount?: number;
  onViewAll?: () => void;
  onLikeComment?: (commentId: string) => void;
}

function CommentRow({
  comment,
  onLikeComment,
}: {
  comment: CommentItem;
  onLikeComment?: (commentId: string) => void;
}) {
  const { user } = useAuth();
  const name =
    [comment.user.first_name, comment.user.last_name]
      .filter(Boolean)
      .join(" ") || "User";
  const avatar = mediaUrl(comment.user.avatar);
  const body = comment.is_deleted
    ? "This comment was deleted."
    : comment.content;
  const liked = Boolean(comment.has_liked);
  const myAvatar = liked ? mediaUrl(user?.avatar) : undefined;

  return (
    <li className="flex gap-3">
      <Avatar className="size-10 shrink-0">
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
          <p className="text-muted-foreground text-sm">{body}</p>
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
          <li>
            <button type="button" className="hover:underline">
              Reply
            </button>
          </li>
          <li>
            <span>{formatRelativeTime(comment.created_at)}</span>
          </li>
        </ul>
      </div>
    </li>
  );
}

export function CommentThread({
  comments,
  comment,
  previousCount = 0,
  onViewAll,
  onLikeComment,
}: CommentThreadProps) {
  const list = comments ?? (comment ? [comment] : []);
  if (!list.length) return null;

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
        {list.map((item) => (
          <CommentRow
            key={item.id}
            comment={item}
            onLikeComment={onLikeComment}
          />
        ))}
      </ul>
    </div>
  );
}
