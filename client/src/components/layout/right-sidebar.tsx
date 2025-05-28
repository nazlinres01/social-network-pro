import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export function RightSidebar() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: suggestedUsers = [] } = useQuery({
    queryKey: ["/api/users/suggested"],
    queryFn: () => api.getSuggestedUsers(3),
  });

  const followMutation = useMutation({
    mutationFn: api.followUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users/suggested"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({
        title: "Başarılı",
        description: "Kullanıcı takip edildi",
      });
    },
  });

  const activeUsers = [
    {
      name: "Ali Veli",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150",
      status: "Çevrimiçi"
    },
    {
      name: "Merve K.",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150",
      status: "Çevrimiçi"
    },
    {
      name: "Okan M.",
      avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=150&h=150",
      status: "5 dk önce"
    }
  ];

  const events = [
    {
      title: "React Meetup Istanbul",
      location: "Teknopark İstanbul",
      time: "19:00 - 21:00",
      date: "MAR",
      day: "15"
    },
    {
      title: "Design Workshop",
      location: "Online Etkinlik",
      time: "14:00 - 16:00",
      date: "MAR",
      day: "18"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Suggested Users */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Önerilen Kullanıcılar</h3>
          <div className="space-y-4">
            {suggestedUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={user.avatar || "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=150&h=150"}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">{user.name}</h4>
                    <p className="text-sm text-gray-600">{user.followersCount} takipçi</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => followMutation.mutate(user.id)}
                  disabled={followMutation.isPending}
                >
                  Takip Et
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Now */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Şimdi Aktif</h3>
          <div className="space-y-3">
            {activeUsers.map((user, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                    user.status === "Çevrimiçi" ? "bg-green-500" : "bg-yellow-500"
                  }`}></div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{user.name}</h4>
                  <p className="text-xs text-gray-600">{user.status}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Events */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Yaklaşan Etkinlikler</h3>
          <div className="space-y-4">
            {events.map((event, index) => (
              <div key={index} className="border border-gray-100 rounded-lg p-4">
                <div className="flex space-x-3">
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center ${
                      index === 0 ? "bg-primary/10" : "bg-purple-100"
                    }`}>
                      <div className={`text-xs font-medium ${
                        index === 0 ? "text-primary" : "text-purple-600"
                      }`}>{event.date}</div>
                      <div className={`text-sm font-bold ${
                        index === 0 ? "text-primary" : "text-purple-600"
                      }`}>{event.day}</div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900">{event.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{event.location}</p>
                    <p className="text-xs text-gray-500 mt-1">{event.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
