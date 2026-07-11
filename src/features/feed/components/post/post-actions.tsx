"use client";

import { useState } from "react";
import { MessageCircle, Share2 } from "lucide-react";

import { cn } from "@/lib/utils";

export function PostActions() {
  const [active, setActive] = useState<"haha" | "comment" | "share" | null>(
    "haha",
  );

  return (
    <div className="bg-reaction mt-4 flex gap-1 p-2">
      <button
        type="button"
        onClick={() => setActive("haha")}
        className={cn(
          "text-ink hover:bg-reaction-hover flex h-12 flex-1 items-center justify-center rounded-md text-sm transition-colors",
          active === "haha" && "bg-reaction-hover",
        )}
      >
        <span className="mr-2 inline-flex" aria-hidden>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="19"
            height="19"
            fill="none"
            viewBox="0 0 19 19"
          >
            <path
              fill="#FFCC4D"
              d="M9.5 19a9.5 9.5 0 100-19 9.5 9.5 0 000 19z"
            />
            <path
              fill="#664500"
              d="M9.5 11.083c-1.912 0-3.181-.222-4.75-.527-.358-.07-1.056 0-1.056 1.055 0 2.111 2.425 4.75 5.806 4.75 3.38 0 5.805-2.639 5.805-4.75 0-1.055-.697-1.125-1.055-1.055-1.57.305-2.838.527-4.75.527z"
            />
            <path
              fill="#fff"
              d="M4.75 11.611s1.583.528 4.75.528 4.75-.528 4.75-.528-1.056 2.111-4.75 2.111-4.75-2.11-4.75-2.11z"
            />
            <path
              fill="#664500"
              d="M6.333 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847zM12.667 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847z"
            />
          </svg>
        </span>
        Haha
      </button>

      <button
        type="button"
        onClick={() => setActive("comment")}
        className={cn(
          "text-ink hover:bg-reaction-hover flex h-12 flex-1 items-center justify-center rounded-md text-sm transition-colors",
          active === "comment" && "bg-reaction-hover",
        )}
      >
        <MessageCircle className="mr-2 size-5" />
        Comment
      </button>

      <button
        type="button"
        onClick={() => setActive("share")}
        className={cn(
          "text-ink hover:bg-reaction-hover flex h-12 flex-1 items-center justify-center rounded-md text-sm transition-colors",
          active === "share" && "bg-reaction-hover",
        )}
      >
        <Share2 className="mr-2 size-5" />
        Share
      </button>
    </div>
  );
}
