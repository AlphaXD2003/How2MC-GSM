import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  AlignJustify,
  LayoutDashboard,
  Server,
  Newspaper,
  Store,
  PanelBottomClose,
  Settings,
  LogOut,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ModeToggle } from "./ModeToogle";


const Menus = [
  {
    name: "Dashboard",
    path: "/dashboard",
    component: <LayoutDashboard />,
  },
  {
    name: "Servers",
    path: "/servers",
    component: <Server />,
  },
  {
    name: "Blogs",
    path: "/blogs",
    component: <Newspaper />,
  },
  {
    name: "Shop",
    path: "/shop",
    component: <Store />,
  },
  {
    name: "Panel",
    path: "/panel",
    component: <PanelBottomClose />,
  },
  {
    name: "Settings",
    path: "/settings",
    component: <Settings />,
  },
];

const SmallSidebar = () => {
  return (
    <div className="mt-4">
      <Sheet>
        <SheetTrigger asChild>
          <div className="flex items-center gap-3">
            <AlignJustify className="block lg:hidden" />
            How2MC GSM
          </div>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>How2MC GSM</SheetTitle>
            <SheetDescription>
              <p className="  text-[var(--primary-color)] dark:text-[var(--secondary-color)]">
                How2MC GSM is a Game Server Management System that allows you to
                manage your game servers easily.
              </p>
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col  min-h-[70%]">
          <div className="mt-6 flex-1">
            {Menus.map((item, index) => (
              <Link to={item.path} key={index}>
                <div className="flex items-center justify-between py-3  hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <div className="flex items-center">
                    {item.component}
                    <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                      {item.name}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          </div>
          <SheetFooter >
            <div className="flex flex-col gap-3 mt-16 mr-auto">
            <div className="flex flex-row gap-3 items-center">
              <ModeToggle expanded={true} />
              {/* <div className="font-bold">Choose Theme Here</div> */}
            </div>
            <div className="flex p-3 cursor-pointer hover:text-red-500 flex-row gap-3 items-center ]">
              <LogOut  />
              <div className="font-bold">Logout</div>
            </div>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default SmallSidebar;
