"use client";

import { themes } from "@/constants";
import ThemeStore from "@/stores/ThemeStore";
import { SwatchIcon } from "@heroicons/react/24/outline";
import { useCallback, useEffect, useRef } from "react";

const Theme = () => {
  const htmlElm = useRef();

  useEffect(() => {
    htmlElm.current = document.querySelector("html");
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
      htmlElm.current?.setAttribute("data-theme", savedTheme);
      themeStore.setTheme(savedTheme);
    }
  }, []);

  const themeStore = ThemeStore((state) => state);

  const setTheme = useCallback(
    (theme) => {
      htmlElm.current?.setAttribute("data-theme", theme);
      themeStore.setTheme(theme);
      localStorage.setItem("theme", theme);
    },
    [themeStore?.theme]
  );
  return (
    <div>
      <button className="btn btn-ghost btn-circle relative btn-sm md:btn-md  ">
        <div className=" dropdown dropdown-end  relative ">
          <label tabIndex={0} className="">
            <SwatchIcon className="w-6 h- cursor-pointer " />
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content !z-50  menu p-2  bg-base-100 rounded-box w-44 shadow-xl  "
          >
            {themes.map(({ icon: Icon, theme }) => (
              <div
                role="button"
                className={`btn  rounded-full !px-2 leading-relaxed tracking-wider !z-50  ${
                  theme === themeStore?.theme
                    ? "btn-glass"
                    : "btn-ghost lowercase"
                } m-1`}
                onClick={() => setTheme(theme)}
                key={theme}
              >
                <div className="flex justify-around items-center  w-full h-full !z-50 ">
                  <Icon className="w-5 h-5 basis-1/2 " />
                  <p className="basis-1/2  text-left">{theme}</p>
                </div>
              </div>
            ))}
          </ul>
        </div>
      </button>
    </div>
  );
};

export default Theme;
