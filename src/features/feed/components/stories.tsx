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
    <div className="relative mb-4 hidden lg:block">
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

      <div className="flex w-full gap-6 overflow-x-auto scrollbar-none">
        {stories.map((story, index) => (
          <StoryCard
            key={story.id}
            story={story}
            className={cn(
              "w-[22%] min-w-[110px] shrink-0",
              index >= 4 && "hidden xl:block",
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
        <div className="relative z-2 flex aspect-10/11 w-full flex-col justify-end overflow-hidden rounded-lg">
          <Image
            src={story.cover}
            alt={story.name}
            fill
            sizes="(max-width: 1024px) 30vw, 140px"
            className="object-cover"
            priority={story.isOwn}
          />
          <div className="absolute inset-0 z-1 bg-black/50 transition-opacity duration-200 group-hover:opacity-70" />

          {story.isOwn ? (
            <div className="bg-story relative z-10 w-full rounded-t-[25.5px] rounded-b-md pt-[30px]">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="border-story bg-primary flex h-8 w-8 items-center justify-center rounded-full border-2">
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

/** Instagram-style horizontal stories — shown below lg (vanilla mobile stories) */
export function StoriesMobile({ stories }: StoriesProps) {
  return (
    <div className="bg-card mb-4 rounded-md px-3 py-3 lg:hidden">
      <ul className="flex items-center gap-1 overflow-x-auto scrollbar-none">
        {stories.map((story) => (
          <li key={story.id} className="flex w-[70px] shrink-0 justify-center">
            <Link
              href="#0"
              className="flex w-[60px] flex-col items-center"
            >
              <div
                className={cn(
                  "relative size-[60px] overflow-hidden rounded-full",
                  story.isOwn
                    ? "ring-0"
                    : "p-[2px] ring-2 ring-primary/70 ring-offset-1 ring-offset-card",
                )}
              >
                <Image
                  src={story.avatar ?? story.cover}
                  alt={story.name}
                  fill
                  sizes="60px"
                  className="rounded-full object-cover"
                />
                {story.isOwn ? (
                  <>
                    <span className="absolute inset-0 rounded-full bg-black/45" />
                    <span className="border-card bg-primary absolute top-1/2 left-1/2 flex size-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        fill="none"
                        viewBox="0 0 12 12"
                        aria-hidden
                      >
                        <path
                          stroke="#fff"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 2.5v7M2.5 6h7"
                        />
                      </svg>
                    </span>
                  </>
                ) : null}
              </div>
              <p
                className={cn(
                  "mt-3 w-full truncate text-center text-xs leading-tight font-medium",
                  story.isOwn ? "text-primary" : "text-subtle",
                )}
              >
                {story.isOwn ? "Your Story" : story.name.split(" ")[0]}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
