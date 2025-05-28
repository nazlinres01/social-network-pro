import { 
  users, posts, likes, comments, follows,
  type User, type Post, type Like, type Comment, type Follow,
  type InsertUser, type InsertPost, type InsertLike, type InsertComment, type InsertFollow,
  type PostWithAuthor, type CommentWithAuthor, type PostWithDetails
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  searchUsers(query: string): Promise<User[]>;
  
  // Posts
  getPost(id: number): Promise<Post | undefined>;
  getPostWithAuthor(id: number, currentUserId?: number): Promise<PostWithAuthor | undefined>;
  getPostWithDetails(id: number, currentUserId?: number): Promise<PostWithDetails | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  deletePost(id: number, userId: number): Promise<boolean>;
  getFeedPosts(userId: number, limit?: number, offset?: number): Promise<PostWithAuthor[]>;
  getUserPosts(userId: number, currentUserId?: number): Promise<PostWithAuthor[]>;
  
  // Likes
  likePost(like: InsertLike): Promise<Like>;
  unlikePost(userId: number, postId: number): Promise<boolean>;
  isPostLiked(userId: number, postId: number): Promise<boolean>;
  
  // Comments
  getPostComments(postId: number): Promise<CommentWithAuthor[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  deleteComment(id: number, userId: number): Promise<boolean>;
  
  // Follows
  followUser(follow: InsertFollow): Promise<Follow>;
  unfollowUser(followerId: number, followingId: number): Promise<boolean>;
  isFollowing(followerId: number, followingId: number): Promise<boolean>;
  getFollowers(userId: number): Promise<User[]>;
  getFollowing(userId: number): Promise<User[]>;
  getSuggestedUsers(userId: number, limit?: number): Promise<User[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private posts: Map<number, Post> = new Map();
  private likes: Map<number, Like> = new Map();
  private comments: Map<number, Comment> = new Map();
  private follows: Map<number, Follow> = new Map();
  
  private currentUserId = 1;
  private currentPostId = 1;
  private currentLikeId = 1;
  private currentCommentId = 1;
  private currentFollowId = 1;

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Create sample users
    const sampleUsers: InsertUser[] = [
      {
        username: "ahmet_yilmaz",
        name: "Ahmet Yılmaz",
        bio: "UI/UX Tasarımcı | İstanbul",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        isVerified: true
      },
      {
        username: "elif_demir",
        name: "Elif Demir",
        bio: "Creative Designer",
        avatar: "https://pixabay.com/get/g262776e4eee2a40b4e3ed1491282caaee776302356458ece6667e4bbce6b76c2858adfd065ef2ddb1a5a1140d1d4dfc1c5b30f3a2a01bdaccc77606113e60922_1280.jpg",
        isVerified: false
      },
      {
        username: "baris_ozkan",
        name: "Barış Özkan",
        bio: "Software Developer",
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        isVerified: false
      },
      {
        username: "selin_celik",
        name: "Selin Çelik",
        bio: "Photographer",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        isVerified: true
      }
    ];

    sampleUsers.forEach(userData => {
      const user: User = {
        ...userData,
        id: this.currentUserId++,
        followersCount: Math.floor(Math.random() * 1000) + 100,
        followingCount: Math.floor(Math.random() * 500) + 50,
        postsCount: Math.floor(Math.random() * 100) + 10,
        createdAt: new Date()
      };
      this.users.set(user.id, user);
    });

    // Create sample posts
    const samplePosts = [
      {
        authorId: 2,
        content: "Bugün yeni projemde çalışırken harika bir keşif yaptım! #WebDesign dünyasında her gün yeni şeyler öğreniyorum. Bu harika topluluğun bir parçası olmaktan mutluyum! 💼✨",
        imageUrl: "https://images.unsplash.com/photo-1559028006-448665bd7c7f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
      },
      {
        authorId: 3,
        content: "React'ta yeni başlayanlar için süper ipucu! State management konusunu anlamak başta zor gelebilir ama practice ile mükemmel hale geliyor. #ReactJS #WebDevelopment",
        imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
      },
      {
        authorId: 4,
        content: "Bugün İstanbul'da harika bir fotoğraf çekimi yaptık! Şehrin enerjisini yakalamaya çalıştım. #Photography #Istanbul #StreetArt",
        imageUrl: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
      }
    ];

    samplePosts.forEach(postData => {
      const post: Post = {
        ...postData,
        id: this.currentPostId++,
        likesCount: Math.floor(Math.random() * 500) + 50,
        commentsCount: Math.floor(Math.random() * 50) + 5,
        sharesCount: Math.floor(Math.random() * 20) + 1,
        createdAt: new Date(Date.now() - Math.random() * 86400000 * 7)
      };
      this.posts.set(post.id, post);
    });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(userData: InsertUser): Promise<User> {
    const user: User = {
      ...userData,
      id: this.currentUserId++,
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
      createdAt: new Date()
    };
    this.users.set(user.id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async searchUsers(query: string): Promise<User[]> {
    const searchTerm = query.toLowerCase();
    return Array.from(this.users.values())
      .filter(user => 
        user.name.toLowerCase().includes(searchTerm) ||
        user.username.toLowerCase().includes(searchTerm)
      )
      .slice(0, 10);
  }

  // Posts
  async getPost(id: number): Promise<Post | undefined> {
    return this.posts.get(id);
  }

  async getPostWithAuthor(id: number, currentUserId?: number): Promise<PostWithAuthor | undefined> {
    const post = this.posts.get(id);
    if (!post) return undefined;

    const author = this.users.get(post.authorId);
    if (!author) return undefined;

    const isLiked = currentUserId ? await this.isPostLiked(currentUserId, id) : false;

    return {
      ...post,
      author,
      isLiked
    };
  }

  async getPostWithDetails(id: number, currentUserId?: number): Promise<PostWithDetails | undefined> {
    const postWithAuthor = await this.getPostWithAuthor(id, currentUserId);
    if (!postWithAuthor) return undefined;

    const comments = await this.getPostComments(id);

    return {
      ...postWithAuthor,
      comments
    };
  }

  async createPost(postData: InsertPost): Promise<Post> {
    const post: Post = {
      ...postData,
      id: this.currentPostId++,
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      createdAt: new Date()
    };
    this.posts.set(post.id, post);

    // Update user's post count
    const user = this.users.get(post.authorId);
    if (user) {
      user.postsCount++;
      this.users.set(user.id, user);
    }

    return post;
  }

  async deletePost(id: number, userId: number): Promise<boolean> {
    const post = this.posts.get(id);
    if (!post || post.authorId !== userId) return false;

    this.posts.delete(id);

    // Update user's post count
    const user = this.users.get(userId);
    if (user) {
      user.postsCount = Math.max(0, user.postsCount - 1);
      this.users.set(user.id, user);
    }

    return true;
  }

  async getFeedPosts(userId: number, limit = 10, offset = 0): Promise<PostWithAuthor[]> {
    const following = await this.getFollowing(userId);
    const followingIds = following.map(user => user.id);
    followingIds.push(userId); // Include user's own posts

    const posts = Array.from(this.posts.values())
      .filter(post => followingIds.includes(post.authorId))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(offset, offset + limit);

    const postsWithAuthors: PostWithAuthor[] = [];
    for (const post of posts) {
      const author = this.users.get(post.authorId);
      if (author) {
        const isLiked = await this.isPostLiked(userId, post.id);
        postsWithAuthors.push({
          ...post,
          author,
          isLiked
        });
      }
    }

    return postsWithAuthors;
  }

  async getUserPosts(userId: number, currentUserId?: number): Promise<PostWithAuthor[]> {
    const posts = Array.from(this.posts.values())
      .filter(post => post.authorId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const author = this.users.get(userId);
    if (!author) return [];

    const postsWithAuthors: PostWithAuthor[] = [];
    for (const post of posts) {
      const isLiked = currentUserId ? await this.isPostLiked(currentUserId, post.id) : false;
      postsWithAuthors.push({
        ...post,
        author,
        isLiked
      });
    }

    return postsWithAuthors;
  }

  // Likes
  async likePost(likeData: InsertLike): Promise<Like> {
    const existingLike = Array.from(this.likes.values())
      .find(like => like.userId === likeData.userId && like.postId === likeData.postId);
    
    if (existingLike) {
      throw new Error("Post already liked");
    }

    const like: Like = {
      ...likeData,
      id: this.currentLikeId++,
      createdAt: new Date()
    };
    this.likes.set(like.id, like);

    // Update post's like count
    const post = this.posts.get(likeData.postId);
    if (post) {
      post.likesCount++;
      this.posts.set(post.id, post);
    }

    return like;
  }

  async unlikePost(userId: number, postId: number): Promise<boolean> {
    const like = Array.from(this.likes.values())
      .find(like => like.userId === userId && like.postId === postId);
    
    if (!like) return false;

    this.likes.delete(like.id);

    // Update post's like count
    const post = this.posts.get(postId);
    if (post) {
      post.likesCount = Math.max(0, post.likesCount - 1);
      this.posts.set(post.id, post);
    }

    return true;
  }

  async isPostLiked(userId: number, postId: number): Promise<boolean> {
    return Array.from(this.likes.values())
      .some(like => like.userId === userId && like.postId === postId);
  }

  // Comments
  async getPostComments(postId: number): Promise<CommentWithAuthor[]> {
    const comments = Array.from(this.comments.values())
      .filter(comment => comment.postId === postId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    const commentsWithAuthors: CommentWithAuthor[] = [];
    for (const comment of comments) {
      const author = this.users.get(comment.userId);
      if (author) {
        commentsWithAuthors.push({
          ...comment,
          author
        });
      }
    }

    return commentsWithAuthors;
  }

  async createComment(commentData: InsertComment): Promise<Comment> {
    const comment: Comment = {
      ...commentData,
      id: this.currentCommentId++,
      createdAt: new Date()
    };
    this.comments.set(comment.id, comment);

    // Update post's comment count
    const post = this.posts.get(commentData.postId);
    if (post) {
      post.commentsCount++;
      this.posts.set(post.id, post);
    }

    return comment;
  }

  async deleteComment(id: number, userId: number): Promise<boolean> {
    const comment = this.comments.get(id);
    if (!comment || comment.userId !== userId) return false;

    this.comments.delete(id);

    // Update post's comment count
    const post = this.posts.get(comment.postId);
    if (post) {
      post.commentsCount = Math.max(0, post.commentsCount - 1);
      this.posts.set(post.id, post);
    }

    return true;
  }

  // Follows
  async followUser(followData: InsertFollow): Promise<Follow> {
    const existingFollow = Array.from(this.follows.values())
      .find(follow => follow.followerId === followData.followerId && follow.followingId === followData.followingId);
    
    if (existingFollow) {
      throw new Error("Already following user");
    }

    const follow: Follow = {
      ...followData,
      id: this.currentFollowId++,
      createdAt: new Date()
    };
    this.follows.set(follow.id, follow);

    // Update follower and following counts
    const follower = this.users.get(followData.followerId);
    const following = this.users.get(followData.followingId);
    
    if (follower) {
      follower.followingCount++;
      this.users.set(follower.id, follower);
    }
    
    if (following) {
      following.followersCount++;
      this.users.set(following.id, following);
    }

    return follow;
  }

  async unfollowUser(followerId: number, followingId: number): Promise<boolean> {
    const follow = Array.from(this.follows.values())
      .find(follow => follow.followerId === followerId && follow.followingId === followingId);
    
    if (!follow) return false;

    this.follows.delete(follow.id);

    // Update follower and following counts
    const follower = this.users.get(followerId);
    const following = this.users.get(followingId);
    
    if (follower) {
      follower.followingCount = Math.max(0, follower.followingCount - 1);
      this.users.set(follower.id, follower);
    }
    
    if (following) {
      following.followersCount = Math.max(0, following.followersCount - 1);
      this.users.set(following.id, following);
    }

    return true;
  }

  async isFollowing(followerId: number, followingId: number): Promise<boolean> {
    return Array.from(this.follows.values())
      .some(follow => follow.followerId === followerId && follow.followingId === followingId);
  }

  async getFollowers(userId: number): Promise<User[]> {
    const followerIds = Array.from(this.follows.values())
      .filter(follow => follow.followingId === userId)
      .map(follow => follow.followerId);

    return followerIds
      .map(id => this.users.get(id))
      .filter(user => user !== undefined) as User[];
  }

  async getFollowing(userId: number): Promise<User[]> {
    const followingIds = Array.from(this.follows.values())
      .filter(follow => follow.followerId === userId)
      .map(follow => follow.followingId);

    return followingIds
      .map(id => this.users.get(id))
      .filter(user => user !== undefined) as User[];
  }

  async getSuggestedUsers(userId: number, limit = 5): Promise<User[]> {
    const following = await this.getFollowing(userId);
    const followingIds = new Set([userId, ...following.map(user => user.id)]);

    return Array.from(this.users.values())
      .filter(user => !followingIds.has(user.id))
      .sort((a, b) => b.followersCount - a.followersCount)
      .slice(0, limit);
  }
}

import { db } from "./db";
import { eq, and, desc, like, sql } from "drizzle-orm";

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async searchUsers(query: string): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .where(like(users.name, `%${query}%`));
  }

  async getPost(id: number): Promise<Post | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.id, id));
    return post || undefined;
  }

  async getPostWithAuthor(id: number, currentUserId?: number): Promise<PostWithAuthor | undefined> {
    const result = await db
      .select({
        id: posts.id,
        authorId: posts.authorId,
        content: posts.content,
        imageUrl: posts.imageUrl,
        likesCount: posts.likesCount,
        commentsCount: posts.commentsCount,
        sharesCount: posts.sharesCount,
        createdAt: posts.createdAt,
        author: users
      })
      .from(posts)
      .innerJoin(users, eq(posts.authorId, users.id))
      .where(eq(posts.id, id));

    if (result.length === 0) return undefined;

    const post = result[0];
    const isLiked = currentUserId ? await this.isPostLiked(currentUserId, id) : false;

    return {
      ...post,
      isLiked
    };
  }

  async getPostWithDetails(id: number, currentUserId?: number): Promise<PostWithDetails | undefined> {
    const postWithAuthor = await this.getPostWithAuthor(id, currentUserId);
    if (!postWithAuthor) return undefined;

    const comments = await this.getPostComments(id);
    
    return {
      ...postWithAuthor,
      comments
    };
  }

  async createPost(postData: InsertPost): Promise<Post> {
    const [post] = await db
      .insert(posts)
      .values(postData)
      .returning();
    return post;
  }

  async deletePost(id: number, userId: number): Promise<boolean> {
    const result = await db
      .delete(posts)
      .where(and(eq(posts.id, id), eq(posts.authorId, userId)))
      .returning();
    return result.length > 0;
  }

  async getFeedPosts(userId: number, limit = 10, offset = 0): Promise<PostWithAuthor[]> {
    const result = await db
      .select({
        id: posts.id,
        authorId: posts.authorId,
        content: posts.content,
        imageUrl: posts.imageUrl,
        likesCount: posts.likesCount,
        commentsCount: posts.commentsCount,
        sharesCount: posts.sharesCount,
        createdAt: posts.createdAt,
        author: users
      })
      .from(posts)
      .innerJoin(users, eq(posts.authorId, users.id))
      .orderBy(desc(posts.createdAt))
      .limit(limit)
      .offset(offset);

    const postsWithLikes = await Promise.all(
      result.map(async (post) => ({
        ...post,
        isLiked: await this.isPostLiked(userId, post.id)
      }))
    );

    return postsWithLikes;
  }

  async getUserPosts(userId: number, currentUserId?: number): Promise<PostWithAuthor[]> {
    const result = await db
      .select({
        id: posts.id,
        authorId: posts.authorId,
        content: posts.content,
        imageUrl: posts.imageUrl,
        likesCount: posts.likesCount,
        commentsCount: posts.commentsCount,
        sharesCount: posts.sharesCount,
        createdAt: posts.createdAt,
        author: users
      })
      .from(posts)
      .innerJoin(users, eq(posts.authorId, users.id))
      .where(eq(posts.authorId, userId))
      .orderBy(desc(posts.createdAt));

    const postsWithLikes = await Promise.all(
      result.map(async (post) => ({
        ...post,
        isLiked: currentUserId ? await this.isPostLiked(currentUserId, post.id) : false
      }))
    );

    return postsWithLikes;
  }

  async likePost(likeData: InsertLike): Promise<Like> {
    const [like] = await db
      .insert(likes)
      .values(likeData)
      .returning();
    
    // Increment likes count
    await db
      .update(posts)
      .set({ likesCount: sql`${posts.likesCount} + 1` })
      .where(eq(posts.id, likeData.postId));

    return like;
  }

  async unlikePost(userId: number, postId: number): Promise<boolean> {
    const result = await db
      .delete(likes)
      .where(and(eq(likes.userId, userId), eq(likes.postId, postId)))
      .returning();

    if (result.length > 0) {
      // Decrement likes count
      await db
        .update(posts)
        .set({ likesCount: sql`${posts.likesCount} - 1` })
        .where(eq(posts.id, postId));
      return true;
    }
    return false;
  }

  async isPostLiked(userId: number, postId: number): Promise<boolean> {
    const [like] = await db
      .select()
      .from(likes)
      .where(and(eq(likes.userId, userId), eq(likes.postId, postId)));
    return !!like;
  }

  async getPostComments(postId: number): Promise<CommentWithAuthor[]> {
    const result = await db
      .select({
        id: comments.id,
        authorId: comments.authorId,
        postId: comments.postId,
        content: comments.content,
        createdAt: comments.createdAt,
        author: users
      })
      .from(comments)
      .innerJoin(users, eq(comments.authorId, users.id))
      .where(eq(comments.postId, postId))
      .orderBy(desc(comments.createdAt));

    return result;
  }

  async createComment(commentData: InsertComment): Promise<Comment> {
    const [comment] = await db
      .insert(comments)
      .values(commentData)
      .returning();

    // Increment comments count
    await db
      .update(posts)
      .set({ commentsCount: sql`${posts.commentsCount} + 1` })
      .where(eq(posts.id, commentData.postId));

    return comment;
  }

  async deleteComment(id: number, userId: number): Promise<boolean> {
    const [comment] = await db
      .select()
      .from(comments)
      .where(eq(comments.id, id));

    if (!comment || comment.authorId !== userId) return false;

    const result = await db
      .delete(comments)
      .where(eq(comments.id, id))
      .returning();

    if (result.length > 0) {
      // Decrement comments count
      await db
        .update(posts)
        .set({ commentsCount: sql`${posts.commentsCount} - 1` })
        .where(eq(posts.id, comment.postId));
      return true;
    }
    return false;
  }

  async followUser(followData: InsertFollow): Promise<Follow> {
    const [follow] = await db
      .insert(follows)
      .values(followData)
      .returning();

    // Update follower and following counts
    await db
      .update(users)
      .set({ followingCount: sql`${users.followingCount} + 1` })
      .where(eq(users.id, followData.followerId));

    await db
      .update(users)
      .set({ followersCount: sql`${users.followersCount} + 1` })
      .where(eq(users.id, followData.followingId));

    return follow;
  }

  async unfollowUser(followerId: number, followingId: number): Promise<boolean> {
    const result = await db
      .delete(follows)
      .where(and(eq(follows.followerId, followerId), eq(follows.followingId, followingId)))
      .returning();

    if (result.length > 0) {
      // Update follower and following counts
      await db
        .update(users)
        .set({ followingCount: sql`${users.followingCount} - 1` })
        .where(eq(users.id, followerId));

      await db
        .update(users)
        .set({ followersCount: sql`${users.followersCount} - 1` })
        .where(eq(users.id, followingId));

      return true;
    }
    return false;
  }

  async isFollowing(followerId: number, followingId: number): Promise<boolean> {
    const [follow] = await db
      .select()
      .from(follows)
      .where(and(eq(follows.followerId, followerId), eq(follows.followingId, followingId)));
    return !!follow;
  }

  async getFollowers(userId: number): Promise<User[]> {
    const result = await db
      .select({
        user: users
      })
      .from(follows)
      .innerJoin(users, eq(follows.followerId, users.id))
      .where(eq(follows.followingId, userId));

    return result.map(r => r.user);
  }

  async getFollowing(userId: number): Promise<User[]> {
    const result = await db
      .select({
        user: users
      })
      .from(follows)
      .innerJoin(users, eq(follows.followingId, users.id))
      .where(eq(follows.followerId, userId));

    return result.map(r => r.user);
  }

  async getSuggestedUsers(userId: number, limit = 5): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .where(sql`${users.id} != ${userId}`)
      .orderBy(desc(users.followersCount))
      .limit(limit);
  }
}

export const storage = new DatabaseStorage();
