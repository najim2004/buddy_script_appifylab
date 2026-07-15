"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ImageIcon,
  Video,
  CalendarDays,
  FileText,
  Send,
  X,
  Pen,
  Globe,
  Lock,
  ChevronDown,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getApiErrorMessage } from "@/lib/api/error";
import { cn } from "@/lib/utils";
import { useCreatePostMutation } from "../api/feed.api";

interface CreatePostProps {
  userAvatar?: string;
  className?: string;
}

type FilePreview = {
  file: File;
  url: string;
  isVideo: boolean;
};

export function CreatePost({ userAvatar, className }: CreatePostProps) {
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [previews, setPreviews] = useState<FilePreview[]>([]);
  const [createPost, { isLoading }] = useCreatePostMutation();

  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const previewsRef = useRef<FilePreview[]>([]);
  previewsRef.current = previews;

  useEffect(() => {
    return () => {
      previewsRef.current.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, []);

  const addFiles = (list: FileList | null) => {
    if (!list?.length) return;

    const validFiles: File[] = [];
    for (let i = 0; i < list.length; i++) {
      const file = list[i];
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File "${file.name}" exceeds the 5MB limit.`);
      } else {
        validFiles.push(file);
      }
    }

    if (validFiles.length === 0) return;

    const newFiles: FilePreview[] = validFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      isVideo: file.type.startsWith("video/"),
    }));
    setPreviews((prev) => [...prev, ...newFiles].slice(0, 10));
  };

  const removeFile = (index: number) => {
    setPreviews((prev) => {
      const target = prev[index];
      if (target) {
        URL.revokeObjectURL(target.url);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const onPost = async () => {
    const text = content.trim();
    const rawFiles = previews.map((p) => p.file);
    if (!text && rawFiles.length === 0) {
      toast.error("Write something or add a photo/video");
      return;
    }

    try {
      await createPost({ content: text, files: rawFiles, visibility }).unwrap();
      setContent("");
      setVisibility("public");
      previews.forEach((item) => URL.revokeObjectURL(item.url));
      setPreviews([]);
      toast.success("Post shared");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not create post"));
    }
  };

  const openPhoto = () => {
    if (photoInputRef.current) {
      photoInputRef.current.value = "";
      photoInputRef.current.click();
    }
  };

  const openVideo = () => {
    if (videoInputRef.current) {
      videoInputRef.current.value = "";
      videoInputRef.current.click();
    }
  };

  return (
    <div
      className={cn(
        "bg-card mb-4 rounded-md pt-6 max-lg:overflow-hidden max-lg:pt-4",
        className,
      )}
    >
      <div className="flex flex-col items-start px-6 max-lg:px-4">
        <div className="flex w-full items-center">
          <Avatar className="mr-3 size-10 shrink-0">
            {userAvatar ? (
              <AvatarImage src={userAvatar} alt="Your profile" />
            ) : null}
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="mb-2 flex w-full justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="border-input text-muted-foreground hover:bg-accent flex cursor-pointer items-center gap-1.5 rounded-md border bg-transparent px-2.5 py-1 text-xs font-medium outline-none"
                >
                  {visibility === "public" ? (
                    <Globe className="size-3.5" />
                  ) : (
                    <Lock className="size-3.5" />
                  )}
                  <span className="capitalize">{visibility}</span>
                  <ChevronDown className="size-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[130px]">
                <DropdownMenuItem
                  onClick={() => setVisibility("public")}
                  className="cursor-pointer gap-2"
                >
                  <Globe className="text-muted-foreground size-4" />
                  <span>Public</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setVisibility("private")}
                  className="cursor-pointer gap-2"
                >
                  <Lock className="text-muted-foreground size-4" />
                  <span>Private</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="relative w-full">
          <Textarea
            id="create-post"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write something ..."
            className="text-content placeholder:text-muted-foreground min-h-[88px] w-full resize-none rounded-md border-0 bg-transparent px-2 py-2 pr-10 text-base shadow-none focus-visible:ring-0 max-lg:min-h-[72px] max-lg:text-sm"
          />
          {!content && (
            <div className="text-muted-foreground pointer-events-none absolute top-2 left-[150px] max-lg:left-[130px]">
              <Pen className="size-4" />
            </div>
          )}
        </div>
      </div>

      {previews.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2 px-6 max-lg:px-4">
          {previews.map((item, index) => (
            <div
              key={`${item.file.name}-${index}`}
              className="relative size-20 overflow-hidden rounded-md"
            >
              {item.isVideo ? (
                <>
                  <video
                    src={item.url}
                    className="size-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <Video className="size-6 text-white opacity-80" />
                  </div>
                </>
              ) : (
                <Image
                  src={item.url}
                  alt=""
                  fill
                  sizes="80px"
                  unoptimized
                  className="object-cover"
                />
              )}
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="bg-background/80 absolute top-1 right-1 rounded-full p-0.5"
                aria-label="Remove file"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : null}

      <input
        ref={photoInputRef}
        type="file"
        accept="image/*,.heic,.heif,.webp"
        multiple
        className="hidden"
        onChange={(e) => {
          addFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        multiple
        className="hidden"
        onChange={(e) => {
          addFiles(e.target.files);
          e.target.value = "";
        }}
      />

      <div className="hidden p-6 lg:block">
        <div className="bg-brand-tint mt-2.5 flex flex-col gap-4 rounded-md p-4 lg:min-h-16 lg:px-4 lg:py-2 xl:grid xl:grid-cols-5">
          <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4 xl:col-span-4">
            <button
              type="button"
              onClick={openPhoto}
              className="text-muted-foreground hover:text-primary flex items-center text-sm font-medium sm:text-base"
            >
              <ImageIcon className="mr-1.5 size-5 sm:mr-2" />
              <span>Photo</span>
            </button>

            <button
              type="button"
              onClick={openVideo}
              className="text-muted-foreground hover:text-primary flex items-center text-sm font-medium sm:text-base"
            >
              <Video className="mr-1.5 size-5 sm:mr-2" />
              <span>Video</span>
            </button>

            <button
              type="button"
              disabled
              className="text-muted-foreground flex cursor-not-allowed items-center text-sm font-medium opacity-50 sm:text-base"
            >
              <CalendarDays className="mr-1.5 size-5 sm:mr-2" />
              <span>Event</span>
            </button>

            <button
              type="button"
              disabled
              className="text-muted-foreground flex cursor-not-allowed items-center text-sm font-medium opacity-50 sm:text-base"
            >
              <FileText className="mr-1.5 size-5 sm:mr-2" />
              <span>Article</span>
            </button>
          </div>

          <Button
            type="button"
            disabled={isLoading}
            onClick={() => void onPost()}
            className="bg-primary hover:bg-primary-hover h-auto w-full shrink-0 rounded-md py-3 text-base font-medium text-white lg:px-[22px]"
          >
            <Send className="mr-2 size-3.5" />
            {isLoading ? "Posting…" : "Post"}
          </Button>
        </div>
      </div>

      <div className="bg-brand-tint mt-2.5 flex h-16 items-center justify-between px-4 lg:hidden">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={openPhoto}
            aria-label="Add photo"
            className="text-muted-foreground hover:text-primary"
          >
            <ImageIcon className="size-5" />
          </button>
          <button
            type="button"
            onClick={openVideo}
            aria-label="Add video"
            className="text-muted-foreground hover:text-primary"
          >
            <Video className="size-5" />
          </button>
          <button
            type="button"
            disabled
            aria-label="Event"
            className="text-muted-foreground cursor-not-allowed opacity-50"
          >
            <CalendarDays className="size-5" />
          </button>
          <button
            type="button"
            disabled
            aria-label="Article"
            className="text-muted-foreground cursor-not-allowed opacity-50"
          >
            <FileText className="size-5" />
          </button>
        </div>

        <Button
          type="button"
          disabled={isLoading}
          onClick={() => void onPost()}
          className="bg-primary hover:bg-primary-hover h-10 w-[100px] shrink-0 rounded-md text-sm font-medium text-white"
        >
          <Send className="mr-1.5 size-3.5" />
          {isLoading ? "…" : "Post"}
        </Button>
      </div>
    </div>
  );
}
