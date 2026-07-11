import Image from "next/image";
import Link from "next/link";

interface PostStatsProps {
  reactionCount: number;
  commentsCount: number;
  sharesCount: number;
}

const REACTION_IMAGES = [
  "/assets/images/react_img1.png",
  "/assets/images/react_img2.png",
  "/assets/images/react_img3.png",
  "/assets/images/react_img4.png",
  "/assets/images/react_img5.png",
] as const;

export function PostStats({
  reactionCount,
  commentsCount,
  sharesCount,
}: PostStatsProps) {
  const visible = REACTION_IMAGES.slice(
    0,
    Math.min(5, Math.max(1, reactionCount)),
  );

  return (
    <div className="mb-0 flex items-center justify-between px-6">
      <div className="flex items-center">
        <div className="flex cursor-pointer items-center">
          {visible.map((src, index) => (
            <Image
              key={src}
              src={src}
              alt=""
              width={32}
              height={32}
              className="border-card bg-placeholder size-8 rounded-full border object-cover"
              style={{ marginLeft: index === 0 ? 0 : -16 }}
            />
          ))}
          {reactionCount > 5 ? (
            <span
              className="border-card bg-primary text-primary-foreground ml-[-16px] flex size-8 items-center justify-center rounded-full border-2 text-sm"
              aria-hidden
            >
              9+
            </span>
          ) : null}
        </div>
        <p className="text-subtle ml-2.5 pt-1.5 text-sm leading-tight">
          {reactionCount}
        </p>
      </div>

      <div className="text-subtle flex items-center text-sm leading-tight">
        <Link href="#0" className="hover:text-primary transition-colors">
          <span className="text-title">{commentsCount}</span> Comment
        </Link>
        <span className="mx-4">
          <span className="text-title">{sharesCount}</span> Share
        </span>
      </div>
    </div>
  );
}
