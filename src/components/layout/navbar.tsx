"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MobileBottomNav,
  MobileTopBar,
} from "@/components/layout/mobile-bottom-nav";
import { useAuth, useLogoutMutation } from "@/features/auth";
import { getApiErrorMessage } from "@/lib/api/error";
import { ROUTES } from "@/lib/constants";

const NAV_ITEMS = [
  {
    id: "home",
    href: "/",
    badge: 0,
    hasActiveState: true,
    liClass: "relative",
    linkClass: (active: boolean) =>
      `relative flex h-[70px] items-center justify-center px-4 transition-all ${
        active
          ? "border-brand-underline border-b-2"
          : "hover:border-brand-underline border-b-2 border-transparent hover:border-b-2"
      }`,
    icon: (active: boolean) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="21"
        fill="none"
        viewBox="0 0 18 21"
      >
        <path
          className="transition-all"
          stroke={active ? "#1890FF" : "currentColor"}
          strokeOpacity={active ? "1" : ".6"}
          strokeWidth="1.5"
          d="M1 9.924c0-1.552 0-2.328.314-3.01.313-.682.902-1.187 2.08-2.196l1.143-.98C6.667 1.913 7.732 1 9 1c1.268 0 2.333.913 4.463 2.738l1.142.98c1.179 1.01 1.768 1.514 2.081 2.196.314.682.314 1.458.314 3.01v4.846c0 2.155 0 3.233-.67 3.902-.669.67-1.746.67-3.901.67H5.57c-2.155 0-3.232 0-3.902-.67C1 18.002 1 16.925 1 14.77V9.924z"
        />
        <path
          className="transition-all"
          stroke={active ? "#1890FF" : "currentColor"}
          strokeOpacity={active ? "1" : ".6"}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M11.857 19.341v-5.857a1 1 0 00-1-1H7.143a1 1 0 00-1 1v5.857"
        />
      </svg>
    ),
  },
  {
    id: "friend-request",
    href: "#",
    badge: 0,
    hasActiveState: false,
    liClass: "",
    linkClass: () => "flex h-[70px] items-center justify-center px-2",
    icon: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="26"
        height="20"
        fill="none"
        viewBox="0 0 26 20"
      >
        <path
          fill="currentColor"
          fillOpacity=".6"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.79 12.15h.429c2.268.015 7.45.243 7.45 3.732 0 3.466-5.002 3.692-7.415 3.707h-.894c-2.268-.015-7.452-.243-7.452-3.727 0-3.47 5.184-3.697 7.452-3.711l.297-.001h.132zm0 1.75c-2.792 0-6.12.34-6.12 1.962 0 1.585 3.13 1.955 5.864 1.976l.255.002c2.792 0 6.118-.34 6.118-1.958 0-1.638-3.326-1.982-6.118-1.982zm9.343-2.224c2.846.424 3.444 1.751 3.444 2.79 0 .636-.251 1.794-1.931 2.43a.882.882 0 01-1.137-.506.873.873 0 01.51-1.13c.796-.3.796-.633.796-.793 0-.511-.654-.868-1.944-1.06a.878.878 0 01-.741-.996.886.886 0 011.003-.735zm-17.685.735a.878.878 0 01-.742.997c-1.29.19-1.944.548-1.944 1.059 0 .16 0 .491.798.793a.873.873 0 01-.314 1.693.897.897 0 01-.313-.057C.25 16.259 0 15.1 0 14.466c0-1.037.598-2.366 3.446-2.79.485-.06.929.257 1.002.735zM12.789 0c2.96 0 5.368 2.392 5.368 5.33 0 2.94-2.407 5.331-5.368 5.331h-.031a5.329 5.329 0 01-3.782-1.57 5.253 5.253 0 01-1.553-3.764C7.423 2.392 9.83 0 12.789 0zm0 1.75c-1.987 0-3.604 1.607-3.604 3.58a3.526 3.526 0 001.04 2.527 3.58 3.58 0 002.535 1.054l.03.875v-.875c1.987 0 3.605-1.605 3.605-3.58S14.777 1.75 12.789 1.75zm7.27-.607a4.222 4.222 0 013.566 4.172c-.004 2.094-1.58 3.89-3.665 4.181a.88.88 0 01-.994-.745.875.875 0 01.75-.989 2.494 2.494 0 002.147-2.45 2.473 2.473 0 00-2.09-2.443.876.876 0 01-.726-1.005.881.881 0 011.013-.721zm-13.528.72a.876.876 0 01-.726 1.006 2.474 2.474 0 00-2.09 2.446A2.493 2.493 0 005.86 7.762a.875.875 0 11-.243 1.734c-2.085-.29-3.66-2.087-3.664-4.179 0-2.082 1.5-3.837 3.566-4.174a.876.876 0 011.012.72z"
        />
      </svg>
    ),
  },
  {
    id: "notifications",
    href: null,
    badge: 6,
    hasActiveState: false,
    liClass: "relative cursor-pointer",
    linkClass: () => "",
    icon: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="22"
        fill="none"
        viewBox="0 0 20 22"
      >
        <path
          fill="currentColor"
          fillOpacity=".6"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7.547 19.55c.533.59 1.218.915 1.93.915.714 0 1.403-.324 1.938-.916a.777.777 0 011.09-.056c.318.284.344.77.058 1.084-.832.917-1.927 1.423-3.086 1.423h-.002c-1.155-.001-2.248-.506-3.077-1.424a.762.762 0 01.057-1.083.774.774 0 011.092.057zM9.527 0c4.58 0 7.657 3.543 7.657 6.85 0 1.702.436 2.424.899 3.19.457.754.976 1.612.976 3.233-.36 4.14-4.713 4.478-9.531 4.478-4.818 0-9.172-.337-9.528-4.413-.003-1.686.515-2.544.973-3.299l.161-.27c.398-.679.737-1.417.737-2.918C1.871 3.543 4.948 0 9.528 0zm0 1.535c-3.6 0-6.11 2.802-6.11 5.316 0 2.127-.595 3.11-1.12 3.978-.422.697-.755 1.247-.755 2.444.173 1.93 1.455 2.944 7.986 2.944 6.494 0 7.817-1.06 7.988-3.01-.003-1.13-.336-1.681-.757-2.378-.526-.868-1.12-1.851-1.12-3.978 0-2.514-2.51-5.316-6.111-5.316z"
        />
      </svg>
    ),
  },
  {
    id: "messages",
    href: null,
    badge: 2,
    hasActiveState: false,
    liClass: "relative cursor-pointer",
    linkClass: () => "",
    icon: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="23"
        height="22"
        fill="none"
        viewBox="0 0 23 22"
      >
        <path
          fill="currentColor"
          fillOpacity=".6"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M11.43 0c2.96 0 5.743 1.143 7.833 3.22 4.32 4.29 4.32 11.271 0 15.562C17.145 20.886 14.293 22 11.405 22c-1.575 0-3.16-.33-4.643-1.012-.437-.174-.847-.338-1.14-.338-.338.002-.793.158-1.232.308-.9.307-2.022.69-2.852-.131-.826-.822-.445-1.932-.138-2.826.152-.44.307-.895.307-1.239 0-.282-.137-.642-.347-1.161C-.57 11.46.322 6.47 3.596 3.22A11.04 11.04 0 0111.43 0zm0 1.535A9.5 9.5 0 004.69 4.307a9.463 9.463 0 00-1.91 10.686c.241.592.474 1.17.474 1.77 0 .598-.207 1.201-.39 1.733-.15.439-.378 1.1-.231 1.245.143.147.813-.085 1.255-.235.53-.18 1.133-.387 1.73-.391.597 0 1.161.225 1.758.463 3.655 1.679 7.98.915 10.796-1.881 3.716-3.693 3.716-9.7 0-13.391a9.5 9.5 0 00-6.74-2.77zm4.068 8.867c.57 0 1.03.458 1.03 1.024 0 .566-.46 1.023-1.03 1.023a1.023 1.023 0 11-.01-2.047h.01zm-4.131 0c.568 0 1.03.458 1.03 1.024 0 .566-.462 1.023-1.03 1.023a1.03 1.03 0 01-1.035-1.024c0-.566.455-1.023 1.025-1.023h.01zm-4.132 0c.568 0 1.03.458 1.03 1.024 0 .566-.462 1.023-1.03 1.023a1.022 1.022 0 11-.01-2.047h.01z"
        />
      </svg>
    ),
  },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const displayName =
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    user?.email ||
    "User";
  const avatarSrc = user?.avatar
    ? user.avatar.startsWith("http") || user.avatar.startsWith("/")
      ? user.avatar
      : `/storage/${user.avatar}`
    : undefined;

  const onLogout = async () => {
    try {
      await logout().unwrap();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not log out"));
    } finally {
      router.replace(ROUTES.LOGIN);
    }
  };

  return (
    <>
      <nav className="bg-card fixed top-0 right-0 left-0 z-50 hidden lg:block dark:border-b">
        <div className="container mx-auto flex h-[72px] max-w-[1296px] items-center px-4 xl:px-0">
          <div className="flex shrink-0 items-center">
            <Link href="/">
              <Image
                src="/assets/images/logo.svg"
                alt="Buddy Script logo"
                width={161}
                height={40}
                priority
                className="h-auto w-auto max-w-[137px]"
              />
            </Link>
          </div>

          <div className="ml-auto w-full">
            <form className="relative mx-auto lg:w-[326px] xl:w-[426px]">
              <svg
                className="absolute top-1/2 left-4 -translate-y-1/2"
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="17"
                fill="none"
                viewBox="0 0 17 17"
              >
                <circle cx="7" cy="7" r="6" stroke="#666" />
                <path stroke="#666" strokeLinecap="round" d="M16 16l-3-3" />
              </svg>
              <input
                type="search"
                placeholder="input search text"
                className="bg-secondary text-foreground focus:border-primary h-10 w-full rounded-[40px] border border-transparent pr-4 pl-11 text-sm font-medium focus:ring-0 focus:outline-none"
              />
            </form>
          </div>

          <ul className="ml-auto flex items-center space-x-6 xl:space-x-11">
            {NAV_ITEMS.map((item) => {
              const active =
                item.hasActiveState && item.href
                  ? pathname === item.href
                  : false;

              const innerContent = (
                <>
                  {item.icon(active)}
                  {item.badge > 0 && (
                    <span className="border-card bg-primary absolute -top-2 -right-2 flex h-4 min-w-4 items-center justify-center rounded-lg border text-xs leading-[1.4] font-normal text-white">
                      {item.badge}
                    </span>
                  )}
                </>
              );

              return (
                <li key={item.id} className={item.liClass || undefined}>
                  {item.href ? (
                    <Link href={item.href} className={item.linkClass(active)}>
                      {innerContent}
                    </Link>
                  ) : (
                    innerContent
                  )}
                </li>
              );
            })}
          </ul>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="ml-8 flex shrink-0 items-center gap-2 outline-none"
              >
                <div className="bg-muted text-muted-foreground flex h-7 w-7 items-center justify-center overflow-hidden rounded-full text-xs">
                  {avatarSrc ? (
                    <Image
                      src={avatarSrc}
                      alt={displayName}
                      width={32}
                      height={32}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    displayName.slice(0, 1).toUpperCase()
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-title text-base font-normal">
                    {displayName}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="10"
                    height="6"
                    fill="none"
                    viewBox="0 0 10 6"
                    aria-hidden
                  >
                    <path
                      fill="#112032"
                      className="dark:fill-white"
                      d="M5 5l.354.354L5 5.707l-.354-.353L5 5zm4.354-3.646l-4 4-.708-.708 4-4 .708.708zm-4.708 4l-4-4 .708-.708 4 4-.708.708z"
                    />
                  </svg>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card w-44">
              <DropdownMenuItem
                className="text-destructive focus:text-destructive cursor-pointer"
                disabled={isLoggingOut}
                onClick={() => void onLogout()}
              >
                <LogOut className="size-4" />
                {isLoggingOut ? "Logging out…" : "Logout"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      <MobileTopBar />
      <MobileBottomNav />
    </>
  );
}
