"use client";

import { useState } from "react";
import { ImageIcon, Mic, X } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PostCommentInputProps {
  userImage?: string;
  onSubmit?: (content: string) => void;
  onCancel?: () => void;
  autoFocus?: boolean;
  placeholder?: string;
}

export function PostCommentInput({
  userImage,
  onSubmit,
  onCancel,
  autoFocus = false,
  placeholder = "Write a comment...",
}: PostCommentInputProps) {
  const [value, setValue] = useState("");

  const submit = () => {
    const content = value.trim();
    if (!content || !onSubmit) return;
    // Clear immediately — API call is fire-and-forget via RTK optimistic update
    setValue("");
    onSubmit(content);
  };

  return (
    <div className="px-4 pt-4 pb-2.5 sm:px-6">
      <div className="bg-comment flex items-center rounded-[18px] px-2.5 py-1">
        <Avatar className="size-[26px] shrink-0">
          {userImage ? <AvatarImage src={userImage} alt="" /> : null}
          <AvatarFallback className="text-[10px]">U</AvatarFallback>
        </Avatar>
        <div className="flex flex-1 items-center">
          <textarea
            rows={1}
            value={value}
            autoFocus={autoFocus}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
              if (e.key === "Escape" && onCancel) {
                onCancel();
              }
            }}
            placeholder={placeholder}
            className="text-card-foreground placeholder:text-muted-foreground h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none"
          />
          {onCancel ? (
            <button
              type="button"
              onClick={onCancel}
              className="text-muted-foreground hover:text-primary mx-1"
              aria-label="Cancel reply"
            >
              <X className="size-4" />
            </button>
          ) : null}
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
