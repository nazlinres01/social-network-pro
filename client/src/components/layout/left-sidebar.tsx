import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { api } from "@/lib/api";
import { Home, User, Bookmark, Users, Settings } from "lucide-react";

export function LeftSidebar() {
  const [location, setLocation] = useLocation();
  
  const { data: currentUser } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: api.getCurrentUser,
  });

  const menuItems = [
    { path: "/", icon: Home, label: "Ana Sayfa" },
    { path: "/profile", icon: User, label: "Profilim" },
    { path: "/saved", icon: Bookmark, label: "Kaydedilenler" },
    { path: "/groups", icon: Users, label: "Gruplar" },
    { path: "/settings", icon: Settings, label: "Ayarlar" }
  ];

  const trendingTopics = [
    { tag: "#WebTasarım", posts: "1.2K" },
    { tag: "#ReactJS", posts: "856" },
    { tag: "#UIDesign", posts: "634" },
  ];

  return (
    <div className="space-y-6">
      {/* User Profile Card */}
      {currentUser && (
        <Card>
          <CardContent className="p-6">
            <img
              src={currentUser.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400"}
              alt="Profil fotoğrafı"
              className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
            />
            <h3 className="text-lg font-semibold text-center text-gray-900">{currentUser.name}</h3>
            <p className="text-sm text-gray-600 text-center mb-4">{currentUser.bio || "UI/UX Tasarımcı"}</p>
            <div className="flex justify-center space-x-8 text-sm">
              <div className="text-center">
                <div className="font-semibold text-gray-900">{currentUser.postsCount}</div>
                <div className="text-gray-600">Gönderi</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-900">{currentUser.followersCount}</div>
                <div className="text-gray-600">Takipçi</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-900">{currentUser.followingCount}</div>
                <div className="text-gray-600">Takip</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation Menu */}
      <Card>
        <CardContent className="p-4">
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              
              return (
                <Button 
                  key={item.path}
                  variant="ghost" 
                  className={`w-full justify-start ${
                    isActive 
                      ? "bg-primary/10 text-primary hover:bg-primary/20" 
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setLocation(item.path)}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Button>
              );
            })}
          </nav>
        </CardContent>
      </Card>

      {/* Trending Topics */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Gündem</h3>
          <div className="space-y-3">
            {trendingTopics.map((topic, index) => (
              <div key={index} className="cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                <p className="text-sm font-medium text-primary">{topic.tag}</p>
                <p className="text-xs text-gray-600">{topic.posts} gönderi</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
