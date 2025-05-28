import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Image, Video, Smile } from "lucide-react";

export function PostCreator() {
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: currentUser } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: api.getCurrentUser,
  });

  const createPostMutation = useMutation({
    mutationFn: api.createPost,
    onSuccess: () => {
      setContent("");
      setImageUrl("");
      queryClient.invalidateQueries({ queryKey: ["/api/feed"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({
        title: "Başarılı",
        description: "Gönderiniz paylaşıldı!",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Gönderi paylaşılırken bir hata oluştu",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!content.trim()) {
      toast({
        title: "Hata",
        description: "Gönderi içeriği boş olamaz",
        variant: "destructive",
      });
      return;
    }

    createPostMutation.mutate({
      content: content.trim(),
      imageUrl: imageUrl.trim() || undefined,
      authorId: 1, // This will be overridden in the API
    });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          {currentUser && (
            <img
              src={currentUser.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150"}
              alt="Profil fotoğrafı"
              className="w-12 h-12 rounded-full object-cover"
            />
          )}
          <div className="flex-1">
            <Textarea
              placeholder="Neler düşünüyorsun?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border-gray-200 resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={3}
            />
            <input
              type="url"
              placeholder="Görsel URL'si (isteğe bağlı)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full mt-2 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <div className="flex justify-between items-center mt-4">
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-primary">
                  <Image className="w-4 h-4 mr-2" />
                  Fotoğraf
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-primary">
                  <Video className="w-4 h-4 mr-2" />
                  Video
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-primary">
                  <Smile className="w-4 h-4 mr-2" />
                  Emoji
                </Button>
              </div>
              <Button
                onClick={handleSubmit}
                disabled={createPostMutation.isPending || !content.trim()}
                className="bg-primary hover:bg-primary/90"
              >
                {createPostMutation.isPending ? "Paylaşılıyor..." : "Paylaş"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
