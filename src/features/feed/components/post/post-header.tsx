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
  const showMenu = canEdit || canDelete;

  return (
    <div className="mb-4 flex items-center justify-between gap-2">
      <div className="flex min-w-0 cursor-pointer items-center">
        <Avatar className="mr-3 size-10 shrink-0 sm:mr-4 sm:size-11">
          {authorImage ? (
            <AvatarImage src={authorImage} alt={authorName} />
          ) : null}
          <AvatarFallback>{authorName.slice(0, 1)}</AvatarFallback>
        </Avatar>
        <div>
          <h4 className="mb-0.5">
            <Link
              href="#0"
              className="text-content hover:text-primary block truncate text-sm leading-tight transition-colors hover:underline sm:text-base"
            >
              {authorName}
            </Link>
          </h4>
          <p className="text-subtle flex items-center text-xs leading-tight font-normal sm:text-sm">
            {timeAgo}
            <span className="mx-1">·</span>
            <Link href="#0" className="text-subtle hover:underline">
              {privacy}
            </Link>
          </p>
        </div>
      </div>

      {showMenu ? (
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
            {canEdit ? (
              <DropdownMenuItem className="cursor-pointer" onClick={onEdit}>
                Edit Post
              </DropdownMenuItem>
            ) : null}
            {canDelete ? (
              <DropdownMenuItem
                className="text-destructive focus:text-destructive cursor-pointer"
                onClick={onDelete}
              >
                Delete Post
              </DropdownMenuItem>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
    </div>
  );
}
