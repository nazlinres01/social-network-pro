import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { TopNavigation } from "@/components/layout/top-navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Settings, User, Bell, Shield, Palette, Globe, Download, Trash2 } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  const { data: currentUser } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: api.getCurrentUser,
  });

  // Ayarlar state'leri
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || "",
    username: currentUser?.username || "",
    bio: currentUser?.bio || "",
    website: "",
    location: "İstanbul, Türkiye"
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    weeklyDigest: true,
    postLikes: true,
    postComments: true,
    newFollowers: true,
    mentions: true
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    allowTagging: true,
    allowMessaging: true,
    showOnlineStatus: true
  });

  const [theme, setTheme] = useState({
    darkMode: false,
    compactMode: false,
    language: "tr",
    timezone: "Europe/Istanbul"
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Settings className="w-6 h-6 mr-3 text-primary" />
            Ayarlar
          </h1>
          <p className="text-gray-600 mt-1">Hesap ve uygulama ayarlarınızı yönetin</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="notifications">Bildirimler</TabsTrigger>
            <TabsTrigger value="privacy">Gizlilik</TabsTrigger>
            <TabsTrigger value="appearance">Görünüm</TabsTrigger>
            <TabsTrigger value="account">Hesap</TabsTrigger>
          </TabsList>

          {/* Profil Ayarları */}
          <TabsContent value="profile" className="mt-6">
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center space-x-4">
                  <User className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-gray-900">Profil Bilgileri</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Ad Soyad</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Kullanıcı Adı</Label>
                    <Input
                      id="username"
                      value={profileData.username}
                      onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      placeholder="https://example.com"
                      value={profileData.website}
                      onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Konum</Label>
                    <Input
                      id="location"
                      value={profileData.location}
                      onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Biyografi</Label>
                  <Textarea
                    id="bio"
                    placeholder="Kendinizi tanıtın..."
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    rows={4}
                  />
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Profil Fotoğrafı</h4>
                  <div className="flex items-center space-x-4">
                    <img
                      src={currentUser?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150"}
                      alt="Profil fotoğrafı"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                    <div>
                      <Button variant="outline" size="sm">Fotoğraf Değiştir</Button>
                      <p className="text-sm text-gray-500 mt-2">JPG, PNG veya GIF. Maksimum 5MB.</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button variant="outline">İptal</Button>
                  <Button>Değişiklikleri Kaydet</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bildirim Ayarları */}
          <TabsContent value="notifications" className="mt-6">
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center space-x-4">
                  <Bell className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-gray-900">Bildirim Tercihleri</h3>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Genel Bildirimler</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>E-posta Bildirimleri</Label>
                          <p className="text-sm text-gray-500">Önemli güncellemeler için e-posta alın</p>
                        </div>
                        <Switch
                          checked={notifications.emailNotifications}
                          onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, emailNotifications: checked }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Push Bildirimleri</Label>
                          <p className="text-sm text-gray-500">Tarayıcı bildirimleri</p>
                        </div>
                        <Switch
                          checked={notifications.pushNotifications}
                          onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, pushNotifications: checked }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>SMS Bildirimleri</Label>
                          <p className="text-sm text-gray-500">Kritik güncellemeler için SMS</p>
                        </div>
                        <Switch
                          checked={notifications.smsNotifications}
                          onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, smsNotifications: checked }))}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Sosyal Bildirimler</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Gönderi Beğenileri</Label>
                        <Switch
                          checked={notifications.postLikes}
                          onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, postLikes: checked }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Gönderi Yorumları</Label>
                        <Switch
                          checked={notifications.postComments}
                          onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, postComments: checked }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Yeni Takipçiler</Label>
                        <Switch
                          checked={notifications.newFollowers}
                          onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, newFollowers: checked }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Etiketlemeler</Label>
                        <Switch
                          checked={notifications.mentions}
                          onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, mentions: checked }))}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>Ayarları Kaydet</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gizlilik Ayarları */}
          <TabsContent value="privacy" className="mt-6">
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center space-x-4">
                  <Shield className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-gray-900">Gizlilik ve Güvenlik</h3>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>E-posta Adresini Göster</Label>
                        <p className="text-sm text-gray-500">Profilinizde e-posta adresiniz görünsün</p>
                      </div>
                      <Switch
                        checked={privacy.showEmail}
                        onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, showEmail: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Telefon Numarasını Göster</Label>
                        <p className="text-sm text-gray-500">Profilinizde telefon numaranız görünsün</p>
                      </div>
                      <Switch
                        checked={privacy.showPhone}
                        onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, showPhone: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Etiketlenmeye İzin Ver</Label>
                        <p className="text-sm text-gray-500">Diğer kullanıcılar sizi etiketleyebilsin</p>
                      </div>
                      <Switch
                        checked={privacy.allowTagging}
                        onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, allowTagging: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Mesajlaşmaya İzin Ver</Label>
                        <p className="text-sm text-gray-500">Diğer kullanıcılar size mesaj gönderebilsin</p>
                      </div>
                      <Switch
                        checked={privacy.allowMessaging}
                        onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, allowMessaging: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Çevrimiçi Durumunu Göster</Label>
                        <p className="text-sm text-gray-500">Ne zaman aktif olduğunuz görünsün</p>
                      </div>
                      <Switch
                        checked={privacy.showOnlineStatus}
                        onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, showOnlineStatus: checked }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>Ayarları Kaydet</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Görünüm Ayarları */}
          <TabsContent value="appearance" className="mt-6">
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center space-x-4">
                  <Palette className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-gray-900">Görünüm ve Dil</h3>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Karanlık Mod</Label>
                      <p className="text-sm text-gray-500">Karanlık tema kullanın</p>
                    </div>
                    <Switch
                      checked={theme.darkMode}
                      onCheckedChange={(checked) => setTheme(prev => ({ ...prev, darkMode: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Kompakt Mod</Label>
                      <p className="text-sm text-gray-500">Daha sık içerik görmek için</p>
                    </div>
                    <Switch
                      checked={theme.compactMode}
                      onCheckedChange={(checked) => setTheme(prev => ({ ...prev, compactMode: checked }))}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="language">Dil</Label>
                      <select
                        id="language"
                        value={theme.language}
                        onChange={(e) => setTheme(prev => ({ ...prev, language: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="tr">Türkçe</option>
                        <option value="en">English</option>
                        <option value="de">Deutsch</option>
                        <option value="fr">Français</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Saat Dilimi</Label>
                      <select
                        id="timezone"
                        value={theme.timezone}
                        onChange={(e) => setTheme(prev => ({ ...prev, timezone: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="Europe/Istanbul">İstanbul (UTC+3)</option>
                        <option value="Europe/London">Londra (UTC+0)</option>
                        <option value="America/New_York">New York (UTC-5)</option>
                        <option value="Asia/Tokyo">Tokyo (UTC+9)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>Ayarları Kaydet</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Hesap Ayarları */}
          <TabsContent value="account" className="mt-6">
            <div className="space-y-6">
              {/* Verilerinizi İndirin */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <Download className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold text-gray-900">Verilerinizi İndirin</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Tüm gönderilerinizi, yorumlarınızı ve profil bilgilerinizi içeren bir arşiv dosyası indirin.
                  </p>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Veri Arşivi İste
                  </Button>
                </CardContent>
              </Card>

              {/* Şifre Değiştir */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Şifre Değiştir</h3>
                  <div className="space-y-4 max-w-md">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Mevcut Şifre</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">Yeni Şifre</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Yeni Şifre (Tekrar)</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                    <Button>Şifreyi Güncelle</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Hesabı Sil */}
              <Card className="border-red-200">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <Trash2 className="w-5 h-5 text-red-500" />
                    <h3 className="text-lg font-semibold text-red-600">Tehlikeli Bölge</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Hesabınızı silmek istiyorsanız, bu işlem geri alınamaz. Tüm verileriniz kalıcı olarak silinecektir.
                  </p>
                  <Button variant="destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Hesabı Sil
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}