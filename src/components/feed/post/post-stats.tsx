import Image from "next/image";
import Link from "next/link";

interface PostStatsProps {
  reactionCount: number;
  commentsCount: number;
  sharesCount: number;
}

export function PostStats({ reactionCount, commentsCount, sharesCount }: PostStatsProps) {
  return (
    <div className="flex items-center justify-between border-b border-bs-border1 py-[10px]">
      <div className="flex items-center">
        <ul className="flex items-center">
          <li className="-mr-[5px]">
            <Image
              src="/assets/images/like.svg"
              alt="Like"
              width={18}
              height={18}
              className="rounded-full ring-2 ring-white dark:ring-bs-bg2"
            />
          </li>
          <li>
            <Image
              src="/assets/images/love.svg"
              alt="Love"
              width={18}
              height={18}
              className="rounded-full ring-2 ring-white dark:ring-bs-bg2"
            />
          </li>
        </ul>
        <p className="ml-[10px] text-[15px] font-medium text-[#8c8c8c]">
          {reactionCount}
        </p>
      </div>
      <div className="">
        <p className="text-[14px] font-medium text-[#8c8c8c]">
          <Link
            href="#0"
            className="text-[#8c8c8c] transition-all duration-200 ease-in-out hover:text-primary"
          >
            {commentsCount} Comments
          </Link>{" "}
          .{" "}
          <Link
            href="#0"
            className="text-[#8c8c8c] transition-all duration-200 ease-in-out hover:text-primary"
          >
            {sharesCount} Share
          </Link>
        </p>
      </div>
    </div>
  );
}
