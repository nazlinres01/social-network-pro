import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { PostCreator } from "./post-creator";
import { PostCard } from "./post-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function FeedContent() {
  const [offset, setOffset] = useState(0);
  const limit = 10;

  const { data: posts = [], isLoading, error } = useQuery({
    queryKey: ["/api/feed", { limit, offset }],
    queryFn: () => api.getFeed(limit, offset),
  });

  const stories = [
    {
      username: "zeynep_k",
      avatar: "https://pixabay.com/get/g4330fa9b7cf77ed7d1b2c6ef47136df434e311567f0bda0900573ca47abcde0c7399e5c70f33fa638050978ff2e6117db65006c7d849e4a850eb164bab70e736_1280.jpg"
    },
    {
      username: "can_dev",
      avatar: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=150&h=150"
    },
    {
      username: "photo_art",
      avatar: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=150&h=150"
    }
  ];

  if (error) {
    return (
      <div className="space-y-6">
        <PostCreator />
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-500">Gönderiler yüklenirken bir hata oluştu.</p>
            <Button variant="outline" className="mt-2" onClick={() => window.location.reload()}>
              Tekrar Dene
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PostCreator />

      {/* Stories Section */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hikayeler</h3>
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {stories.map((story, index) => (
              <div key={index} className="flex-shrink-0 text-center cursor-pointer">
                <div className="relative">
                  <img
                    src={story.avatar}
                    alt={`${story.username} hikayesi`}
                    className="w-16 h-16 rounded-full border-4 border-gradient-to-r from-purple-400 to-pink-400 object-cover"
                    style={{
                      borderImage: "linear-gradient(45deg, #a855f7, #ec4899) 1"
                    }}
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <p className="text-xs text-gray-600 mt-2">{story.username}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Posts Feed */}
      <div className="space-y-6">
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 3 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <Skeleton className="h-20 w-full mb-4" />
                <Skeleton className="h-64 w-full mb-4" />
                <div className="flex space-x-4">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : posts.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-500 mb-4">Henüz gönderi bulunmuyor.</p>
              <p className="text-sm text-gray-400">İlk gönderinizi oluşturun veya başka kullanıcıları takip edin!</p>
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>

      {/* Load More Button */}
      {posts.length > 0 && (
        <div className="text-center py-8">
          <Button
            variant="outline"
            onClick={() => setOffset(prev => prev + limit)}
            disabled={isLoading}
          >
            Daha Fazla Gönderi Yükle
          </Button>
        </div>
      )}
    </div>
  );
}
