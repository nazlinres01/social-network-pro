import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { TopNavigation } from "@/components/layout/top-navigation";
import { PostCard } from "@/components/feed/post-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bookmark, Search, Grid, List, Calendar, Tag } from "lucide-react";

export default function SavedPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState("list");

  const { data: currentUser } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: api.getCurrentUser,
  });

  // Mock kaydedilen gönderiler - gerçek uygulamada API'den gelecek
  const savedPosts = [
    {
      id: 1,
      author: {
        id: 3,
        name: "Barış Özkan",
        username: "baris_ozkan",
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&h=150",
        isVerified: false
      },
      authorId: 3,
      content: "React ile performans optimizasyonu ipuçları! useState ve useEffect hook'larını doğru kullanarak uygulamanızın hızını artırabilirsiniz. #React #Performance",
      imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&h=600",
      likesCount: 234,
      commentsCount: 45,
      sharesCount: 12,
      createdAt: new Date(Date.now() - 86400000),
      isLiked: true,
      savedAt: new Date(Date.now() - 3600000),
      category: "teknoloji"
    },
    {
      id: 2,
      author: {
        id: 4,
        name: "Selin Çelik",
        username: "selin_celik",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150",
        isVerified: true
      },
      authorId: 4,
      content: "Günün fotoğrafı: İstanbul'da gün batımı. Bu muhteşem manzarayı sizlerle paylaşmak istedim! 📸 #Photography #Istanbul #Sunset",
      imageUrl: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=800&h=600",
      likesCount: 189,
      commentsCount: 32,
      sharesCount: 8,
      createdAt: new Date(Date.now() - 172800000),
      isLiked: false,
      savedAt: new Date(Date.now() - 7200000),
      category: "fotograf"
    },
    {
      id: 3,
      author: {
        id: 2,
        name: "Elif Demir",
        username: "elif_demir",
        avatar: "https://pixabay.com/get/g262776e4eee2a40b4e3ed1491282caaee776302356458ece6667e4bbce6b76c2858adfd065ef2ddb1a5a1140d1d4dfc1c5b30f3a2a01bdaccc77606113e60922_1280.jpg",
        isVerified: false
      },
      authorId: 2,
      content: "UI tasarımında renk teorisi! Doğru renk paleti seçimi kullanıcı deneyimini büyük ölçüde etkiler. İşte dikkat etmeniz gereken noktalar... #UIDesign #ColorTheory",
      imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&h=600",
      likesCount: 156,
      commentsCount: 28,
      sharesCount: 15,
      createdAt: new Date(Date.now() - 259200000),
      isLiked: true,
      savedAt: new Date(Date.now() - 14400000),
      category: "tasarim"
    }
  ];

  const categories = [
    { id: "all", name: "Tümü", count: savedPosts.length },
    { id: "teknoloji", name: "Teknoloji", count: savedPosts.filter(p => p.category === "teknoloji").length },
    { id: "tasarim", name: "Tasarım", count: savedPosts.filter(p => p.category === "tasarim").length },
    { id: "fotograf", name: "Fotoğraf", count: savedPosts.filter(p => p.category === "fotograf").length }
  ];

  const filteredPosts = savedPosts.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeTab === "all" || post.category === activeTab;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Bookmark className="w-6 h-6 mr-3 text-primary" />
              Kaydedilenler
            </h1>
            <p className="text-gray-600 mt-1">{savedPosts.length} kayıtlı gönderi</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Kayıtlı gönderilerde ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-4">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="relative">
                {category.name}
                <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  {category.count}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Content */}
        {filteredPosts.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Bookmark className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery ? "Arama sonucu bulunamadı" : "Henüz kayıtlı gönderi yok"}
              </h3>
              <p className="text-gray-600">
                {searchQuery 
                  ? "Farklı anahtar kelimeler deneyebilirsiniz."
                  : "Beğendiğiniz gönderileri kaydetmek için yer imi butonuna tıklayın."
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-6"}>
            {filteredPosts.map((post) => (
              <div key={post.id} className="relative">
                {viewMode === "list" ? (
                  <PostCard post={post} />
                ) : (
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      {post.imageUrl && (
                        <img
                          src={post.imageUrl}
                          alt="Gönderi görseli"
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                      )}
                      <div className="p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <img
                            src={post.author.avatar}
                            alt={post.author.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <h4 className="font-medium text-gray-900 text-sm">{post.author.name}</h4>
                            <p className="text-xs text-gray-500">
                              {new Date(post.savedAt!).toLocaleDateString('tr-TR')} tarihinde kaydedildi
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm line-clamp-3">{post.content}</p>
                        <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                          <span>{post.likesCount} beğeni</span>
                          <span className="flex items-center">
                            <Tag className="w-3 h-3 mr-1" />
                            {post.category}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {/* Kaydetme tarihi etiketi */}
                <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(post.savedAt!).toLocaleDateString('tr-TR')}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Alt bilgi */}
        {filteredPosts.length > 0 && (
          <Card className="mt-8">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Kayıtlı Gönderilerinizi Düzenleyin</h3>
              <p className="text-gray-600 mb-4">
                Koleksiyonlarınızı kategorilere ayırarak daha kolay erişim sağlayabilirsiniz.
              </p>
              <div className="flex justify-center space-x-3">
                <Button variant="outline" size="sm">
                  Koleksiyon Oluştur
                </Button>
                <Button variant="outline" size="sm">
                  Dışa Aktar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}