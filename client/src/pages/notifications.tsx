import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { TopNavigation } from "@/components/layout/top-navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, MessageCircle, UserPlus, Repeat, CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("all");

  const { data: currentUser } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: api.getCurrentUser,
  });

  // Gerçek bildirim verileri - API'den gelecek
  const notifications = [
    {
      id: 1,
      type: "like",
      user: {
        id: 3,
        name: "Barış Özkan",
        username: "baris_ozkan",
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&h=150"
      },
      content: "gönderinizi beğendi",
      postContent: "Bugün yeni React projemde çalışırken...",
      createdAt: new Date(Date.now() - 300000),
      isRead: false
    },
    {
      id: 2,
      type: "comment",
      user: {
        id: 4,
        name: "Selin Çelik",
        username: "selin_celik",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150"
      },
      content: "gönderinize yorum yaptı",
      commentContent: "Harika bir çalışma! Tebrikler 👏",
      postContent: "UI tasarım ipuçları...",
      createdAt: new Date(Date.now() - 1800000),
      isRead: false
    },
    {
      id: 3,
      type: "follow",
      user: {
        id: 2,
        name: "Elif Demir",
        username: "elif_demir",
        avatar: "https://pixabay.com/get/g262776e4eee2a40b4e3ed1491282caaee776302356458ece6667e4bbce6b76c2858adfd065ef2ddb1a5a1140d1d4dfc1c5b30f3a2a01bdaccc77606113e60922_1280.jpg"
      },
      content: "sizi takip etmeye başladı",
      createdAt: new Date(Date.now() - 3600000),
      isRead: true
    },
    {
      id: 4,
      type: "share",
      user: {
        id: 5,
        name: "Can Yılmaz",
        username: "can_dev",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150"
      },
      content: "gönderinizi paylaştı",
      postContent: "JavaScript ES6 özellikleri...",
      createdAt: new Date(Date.now() - 7200000),
      isRead: true
    },
    {
      id: 5,
      type: "like",
      user: {
        id: 6,
        name: "Ayşe Kaya",
        username: "ayse_design",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b647?auto=format&fit=crop&w=150&h=150"
      },
      content: "yorumunuzu beğendi",
      commentContent: "Çok güzel açıklamışsın!",
      createdAt: new Date(Date.now() - 10800000),
      isRead: true
    }
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart className="w-5 h-5 text-red-500" />;
      case "comment":
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case "follow":
        return <UserPlus className="w-5 h-5 text-green-500" />;
      case "share":
        return <Repeat className="w-5 h-5 text-purple-500" />;
      default:
        return <CheckCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationText = (notification: any) => {
    switch (notification.type) {
      case "like":
        return notification.commentContent ? "yorumunuzu beğendi" : "gönderinizi beğendi";
      case "comment":
        return "gönderinize yorum yaptı";
      case "follow":
        return "sizi takip etmeye başladı";
      case "share":
        return "gönderinizi paylaştı";
      default:
        return notification.content;
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !notification.isRead;
    if (activeTab === "mentions") return notification.type === "comment";
    return notification.type === activeTab;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bildirimler</h1>
            {unreadCount > 0 && (
              <p className="text-gray-600 mt-1">{unreadCount} okunmamış bildirim</p>
            )}
          </div>
          <Button variant="outline" size="sm">
            Tümünü Okundu İşaretle
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all" className="relative">
              Tümü
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2 text-xs px-1 py-0 min-w-[1.25rem] h-5">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="unread">Okunmamış</TabsTrigger>
            <TabsTrigger value="like">Beğeni</TabsTrigger>
            <TabsTrigger value="comment">Yorum</TabsTrigger>
            <TabsTrigger value="follow">Takip</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <div className="space-y-4">
              {filteredNotifications.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <div className="text-gray-400 mb-4">
                      <CheckCircle className="w-16 h-16 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {activeTab === "unread" ? "Tüm bildirimler okundu!" : "Henüz bildirim yok"}
                    </h3>
                    <p className="text-gray-600">
                      {activeTab === "unread" 
                        ? "Harika! Tüm bildirimlerinizi kontrol ettiniz."
                        : "Yeni etkileşimler olduğunda burada görünecek."
                      }
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredNotifications.map((notification) => (
                  <Card 
                    key={notification.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      !notification.isRead ? "bg-blue-50 border-blue-200" : ""
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <div className="relative">
                          <img
                            src={notification.user.avatar}
                            alt={notification.user.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-900">
                              <span className="font-medium">{notification.user.name}</span>
                              {" "}
                              <span className="text-gray-600">{getNotificationText(notification)}</span>
                            </p>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-500">
                                {formatDistanceToNow(notification.createdAt, { addSuffix: true, locale: tr })}
                              </span>
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                          </div>
                          
                          {/* Gönderi veya yorum içeriği */}
                          {(notification.postContent || notification.commentContent) && (
                            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                              {notification.commentContent && (
                                <p className="text-sm text-gray-700 italic mb-2">
                                  "{notification.commentContent}"
                                </p>
                              )}
                              {notification.postContent && (
                                <p className="text-sm text-gray-600 truncate">
                                  {notification.postContent}
                                </p>
                              )}
                            </div>
                          )}
                          
                          {/* Aksiyon butonları */}
                          <div className="flex items-center space-x-3 mt-3">
                            {notification.type === "follow" && (
                              <Button size="sm" variant="outline">
                                Takip Et
                              </Button>
                            )}
                            {(notification.type === "comment" || notification.type === "like") && (
                              <Button size="sm" variant="ghost">
                                Görüntüle
                              </Button>
                            )}
                            {notification.type === "share" && (
                              <Button size="sm" variant="ghost">
                                Gönderiye Git
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Bildirim Ayarları */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bildirim Ayarları</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">E-posta Bildirimleri</h4>
                  <p className="text-sm text-gray-600">Önemli etkinlikler için e-posta al</p>
                </div>
                <Button variant="outline" size="sm">
                  Ayarla
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Push Bildirimleri</h4>
                  <p className="text-sm text-gray-600">Tarayıcı bildirimleri</p>
                </div>
                <Button variant="outline" size="sm">
                  Ayarla
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Özet E-posta</h4>
                  <p className="text-sm text-gray-600">Haftalık etkinlik özeti</p>
                </div>
                <Button variant="outline" size="sm">
                  Ayarla
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}