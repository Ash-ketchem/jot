import {
  MoonIcon,
  SunIcon,
  EnvelopeIcon,
  HomeIcon,
  UserCircleIcon,
  BookmarkIcon,
} from "@heroicons/react/24/outline";

export const themes = [
  {
    theme: "light",
    icon: SunIcon,
  },

  {
    theme: "night",
    icon: MoonIcon,
  },
  {
    theme: "cupcake",
    icon: SunIcon,
  },
  {
    theme: "dark",
    icon: MoonIcon,
  },
  {
    theme: "lofi",
    icon: SunIcon,
  },
  {
    theme: "coffee",
    icon: MoonIcon,
  },
];

export const NavItems = [
  {
    label: "Home",
    Icon: HomeIcon,
    href: "/",
    auth: false,
  },
  {
    label: "Messages",
    Icon: EnvelopeIcon,
    href: "/chat",
    auth: true,
  },
  {
    label: "Profile",
    Icon: UserCircleIcon,
    href: "/profile",
    auth: true,
  },
  {
    label: "Bookmarks",
    Icon: BookmarkIcon,
    href: "/bookmarks",
    auth: true,
  },
];
