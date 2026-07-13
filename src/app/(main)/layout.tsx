import { ThemeToggle } from "@/components/common/theme-toggle";
import { Navbar } from "@/components/layout/navbar";
import { LeftSidebar } from "@/components/layout/left-sidebar";
import { RightSidebar } from "@/components/layout/right-sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background min-h-screen">
      <ThemeToggle />
      <Navbar />

      <div className="container mx-auto max-w-[1296px] px-4 pt-[90px] xl:px-0">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
          <aside className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-[90px] max-h-[calc(100vh-100px)] overflow-y-auto">
              <LeftSidebar />
            </div>
          </aside>

          <main className="lg:col-span-6">{children}</main>

          <aside className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-[90px] max-h-[calc(100vh-100px)] overflow-y-auto">
              <RightSidebar />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
