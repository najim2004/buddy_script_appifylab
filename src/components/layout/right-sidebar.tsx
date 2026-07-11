import Link from "next/link";
import Image from "next/image";

export function RightSidebar() {
  return (
    <div className="space-y-4">
      {/* You Might Like */}
      <div className="bg-card rounded-[6px] p-6 pb-6">
        <div className="mb-6 flex items-center justify-between">
          <h4 className="text-title text-[18px] font-semibold">
            You Might Like
          </h4>
          <Link
            href="#"
            className="text-muted-foreground hover:text-primary text-sm font-medium transition-colors"
          >
            See All
          </Link>
        </div>

        <hr className="border-border mb-6" />

        <div>
          <div className="mb-4 flex items-center">
            <Link
              href="#"
              className="mr-3 block h-[46px] w-[46px] shrink-0 overflow-hidden rounded-full"
            >
              <Image
                src="/assets/images/Avatar.png"
                alt="Radovan SkillArena"
                width={46}
                height={46}
                className="h-full w-full object-cover"
              />
            </Link>
            <div>
              <Link
                href="#"
                className="text-title hover:text-primary text-[15px] font-semibold transition-colors"
              >
                Radovan SkillArena
              </Link>
              <p className="text-muted-foreground text-[13px] font-normal">
                Founder & CEO at Trophy
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="border border-[#f1f1f1] dark:border-border bg-transparent text-sidebar-muted hover:bg-secondary flex-1 rounded-[6px] py-[10px] text-[15px] font-medium transition-colors"
            >
              Ignore
            </button>
            <button
              type="button"
              className="bg-primary flex-1 rounded-[6px] py-[10px] text-[15px] font-medium text-white transition-colors hover:bg-primary-hover"
            >
              Follow
            </button>
          </div>
        </div>
      </div>

      {/* Your Friends */}
      <div className="bg-card rounded-[6px] p-6">
        <div className="mb-6 flex items-center justify-between">
          <h4 className="text-title text-[18px] font-semibold">
            Your Friends
          </h4>
          <Link
            href="/friend-request"
            className="text-muted-foreground hover:text-primary text-sm font-medium transition-colors"
          >
            See All
          </Link>
        </div>

        {/* Search */}
        <form className="relative mb-6">
          <svg
            className="absolute top-1/2 left-3 -translate-y-1/2"
            xmlns="http://www.w3.org/2000/svg"
            width="17"
            height="17"
            fill="none"
            viewBox="0 0 17 17"
          >
            <circle cx="7" cy="7" r="6" stroke="#666"></circle>
            <path stroke="#666" strokeLinecap="round" d="M16 16l-3-3"></path>
          </svg>
          <input
            type="search"
            placeholder="Search friends"
            className="border-border bg-background text-foreground focus:border-primary focus:ring-primary h-[42px] w-full rounded-[40px] border pr-4 pl-10 text-sm focus:ring-1 focus:outline-none"
          />
        </form>

        {/* Friends List */}
        <div className="space-y-[18px]">
          {/* Friend 1 (Inactive) */}
          <div className="flex items-center justify-between opacity-60 transition-opacity hover:opacity-100">
            <div className="flex items-center">
              <Link
                href="#"
                className="mr-3 block h-10 w-10 shrink-0 overflow-hidden rounded-full"
              >
                <Image
                  src="/assets/images/people1.png"
                  alt="Steve Jobs"
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              </Link>
              <div>
                <Link
                  href="#"
                  className="text-title hover:text-primary text-[14px] font-semibold transition-colors"
                >
                  Steve Jobs
                </Link>
                <p className="text-muted-foreground text-[12px] font-normal">
                  CEO of Apple
                </p>
              </div>
            </div>
            <span className="text-muted-foreground text-[12px]">5m ago</span>
          </div>

          {/* Friend 2 (Active) */}
          <div className="group flex cursor-pointer items-center justify-between">
            <div className="flex items-center">
              <Link
                href="#"
                className="mr-3 block h-10 w-10 shrink-0 overflow-hidden rounded-full"
              >
                <Image
                  src="/assets/images/people2.png"
                  alt="Ryan Roslansky"
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              </Link>
              <div>
                <Link
                  href="#"
                  className="text-title group-hover:text-primary text-[14px] font-semibold transition-colors"
                >
                  Ryan Roslansky
                </Link>
                <p className="text-muted-foreground text-[12px] font-normal">
                  CEO of Linkedin
                </p>
              </div>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              fill="none"
              viewBox="0 0 14 14"
            >
              <rect
                width="12"
                height="12"
                x="1"
                y="1"
                fill="var(--success)"
                stroke="var(--card)"
                strokeWidth="2"
                rx="6"
              />
            </svg>
          </div>

          {/* Friend 3 (Active) */}
          <div className="group flex cursor-pointer items-center justify-between">
            <div className="flex items-center">
              <Link
                href="#"
                className="mr-3 block h-10 w-10 shrink-0 overflow-hidden rounded-full"
              >
                <Image
                  src="/assets/images/people3.png"
                  alt="Dylan Field"
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              </Link>
              <div>
                <Link
                  href="#"
                  className="text-title group-hover:text-primary text-[14px] font-semibold transition-colors"
                >
                  Dylan Field
                </Link>
                <p className="text-muted-foreground text-[12px] font-normal">
                  CEO of Figma
                </p>
              </div>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              fill="none"
              viewBox="0 0 14 14"
            >
              <rect
                width="12"
                height="12"
                x="1"
                y="1"
                fill="var(--success)"
                stroke="var(--card)"
                strokeWidth="2"
                rx="6"
              />
            </svg>
          </div>

          {/* Friend 4 (Active) */}
          <div className="group flex cursor-pointer items-center justify-between">
            <div className="flex items-center">
              <Link
                href="#"
                className="mr-3 block h-10 w-10 shrink-0 overflow-hidden rounded-full"
              >
                <Image
                  src="/assets/images/people2.png"
                  alt="Ryan Roslansky"
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              </Link>
              <div>
                <Link
                  href="#"
                  className="text-title group-hover:text-primary text-[14px] font-semibold transition-colors"
                >
                  Ryan Roslansky
                </Link>
                <p className="text-muted-foreground text-[12px] font-normal">
                  CEO of Linkedin
                </p>
              </div>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              fill="none"
              viewBox="0 0 14 14"
            >
              <rect
                width="12"
                height="12"
                x="1"
                y="1"
                fill="var(--success)"
                stroke="var(--card)"
                strokeWidth="2"
                rx="6"
              />
            </svg>
          </div>

          {/* Friend 5 (Active) */}
          <div className="group flex cursor-pointer items-center justify-between">
            <div className="flex items-center">
              <Link
                href="#"
                className="mr-3 block h-10 w-10 shrink-0 overflow-hidden rounded-full"
              >
                <Image
                  src="/assets/images/people3.png"
                  alt="Dylan Field"
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              </Link>
              <div>
                <Link
                  href="#"
                  className="text-title group-hover:text-primary text-[14px] font-semibold transition-colors"
                >
                  Dylan Field
                </Link>
                <p className="text-muted-foreground text-[12px] font-normal">
                  CEO of Figma
                </p>
              </div>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              fill="none"
              viewBox="0 0 14 14"
            >
              <rect
                width="12"
                height="12"
                x="1"
                y="1"
                fill="var(--success)"
                stroke="var(--card)"
                strokeWidth="2"
                rx="6"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
