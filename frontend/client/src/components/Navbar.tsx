import { useState } from "react";
import { HoveredLink, Menu, MenuItem } from "./ui/navbar-menu";
import { cn } from "@/utils/cn";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const Navbar = ({ className }: { className?: string }) => {
  const [active, setActive] = useState<string | null>(null);
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  return (
    <div
      className={cn("fixed top-10 inset-x-0 max-w-2xl mx-auto z-50", className)}
    >
      <Menu setActive={setActive}>
        <Link to={"/"}><MenuItem  setActive={setActive} active={active} item="Home"></MenuItem></Link>
        {isLoggedIn && <Link to={"/dashboard"}><MenuItem  setActive={setActive} active={active} item="Dashboard"></MenuItem></Link>}
        <MenuItem setActive={setActive} active={active} item="Plans">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/hobby">Free</HoveredLink>
            <HoveredLink href="/individual">Basic</HoveredLink>
            <HoveredLink href="/team">Silver</HoveredLink>
            <HoveredLink href="/enterprise">Gold</HoveredLink>
          </div>
        </MenuItem>
        <MenuItem
          setActive={setActive}
          active={active}
          item="Affilates"
        ></MenuItem>
        <MenuItem
          setActive={setActive}
          active={active}
          item="Annoucement"
        ></MenuItem>
        <MenuItem
          setActive={setActive}
          active={active}
          item="Contact Us"
        ></MenuItem>
      </Menu>
    </div>
  );
};

export default Navbar;
