import Image from "next/image";
import { mediaUrl } from "@/lib/media-url";
import type { ApiPostAttachment } from "../../types/feed.api.types";

interface PostContentProps {
  content: string;
  attachments?: ApiPostAttachment[];
}

export function PostContent({ content, attachments = [] }: PostContentProps) {
  const count = attachments.length;

  const renderMediaItem = (item: ApiPostAttachment) => {
    const isVideo =
      item.type === "VIDEO" || item.mime_type?.startsWith("video/");
    const url = mediaUrl(item.file_path);

    if (isVideo) {
      return (
        <video src={url} controls className="size-full bg-black object-cover" />
      );
    }

    return (
      <Image
        src={url || ""}
        alt={item.file_name || "Attachment"}
        fill
        sizes="(max-width: 768px) 100vw, 600px"
        className="object-cover"
      />
    );
  };

  return (
    <>
      {content ? (
        <h4 className="text-content mb-4 text-sm leading-[21px] font-normal">
          {content}
        </h4>
      ) : null}

      {count > 0 && (
        <div className="mb-6 overflow-hidden rounded-md">
          {count === 1 && (
            <div className="relative aspect-7/5 w-full bg-black/5">
              {renderMediaItem(attachments[0])}
            </div>
          )}

          {count === 2 && (
            <div className="grid aspect-3/2 w-full grid-cols-2 gap-1.5">
              <div className="relative size-full bg-black/5">
                {renderMediaItem(attachments[0])}
              </div>
              <div className="relative size-full bg-black/5">
                {renderMediaItem(attachments[1])}
              </div>
            </div>
          )}

          {count === 3 && (
            <div className="grid aspect-3/2 w-full grid-cols-3 gap-1.5">
              <div className="relative col-span-2 size-full bg-black/5">
                {renderMediaItem(attachments[0])}
              </div>
              <div className="grid size-full grid-rows-2 gap-1.5">
                <div className="relative size-full bg-black/5">
                  {renderMediaItem(attachments[1])}
                </div>
                <div className="relative size-full bg-black/5">
                  {renderMediaItem(attachments[2])}
                </div>
              </div>
            </div>
          )}

          {count >= 4 && (
            <div className="grid aspect-square w-full grid-cols-2 gap-1.5">
              <div className="relative size-full bg-black/5">
                {renderMediaItem(attachments[0])}
              </div>
              <div className="relative size-full bg-black/5">
                {renderMediaItem(attachments[1])}
              </div>
              <div className="relative size-full bg-black/5">
                {renderMediaItem(attachments[2])}
              </div>
              <div className="relative size-full bg-black/5">
                {renderMediaItem(attachments[3])}
                {count > 4 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-xl font-bold text-white">
                    +{count - 3}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
