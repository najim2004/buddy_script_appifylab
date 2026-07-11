import Link from "next/link";
import Image from "next/image";

export function RightSidebar() {
  return (
    <div className="space-y-6 lg:sticky lg:top-[90px]">
      {/* You Might Like */}
      <div className="rounded-[6px] bg-bs-bg2 p-6 pb-6">
        <div className="mb-6 flex items-center justify-between">
          <h4 className="text-[18px] font-semibold text-bs-color">You Might Like</h4>
          <Link href="#" className="text-sm font-medium text-bs-color7 transition-colors hover:text-primary">
            See All
          </Link>
        </div>
        
        <hr className="mb-6 border-bs-bcolor1" />
        
        <div>
          <div className="mb-4 flex items-center">
            <Link href="#" className="mr-3 block h-[46px] w-[46px] shrink-0 overflow-hidden rounded-full">
              <Image src="/assets/images/Avatar.png" alt="Radovan SkillArena" width={46} height={46} className="h-full w-full object-cover" />
            </Link>
            <div>
              <Link href="#" className="text-[15px] font-semibold text-bs-color transition-colors hover:text-primary">
                Radovan SkillArena
              </Link>
              <p className="text-[13px] font-normal text-bs-color7">Founder & CEO at Trophy</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button type="button" className="flex-1 rounded-[6px] bg-bs-bg1 py-[10px] text-[15px] font-medium text-bs-color transition-colors hover:bg-bs-bg3">
              Ignore
            </button>
            <button type="button" className="flex-1 rounded-[6px] bg-primary py-[10px] text-[15px] font-medium text-white transition-colors hover:bg-blue-600">
              Follow
            </button>
          </div>
        </div>
      </div>

      {/* Your Friends */}
      <div className="rounded-[6px] bg-bs-bg2 p-6">
        <div className="mb-6 flex items-center justify-between">
          <h4 className="text-[18px] font-semibold text-bs-color">Your Friends</h4>
          <Link href="/friend-request" className="text-sm font-medium text-bs-color7 transition-colors hover:text-primary">
            See All
          </Link>
        </div>

        {/* Search */}
        <form className="relative mb-6">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 17 17">
            <circle cx="7" cy="7" r="6" stroke="#666"></circle>
            <path stroke="#666" strokeLinecap="round" d="M16 16l-3-3"></path>
          </svg>
          <input
            type="search"
            placeholder="Search friends"
            className="h-[42px] w-full rounded-[40px] border border-bs-bcolor1 bg-bs-bg1 pl-10 pr-4 text-sm text-bs-color1 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </form>

        {/* Friends List */}
        <div className="space-y-[18px]">
          {/* Friend 1 (Inactive) */}
          <div className="flex items-center justify-between opacity-60 transition-opacity hover:opacity-100">
            <div className="flex items-center">
              <Link href="#" className="mr-3 block h-10 w-10 shrink-0 overflow-hidden rounded-full">
                <Image src="/assets/images/people1.png" alt="Steve Jobs" width={40} height={40} className="h-full w-full object-cover" />
              </Link>
              <div>
                <Link href="#" className="text-[14px] font-semibold text-bs-color transition-colors hover:text-primary">Steve Jobs</Link>
                <p className="text-[12px] font-normal text-bs-color7">CEO of Apple</p>
              </div>
            </div>
            <span className="text-[12px] text-bs-color7">5m ago</span>
          </div>

          {/* Friend 2 (Active) */}
          <div className="flex items-center justify-between cursor-pointer group">
            <div className="flex items-center">
              <Link href="#" className="mr-3 block h-10 w-10 shrink-0 overflow-hidden rounded-full">
                <Image src="/assets/images/people2.png" alt="Ryan Roslansky" width={40} height={40} className="h-full w-full object-cover" />
              </Link>
              <div>
                <Link href="#" className="text-[14px] font-semibold text-bs-color transition-colors group-hover:text-primary">Ryan Roslansky</Link>
                <p className="text-[12px] font-normal text-bs-color7">CEO of Linkedin</p>
              </div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 14 14">
              <rect width="12" height="12" x="1" y="1" fill="#0ACF83" stroke="var(--bs-bg2)" strokeWidth="2" rx="6" />
            </svg>
          </div>

          {/* Friend 3 (Active) */}
          <div className="flex items-center justify-between cursor-pointer group">
            <div className="flex items-center">
              <Link href="#" className="mr-3 block h-10 w-10 shrink-0 overflow-hidden rounded-full">
                <Image src="/assets/images/people3.png" alt="Dylan Field" width={40} height={40} className="h-full w-full object-cover" />
              </Link>
              <div>
                <Link href="#" className="text-[14px] font-semibold text-bs-color transition-colors group-hover:text-primary">Dylan Field</Link>
                <p className="text-[12px] font-normal text-bs-color7">CEO of Figma</p>
              </div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 14 14">
              <rect width="12" height="12" x="1" y="1" fill="#0ACF83" stroke="var(--bs-bg2)" strokeWidth="2" rx="6" />
            </svg>
          </div>
          
          {/* Friend 4 (Active) */}
          <div className="flex items-center justify-between cursor-pointer group">
            <div className="flex items-center">
              <Link href="#" className="mr-3 block h-10 w-10 shrink-0 overflow-hidden rounded-full">
                <Image src="/assets/images/people2.png" alt="Ryan Roslansky" width={40} height={40} className="h-full w-full object-cover" />
              </Link>
              <div>
                <Link href="#" className="text-[14px] font-semibold text-bs-color transition-colors group-hover:text-primary">Ryan Roslansky</Link>
                <p className="text-[12px] font-normal text-bs-color7">CEO of Linkedin</p>
              </div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 14 14">
              <rect width="12" height="12" x="1" y="1" fill="#0ACF83" stroke="var(--bs-bg2)" strokeWidth="2" rx="6" />
            </svg>
          </div>
          
          {/* Friend 5 (Active) */}
          <div className="flex items-center justify-between cursor-pointer group">
            <div className="flex items-center">
              <Link href="#" className="mr-3 block h-10 w-10 shrink-0 overflow-hidden rounded-full">
                <Image src="/assets/images/people3.png" alt="Dylan Field" width={40} height={40} className="h-full w-full object-cover" />
              </Link>
              <div>
                <Link href="#" className="text-[14px] font-semibold text-bs-color transition-colors group-hover:text-primary">Dylan Field</Link>
                <p className="text-[12px] font-normal text-bs-color7">CEO of Figma</p>
              </div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 14 14">
              <rect width="12" height="12" x="1" y="1" fill="#0ACF83" stroke="var(--bs-bg2)" strokeWidth="2" rx="6" />
            </svg>
          </div>

        </div>
      </div>
    </div>
  );
}
