import { CreatePost } from "@/components/feed/create-post";
import { PostCard } from "@/components/feed/post-card";
import { Stories } from "@/components/feed/stories";
import { RightSidebar } from "@/components/layout/right-sidebar";

export default function FeedPage() {
  return (
    <>
      {/* Center Main Feed */}
      <div className="col-span-12 lg:col-span-6">
        <div className="mx-auto w-full max-w-[600px] lg:max-w-none">
          <Stories />
          
          <CreatePost />
          
          <PostCard
            authorName="Karim Saif"
            authorImage="/assets/images/post_img1.png"
            timeAgo="5 minute ago"
            privacy="Public"
            content="-Healthy Tracking App"
            postImage="/assets/images/timeline_img1.png"
            reactionCount={11}
            commentsCount={2}
            sharesCount={1}
            currentUserImage="/assets/images/txt_img.png"
          />

          <PostCard
            authorName="Karim Saif"
            authorImage="/assets/images/post_img1.png"
            timeAgo="5 minute ago"
            privacy="Public"
            content="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            reactionCount={5}
            commentsCount={1}
            sharesCount={0}
            currentUserImage="/assets/images/txt_img.png"
          />
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="hidden lg:col-span-3 lg:block">
        <RightSidebar />
      </div>
    </>
  );
}
