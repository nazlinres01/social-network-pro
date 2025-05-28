import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Home, Search, PlusCircle, Heart, User, MessageCircle } from "lucide-react";

export function BottomNavigation() {
  const [location, setLocation] = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-inset-bottom">
      <div className="flex justify-around items-center py-3">
        <Button 
          variant="ghost" 
          size="sm" 
          className={`flex flex-col items-center space-y-1 ${location === "/" ? "text-primary" : "text-gray-600"}`}
          onClick={() => setLocation("/")}
        >
          <Home className="w-5 h-5" />
          <span className="text-xs">Ana Sayfa</span>
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className={`flex flex-col items-center space-y-1 ${location === "/explore" ? "text-primary" : "text-gray-600"}`}
          onClick={() => setLocation("/explore")}
        >
          <Search className="w-5 h-5" />
          <span className="text-xs">Keşfet</span>
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className={`flex flex-col items-center space-y-1 ${location === "/messages" ? "text-primary" : "text-gray-600"}`}
          onClick={() => setLocation("/messages")}
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-xs">Mesajlar</span>
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className={`flex flex-col items-center space-y-1 text-gray-600 relative ${location === "/notifications" ? "text-primary" : "text-gray-600"}`}
          onClick={() => setLocation("/notifications")}
        >
          <Heart className="w-5 h-5" />
          <span className="text-xs">Bildirimler</span>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className={`flex flex-col items-center space-y-1 ${location === "/profile" ? "text-primary" : "text-gray-600"}`}
          onClick={() => setLocation("/profile")}
        >
          <User className="w-5 h-5" />
          <span className="text-xs">Profil</span>
        </Button>
      </div>
    </nav>
  );
}
