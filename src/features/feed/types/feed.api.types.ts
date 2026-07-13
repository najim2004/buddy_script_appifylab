export type PostVisibility = "PUBLIC" | "PRIVATE" | "FRIENDS";
export type PostType = "NORMAL" | "EVENT" | "ARTICLE";

export interface ApiUserBrief {
  id: string;
  first_name: string;
  last_name?: string | null;
  avatar?: string | null;
}

export interface ApiPostAttachment {
  id: string;
  type: string;
  file_path: string;
  file_name: string;
  mime_type: string;
  size_bytes: number | null;
}

export interface ApiComment {
  id: string;
  created_at: string;
  post_id: string;
  content: string;
  parent_id: string | null;
  deleted_at: string | null;
  is_deleted: boolean;
  likes: number;
  has_liked: boolean;
  user: ApiUserBrief;
  reply_to_user?: ApiUserBrief | null;
}

/** Same shape as list/create comment responses. */
export type ApiLatestComment = ApiComment;

export interface ApiPostDetail {
  id: string;
  created_at: string;
  content?: string | null;
  visibility: PostVisibility;
  status: string;
  post_type: PostType;
  author: ApiUserBrief;
  attachments: ApiPostAttachment[];
  comments: number;
  likes: number;
  has_liked: boolean;
  recent_likes: { id: string; avatar?: string | null }[];
  latest_comment: ApiLatestComment | null;
}

export interface PostsPage {
  data: ApiPostDetail[];
  meta?: {
    next_cursor: string | null;
    has_next_page: boolean;
  };
}

export interface CommentsPage {
  data: ApiComment[];
  meta?: {
    next_cursor: string | null;
    has_next_page: boolean;
  };
}

export interface LikeToggleResult {
  liked: boolean;
}

export const FEED_LIST_ARG = { limit: 10 } as const;
export const COMMENTS_LIMIT = 30;
