import { apiRequest } from "./queryClient";
import type { User, PostWithAuthor, PostWithDetails, InsertPost, InsertComment } from "@shared/schema";

export const api = {
  // Auth
  getCurrentUser: () => fetch("/api/auth/me").then(res => res.json()) as Promise<User>,

  // Users
  getUser: (id: number) => fetch(`/api/users/${id}`).then(res => res.json()) as Promise<User>,
  searchUsers: (query: string) => fetch(`/api/users/search/${query}`).then(res => res.json()) as Promise<User[]>,
  getUserPosts: (id: number) => fetch(`/api/users/${id}/posts`).then(res => res.json()) as Promise<PostWithAuthor[]>,
  getSuggestedUsers: (limit = 5) => fetch(`/api/users/suggested?limit=${limit}`).then(res => res.json()) as Promise<User[]>,
  getFollowers: (id: number) => fetch(`/api/users/${id}/followers`).then(res => res.json()) as Promise<User[]>,
  getFollowing: (id: number) => fetch(`/api/users/${id}/following`).then(res => res.json()) as Promise<User[]>,
  checkIsFollowing: (id: number) => fetch(`/api/users/${id}/following/check`).then(res => res.json()) as Promise<{ isFollowing: boolean }>,

  // Posts
  getFeed: (limit = 10, offset = 0) => 
    fetch(`/api/feed?limit=${limit}&offset=${offset}`).then(res => res.json()) as Promise<PostWithAuthor[]>,
  getPost: (id: number) => fetch(`/api/posts/${id}`).then(res => res.json()) as Promise<PostWithDetails>,
  createPost: (data: InsertPost) => apiRequest("POST", "/api/posts", data).then(res => res.json()) as Promise<PostWithAuthor>,
  deletePost: (id: number) => apiRequest("DELETE", `/api/posts/${id}`),

  // Likes
  likePost: (id: number) => apiRequest("POST", `/api/posts/${id}/like`),
  unlikePost: (id: number) => apiRequest("DELETE", `/api/posts/${id}/like`),

  // Comments
  getComments: (postId: number) => fetch(`/api/posts/${postId}/comments`).then(res => res.json()),
  createComment: (postId: number, content: string) => 
    apiRequest("POST", `/api/posts/${postId}/comments`, { content }).then(res => res.json()),

  // Follows
  followUser: (id: number) => apiRequest("POST", `/api/users/${id}/follow`),
  unfollowUser: (id: number) => apiRequest("DELETE", `/api/users/${id}/follow`),
};
