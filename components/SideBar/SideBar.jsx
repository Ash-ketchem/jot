import { NavItems } from "@/constants";
import SideBarItem from "./SideBarItem";
import Jot from "./Jot";
import Extra from "./Extra";
import Logout from "./Logout";
import LoggedUserItem from "./LoggedUserItem";

const SideBar = ({ loggedUserId }) => {
  return (
    <ul className="menu bg-base-200 w-full rounded-box space-y-3 relative [&_li>*]:rounded-full h-full">
      <div className="mt-2" />
      {NavItems.filter((item) => (item?.auth ? loggedUserId : true)).map(
        (item) => (
          <li className="rounded-full" key={item?.label}>
            <SideBarItem
              key={item?.label}
              label={item.label}
              auth={item.auth}
              href={item.href}
              Icon={item.Icon}
              loggedUserId={loggedUserId}
            />
          </li>
        )
      )}
      {loggedUserId && (
        <li>
          <Jot label="Jot" loggedUserId={loggedUserId} />
        </li>
      )}
      <li>
        <Logout loggedUserId={loggedUserId} />
      </li>
      {loggedUserId && (
        <li>
          <Extra loggedUserId={loggedUserId} />
        </li>
      )}

      {loggedUserId && (
        <li className=" absolute bottom-8 left-0 px-2 w-full flex justify-center items-center ">
          <LoggedUserItem />
        </li>
      )}
    </ul>
  );
};

export default SideBar;
