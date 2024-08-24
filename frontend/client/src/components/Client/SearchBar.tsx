import { Input } from "@/components/ui/input"

export function Search() {
  return (
    <div className=" rounded-lg">
      <Input
        textBoxColor="bg-[var(--quinary-color)]"
        type="search"
        placeholder="Search..."
        className="sm:w-[200px] md:w-[300px] dark:bg-[var(--quinary-color)]"
      />
    </div>
  )
}