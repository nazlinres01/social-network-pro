import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import type { PostWithAuthor } from "@shared/schema";

interface PostCardProps {
  post: PostWithAuthor;
}

export function PostCard({ post }: PostCardProps) {
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: currentUser } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: api.getCurrentUser,
  });

  const { data: comments = [] } = useQuery({
    queryKey: ["/api/posts", post.id, "comments"],
    queryFn: () => api.getComments(post.id),
    enabled: showComments,
  });

  const likeMutation = useMutation({
    mutationFn: () => post.isLiked ? api.unlikePost(post.id) : api.likePost(post.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/feed"] });
    },
  });

  const commentMutation = useMutation({
    mutationFn: (content: string) => api.createComment(post.id, content),
    onSuccess: () => {
      setCommentText("");
      queryClient.invalidateQueries({ queryKey: ["/api/posts", post.id, "comments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/feed"] });
      toast({
        title: "Başarılı",
        description: "Yorumunuz eklendi",
      });
    },
  });

  const handleLike = () => {
    likeMutation.mutate();
  };

  const handleComment = () => {
    if (!commentText.trim()) return;
    commentMutation.mutate(commentText.trim());
  };

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
    locale: tr,
  });

  return (
    <Card className="overflow-hidden">
      {/* Post Header */}
      <CardContent className="p-6 pb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={post.author.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150"}
              alt={post.author.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h4 className="font-semibold text-gray-900 flex items-center">
                {post.author.name}
                {post.author.isVerified && (
                  <svg className="w-4 h-4 text-blue-500 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </h4>
              <p className="text-sm text-gray-600">{timeAgo}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>

      {/* Post Content */}
      <CardContent className="px-6 py-4">
        <p className="text-gray-900 whitespace-pre-wrap">{post.content}</p>
      </CardContent>

      {/* Post Image */}
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt="Gönderi görseli"
          className="w-full h-96 object-cover"
        />
      )}

      {/* Post Actions */}
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              disabled={likeMutation.isPending}
              className={`flex items-center space-x-2 ${
                post.isLiked 
                  ? "text-red-500 hover:text-red-600" 
                  : "text-gray-600 hover:text-red-500"
              } transition-colors group`}
            >
              <Heart 
                className={`w-5 h-5 ${post.isLiked ? "fill-current" : ""} group-hover:scale-110 transition-transform`} 
              />
              <span className="text-sm font-medium">{post.likesCount}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-medium">{post.commentsCount}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2 text-gray-600 hover:text-green-500 transition-colors"
            >
              <Share className="w-5 h-5" />
              <span className="text-sm font-medium">{post.sharesCount}</span>
            </Button>
          </div>
          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-yellow-500 transition-colors">
            <Bookmark className="w-5 h-5" />
          </Button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="border-t border-gray-100 pt-4">
            {comments.length > 0 && (
              <div className="space-y-3 mb-4">
                {comments.slice(0, 3).map((comment: any) => (
                  <div key={comment.id} className="flex items-start space-x-3">
                    <img
                      src={comment.author.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150"}
                      alt={comment.author.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium text-gray-900">{comment.author.name}</span>
                        <span className="text-gray-700 ml-2">{comment.content}</span>
                      </p>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                        <span>{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: tr })}</span>
                        <button className="hover:text-gray-700">Beğen</button>
                        <button className="hover:text-gray-700">Yanıtla</button>
                      </div>
                    </div>
                  </div>
                ))}
                {comments.length > 3 && (
                  <Button variant="ghost" size="sm" className="text-gray-500">
                    {comments.length - 3} yorumu daha görüntüle
                  </Button>
                )}
              </div>
            )}

            {/* Add Comment */}
            <div className="flex items-center space-x-3">
              {currentUser && (
                <img
                  src={currentUser.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150"}
                  alt="Profil fotoğrafı"
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
              <Input
                type="text"
                placeholder="Yorum ekle..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleComment()}
                className="flex-1 bg-gray-50 border-gray-200 rounded-full text-sm focus:ring-primary focus:border-primary"
              />
              <Button
                onClick={handleComment}
                disabled={commentMutation.isPending || !commentText.trim()}
                size="sm"
                className="text-primary hover:text-primary/80"
                variant="ghost"
              >
                Gönder
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
