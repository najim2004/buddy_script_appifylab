import Link from "next/link";
import Image from "next/image";

const SUGGESTED_PEOPLE = [
  {
    name: "Steve Jobs",
    role: "CEO of Apple",
    image: "/assets/images/people1.png",
  },
  {
    name: "Ryan Roslansky",
    role: "CEO of Linkedin",
    image: "/assets/images/people2.png",
  },
  {
    name: "Dylan Field",
    role: "CEO of Figma",
    image: "/assets/images/people3.png",
  },
];

export function SuggestedPeople() {
  return (
    <div className="bg-card rounded-lg p-6 pb-1.5">
      <div className="mb-6 flex items-center justify-between">
        <h4 className="text-title text-xl font-medium">Suggested People</h4>
        <Link
          href="#"
          className="text-primary text-xs font-medium transition-colors"
        >
          See All
        </Link>
      </div>

      {SUGGESTED_PEOPLE.map((person) => (
        <div key={person.name} className="mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link
              href="#"
              className="mr-3 block h-10 w-10 shrink-0 overflow-hidden rounded-full"
            >
              <Image
                src={person.image}
                alt={person.name}
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            </Link>
            <div>
              <Link href="#" className="text-title text-sm font-medium">
                {person.name}
              </Link>
              <p className="text-muted-foreground text-xs font-normal">
                {person.role}
              </p>
            </div>
          </div>
          <Link
            href="#"
            className="border-border text-muted-foreground hover:bg-primary hover:border-primary hover:text-primary-foreground rounded-sm border p-[7px] text-xs leading-[1.4] font-medium transition-colors"
          >
            Connect
          </Link>
        </div>
      ))}
    </div>
  );
}
