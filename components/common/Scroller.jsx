"use client";

import scrollStore from "@/stores/ScrollStore";
import { usePathname } from "next/navigation";
import { useCallback, useRef, useEffect } from "react";

const Scroller = ({ children }) => {
  const pathname = usePathname();
  const { paths, setScroll } = scrollStore((state) => state);
  const scrollRef = useRef(null);

  const scrollValueRef = useRef(0);

  const handleScroll = useCallback((e) => {
    scrollValueRef.current = e.target.scrollTop;
  }, []);

  useEffect(() => {
    // scroll restoration
    if (paths.has(pathname)) {
      scrollRef.current.scrollTo(0, paths.get(pathname));
    }

    return () => {
      setScroll(pathname, scrollValueRef.current);
    };
  }, [pathname]);

  return (
    <div
      className="basis-2/3 overflow-y-auto  h-full  bg-base-200 rounded-box "
      onScroll={handleScroll}
      ref={scrollRef}
    >
      {children}
    </div>
  );
};

export default Scroller;
