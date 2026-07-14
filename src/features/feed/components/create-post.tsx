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
} from "lucide-react";
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
    const newFiles: FilePreview[] = Array.from(list).map((file) => ({
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
      await createPost({ content: text, files: rawFiles }).unwrap();
      setContent("");
      previews.forEach((item) => URL.revokeObjectURL(item.url));
      setPreviews([]);
      toast.success("Post shared");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not create post"));
    }
  };

  return (
    <div className={cn("bg-card mb-4 rounded-md pt-6", className)}>
      <div className="flex items-start px-6">
        <Avatar className="mr-3 size-10 shrink-0">
          {userAvatar ? (
            <AvatarImage src={userAvatar} alt="Your profile" />
          ) : null}
          <AvatarFallback>U</AvatarFallback>
        </Avatar>

        <div className="relative flex-1">
          <Textarea
            id="create-post"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write something ..."
            className="text-content placeholder:text-muted-foreground min-h-[88px] w-full resize-none rounded-md border-0 bg-transparent px-2 py-2 pr-10 text-base shadow-none focus-visible:ring-0"
          />
          {!content && (
            <div className="text-muted-foreground pointer-events-none absolute top-2 left-[150px]">
              <Pen className="size-4" />
            </div>
          )}
        </div>
      </div>

      {previews.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2 px-6">
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
                // eslint-disable-next-line @next/next/no-img-element -- Local browser preview doesn't need Next.js server-side optimization
                <img
                  src={item.url}
                  alt=""
                  className="size-full object-cover"
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
        accept="image/*"
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

      <div className="p-4 sm:p-6">
        <div className="bg-brand-tint mt-2.5 flex flex-col gap-4 rounded-md p-4 lg:min-h-16 lg:px-4 lg:py-2">
          <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4">
            <button
              type="button"
              onClick={() => {
                if (photoInputRef.current) {
                  photoInputRef.current.value = "";
                  photoInputRef.current.click();
                }
              }}
              className="text-muted-foreground hover:text-primary group flex items-center text-sm font-medium sm:text-base"
            >
              <ImageIcon className="mr-1.5 size-5 sm:mr-2" />
              <span>Photo</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (videoInputRef.current) {
                  videoInputRef.current.value = "";
                  videoInputRef.current.click();
                }
              }}
              className="text-muted-foreground hover:text-primary group flex items-center text-sm font-medium sm:text-base"
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
    </div>
  );
}

export function CreatePostMobile({ userAvatar }: CreatePostProps) {
  return (
    <div className="bg-card mb-4 rounded-md p-4 md:hidden">
      <div className="flex items-center gap-3">
        {userAvatar ? (
          <Image
            src={userAvatar}
            alt=""
            width={40}
            height={40}
            className="size-10 rounded-full object-cover"
          />
        ) : (
          <div className="bg-muted text-muted-foreground flex size-10 items-center justify-center rounded-full text-sm">
            U
          </div>
        )}
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
