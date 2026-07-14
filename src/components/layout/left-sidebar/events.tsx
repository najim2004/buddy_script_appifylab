import Link from "next/link";
import Image from "next/image";

const EVENTS = [
  {
    id: 1,
    image: "/assets/images/feed_event1.png",
    day: "10",
    month: "Jul",
    title: "No more terrorism no more cry",
    goingCount: "17 People Going",
    status: "Going",
  },
  {
    id: 2,
    image: "/assets/images/feed_event1.png",
    day: "10",
    month: "Jul",
    title: "No more terrorism no more cry",
    goingCount: "17 People Going",
    status: "Going",
  },
];

export function Events() {
  return (
    <div className="bg-card rounded-[6px] p-6 pb-1.5">
      <div className="mb-6 flex items-center justify-between">
        <h4 className="text-title text-xl font-medium">Events</h4>
        <Link
          href="#"
          className="text-primary text-xs font-medium transition-colors"
        >
          See all
        </Link>
      </div>

      {EVENTS.map((event) => (
        <Link
          key={event.id}
          href="#"
          className="group mb-4 block transition-colors"
        >
          <div className="bg-card overflow-hidden rounded-lg shadow-[0px_4px_8px_rgba(0,0,0,0.08)]">
            <div className="relative aspect-14/9 w-full overflow-hidden rounded-lg bg-gray-200">
              <Image
                src={event.image}
                alt="Event"
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
            <div className="bg-card mt-1.5 mb-6 flex p-3 pb-0">
              <div className="bg-success mr-3 flex h-[52px] w-[46px] shrink-0 flex-col items-center justify-center rounded-sm px-2 py-2">
                <span className="text-lg leading-[1.1] font-bold text-white">
                  {event.day}
                </span>
                <span className="text-lg leading-[1.1] font-normal text-white">
                  {event.month}
                </span>
              </div>
              <div>
                <h4 className="text-title text-sm xl:text-base leading-[1.4] font-medium">
                  {event.title}
                </h4>
              </div>
            </div>
            <div className="border-background mt-1 mb-3 flex items-center justify-between border-t px-4 pt-3 pb-0.5">
              <span className="text-muted-foreground text-xs leading-4 font-medium opacity-70">
                {event.goingCount}
              </span>
              <span className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-primary-light/90 rounded-sm border px-3.5 py-[3px] text-xs leading-[18px] font-medium transition-colors">
                {event.status}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
