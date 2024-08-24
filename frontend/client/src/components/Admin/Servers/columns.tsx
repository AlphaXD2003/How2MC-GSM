import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "../../ui/checkbox"
export type UserPaymentTableColumn = {
    id: string
    amount: number
    status: string
    startingDate: string
    endingDate: string
}
import { Button } from "../../ui/button"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import axios from "axios"
import { table } from "console"

export type Server = {
    id: string
    name: string
    description: string
    pteroId: string
    pteroUserId: number
    cost : number
    dateCreated: string
}

export const columns: ColumnDef<Server>[] = [
    {
        accessorKey: 'select',
        header: ({table} ) => {
          const [selectAll, setSelectAll] = useState(false)
          return <Checkbox
          
            checked = {
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!value)}
          />
          },
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
        cell: ({ row }) => {
          const navigate = useNavigate()
            return (
                <div 
                onClick={() => {
                  navigate(`/dashboard/servers/${row.getValue('pteroId')}`)
                }}
                className="flex items-center space-x-2">
                    <div className="text-sm font-medium">{row.getValue('id')}</div>
                </div>
            )
        },
    },

{
    accessorKey: 'name',
    header: 'Name',
    enableSorting: false,
    cell: (info) => {
      return info.getValue()
    },
},
{
    accessorKey: 'description',
    header: 'Description',
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
    accessorKey: 'pteroUserId',
    header: 'Ptero User ID',
        enableSorting: false,
    cell: (info) => {
      return info.getValue()
    },
},
{
    accessorKey: 'cost',
    header: 'Cost',
        enableSorting: false,
    cell: (info) => {
      return info.getValue()
    },
},
{
    accessorKey: 'dateCreated',
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Creation Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
  
      cell: ({ row }) => <div className="lowercase">{row.getValue("dateCreated")}</div>,
},
{
  id: "actions",
  enableHiding: false,
  cell: ({ row }) => {
    const server = row.original
    const navigate = useNavigate()
    const deleteServer = async (id: string) => {
      try {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/servers/delete-by-id`,{
          id
        },
      {
  
      })
      toast({
        title: "Server deleted",
        description: "Server has been deleted",
        duration: 5000,
        
      })
     setTimeout(() => {
       navigate(`/dashboard/admin`)
     }, 2000)
      
      } catch (error) {
        
      }
    }
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
              navigator.clipboard.writeText(server.id)
              toast({
                title: "Copied to clipboard",
                
              })
            }}
          >
            Copy server ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
          className="cursor-pointer"
            onClick={() => navigate(`/dashboard/servers/${server.pteroId}`)}
          >View Server</DropdownMenuItem>
        
          <DropdownMenuItem
          className="cursor-pointer"
            onClick={async () => await deleteServer(server.pteroId)}
          >Delete Server</DropdownMenuItem>
          <DropdownMenuItem
          className="cursor-pointer"
            onClick={() => {
              navigate(`/dashboard/admin/servers/${server.pteroId}/edit`)
            }}
          >Edit Server</DropdownMenuItem>
         
        </DropdownMenuContent>
      </DropdownMenu>
    )
  },
},
]