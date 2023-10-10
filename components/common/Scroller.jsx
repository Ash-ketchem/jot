"use client";

import scrollStore from "@/stores/ScrollStore";
import { usePathname } from "next/navigation";
import { useCallback, useRef, useEffect } from "react";

const Scroller = ({ children }) => {
  const pathname = usePathname();
  const { paths, setScroll } = scrollStore((state) => state);
  const scrollRef = useRef(null);
  const scrollRestored = useRef(false);

  const scrollValueRef = useRef(0);

  const handleScroll = useCallback(
    (e) => {
      scrollValueRef.current = e.target.scrollTop;
    },
    [pathname]
  );

  useEffect(() => {
    // scroll restoration

    if (paths.has(pathname) && paths.get(pathname) > 0) {
      scrollRef.current.scrollTo(0, paths.get(pathname));
      scrollRestored.current = true;
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
