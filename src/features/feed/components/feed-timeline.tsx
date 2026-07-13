"use client";

import { Loader2 } from "lucide-react";

import { useAuth } from "@/features/auth";
import { mediaUrl } from "@/lib/media-url";
import { FEED_STORIES } from "../data/mock-feed";
import { useGetPostsQuery } from "../api/feed.api";
import { FEED_LIST_ARG } from "../types/feed.api.types";
import { CreatePost } from "./create-post";
import { PostCard } from "./post-card";
import { Stories, StoriesMobile } from "./stories";

export function FeedTimeline() {
  const { user } = useAuth();
  const { data, isLoading, isError } = useGetPostsQuery(FEED_LIST_ARG);

  const userAvatar = mediaUrl(user?.avatar);
  const posts = data?.data ?? [];
  const showInitialLoader = isLoading && !data;

  return (
    <div className="w-full">
      <Stories stories={FEED_STORIES} />
      <StoriesMobile stories={FEED_STORIES} />
      <CreatePost userAvatar={userAvatar} />

      {showInitialLoader ? (
        <div className="bg-card mb-4 flex items-center justify-center rounded-md py-12">
          <Loader2 className="text-muted-foreground size-6 animate-spin" />
        </div>
      ) : null}

      {isError && !data ? (
        <div className="bg-card text-muted-foreground mb-4 rounded-md px-6 py-8 text-center text-sm">
          Could not load posts. Please try again.
        </div>
      ) : null}

      {!showInitialLoader && !isError && posts.length === 0 ? (
        <div className="bg-card text-muted-foreground mb-4 rounded-md px-6 py-8 text-center text-sm">
          No posts yet. Be the first to share something.
        </div>
      ) : null}

      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          currentUserImage={userAvatar}
          canDelete={Boolean(user && post.author.id === user.id)}
        />
      ))}
    </div>
  );
}
