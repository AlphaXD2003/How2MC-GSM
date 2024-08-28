import axios from "axios";
import React, { useEffect, useState } from "react";
// import { DataTable } from './data-table'
import { columns } from "./columns";

import { DataTable } from "./data-table";
interface User {
  id: string;
  username: string;
  email: string;
  ip: string;
  isAdmin: boolean;
  pteroId: number;
  coins: number;
  firstName: string;
  lastName: string;
}

const User = () => {
  const [users, setUsers] = React.useState<User[]>([]);

  const listAllUsers = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/users/get-all-users`,
        {
          withCredentials: true,
        }
      );
      // console.log(response.data.data)
      const dataUser = response.data.data.map((user: any) => {
        return {
          id: user._id,
          username: user.username,
          email: user.email,
          ip: user.IP,
          isAdmin: user.isAdmin ? "true" : "false",
          pteroId: user.pteroId,
          coins: user.coins,
          firstName: user.firstName,
          lastName: user.lastName,
        };
      });
      setUsers(dataUser);
      console.log(dataUser);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const [loading, setLoading] = useState(true);

  // Initialize the table only after users are fetched
  useEffect(() => {
    if (users.length > 0) {
      console.log(users);
    }
  }, [users]);

  useEffect(() => {
    (async () => {
      await listAllUsers();
    })();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!users || users.length === 0) return <div>Loading Table...</div>;
  return (
    <div className="w-full">
      <DataTable data={users} columns={columns} />
    </div>
  );
};

export default User;
