import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPostSchema, insertCommentSchema, insertLikeSchema, insertFollowSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get current user (simulated authentication - returns first user)
  app.get("/api/auth/me", async (req, res) => {
    try {
      const user = await storage.getUser(1); // Simulate logged in user
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get suggested users (must be before parameterized routes)
  app.get("/api/users/suggested", async (req, res) => {
    try {
      const currentUserId = 1; // Simulate logged in user
      const limit = parseInt(req.query.limit as string) || 5;
      const users = await storage.getSuggestedUsers(currentUserId, limit);
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Search users
  app.get("/api/users/search/:query", async (req, res) => {
    try {
      const query = req.params.query;
      const users = await storage.searchUsers(query);
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get user profile
  app.get("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get user posts
  app.get("/api/users/:id/posts", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const currentUserId = 1; // Simulate logged in user
      const posts = await storage.getUserPosts(userId, currentUserId);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get feed posts
  app.get("/api/feed", async (req, res) => {
    try {
      const currentUserId = 1; // Simulate logged in user
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;
      
      const posts = await storage.getFeedPosts(currentUserId, limit, offset);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create post
  app.post("/api/posts", async (req, res) => {
    try {
      const currentUserId = 1; // Simulate logged in user
      const postData = insertPostSchema.parse({
        ...req.body,
        authorId: currentUserId
      });
      
      const post = await storage.createPost(postData);
      const postWithAuthor = await storage.getPostWithAuthor(post.id, currentUserId);
      
      res.status(201).json(postWithAuthor);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid post data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get post details
  app.get("/api/posts/:id", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const currentUserId = 1; // Simulate logged in user
      
      const post = await storage.getPostWithDetails(postId, currentUserId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Delete post
  app.delete("/api/posts/:id", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const currentUserId = 1; // Simulate logged in user
      
      const success = await storage.deletePost(postId, currentUserId);
      if (!success) {
        return res.status(404).json({ message: "Post not found or unauthorized" });
      }
      
      res.json({ message: "Post deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Like post
  app.post("/api/posts/:id/like", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const currentUserId = 1; // Simulate logged in user
      
      const like = await storage.likePost({ userId: currentUserId, postId });
      res.status(201).json({ message: "Post liked successfully", like });
    } catch (error) {
      if (error instanceof Error && error.message === "Post already liked") {
        return res.status(400).json({ message: "Post already liked" });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Unlike post
  app.delete("/api/posts/:id/like", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const currentUserId = 1; // Simulate logged in user
      
      const success = await storage.unlikePost(currentUserId, postId);
      if (!success) {
        return res.status(404).json({ message: "Like not found" });
      }
      
      res.json({ message: "Post unliked successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get post comments
  app.get("/api/posts/:id/comments", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const comments = await storage.getPostComments(postId);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create comment
  app.post("/api/posts/:id/comments", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const currentUserId = 1; // Simulate logged in user
      
      const commentData = insertCommentSchema.parse({
        ...req.body,
        userId: currentUserId,
        postId
      });
      
      const comment = await storage.createComment(commentData);
      res.status(201).json(comment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid comment data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Follow user
  app.post("/api/users/:id/follow", async (req, res) => {
    try {
      const followingId = parseInt(req.params.id);
      const currentUserId = 1; // Simulate logged in user
      
      if (followingId === currentUserId) {
        return res.status(400).json({ message: "Cannot follow yourself" });
      }
      
      const follow = await storage.followUser({ followerId: currentUserId, followingId });
      res.status(201).json({ message: "User followed successfully", follow });
    } catch (error) {
      if (error instanceof Error && error.message === "Already following user") {
        return res.status(400).json({ message: "Already following user" });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Unfollow user
  app.delete("/api/users/:id/follow", async (req, res) => {
    try {
      const followingId = parseInt(req.params.id);
      const currentUserId = 1; // Simulate logged in user
      
      const success = await storage.unfollowUser(currentUserId, followingId);
      if (!success) {
        return res.status(404).json({ message: "Follow relationship not found" });
      }
      
      res.json({ message: "User unfollowed successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get followers
  app.get("/api/users/:id/followers", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const followers = await storage.getFollowers(userId);
      res.json(followers);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get following
  app.get("/api/users/:id/following", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const following = await storage.getFollowing(userId);
      res.json(following);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });



  // Check if following
  app.get("/api/users/:id/following/check", async (req, res) => {
    try {
      const followingId = parseInt(req.params.id);
      const currentUserId = 1; // Simulate logged in user
      
      const isFollowing = await storage.isFollowing(currentUserId, followingId);
      res.json({ isFollowing });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
