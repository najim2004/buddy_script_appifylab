import {
  CURRENT_USER_AVATAR,
  FEED_POSTS,
  FEED_STORIES,
} from "../data/mock-feed";
import { CreatePost } from "./create-post";
import { PostCard } from "./post-card";
import { Stories, StoriesMobile } from "./stories";

export function FeedTimeline() {
  return (
    <div className="mx-auto w-full max-w-[600px] lg:max-w-none">
      <Stories stories={FEED_STORIES} />
      <StoriesMobile stories={FEED_STORIES} />
      <CreatePost userAvatar={CURRENT_USER_AVATAR} />
      {FEED_POSTS.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          currentUserImage={CURRENT_USER_AVATAR}
        />
      ))}
    </div>
  );
}
