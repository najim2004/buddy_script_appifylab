"use client";

import Image from "next/image";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  const name =
    [comment.user.first_name, comment.user.last_name]
      .filter(Boolean)
      .join(" ") || "User";
  const avatar = comment.user.avatar || "/assets/images/txt_img.png";
  const body = comment.is_deleted
    ? "This comment was deleted."
    : comment.content;

  return (
    <li className="flex gap-3">
      <Avatar className="size-10 shrink-0">
        <AvatarImage src={avatar} alt={name} />
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
              <Image
                src="/assets/images/react_img1.png"
                alt=""
                width={14}
                height={14}
                className="size-3.5"
              />
              {comment.likes}
            </span>
          ) : null}
        </div>
        <ul className="text-subtle mt-2 flex flex-wrap gap-3 px-1 text-xs">
          <li>
            <button
              type="button"
              className="hover:underline"
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
            <span>{comment.created_at}</span>
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
