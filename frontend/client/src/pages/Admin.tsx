import Orders from "@/components/Admin/Orders/Orders";
import ServerAdminView from "@/components/Admin/Servers/ServerAdminView";
import User from "@/components/Admin/User";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import { useEffect, useState } from "react";
import { Audio } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<any>(true);
  const [defaultPanel, setDefaultPanel] = useState<any>("users");
  const getUserData = async () => {
    try {
      const userRes = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/get-user`,
        {
          withCredentials: true,
        }
      );
      //console.log('User Sidebar ',userRes.data.data)
      return userRes.data.data.isAdmin;
    } catch (error) {}
  };
  useEffect(() => {
    (async () => {
      const isAdmin = await getUserData();
      // console.log(isAdmin)
      setLoading(false);
      if (!isAdmin) {
        navigate("/dashboard");
      }
    })();
  }, []);
  if (loading) {
    return (
      <div className="w-full flex items-center space-x-4">
        <Audio />
      </div>
    );
  } else
    return (
      <div className="w-full">
        <div className="flex flex-row items-center justify-between  lg:mx-3  lg:mt-4 mx-1 ">
          <div className="lg:text-lg font-bold flex flex-col gap-1">
            Admin Panel
            <div className="text-md text-gray-500">
              This is the Admin panel.
            </div>
          </div>
        </div>
        <div className="mt-4 p-2 mr-2 lg:mt-8 w-full">
          <Tabs defaultValue={defaultPanel} className="w-full">
            <TabsList>
              <TabsTrigger
                onClick={() => {
                  setDefaultPanel("users");
                }}
                value="users"
              >
                Users
              </TabsTrigger>
              <TabsTrigger
                onClick={() => {
                  setDefaultPanel("servers");
                }}
                value="servers"
              >
                Servers
              </TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="password">Blogs</TabsTrigger>
              <TabsTrigger value="password">Annoucements</TabsTrigger>
              <TabsTrigger value="password">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="users">
              <User />
            </TabsContent>
            <TabsContent value="servers">
              <ServerAdminView />
            </TabsContent>
            <TabsContent value="orders">
              <Orders />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
};

export default Admin;
