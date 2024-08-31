import { ModeToggle } from "@/components/Client/ModeToogle";
import { Menu, LogOut, AppWindowMacIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Server,
  Newspaper,
  Store,
  PanelBottomClose,
  Settings,
} from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setIsLoggedIn, setUserData } from "@/slice/userSlice";

const Menus = [
  {
    name: "Dashboard",
    path: "/dashboard",
    component: <LayoutDashboard />,
  },
  {
    name: "Servers",
    path: "/dashboard/servers",
    component: <Server />,
  },
  {
    name: "Blogs",
    path: "/blogs",
    component: <Newspaper />,
  },
  {
    name: "Shop",
    path: "/dashboard/shop",
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
  {
    name: "Admin",
    path: "/dashboard/admin",
    component: <AppWindowMacIcon />,
  },
];
const Sidebar = () => {
  const [active, setActive] = useState<string | null>("Dashboard");
  const [expanded, setExpanded] = useState(true);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isAdmin, setIsAdmin] = useState<any>(false);
  const getUserData = async () => {
    try {
      const userRes = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/get-user`,
        {
          withCredentials: true,
        }
      );
      //console.log('User Sidebar ',userRes.data.data)
      setIsAdmin(userRes.data.data.isAdmin);
    } catch (error) {}
  };
  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      localStorage.removeItem("token");
      dispatch(setUserData(null));
      dispatch(setIsLoggedIn(false));
      navigate("/");
    } catch (error) {}
  };
  useEffect(() => {
    (async () => {
      await getUserData();
    })();
  }, []);

  return (
    <div
      className={`sidebar ${
        expanded ? "expanded" : "collapsed"
      }  lg:flex lg:flex-col hidden bg-[var(--quinary-color)] h-screen `}
    >
      <div
        onClick={() => setExpanded(!expanded)}
        className="mt-12 ml-5 cursor-pointer text-lg flex flex-row gap-3 "
      >
        <div>
          <Menu />
        </div>
        {!expanded ? null : <div className="fadeIn"> How2GSM </div>}
      </div>
      {/* UL and LI  */}
      <div className="flex-1 mt-10 mr-2  ">
        <ul className="flex flex-col gap-3 mt-auto">
          {Menus.map((menu, index) => (
            <li
              onClick={() => setActive(menu.name)}
              key={index}
              className={`fadeIn hover:shadow-lg px-3 py-2  hover:bg-[var(--semi-dark2)] hover:rounded-lg flex flex-row gap-2 items-center ml-2 mb-1 cursor-pointer ${
                active === menu.name
                  ? "bg-[var(--semi-dark2)] rounded-lg text-white"
                  : ""
              }`}
            >
              <div
                hidden={menu.name === "Admin" ? !isAdmin : false}
                className="text-md"
              >
                <Link
                  className="flex flex-row gap-3 items-center"
                  to={menu.path}
                >
                  {menu.component}
                  {expanded && menu.name}
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom  */}
      <div className="flex flex-col gap-3 mt-auto mr-6 justify-center">
        <div
          onClick={handleLogout}
          className={`${
            expanded ? "border border-gray-600 bg-[var(--semi-dark2)] " : null
          } rounded-lg shadow-lg px-3 font-bold  py-2 dark:text-red-600  flex flex-row gap-3 items-center ml-2 mb-3 cursor-pointer`}
        >
          <div className="text-xl">
            <LogOut />
          </div>
          {expanded && <div className="fadeIn"> Logout</div>}
        </div>

        <div className="ml-2 mb-5">
          <ModeToggle expanded={expanded} />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
