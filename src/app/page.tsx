import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { siteConfig } from "@/config/site";
import { ROUTES } from "@/lib/constants";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <header className="flex items-center justify-between border-b px-6 py-4">
        <span className="text-lg font-semibold">{siteConfig.name}</span>
        <ThemeToggle />
      </header>

      <section className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-balance sm:text-5xl">
          Industry-grade Next.js starter
        </h1>
        <p className="text-muted-foreground max-w-xl text-balance">
          Next.js 16 · React 19 · Tailwind v4 · Redux Toolkit · RTK Query ·
          shadcn/ui · Socket.IO — wired up and ready to scale.
        </p>
        <div className="flex gap-3">
          <Button asChild>
            <Link href={ROUTES.LOGIN}>Get started</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={ROUTES.DASHBOARD}>Dashboard</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
