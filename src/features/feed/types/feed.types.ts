export type PostPrivacy = "Public" | "Friends" | "Only me";

export interface FeedAuthor {
  name: string;
  avatar: string;
  href?: string;
}

export interface FeedComment {
  id: string;
  author: FeedAuthor;
  body: string;
  createdAt: string;
  reactionCount?: number;
}

export interface FeedPost {
  id: string;
  author: FeedAuthor;
  createdAt: string;
  privacy: PostPrivacy;
  content: string;
  image?: string;
  reactionCount: number;
  commentsCount: number;
  sharesCount: number;
  comments?: FeedComment[];
}

export interface FeedStory {
  id: string;
  name: string;
  cover: string;
  avatar?: string;
  isOwn?: boolean;
}
