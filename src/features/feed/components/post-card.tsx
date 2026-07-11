import type { FeedPost } from "../types/feed.types";
import { CommentThread } from "./post/comment-thread";
import { PostActions } from "./post/post-actions";
import { PostCommentInput } from "./post/post-comment-input";
import { PostContent } from "./post/post-content";
import { PostHeader } from "./post/post-header";
import { PostStats } from "./post/post-stats";

interface PostCardProps {
  post: FeedPost;
  currentUserImage: string;
}

export function PostCard({ post, currentUserImage }: PostCardProps) {
  return (
    <article className="bg-card mb-4 rounded-md py-6">
      <div className="px-6">
        <PostHeader
          authorName={post.author.name}
          authorImage={post.author.avatar}
          timeAgo={post.createdAt}
          privacy={post.privacy}
        />
        <PostContent content={post.content} image={post.image} />
      </div>

      <PostStats
        reactionCount={post.reactionCount}
        commentsCount={post.commentsCount}
        sharesCount={post.sharesCount}
      />

      <PostActions />
      <PostCommentInput userImage={currentUserImage} />

      {post.comments?.length ? (
        <CommentThread comments={post.comments} />
      ) : null}
    </article>
  );
}
