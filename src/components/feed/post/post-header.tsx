import Image from "next/image";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PostHeaderProps {
  authorName: string;
  authorImage: string;
  timeAgo: string;
  privacy: string;
}

export function PostHeader({ authorName, authorImage, timeAgo, privacy }: PostHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <div className="mr-[15px] h-12 w-12 max-w-[48px] shrink-0">
          <Image
            src={authorImage}
            alt={authorName}
            width={48}
            height={48}
            className="h-full w-full rounded-full object-cover"
          />
        </div>
        <div>
          <h4 className="mb-[5px] group">
            <Link
              href="#0"
              className="text-[16px] font-medium text-bs-color3 transition-all duration-200 ease-in-out group-hover:text-primary dark:text-bs-color"
            >
              {authorName}
            </Link>
          </h4>
          <p className="text-[12px] font-normal text-[#8c8c8c] flex items-center">
            {timeAgo} .{" "}
            <Link
              href="#0"
              className="ml-1 flex items-center text-[12px] font-normal text-[#8c8c8c] transition-all duration-200 ease-in-out hover:text-[#8c8c8c]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="11"
                height="11"
                fill="none"
                viewBox="0 0 11 11"
                className="-mt-[3px] mr-1"
              >
                <path
                  fill="#8C8C8C"
                  d="M5.5 0C2.467 0 0 2.467 0 5.5S2.467 11 5.5 11 11 8.533 11 5.5 8.533 0 5.5 0zm2.25 7.155a.333.333 0 11-.476.467l-2.072-2.12a.333.333 0 01-.095-.236V2.667a.333.333 0 11.666 0v2.462l1.977 2.026z"
                />
              </svg>
              {privacy}
            </Link>
          </p>
        </div>
      </div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex h-8 w-8 items-center justify-center rounded-full text-bs-color transition-colors hover:bg-bs-bg1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="4"
                fill="none"
                viewBox="0 0 20 4"
              >
                <path
                  fill="#8C8C8C"
                  d="M3 2a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm7-1.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm7 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"
                />
              </svg>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 border-bs-bg1 bg-bs-bg dark:bg-bs-bg2 dark:border-bs-bg2">
            <DropdownMenuItem className="cursor-pointer text-bs-color focus:bg-bs-bg1 dark:focus:bg-bs-bg1">
              Save Post
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-bs-color focus:bg-bs-bg1 dark:focus:bg-bs-bg1">
              Hide Post
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-red-500 focus:bg-bs-bg1 dark:focus:bg-bs-bg1">
              Report Post
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
