import Image from "next/image";

interface PostCommentInputProps {
  userImage: string;
}

export function PostCommentInput({ userImage }: PostCommentInputProps) {
  return (
    <div className="mt-[15px] flex items-center">
      <Image
        src={userImage}
        alt="Profile"
        width={40}
        height={40}
        className="mr-[15px] h-10 w-10 shrink-0 rounded-full object-cover"
      />
      <form className="relative w-full">
        <textarea
          className="border-bs-border1 bg-bs-bg1 text-bs-color h-[42px] w-full resize-none overflow-hidden rounded-[40px] border px-[15px] py-[10px] text-[14px] transition-all duration-200 ease-in-out focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="Write something..."
        />
        <div className="absolute right-[4px] top-[3px]">
          <button
            type="submit"
            className="bg-primary flex h-[34px] w-[34px] items-center justify-center rounded-[40px] transition-colors hover:bg-blue-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="none"
              viewBox="0 0 18 18"
            >
              <path
                fill="#fff"
                d="M17.156 8.163l-15-7.5a.936.936 0 00-1.272.45A.935.935 0 00.75 1.5l1.83 6.096h6.795a.469.469 0 01.469.469.469.469 0 01-.469.469H2.58l-1.83 6.095a.937.937 0 00.518 1.182.936.936 0 001.206-.299l.061-.073 15-7.5a.937.937 0 00-.378-1.776h0z"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
