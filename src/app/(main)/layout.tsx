import { Navbar } from "@/components/layout/navbar";
import { LeftSidebar } from "@/components/layout/left-sidebar";
import { RightSidebar } from "@/components/layout/right-sidebar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bs-bg1 pb-[60px]">
      {/* Fixed Navbar */}
      <Navbar />

      {/* Main Layout Structure */}
      <div className="container mx-auto max-w-[1400px] px-4 pt-[90px] xl:px-0">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Sidebar */}
          <div className="lg:col-span-3">
            <LeftSidebar />
          </div>

          {/* Main Feed Content */}
          <div className="lg:col-span-6">
            {children}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-3">
            <RightSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
