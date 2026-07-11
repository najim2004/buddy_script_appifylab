import Image from "next/image";

interface PostContentProps {
  content: string;
  image?: string;
}

export function PostContent({ content, image }: PostContentProps) {
  return (
    <>
      <div className="py-[10px]">
        <p className="mb-[10px] text-[15px] font-normal leading-[24px] text-bs-color3 dark:text-bs-color">
          {content}
        </p>
      </div>

      {image && (
        <div className="mb-[15px] overflow-hidden rounded-[6px]">
          <Image
            src={image}
            alt="Post Image"
            width={700}
            height={500}
            className="w-full rounded-[6px] block h-auto object-cover"
          />
        </div>
      )}
    </>
  );
}
