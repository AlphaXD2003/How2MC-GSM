

import  Layout  from "@/layout/Layout"
import Home from "@/pages/Home"
import SignUp from "@/components/SignUp"
import SignIn from "@/components/SignIn"
import Dashboard from "@/pages/Dashboard"
import DashboardLayout from "@/layout/Dashboard Client Layout /Layout"
import AddEditServer from "@/components/Client/AddEditServer"
import Shop from "@/pages/Shop"
import ServerPage from "@/pages/ServerPage"

import Products from "@/pages/Products"

import ProductDetails from "@/components/Client/ProductDetails"
import Admin from "@/pages/Admin"
import OpenUser from "@/components/Admin/OpenUser"
import ServerEdit from "@/components/Admin/Servers/ServerEdit"
import ServerDetails from "@/components/ServerDetails"
export interface Route{
    path: string
    element: React.ReactNode,
    children?: Route[]
}

export const mainRouter: Route[] = [
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                path: '',
                element: <Home />
            },
            {
                path: '/sign-up',
                element: <SignUp />
            },
            {
                path: '/sign-in',
                element: <SignIn />
            },
            
        ]
    },
    {
        path: '/dashboard',
        element: <DashboardLayout />,
        children: [
            {
                path: '',
                element: <Dashboard />
            },
            {
                path: 'add-server',
                element: <AddEditServer formType="add" />
            },
            {
                path: 'edit-server/:id',
                element: <AddEditServer formType="edit" />
            },
            {
                path: 'servers',
                element: <ServerPage />
            },
            {
                path: 'servers/:id',
                element: <ServerDetails />
            },
            {
                path: 'shop',
                element: <Products />
            },
            {
                path: 'shop/:id',
                element: <ProductDetails />
            },
            {
                path: 'admin',
                element: <Admin />
            },
            {
                path: 'admin/open-user/:id',
                element: <OpenUser />
            },
            {
                path: 'admin/servers/:id/edit',
                element: <ServerEdit />
            }
            
        ]
    },
    
]