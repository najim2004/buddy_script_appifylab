import Link from "next/link";
import Image from "next/image";

const RECOMMENDATIONS = [
  {
    id: 1,
    name: "Radovan SkillArena",
    role: "Founder & CEO at Trophy",
    image: "/assets/images/Avatar.png",
  },
];

export function FriendRequests() {
  return (
    <div className="bg-card rounded-lg p-6 pb-6">
      <div className="mb-6 flex items-center justify-between">
        <h4 className="text-title text-base xl:text-xl font-medium">You Might Like</h4>
        <Link href="#" className="text-primary text-nowrap text-xs xl:text-sm font-medium">
          See All
        </Link>
      </div>

      <hr className="border-border mb-6" />

      <div>
        {RECOMMENDATIONS.map((recommendation) => (
          <div key={recommendation.id}>
            <div className="mb-4 flex items-center">
              <Link
                href="#"
                className="mr-3 block h-[46px] w-[46px] shrink-0 overflow-hidden rounded-full"
              >
                <Image
                  src={recommendation.image}
                  alt={recommendation.name}
                  width={46}
                  height={46}
                  className="h-full w-full object-cover"
                />
              </Link>
              <div>
                <Link
                  href="#"
                  className="text-title text-xs xl:text-base font-medium transition-colors"
                >
                  {recommendation.name}
                </Link>
                <p className="text-muted-foreground text-[8px] xl:text-xs font-normal">
                  {recommendation.role}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="dark:border-border text-sidebar-muted hover:bg-secondary border-border-light flex-1 rounded-md border bg-transparent xl:py-3 py-2 text-sm font-medium transition-colors"
              >
                Ignore
              </button>
              <button
                type="button"
                className="bg-primary hover:bg-primary-hover flex-1 rounded-md xl:py-3 py-2 text-sm font-medium text-white transition-colors"
              >
                Follow
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
