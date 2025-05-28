import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { TopNavigation } from "@/components/layout/top-navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Search, Plus, Globe, Lock, Crown, Calendar, MapPin } from "lucide-react";

export default function GroupsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("my-groups");

  const { data: currentUser } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: api.getCurrentUser,
  });

  // Mock grup verileri - gerçek uygulamada API'den gelecek
  const myGroups = [
    {
      id: 1,
      name: "React Developers Turkey",
      description: "Türkiye'deki React geliştiricileri için topluluk",
      memberCount: 2847,
      postCount: 156,
      privacy: "public",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=300&h=200",
      role: "admin",
      lastActivity: new Date(Date.now() - 3600000)
    },
    {
      id: 2,
      name: "UI/UX Designers",
      description: "Tasarım deneyimlerini paylaştığımız özel grup",
      memberCount: 1234,
      postCount: 89,
      privacy: "private",
      image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=300&h=200",
      role: "member",
      lastActivity: new Date(Date.now() - 7200000)
    },
    {
      id: 3,
      name: "Startup Turkey",
      description: "Girişimcilik ve startup ekosistemi",
      memberCount: 5621,
      postCount: 342,
      privacy: "public",
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=300&h=200",
      role: "member",
      lastActivity: new Date(Date.now() - 14400000)
    }
  ];

  const suggestedGroups = [
    {
      id: 4,
      name: "JavaScript Masters",
      description: "İleri seviye JavaScript teknikleri",
      memberCount: 3456,
      privacy: "public",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=300&h=200",
      category: "Teknoloji"
    },
    {
      id: 5,
      name: "Digital Marketing Pro",
      description: "Dijital pazarlama stratejileri ve ipuçları",
      memberCount: 1876,
      privacy: "public",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=300&h=200",
      category: "Pazarlama"
    },
    {
      id: 6,
      name: "Freelance Developers",
      description: "Freelance çalışan geliştiriciler topluluğu",
      memberCount: 2134,
      privacy: "private",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=300&h=200",
      category: "Kariyer"
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "React Workshop",
      group: "React Developers Turkey",
      date: "25 Mart 2024",
      time: "19:00",
      location: "Online",
      attendees: 45
    },
    {
      id: 2,
      title: "Design Thinking Session",
      group: "UI/UX Designers",
      date: "28 Mart 2024",
      time: "14:00",
      location: "İstanbul",
      attendees: 23
    }
  ];

  const filteredMyGroups = myGroups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSuggestedGroups = suggestedGroups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Gruplar</h1>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Grup Oluştur
              </Button>
            </div>

            {/* Search */}
            <Card>
              <CardContent className="p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Grup ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="my-groups">Gruplarım</TabsTrigger>
                <TabsTrigger value="suggested">Önerilen</TabsTrigger>
                <TabsTrigger value="discover">Keşfet</TabsTrigger>
              </TabsList>

              <TabsContent value="my-groups" className="mt-6">
                <div className="space-y-4">
                  {filteredMyGroups.map((group) => (
                    <Card key={group.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex space-x-4">
                          <img
                            src={group.image}
                            alt={group.name}
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-gray-900 flex items-center">
                                {group.name}
                                {group.privacy === "private" ? (
                                  <Lock className="w-4 h-4 ml-2 text-gray-500" />
                                ) : (
                                  <Globe className="w-4 h-4 ml-2 text-gray-500" />
                                )}
                                {group.role === "admin" && (
                                  <Crown className="w-4 h-4 ml-2 text-yellow-500" />
                                )}
                              </h3>
                              <Badge variant={group.role === "admin" ? "default" : "secondary"}>
                                {group.role === "admin" ? "Yönetici" : "Üye"}
                              </Badge>
                            </div>
                            <p className="text-gray-600 mt-1">{group.description}</p>
                            <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                              <span className="flex items-center">
                                <Users className="w-4 h-4 mr-1" />
                                {group.memberCount} üye
                              </span>
                              <span>{group.postCount} gönderi</span>
                              <span>Son etkinlik: {group.lastActivity.toLocaleDateString('tr-TR')}</span>
                            </div>
                            <div className="flex space-x-2 mt-4">
                              <Button size="sm">Gruba Git</Button>
                              <Button size="sm" variant="outline">Bildirimler</Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="suggested" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredSuggestedGroups.map((group) => (
                    <Card key={group.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <img
                          src={group.image}
                          alt={group.name}
                          className="w-full h-32 rounded-lg object-cover mb-4"
                        />
                        <h3 className="font-semibold text-gray-900 flex items-center">
                          {group.name}
                          {group.privacy === "private" ? (
                            <Lock className="w-4 h-4 ml-2 text-gray-500" />
                          ) : (
                            <Globe className="w-4 h-4 ml-2 text-gray-500" />
                          )}
                        </h3>
                        <p className="text-gray-600 mt-1 text-sm">{group.description}</p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center text-sm text-gray-500">
                            <Users className="w-4 h-4 mr-1" />
                            {group.memberCount} üye
                          </div>
                          <Badge variant="outline">{group.category}</Badge>
                        </div>
                        <Button className="w-full mt-4" size="sm">
                          Katıl
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="discover" className="mt-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4 text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                          <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="font-medium text-gray-900">Teknoloji</h3>
                        <p className="text-sm text-gray-600">234 grup</p>
                      </CardContent>
                    </Card>
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4 text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                          <Users className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="font-medium text-gray-900">Tasarım</h3>
                        <p className="text-sm text-gray-600">156 grup</p>
                      </CardContent>
                    </Card>
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4 text-center">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                          <Users className="w-6 h-6 text-purple-600" />
                        </div>
                        <h3 className="font-medium text-gray-900">Pazarlama</h3>
                        <p className="text-sm text-gray-600">89 grup</p>
                      </CardContent>
                    </Card>
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4 text-center">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                          <Users className="w-6 h-6 text-orange-600" />
                        </div>
                        <h3 className="font-medium text-gray-900">Kariyer</h3>
                        <p className="text-sm text-gray-600">67 grup</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Yaklaşan Etkinlikler */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Yaklaşan Etkinlikler</h3>
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="border border-gray-100 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900">{event.title}</h4>
                      <p className="text-sm text-gray-600">{event.group}</p>
                      <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {event.date}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {event.location}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{event.attendees} kişi katılıyor</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Grup İstatistikleri */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">İstatistikler</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Katıldığınız Gruplar</span>
                    <span className="font-semibold text-primary">{myGroups.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Toplam Üye</span>
                    <span className="font-semibold text-green-600">
                      {myGroups.reduce((acc, group) => acc + group.memberCount, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Aktif Gruplar</span>
                    <span className="font-semibold text-blue-600">{myGroups.filter(g => g.role === "admin").length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}