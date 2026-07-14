"use client";

import { useState } from "react";
import Image from "next/image";
import { ThumbsUp } from "lucide-react";

import { mediaUrl } from "@/lib/media-url";
import { useGetPostLikesQuery } from "@/features/feed/api/feed.api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface RecentLiker {
  id: string;
  avatar?: string | null;
}

interface PostStatsProps {
  postId: string;
  likes: number;
  comments: number;
  shares: number;
  recentLikes?: RecentLiker[];
  onCommentsClick?: () => void;
}

export function PostStats({
  postId,
  likes,
  comments,
  shares,
  recentLikes = [],
  onCommentsClick,
}: PostStatsProps) {
  const [likesListOpen, setLikesListOpen] = useState(false);

  // Only fetch likes when list is open
  const { data: likesData, isLoading: likesLoading } = useGetPostLikesQuery(postId, {
    skip: !likesListOpen,
  });

  const avatars = recentLikes
    .map((liker) => mediaUrl(liker.avatar))
    .filter((src): src is string => Boolean(src))
    .slice(0, 5);

  return (
    <div className="mb-0 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center">
        {likes > 0 ? (
          <Dialog open={likesListOpen} onOpenChange={setLikesListOpen}>
            <DialogTrigger asChild>
              <button
                type="button"
                className="flex items-center hover:opacity-80 transition-opacity focus:outline-none"
              >
                {/* Minimal outline like icon */}
                <ThumbsUp className="size-4 text-primary mr-2" />

                {avatars.length > 0 ? (
                  <div className="mr-2 flex items-center">
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

                <p className="text-subtle pt-0.5 text-sm leading-tight font-medium">
                  {likes}
                </p>
              </button>
            </DialogTrigger>

            <DialogContent className="max-w-sm p-0 max-h-[85vh] flex flex-col">
              <DialogHeader className="px-6 pt-5 pb-3 border-b border-border">
                <DialogTitle>Likes</DialogTitle>
              </DialogHeader>
              <div className="flex-1 overflow-y-auto px-6 py-4 max-h-[350px] space-y-4">
                {likesLoading ? (
                  <div className="text-center text-sm text-muted-foreground py-4">Loading...</div>
                ) : likesData && likesData.length > 0 ? (
                  likesData.map((likeItem) => {
                    const name = [likeItem.user.first_name, likeItem.user.last_name]
                      .filter(Boolean)
                      .join(" ") || "User";
                    const avatar = mediaUrl(likeItem.user.avatar);
                    return (
                      <div key={likeItem.id} className="flex items-center gap-3">
                        <Avatar className="size-9">
                          {avatar && <AvatarImage src={avatar} alt={name} />}
                          <AvatarFallback>{name.slice(0, 1)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-semibold text-title">{name}</span>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center text-sm text-muted-foreground py-4">No likes yet</div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        ) : null}
      </div>

      <div className="text-subtle flex shrink-0 items-center text-xs leading-tight sm:text-sm">
        <button
          type="button"
          onClick={onCommentsClick}
          className="hover:text-primary transition-colors"
        >
          <span className="text-title">{comments}</span> Comment
        </button>
        <span className="mx-2 sm:mx-4">
          <span className="text-title">{shares}</span> Share
        </span>
      </div>
    </div>
  );
}
