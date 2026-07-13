import type { FeedStory } from "../types/feed.types";

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

export const CURRENT_USER_AVATAR = "/assets/images/txt_img.png";
