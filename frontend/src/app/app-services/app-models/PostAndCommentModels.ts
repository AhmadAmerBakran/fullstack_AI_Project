export interface AnonymousPost {
  id: number;
  title: string;
  content: string;
  publishDate: Date;
  postImage: string;
  commentCount: number;
}

export interface CreatePost {
  title: string;
  content: string;
  postImage: string;
}

export interface Comment {
  id: number;
  postId: number;
  content: string;
  commentDate: Date;
}

export interface CreateComment {
  blogId: number;
  content: string;
  commentDate: Date;
}
