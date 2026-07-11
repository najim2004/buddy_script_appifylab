import type { FeedPost, FeedStory } from "../types/feed.types";

export const FEED_STORIES: FeedStory[] = [
  {
    id: "own",
    name: "Your Story",
    cover: "/assets/images/card_ppl1.png",
    isOwn: true,
  },
  {
    id: "1",
    name: "Ryan Roslansky",
    cover: "/assets/images/card_ppl2.png",
    avatar: "/assets/images/mini_pic.png",
  },
  {
    id: "2",
    name: "Ryan Roslansky",
    cover: "/assets/images/card_ppl3.png",
    avatar: "/assets/images/mini_pic.png",
  },
  {
    id: "3",
    name: "Ryan Roslansky",
    cover: "/assets/images/card_ppl4.png",
    avatar: "/assets/images/mini_pic.png",
  },
];

export const FEED_POSTS: FeedPost[] = [
  {
    id: "1",
    author: {
      name: "Karim Saif",
      avatar: "/assets/images/post_img.png",
    },
    createdAt: "5 minute ago",
    privacy: "Public",
    content: "-Healthy Tracking App",
    image: "/assets/images/timeline_img.png",
    reactionCount: 11,
    commentsCount: 12,
    sharesCount: 122,
    comments: [
      {
        id: "c1",
        author: {
          name: "Ryan Roslansky",
          avatar: "/assets/images/txt_img.png",
        },
        body: "This looks amazing! Can't wait to try it.",
        createdAt: "21m",
        reactionCount: 2,
      },
    ],
  },
  {
    id: "2",
    author: {
      name: "Karim Saif",
      avatar: "/assets/images/post_img.png",
    },
    createdAt: "5 minute ago",
    privacy: "Public",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    reactionCount: 5,
    commentsCount: 4,
    sharesCount: 1,
  },
];

export const CURRENT_USER_AVATAR = "/assets/images/txt_img.png";
