import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { TopNavigation } from "@/components/layout/top-navigation";
import { PostCard } from "@/components/feed/post-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, MessageCircle, UserPlus, MapPin, Calendar, Link as LinkIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface ProfilePageProps {
  userId?: string;
}

export default function ProfilePage({ userId }: ProfilePageProps) {
  const profileUserId = userId ? parseInt(userId) : 1; // Default to current user
  const [activeTab, setActiveTab] = useState("posts");
  const queryClient = useQueryClient();

  const { data: currentUser } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: api.getCurrentUser,
  });

  const { data: profileUser, isLoading: userLoading } = useQuery({
    queryKey: ["/api/users", profileUserId],
    queryFn: () => api.getUser(profileUserId),
  });

  const { data: userPosts = [], isLoading: postsLoading } = useQuery({
    queryKey: ["/api/users", profileUserId, "posts"],
    queryFn: () => api.getUserPosts(profileUserId),
  });

  const { data: isFollowingData } = useQuery({
    queryKey: ["/api/users", profileUserId, "following/check"],
    queryFn: () => api.checkIsFollowing(profileUserId),
    enabled: profileUserId !== currentUser?.id,
  });

  const followMutation = useMutation({
    mutationFn: () => 
      isFollowingData?.isFollowing 
        ? api.unfollowUser(profileUserId)
        : api.followUser(profileUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", profileUserId, "following/check"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users", profileUserId] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    },
  });

  const isOwnProfile = profileUserId === currentUser?.id;

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopNavigation />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-lg mb-6"></div>
            <div className="h-20 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopNavigation />
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Kullanıcı Bulunamadı</h1>
          <p className="text-gray-600">Aradığınız profil mevcut değil.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-6">
          <div className="relative">
            {/* Cover Photo */}
            <div className="h-48 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-t-lg"></div>
            
            {/* Profile Info */}
            <CardContent className="relative px-6 pb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-end -mt-16 sm:-mt-12">
                {/* Avatar */}
                <img
                  src={profileUser.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200"}
                  alt={profileUser.name}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white object-cover shadow-lg"
                />
                
                {/* Actions */}
                <div className="flex-1 mt-4 sm:mt-0 sm:ml-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
                        {profileUser.name}
                        {profileUser.isVerified && (
                          <svg className="w-6 h-6 text-blue-500 ml-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </h1>
                      <p className="text-gray-600">@{profileUser.username}</p>
                    </div>
                    
                    <div className="flex space-x-2 mt-4 sm:mt-0">
                      {isOwnProfile ? (
                        <>
                          <Button variant="outline" size="sm">
                            <Settings className="w-4 h-4 mr-2" />
                            Profili Düzenle
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            onClick={() => followMutation.mutate()}
                            disabled={followMutation.isPending}
                            variant={isFollowingData?.isFollowing ? "outline" : "default"}
                            size="sm"
                          >
                            <UserPlus className="w-4 h-4 mr-2" />
                            {isFollowingData?.isFollowing ? "Takipten Çık" : "Takip Et"}
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Mesaj
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Bio & Info */}
                  <div className="mt-4">
                    {profileUser.bio && (
                      <p className="text-gray-700 mb-3">{profileUser.bio}</p>
                    )}
                    
                    <div className="flex flex-wrap items-center text-sm text-gray-600 space-x-4">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        İstanbul, Türkiye
                      </div>
                      <div className="flex items-center">
                        <LinkIcon className="w-4 h-4 mr-1" />
                        <span className="text-blue-600">portfolio.com</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDistanceToNow(new Date(profileUser.createdAt), { addSuffix: true, locale: tr })} katıldı
                      </div>
                    </div>
                  </div>
                  
                  {/* Stats */}
                  <div className="flex space-x-6 mt-4">
                    <div className="text-center">
                      <div className="font-semibold text-gray-900">{profileUser.postsCount}</div>
                      <div className="text-sm text-gray-600">Gönderi</div>
                    </div>
                    <div className="text-center cursor-pointer hover:text-blue-600">
                      <div className="font-semibold text-gray-900">{profileUser.followersCount}</div>
                      <div className="text-sm text-gray-600">Takipçi</div>
                    </div>
                    <div className="text-center cursor-pointer hover:text-blue-600">
                      <div className="font-semibold text-gray-900">{profileUser.followingCount}</div>
                      <div className="text-sm text-gray-600">Takip</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>

        {/* Profile Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="posts">Gönderiler</TabsTrigger>
            <TabsTrigger value="media">Medya</TabsTrigger>
            <TabsTrigger value="likes">Beğeniler</TabsTrigger>
            <TabsTrigger value="about">Hakkında</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-6">
            <div className="space-y-6">
              {postsLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : userPosts.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <div className="text-gray-400 mb-4">
                      <MessageCircle className="w-12 h-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {isOwnProfile ? "Henüz gönderi paylaşmadınız" : "Henüz gönderi yok"}
                    </h3>
                    <p className="text-gray-600">
                      {isOwnProfile ? "İlk gönderinizi oluşturun ve topluluğa katılın!" : "Bu kullanıcı henüz hiç gönderi paylaşmamış."}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                userPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="media" className="mt-6">
            <div className="grid grid-cols-3 gap-4">
              {userPosts
                .filter(post => post.imageUrl)
                .map((post) => (
                  <div key={post.id} className="aspect-square">
                    <img
                      src={post.imageUrl!}
                      alt="Gönderi medyası"
                      className="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                    />
                  </div>
                ))}
              {userPosts.filter(post => post.imageUrl).length === 0 && (
                <div className="col-span-3 text-center py-12">
                  <p className="text-gray-600">Henüz medya paylaşımı yok.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="likes" className="mt-6">
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-gray-600">Beğenilen gönderiler burada görünecek.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="about" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Hakkında</h3>
                    <p className="text-gray-700">
                      {profileUser.bio || "Bu kullanıcı henüz bir bio eklememış."}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">İlgi Alanları</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">#WebTasarım</Badge>
                      <Badge variant="secondary">#UI/UX</Badge>
                      <Badge variant="secondary">#ReactJS</Badge>
                      <Badge variant="secondary">#Teknoloji</Badge>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">İstatistikler</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-primary">{profileUser.postsCount}</div>
                        <div className="text-sm text-gray-600">Toplam Gönderi</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{profileUser.followersCount}</div>
                        <div className="text-sm text-gray-600">Takipçi Sayısı</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}