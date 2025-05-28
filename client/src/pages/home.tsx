import { TopNavigation } from "@/components/layout/top-navigation";
import { LeftSidebar } from "@/components/layout/left-sidebar";
import { RightSidebar } from "@/components/layout/right-sidebar";
import { FeedContent } from "@/components/feed/feed-content";
import { BottomNavigation } from "@/components/mobile/bottom-navigation";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 hidden lg:block">
            <LeftSidebar />
          </div>
          
          <div className="lg:col-span-2">
            <FeedContent />
          </div>
          
          <div className="lg:col-span-1 hidden lg:block">
            <RightSidebar />
          </div>
        </div>
      </div>

      <BottomNavigation />

      {/* Floating Action Button for Mobile */}
      <button className="lg:hidden fixed bottom-20 right-4 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center z-40 hover:bg-primary/90 transition-colors">
        <i className="fas fa-plus text-xl"></i>
      </button>
    </div>
  );
}
