import { Button } from "@/components/ui/button";
import { Home, Search, PlusCircle, Heart, User } from "lucide-react";

export function BottomNavigation() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-inset-bottom">
      <div className="flex justify-around items-center py-3">
        <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1 text-primary">
          <Home className="w-5 h-5" />
          <span className="text-xs">Ana Sayfa</span>
        </Button>
        <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1 text-gray-600">
          <Search className="w-5 h-5" />
          <span className="text-xs">Keşfet</span>
        </Button>
        <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1 text-gray-600">
          <PlusCircle className="w-5 h-5" />
          <span className="text-xs">Paylaş</span>
        </Button>
        <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1 text-gray-600 relative">
          <Heart className="w-5 h-5" />
          <span className="text-xs">Bildirimler</span>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
        </Button>
        <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1 text-gray-600">
          <User className="w-5 h-5" />
          <span className="text-xs">Profil</span>
        </Button>
      </div>
    </nav>
  );
}
