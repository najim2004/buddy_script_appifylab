"use client";

import Image from "next/image";

import { mediaUrl } from "@/lib/media-url";

interface RecentLiker {
  id: string;
  avatar?: string | null;
}

interface PostStatsProps {
  likes: number;
  comments: number;
  shares: number;
  recentLikes?: RecentLiker[];
  onCommentsClick?: () => void;
}

export function PostStats({
  likes,
  comments,
  shares,
  recentLikes = [],
  onCommentsClick,
}: PostStatsProps) {
  // Only real avatars — never fill with demo reaction images
  const avatars = recentLikes
    .map((liker) => mediaUrl(liker.avatar))
    .filter((src): src is string => Boolean(src))
    .slice(0, 5);

  return (
    <div className="mb-0 flex items-center justify-between px-6">
      <div className="flex items-center">
        {avatars.length > 0 ? (
          <div className="flex cursor-pointer items-center">
            {avatars.map((src, index) => (
              <Image
                key={`${src}-${index}`}
                src={src}
                alt=""
                width={32}
                height={32}
                className="border-card bg-placeholder size-8 rounded-full border object-cover"
                style={{ marginLeft: index === 0 ? 0 : -16 }}
              />
            ))}
          </div>
        ) : null}
        {likes > 0 ? (
          <p className="text-subtle ml-2.5 pt-1.5 text-sm leading-tight">
            {likes}
          </p>
        ) : null}
      </div>

      <div className="text-subtle flex items-center text-sm leading-tight">
        <button
          type="button"
          onClick={onCommentsClick}
          className="hover:text-primary transition-colors"
        >
          <span className="text-title">{comments}</span> Comment
        </button>
        <span className="mx-4">
          <span className="text-title">{shares}</span> Share
        </span>
      </div>
    </div>
  );
}
