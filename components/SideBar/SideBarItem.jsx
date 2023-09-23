import Link from "next/link";

const SideBarItem = ({ label, href, Icon }) => {
  return (
    <Link href={href || "/"} prefetch={true}>
      <div className="flex gap-4 justify-start items-center py-2 ">
        <Icon className="w-6 h-6" />
        <p className="font-semibold lg:text-base   text-sm">{label}</p>
      </div>
    </Link>
  );
};

export default SideBarItem;
