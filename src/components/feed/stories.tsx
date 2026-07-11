import Image from "next/image";
import Link from "next/link";

export function Stories() {
  return (
    <div className="relative mb-4 hidden md:block">
      {/* Right Arrow (Desktop only as per original) */}
      <div className="absolute right-[-5px] top-1/2 z-[18] -translate-y-1/2">
        <button
          type="button"
          className="bg-primary border-bs-bg1 flex h-6 w-6 items-center justify-center rounded-[40px] border px-[7px]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="9"
            height="8"
            fill="none"
            viewBox="0 0 9 8"
            className="-mt-[2px]"
          >
            <path
              fill="#fff"
              d="M8 4l.366-.341.318.341-.318.341L8 4zm-7 .5a.5.5 0 010-1v1zM5.566.659l2.8 3-.732.682-2.8-3L5.566.66zm2.8 3.682l-2.8 3-.732-.682 2.8-3 .732.682zM8 4.5H1v-1h7v1z"
            />
          </svg>
        </button>
      </div>

      <div className="flex gap-4">
        {/* Your Story */}
        <div className="w-[23%] shrink-0 lg:w-[23%] md:w-[30%]">
          <div className="group cursor-pointer transition-all duration-200 ease-in-out">
            <div className="relative z-[2] flex h-[190px] w-full flex-col justify-end overflow-hidden rounded-[6px]">
              {/* Background Image */}
              <Image
                src="/assets/images/card_ppl1.png"
                alt="Your Story"
                fill
                className="object-cover"
              />
              {/* Overlay */}
              <div className="absolute inset-0 z-[1] bg-black/50" />

              {/* Text Area */}
              <div className="relative z-10 w-full rounded-b-[6px] rounded-t-[25.5px] bg-[#112032] pt-[30px] dark:bg-bs-bg2">
                <div className="absolute -top-[12px] left-1/2 -translate-x-1/2">
                  <button className="bg-primary flex h-8 w-8 items-center justify-center rounded-[40px] border-2 border-[#112032] dark:border-bs-bg2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      height="10"
                      fill="none"
                      viewBox="0 0 10 10"
                    >
                      <path
                        stroke="#fff"
                        strokeLinecap="round"
                        d="M.5 4.884h9M4.884 9.5v-9"
                      />
                    </svg>
                  </button>
                </div>
                <p className="mb-[10px] text-center text-[12px] font-medium leading-[19px] text-white dark:text-bs-color">
                  Your Story
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Public Story 1 */}
        <div className="w-[23%] shrink-0 lg:w-[23%] md:w-[30%]">
          <div className="group cursor-pointer overflow-hidden transition-all duration-200 ease-in-out">
            <div className="relative z-[2] flex h-[190px] w-full flex-col justify-end overflow-hidden rounded-[6px]">
              <Image
                src="/assets/images/card_ppl2.png"
                alt="Ryan Roslansky"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 z-[1] bg-black/50 transition-all duration-200 ease-in-out group-hover:opacity-70" />
              <div className="relative z-10 w-full">
                <p className="mb-[10px] text-center text-[12px] font-medium leading-[19px] text-white">
                  Ryan Roslansky
                </p>
              </div>
              <div className="absolute right-[12px] top-[12px] z-10">
                <Image
                  src="/assets/images/mini_pic.png"
                  alt="Mini pic"
                  width={28}
                  height={28}
                  className="border-bs-bg2 bg-bs-color3 h-7 w-7 rounded-[40px] border-2 object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Public Story 2 */}
        <div className="hidden w-[23%] shrink-0 md:block lg:w-[23%]">
          <div className="group cursor-pointer overflow-hidden transition-all duration-200 ease-in-out">
            <div className="relative z-[2] flex h-[190px] w-full flex-col justify-end overflow-hidden rounded-[6px]">
              <Image
                src="/assets/images/card_ppl3.png"
                alt="Ryan Roslansky"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 z-[1] bg-black/50 transition-all duration-200 ease-in-out group-hover:opacity-70" />
              <div className="relative z-10 w-full">
                <p className="mb-[10px] text-center text-[12px] font-medium leading-[19px] text-white">
                  Ryan Roslansky
                </p>
              </div>
              <div className="absolute right-[12px] top-[12px] z-10">
                <Image
                  src="/assets/images/mini_pic.png"
                  alt="Mini pic"
                  width={28}
                  height={28}
                  className="border-bs-bg2 bg-bs-color3 h-7 w-7 rounded-[40px] border-2 object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Public Story 3 */}
        <div className="hidden w-[23%] shrink-0 lg:block">
          <div className="group cursor-pointer overflow-hidden transition-all duration-200 ease-in-out">
            <div className="relative z-[2] flex h-[190px] w-full flex-col justify-end overflow-hidden rounded-[6px]">
              <Image
                src="/assets/images/card_ppl4.png"
                alt="Ryan Roslansky"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 z-[1] bg-black/50 transition-all duration-200 ease-in-out group-hover:opacity-70" />
              <div className="relative z-10 w-full">
                <p className="mb-[10px] text-center text-[12px] font-medium leading-[19px] text-white">
                  Ryan Roslansky
                </p>
              </div>
              <div className="absolute right-[12px] top-[12px] z-10">
                <Image
                  src="/assets/images/mini_pic.png"
                  alt="Mini pic"
                  width={28}
                  height={28}
                  className="border-bs-bg2 bg-bs-color3 h-7 w-7 rounded-[40px] border-2 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
