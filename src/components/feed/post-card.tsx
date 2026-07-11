import { PostHeader } from "./post/post-header";
import { PostContent } from "./post/post-content";
import { PostStats } from "./post/post-stats";
import { PostActions } from "./post/post-actions";
import { PostCommentInput } from "./post/post-comment-input";

interface PostCardProps {
  authorName: string;
  authorImage: string;
  timeAgo: string;
  privacy: string;
  content: string;
  postImage?: string;
  reactionCount: number;
  commentsCount: number;
  sharesCount: number;
  currentUserImage: string;
}

export function PostCard({
  authorName,
  authorImage,
  timeAgo,
  privacy,
  content,
  postImage,
  reactionCount,
  commentsCount,
  sharesCount,
  currentUserImage,
}: PostCardProps) {
  return (
    <div className="bg-bs-bg2 mb-4 rounded-[6px] py-6">
      <div className="px-6">
        <PostHeader
          authorName={authorName}
          authorImage={authorImage}
          timeAgo={timeAgo}
          privacy={privacy}
        />
        <PostContent content={content} image={postImage} />
        <PostStats
          reactionCount={reactionCount}
          commentsCount={commentsCount}
          sharesCount={sharesCount}
        />
        <PostActions />
        <PostCommentInput userImage={currentUserImage} />
      </div>
    </div>
  );
}
