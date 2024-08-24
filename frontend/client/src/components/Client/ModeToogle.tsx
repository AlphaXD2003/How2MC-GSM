import { Moon, Sun } from "lucide-react";


import { useTheme } from "@/components/theme-provider";

export function ModeToggle({ expanded }: { expanded: boolean }) {
  const { setTheme, theme } = useTheme();

  return (


    <div className="flex flex-row  gap-3 items-center cursor-pointer hover:shadow-lg px-3 py-2 hover:bg-[var(--semi-dark2)] hover:rounded-lg">
      {theme === "light" ? (
        <div className="flex flex-row gap-3 items-center" onClick={() => setTheme("dark")}>
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          {
            expanded && <div className=""> Theme</div>
          }
        </div>
      ) : (
        <div className="flex flex-row gap-3 items-center" onClick={() => setTheme("light")}>
          <Moon className="h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          {
            expanded && <div className="fadeIn"> Theme</div> 
          }
        </div>
      )}
    </div>
  );
}
