export function PostActions() {
  return (
    <div className="mb-[15px] flex items-center justify-between border-b border-bs-border1 py-[10px]">
      <button className="group flex w-full items-center justify-center rounded-[6px] p-2 text-[15px] font-medium text-[#666666] transition-all duration-200 ease-in-out hover:bg-primary/5 hover:text-primary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="19"
          height="19"
          fill="none"
          viewBox="0 0 19 19"
          className="mr-[5px] -mt-[2px]"
        >
          <path fill="#FFCC4D" d="M9.5 19a9.5 9.5 0 100-19 9.5 9.5 0 000 19z" />
          <path
            fill="#664500"
            d="M9.5 11.083c-1.912 0-3.181-.222-4.75-.527-.358-.07-1.056 0-1.056 1.055 0 2.111 2.425 4.75 5.806 4.75 3.38 0 5.805-2.639 5.805-4.75 0-1.055-.697-1.125-1.055-1.055-1.57.305-2.838.527-4.75.527z"
          />
          <path
            fill="#fff"
            d="M4.75 11.611s1.583.528 4.75.528 4.75-.528 4.75-.528-1.056 2.111-4.75 2.111-4.75-2.11-4.75-2.11z"
          />
          <path
            fill="#664500"
            d="M6.333 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847zM12.667 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847z"
          />
        </svg>
        Haha
      </button>

      <button className="group flex w-full items-center justify-center rounded-[6px] p-2 text-[15px] font-medium text-[#666666] transition-all duration-200 ease-in-out hover:bg-primary/5 hover:text-primary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="21"
          height="21"
          fill="none"
          viewBox="0 0 21 21"
          className="mr-[5px] -mt-[2px] stroke-[#666666] group-hover:stroke-primary transition-all duration-200"
        >
          <path d="M1 10.5c0-.464 0-.696.009-.893A9 9 0 019.607 1.01C9.804 1 10.036 1 10.5 1v0c.464 0 .696 0 .893.009a9 9 0 018.598 8.598c.009.197.009.429.009.893v6.046c0 1.36 0 2.041-.317 2.535a2 2 0 01-.602.602c-.494.317-1.174.317-2.535.317H10.5c-.464 0-.696 0-.893-.009a9 9 0 01-8.598-8.598C1 11.196 1 10.964 1 10.5v0z" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.938 9.313h7.125M10.5 14.063h3.563"
          />
        </svg>
        Comment
      </button>

      <button className="group flex w-full items-center justify-center rounded-[6px] p-2 text-[15px] font-medium text-[#666666] transition-all duration-200 ease-in-out hover:bg-primary/5 hover:text-primary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="21"
          fill="none"
          viewBox="0 0 24 21"
          className="mr-[5px] -mt-[2px] stroke-[#666666] group-hover:stroke-primary transition-all duration-200"
        >
          <path d="M7 10.5c0-.464 0-.696.009-.893a9 9 0 018.598-8.597c.197-.009.429-.009.893-.009v0c.464 0 .696 0 .893.009a9 9 0 018.598 8.598c.009.197.009.429.009.893v6.046c0 1.36 0 2.041-.317 2.535a2 2 0 01-.602.602c-.494.317-1.174.317-2.535.317H16.5c-.464 0-.696 0-.893-.009a9 9 0 01-8.598-8.598C7 11.196 7 10.964 7 10.5v0z" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 11l4.5 4M15 15l4.5-4"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.283 14c-1.745-1-2.908-2.812-2.908-4.887a5.613 5.613 0 0111.226 0"
          />
          <path d="M12.43 14l3.19.855-3.08-1.57" fill="#666" />
        </svg>
        Share
      </button>
    </div>
  );
}
