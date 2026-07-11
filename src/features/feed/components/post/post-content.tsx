import Image from "next/image";

interface PostContentProps {
  content: string;
  image?: string;
}

export function PostContent({ content, image }: PostContentProps) {
  return (
    <>
      <h4 className="text-ink mb-4 text-sm leading-[21px] font-normal">
        {content}
      </h4>

      {image ? (
        <div className="mb-6 overflow-hidden rounded-md">
          <Image
            src={image}
            alt="Post media"
            width={700}
            height={500}
            sizes="(max-width: 768px) 100vw, 600px"
            className="block h-auto w-full rounded-md object-cover"
            priority={false}
          />
        </div>
      ) : null}
    </>
  );
}
