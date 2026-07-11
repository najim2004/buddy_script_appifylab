import { ImageIcon, Mic } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PostCommentInputProps {
  userImage: string;
}

export function PostCommentInput({ userImage }: PostCommentInputProps) {
  return (
    <div className="px-6 pt-6 pb-2.5">
      <div className="bg-comment flex items-center rounded-[18px] px-2.5 py-1">
        <Avatar className="size-[26px] shrink-0">
          <AvatarImage src={userImage} alt="" />
          <AvatarFallback className="text-[10px]">U</AvatarFallback>
        </Avatar>
        <div className="flex flex-1 items-center">
          <textarea
            rows={1}
            placeholder="Write a comment..."
            className="text-card-foreground placeholder:text-muted-foreground h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none"
          />
          <button
            type="button"
            className="text-muted-foreground hover:text-primary mx-1"
            aria-label="Voice"
          >
            <Mic className="size-4" />
          </button>
          <button
            type="button"
            className="text-muted-foreground hover:text-primary mx-1"
            aria-label="Attach image"
          >
            <ImageIcon className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
