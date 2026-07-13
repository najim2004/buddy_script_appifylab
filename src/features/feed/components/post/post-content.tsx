import Image from "next/image";

interface PostContentProps {
  content: string;
  image?: string;
  video?: string;
}

export function PostContent({ content, image, video }: PostContentProps) {
  return (
    <>
      {content ? (
        <h4 className="text-content mb-4 text-sm leading-[21px] font-normal">
          {content}
        </h4>
      ) : null}

      {image ? (
        <div className="relative mb-6 aspect-[7/5] w-full overflow-hidden rounded-md">
          <Image
            src={image}
            alt="Post media"
            fill
            sizes="(max-width: 768px) 100vw, 600px"
            className="object-cover"
          />
        </div>
      ) : null}

      {video ? (
        <div className="mb-6 overflow-hidden rounded-md">
          <video
            src={video}
            controls
            className="block max-h-[480px] w-full bg-black"
          />
        </div>
      ) : null}
    </>
  );
}
