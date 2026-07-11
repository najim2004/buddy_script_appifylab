import Image from "next/image";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { FeedStory } from "../types/feed.types";

interface StoriesProps {
  stories: FeedStory[];
}

export function Stories({ stories }: StoriesProps) {
  return (
    <div className="relative mb-4 hidden md:block">
      <div className="absolute top-1/2 right-[-5px] z-20 -translate-y-1/2">
        <Button
          type="button"
          size="icon"
          className="border-background bg-primary hover:bg-primary-hover h-6 w-6 rounded-full border"
          aria-label="Next stories"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="9"
            height="8"
            fill="none"
            viewBox="0 0 9 8"
          >
            <path
              fill="currentColor"
              d="M8 4l.366-.341.318.341-.318.341L8 4zm-7 .5a.5.5 0 010-1v1zM5.566.659l2.8 3-.732.682-2.8-3L5.566.66zm2.8 3.682l-2.8 3-.732-.682 2.8-3 .732.682zM8 4.5H1v-1h7v1z"
            />
          </svg>
        </Button>
      </div>

      <div className="flex gap-4">
        {stories.map((story, index) => (
          <StoryCard
            key={story.id}
            story={story}
            className={cn(
              "w-[30%] shrink-0 lg:w-[23%]",
              index >= 2 && "hidden md:block",
              index >= 3 && "hidden lg:block",
            )}
          />
        ))}
      </div>
    </div>
  );
}

function StoryCard({
  story,
  className,
}: {
  story: FeedStory;
  className?: string;
}) {
  return (
    <div className={className}>
      <Link
        href="#0"
        className="group block overflow-hidden transition-all duration-200 ease-in-out"
      >
        <div className="relative z-[2] flex h-[190px] w-full flex-col justify-end overflow-hidden rounded-md">
          <Image
            src={story.cover}
            alt={story.name}
            fill
            sizes="(max-width: 1024px) 30vw, 140px"
            className="object-cover"
            priority={story.isOwn}
          />
          <div className="absolute inset-0 z-[1] bg-black/50 transition-opacity duration-200 group-hover:opacity-70" />

          {story.isOwn ? (
            <div className="bg-surface-inverse relative z-10 w-full rounded-t-[25.5px] rounded-b-md pt-[30px]">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="border-surface-inverse bg-primary flex h-8 w-8 items-center justify-center rounded-full border-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="10"
                    height="10"
                    fill="none"
                    viewBox="0 0 10 10"
                  >
                    <path
                      stroke="#fff"
                      strokeLinecap="round"
                      d="M.5 4.884h9M4.884 9.5v-9"
                    />
                  </svg>
                </span>
              </div>
              <p className="mb-2.5 text-center text-xs leading-[19px] font-medium text-white">
                {story.name}
              </p>
            </div>
          ) : (
            <>
              <div className="relative z-10 w-full">
                <p className="mb-2.5 text-center text-xs leading-[19px] font-medium text-white">
                  {story.name}
                </p>
              </div>
              {story.avatar ? (
                <div className="absolute top-3 right-3 z-10">
                  <Avatar className="border-card size-7 border-2">
                    <AvatarImage src={story.avatar} alt="" />
                    <AvatarFallback className="bg-placeholder text-[10px]">
                      {story.name.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                </div>
              ) : null}
            </>
          )}
        </div>
      </Link>
    </div>
  );
}

export function StoriesMobile({ stories }: StoriesProps) {
  return (
    <div className="mb-4 flex gap-3 overflow-x-auto px-1 md:hidden">
      {stories.map((story) => (
        <Link
          key={story.id}
          href="#0"
          className="flex w-16 shrink-0 flex-col items-center gap-1"
        >
          <Avatar
            className={cn(
              "size-14 border-2",
              story.isOwn ? "border-primary" : "border-primary/60",
            )}
          >
            <AvatarImage src={story.avatar ?? story.cover} alt={story.name} />
            <AvatarFallback>{story.name.slice(0, 1)}</AvatarFallback>
          </Avatar>
          <span className="text-muted-foreground line-clamp-1 w-full text-center text-[11px]">
            {story.isOwn ? "Your Story" : story.name.split(" ")[0]}
          </span>
        </Link>
      ))}
    </div>
  );
}
