import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useLocation } from "wouter";
import { Search, Home, Compass, Heart, Mail } from "lucide-react";

export function TopNavigation() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useLocation();
  
  const { data: currentUser } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: api.getCurrentUser,
  });

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4 cursor-pointer" onClick={() => setLocation("/")}>
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-10 h-10 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47A3 3 0 1015 8z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900">SocialConnect</h1>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Kullanıcı, gönderi veya hashtag ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setLocation("/explore")}
                className="pl-10 bg-gray-50 border-gray-300 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          {/* Navigation Icons */}
          <div className="flex items-center space-x-6">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`relative ${location === "/" ? "text-primary" : "text-gray-600"}`}
              onClick={() => setLocation("/")}
            >
              <Home className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`relative ${location === "/explore" ? "text-primary" : "text-gray-600"}`}
              onClick={() => setLocation("/explore")}
            >
              <Compass className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`relative ${location === "/notifications" ? "text-primary" : "text-gray-600"}`}
              onClick={() => setLocation("/notifications")}
            >
              <Heart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">3</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className={`${location === "/messages" ? "text-primary" : "text-gray-600"}`}
              onClick={() => setLocation("/messages")}
            >
              <Mail className="w-5 h-5" />
            </Button>
            
            {/* User Avatar */}
            {currentUser && (
              <img
                src={currentUser.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150"}
                alt="Profil fotoğrafı"
                className="w-10 h-10 rounded-full border-2 border-primary cursor-pointer hover:scale-105 transition-transform object-cover"
                onClick={() => setLocation("/profile")}
              />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
