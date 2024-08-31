
import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "../../ui/checkbox"
export type OrderTableColumn = {
    id: string
    amount: number
    status: string
    startingDate: string
    endingDate: string
    uid: string
    sid: string
}
import { Button } from "../../ui/button"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { useState } from "react"
export const columns:  ColumnDef<OrderTableColumn>[] = [
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
        header: 'Order ID',
        enableSorting: false,
        enableHiding: false,
        cell: (({ row }) => (
          <div className="lowercase">{row.getValue("id")}</div>
        )
        ),
      },
      {
        accessorKey: 'amount',
        header: 'Price',
        enableSorting: false,
        cell: (info) => {
          return info.getValue()
        },
      },
      {
        accessorKey: 'startingDate',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Starting Date
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }) => <div className="lowercase">{row.getValue("startingDate")}</div>,
  
      },
      {
        accessorKey: 'endingDate',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Ending Date
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }) => <div className="lowercase">{row.getValue("endingDate")}</div>,
  
      },
      {
        accessorKey: 'uid',
        header: 'User ID',
        cell: ({ row }) => <div className="lowercase">{row.getValue("uid")}</div>,
  
      },
      {
        accessorKey: 'sid',
        header: 'Server ID',
        cell: ({ row }) => <div className="lowercase">{row.getValue("sid")}</div>,
  
      },

]