import Image from "next/image";
import { ImageIcon, Video, CalendarDays, FileText, Send } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface CreatePostProps {
  userAvatar: string;
  className?: string;
}

const ATTACHMENTS = [
  { label: "Photo", icon: ImageIcon },
  { label: "Video", icon: Video },
  { label: "Event", icon: CalendarDays },
  { label: "Article", icon: FileText },
] as const;

export function CreatePost({ userAvatar, className }: CreatePostProps) {
  return (
    <div className={cn("bg-card mb-4 rounded-md pt-6", className)}>
      <div className="flex items-start px-6">
        <Avatar className="mr-3 size-10 shrink-0">
          <AvatarImage src={userAvatar} alt="Your profile" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>

        <div className="relative flex-1">
          <Textarea
            id="create-post"
            placeholder="Write something ..."
            className="border-0 bg-transparent text-content placeholder:text-muted-foreground min-h-[88px] resize-none rounded-md border-0 px-2 py-2 text-base shadow-none focus-visible:ring-0"
          />
        </div>
      </div>

      <div className="bg-brand-tint mt-2.5 flex h-16 items-center justify-between rounded-b-md px-[15px]">
        <div className="flex items-center gap-1 sm:gap-2 lg:gap-3">
          {ATTACHMENTS.map(({ label, icon: Icon }) => (
            <button
              key={label}
              type="button"
              className="text-muted-foreground hover:text-primary group flex items-center px-1.5 text-sm font-normal transition-colors sm:px-2.5 sm:text-base"
            >
              <span className="bg-card group-hover:bg-accent mr-0 flex size-[34px] items-center justify-center rounded-full transition-colors sm:mr-2">
                <Icon className="size-5" />
              </span>
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        <Button
          type="button"
          className="bg-primary hover:bg-primary-hover h-auto shrink-0 rounded-md px-[22px] py-3 text-base font-medium text-white"
        >
          <Send className="size-3.5" />
          Post
        </Button>
      </div>
    </div>
  );
}

/** Mobile icon-only composer strip variant */
export function CreatePostMobile({ userAvatar }: CreatePostProps) {
  return (
    <div className="bg-card mb-4 rounded-md p-4 md:hidden">
      <div className="flex items-center gap-3">
        <Image
          src={userAvatar}
          alt=""
          width={40}
          height={40}
          className="size-10 rounded-full object-cover"
        />
        <input
          type="text"
          readOnly
          placeholder="Write something ..."
          className="bg-comment text-muted-foreground h-10 flex-1 rounded-full px-4 text-sm outline-none"
        />
      </div>
    </div>
  );
}
