import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "../ui/checkbox"
import { Button } from "../ui/button"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { useNavigate } from "react-router-dom"
import { toast } from "../ui/use-toast"

export type User = {
    id: string
    username: string
    email: string
    ip : string
    isAdmin: boolean
    pteroId: number
    coins : number
    firstName: string
    lastName: string
  
}

export const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'select',
      header: ({table} ) => (
        <Checkbox
          checked = {
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!value)}
        />
      ),
      enableSorting: false,
      enableHiding: false,
      cell: (({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      )
      ),
    },
    {
        accessorKey: 'id',
        header: 'ID',
        enableSorting: false,
        enableHiding: false,
        cell: (({ row }) => (
          <div className="lowercase">{row.getValue("id")}</div>
        )
        ),
      },

   {
      accessorKey: 'username',
      header: 'Username',
      enableSorting: false,
      cell: (info) => {
        return info.getValue()
      },
    },
     {
      accessorKey: 'email',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,

    },
     {
      accessorKey: 'ip',
      header: 'IP',
      enableSorting: false,
      cell: (info) => {
        return info.getValue()
      },
    },
      {
        accessorKey: 'isAdmin',
        header: 'Is Admin',
        enableSorting: false,
        cell: (info) => {
          return info.getValue() 
        },
      },
       {
         accessorKey: 'pteroId',
         header: 'Ptero ID',
         enableSorting: false,
         cell: (info) => {
           return info.getValue()
         },
       },
        {
          accessorKey: 'coins',
          header: 'Coins',
          enableSorting: false,
          cell: (info) => {
            return info.getValue()
          },
        },
         {
           accessorKey: 'firstName',
           header: 'First Name',
           enableSorting: false,
           cell: (info) => {
             return info.getValue()
           },
         },
          {
            accessorKey: 'lastName',
            header: 'Last Name',
            enableSorting: false,
            cell: (info) => {
              return info.getValue()
            },
          },
          {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
              const user = row.original
              const navigate = useNavigate()
              return (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                    className="cursor-pointer"
                      onClick={() => {
                        navigator.clipboard.writeText(user.id)
                        toast({
                          title: "Copied to clipboard",
                          
                        })
                      }}
                    >
                      Copy user ID
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                    className="cursor-pointer"
                      onClick={() => navigate(`/dashboard/admin/open-user/${user.id}`)}
                    >View customer</DropdownMenuItem>
                   
                  </DropdownMenuContent>
                </DropdownMenu>
              )
            },
          },
          
]   