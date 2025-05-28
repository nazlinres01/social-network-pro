import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { TopNavigation } from "@/components/layout/top-navigation";
import { PostCard } from "@/components/feed/post-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, TrendingUp, Users, Hash, MapPin } from "lucide-react";

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("trending");

  const { data: suggestedUsers = [] } = useQuery({
    queryKey: ["/api/users/suggested"],
    queryFn: () => api.getSuggestedUsers(10),
  });

  // Mock trending data - in a real app this would come from API
  const trendingTopics = [
    { tag: "#WebTasarım", posts: "1.2K", trend: "+15%" },
    { tag: "#ReactJS", posts: "856", trend: "+8%" },
    { tag: "#UIDesign", posts: "634", trend: "+23%" },
    { tag: "#JavaScript", posts: "892", trend: "+12%" },
    { tag: "#TailwindCSS", posts: "445", trend: "+19%" },
    { tag: "#TypeScript", posts: "712", trend: "+6%" },
  ];

  const trendingPosts = [
    {
      id: 101,
      author: {
        id: 5,
        name: "Tech Haberleri",
        username: "tech_news",
        avatar: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=150&h=150",
        isVerified: true
      },
      content: "2024'ün en popüler web teknolojileri açıklandı! React, Vue ve Angular karşılaştırması blog yazımızda. #WebDev #Tech",
      imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&h=600",
      likesCount: 234,
      commentsCount: 45,
      sharesCount: 12,
      createdAt: new Date(Date.now() - 1800000),
      isLiked: false
    },
    {
      id: 102,
      author: {
        id: 6,
        name: "Design Studio",
        username: "design_studio",
        avatar: "https://images.unsplash.com/photo-1558403194-611308249627?auto=format&fit=crop&w=150&h=150",
        isVerified: true
      },
      content: "Minimalist tasarım trendi devam ediyor! Bu hafta en beğenilen UI/UX çalışmalarını paylaşıyoruz. #Design #UI #UX",
      imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&h=600",
      likesCount: 189,
      commentsCount: 32,
      sharesCount: 8,
      createdAt: new Date(Date.now() - 3600000),
      isLiked: false
    }
  ];

  const events = [
    {
      id: 1,
      title: "React Meetup Istanbul",
      description: "React ve modern web teknolojileri üzerine söyleşi",
      location: "Teknopark İstanbul",
      date: "15 Mart 2024",
      time: "19:00",
      attendees: 156,
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=400&h=300"
    },
    {
      id: 2,
      title: "Design Workshop",
      description: "UI/UX tasarım workshop'u - figma ile tasarım",
      location: "Online Etkinlik",
      date: "18 Mart 2024",
      time: "14:00",
      attendees: 89,
      image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=400&h=300"
    }
  ];

  const filteredUsers = suggestedUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search Section */}
            <Card>
              <CardContent className="p-6">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Kullanıcı, gönderi veya hashtag ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12 text-lg"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-white transition-colors">
                    #WebTasarım
                  </Badge>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-white transition-colors">
                    #ReactJS
                  </Badge>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-white transition-colors">
                    #UIDesign
                  </Badge>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-white transition-colors">
                    #JavaScript
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Explore Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="trending">Gündem</TabsTrigger>
                <TabsTrigger value="people">Kişiler</TabsTrigger>
                <TabsTrigger value="topics">Konular</TabsTrigger>
                <TabsTrigger value="events">Etkinlikler</TabsTrigger>
              </TabsList>

              <TabsContent value="trending" className="mt-6">
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <span>Trend Olan Gönderiler</span>
                  </div>
                  
                  {trendingPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="people" className="mt-6">
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
                    <Users className="w-5 h-5 text-primary" />
                    <span>Önerilen Kullanıcılar</span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(searchQuery ? filteredUsers : suggestedUsers).map((user) => (
                      <Card key={user.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-center space-x-4">
                            <img
                              src={user.avatar || "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=150&h=150"}
                              alt={user.name}
                              className="w-16 h-16 rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 flex items-center">
                                {user.name}
                                {user.isVerified && (
                                  <svg className="w-4 h-4 text-blue-500 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </h3>
                              <p className="text-sm text-gray-600">@{user.username}</p>
                              <p className="text-sm text-gray-700 mt-1">{user.bio}</p>
                              <p className="text-xs text-gray-500 mt-2">{user.followersCount} takipçi</p>
                            </div>
                          </div>
                          <Button className="w-full mt-4" size="sm">
                            Takip Et
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="topics" className="mt-6">
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
                    <Hash className="w-5 h-5 text-primary" />
                    <span>Trend Konular</span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {trendingTopics.map((topic, index) => (
                      <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-primary text-lg">{topic.tag}</h3>
                              <p className="text-sm text-gray-600">{topic.posts} gönderi</p>
                            </div>
                            <div className="text-right">
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                {topic.trend}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="events" className="mt-6">
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span>Yaklaşan Etkinlikler</span>
                  </div>
                  
                  <div className="space-y-4">
                    {events.map((event) => (
                      <Card key={event.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex space-x-4">
                            <img
                              src={event.image}
                              alt={event.title}
                              className="w-24 h-24 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 text-lg">{event.title}</h3>
                              <p className="text-gray-600 mt-1">{event.description}</p>
                              <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                                <div className="flex items-center">
                                  <MapPin className="w-4 h-4 mr-1" />
                                  {event.location}
                                </div>
                                <div>{event.date} • {event.time}</div>
                              </div>
                              <div className="flex items-center justify-between mt-4">
                                <span className="text-sm text-gray-600">{event.attendees} kişi katılıyor</span>
                                <Button size="sm">
                                  Katıl
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform İstatistikleri</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Aktif Kullanıcı</span>
                    <span className="font-semibold text-primary">2.1K</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Günlük Gönderi</span>
                    <span className="font-semibold text-green-600">156</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Trend Hashtag</span>
                    <span className="font-semibold text-purple-600">48</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Popular Hashtags */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Popüler Hashtag'ler</h3>
                <div className="flex flex-wrap gap-2">
                  {trendingTopics.slice(0, 8).map((topic, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer hover:bg-primary hover:text-white transition-colors"
                    >
                      {topic.tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Kategoriler</h3>
                <div className="space-y-2">
                  {[
                    { name: "Teknoloji", count: 234 },
                    { name: "Tasarım", count: 189 },
                    { name: "Geliştirme", count: 156 },
                    { name: "Girişimcilik", count: 143 },
                    { name: "Pazarlama", count: 98 }
                  ].map((category, index) => (
                    <div key={index} className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <span className="text-gray-700">{category.name}</span>
                      <span className="text-sm text-gray-500">{category.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}