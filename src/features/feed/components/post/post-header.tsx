"use client";

import Link from "next/link";
import { MoreVertical } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PostHeaderProps {
  authorName: string;
  authorImage?: string;
  timeAgo: string;
  privacy: string;
  canDelete?: boolean;
  canEdit?: boolean;
  onDelete?: () => void;
  onEdit?: () => void;
}

export function PostHeader({
  authorName,
  authorImage,
  timeAgo,
  privacy,
  canDelete = false,
  canEdit = false,
  onDelete,
  onEdit,
}: PostHeaderProps) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex cursor-pointer items-center">
        <Avatar className="mr-4 size-11 shrink-0">
          {authorImage ? (
            <AvatarImage src={authorImage} alt={authorName} />
          ) : null}
          <AvatarFallback>{authorName.slice(0, 1)}</AvatarFallback>
        </Avatar>
        <div>
          <h4 className="mb-0.5">
            <Link
              href="#0"
              className="text-content hover:text-primary text-base leading-tight transition-colors hover:underline"
            >
              {authorName}
            </Link>
          </h4>
          <p className="text-subtle flex items-center text-sm leading-tight font-normal">
            {timeAgo}
            <span className="mx-1">·</span>
            <Link href="#0" className="text-subtle hover:underline">
              {privacy}
            </Link>
          </p>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-subtle hover:bg-background -mr-2.5 size-8 rounded-full"
            aria-label="Post options"
          >
            <MoreVertical className="size-6" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-card w-44">
          <DropdownMenuItem className="cursor-pointer">
            Save Post
          </DropdownMenuItem>
          {canEdit ? (
            <DropdownMenuItem className="cursor-pointer" onClick={onEdit}>
              Edit Post
            </DropdownMenuItem>
          ) : null}
          <DropdownMenuItem
            className="text-destructive focus:text-destructive cursor-pointer"
            disabled={!canDelete}
            onClick={canDelete ? onDelete : undefined}
          >
            Delete Post
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
