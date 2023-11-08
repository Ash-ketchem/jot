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

export const monthOrder = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
export const timeRanges = {
  "12-6 AM": { start: 0, end: 6 },
  "6-12 PM": { start: 6, end: 12 },
  "12-6 PM": { start: 12, end: 18 },
  "6-12 AM": { start: 18, end: 24 },
};

// export const timeRanges = {
//   "12-6 AM": { start: 0, end: 3 },
//   "3-6 AM": { start: 3, end: 6 },
//   "6-9 AM": { start: 6, end: 9 },
//   "9-12 PM": { start: 9, end: 12 },
//   "12-3 PM": { start: 12, end: 15 },
//   "3-6 PM": { start: 15, end: 18 },
//   "6-9 PM": { start: 18, end: 21 },
//   "9-12 AM": { start: 21, end: 24 },
// };
