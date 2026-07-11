import Image from "next/image";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import type { FeedComment } from "../../types/feed.types";

interface CommentThreadProps {
  comments: FeedComment[];
  previousCount?: number;
}

export function CommentThread({
  comments,
  previousCount = 4,
}: CommentThreadProps) {
  if (!comments.length) return null;

  return (
    <div className="px-6 pb-2">
      {previousCount > 0 ? (
        <button
          type="button"
          className="text-muted-foreground mb-3 text-sm font-normal hover:underline"
        >
          View {previousCount} previous comments
        </button>
      ) : null}

      <ul className="space-y-4">
        {comments.map((comment) => (
          <li key={comment.id} className="flex gap-3">
            <Avatar className="size-10 shrink-0">
              <AvatarImage
                src={comment.author.avatar}
                alt={comment.author.name}
              />
              <AvatarFallback>{comment.author.name.slice(0, 1)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="bg-comment relative rounded-[18px] px-3.5 py-2.5">
                <h4 className="text-title text-sm font-semibold">
                  <Link href="#0" className="hover:underline">
                    {comment.author.name}
                  </Link>
                </h4>
                <p className="text-muted-foreground text-sm">{comment.body}</p>
                {comment.reactionCount ? (
                  <span className="bg-card text-subtle absolute -right-1 -bottom-2 flex items-center gap-1 rounded-xl px-1.5 py-0.5 text-xs shadow-sm">
                    <Image
                      src="/assets/images/react_img1.png"
                      alt=""
                      width={14}
                      height={14}
                      className="size-3.5"
                    />
                    {comment.reactionCount}
                  </span>
                ) : null}
              </div>
              <ul className="text-subtle mt-2 flex flex-wrap gap-3 px-1 text-xs">
                <li>
                  <button type="button" className="hover:underline">
                    Like
                  </button>
                </li>
                <li>
                  <button type="button" className="hover:underline">
                    Reply
                  </button>
                </li>
                <li>
                  <button type="button" className="hover:underline">
                    Share
                  </button>
                </li>
                <li>
                  <span>{comment.createdAt}</span>
                </li>
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
