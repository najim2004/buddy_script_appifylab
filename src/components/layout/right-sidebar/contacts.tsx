import Link from "next/link";
import Image from "next/image";

const FRIENDS = [
  {
    id: 1,
    name: "Steve Jobs",
    role: "CEO of Apple",
    image: "/assets/images/people1.png",
    timeAgo: "5m ago",
    isActive: false,
  },
  {
    id: 2,
    name: "Ryan Roslansky",
    role: "CEO of Linkedin",
    image: "/assets/images/people2.png",
    isActive: true,
  },
  {
    id: 3,
    name: "Dylan Field",
    role: "CEO of Figma",
    image: "/assets/images/people3.png",
    isActive: true,
  },
  {
    id: 4,
    name: "Ryan Roslansky",
    role: "CEO of Linkedin",
    image: "/assets/images/people2.png",
    isActive: true,
  },
  {
    id: 5,
    name: "Dylan Field",
    role: "CEO of Figma",
    image: "/assets/images/people3.png",
    isActive: true,
  },
  {
    id: 6,
    name: "Steve Jobs",
    role: "CEO of Apple",
    image: "/assets/images/people1.png",
    timeAgo: "5m ago",
    isActive: false,
  },
  {
    id: 7,
    name: "Ryan Roslansky",
    role: "CEO of Linkedin",
    image: "/assets/images/people2.png",
    isActive: true,
  },
  {
    id: 8,
    name: "Dylan Field",
    role: "CEO of Figma",
    image: "/assets/images/people3.png",
    isActive: true,
  },
  {
    id: 9,
    name: "Ryan Roslansky",
    role: "CEO of Linkedin",
    image: "/assets/images/people2.png",
    isActive: true,
  },
  {
    id: 10,
    name: "Dylan Field",
    role: "CEO of Figma",
    image: "/assets/images/people3.png",
    isActive: true,
  },
];

export function Contacts() {
  return (
    <div className="bg-card rounded-lg p-6">
      <div className="mb-6 flex items-center justify-between">
        <h4 className="text-title text-base font-medium xl:text-xl">
          Your Friends
        </h4>
        <Link
          href="#"
          className="text-primary text-xs font-medium text-nowrap transition-colors xl:text-sm"
        >
          See All
        </Link>
      </div>

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
          className="border-border bg-background text-foreground focus:border-primary h-[42px] w-full rounded-[40px] border pr-4 pl-10 text-sm focus:ring-0 focus:outline-none"
        />
      </form>

      {/* Friends List */}
      <div className="space-y-8">
        {FRIENDS.map((friend) => (
          <div
            key={friend.id}
            className={`flex cursor-pointer items-center justify-between ${
              !friend.isActive
                ? "hover:bg-background gap-1 rounded-xl p-1.5 lg:flex-col lg:items-start xl:flex-row xl:items-center xl:gap-0"
                : ""
            }`}
          >
            <div className="flex items-center">
              <Link
                href="#"
                className="mr-3 block h-10 w-10 shrink-0 overflow-hidden rounded-full"
              >
                <Image
                  src={friend.image}
                  alt={friend.name}
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              </Link>
              <div>
                <Link href="#" className="text-title text-sm font-medium">
                  {friend.name}
                </Link>
                <p className="text-muted-foreground text-xs font-normal">
                  {friend.role}
                </p>
              </div>
            </div>
            {friend.isActive ? (
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
            ) : (
              <span className="text-muted-foreground text-xs lg:ml-[52px] xl:ml-0">
                {friend.timeAgo}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
