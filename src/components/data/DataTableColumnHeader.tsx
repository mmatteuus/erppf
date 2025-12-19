import { Button } from "@/components/ui/button";
import type { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

export function DataTableColumnHeader<TData>({
  column,
  title,
}: {
  column: Column<TData, unknown>;
  title: string;
}) {
  const sort = column.getIsSorted();

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="-ml-2 h-8"
      onClick={() => column.toggleSorting(sort === "asc")}
    >
      <span>{title}</span>
      {sort === "asc" ? (
        <ArrowUp className="ml-2 h-3.5 w-3.5" />
      ) : sort === "desc" ? (
        <ArrowDown className="ml-2 h-3.5 w-3.5" />
      ) : (
        <ArrowUpDown className="ml-2 h-3.5 w-3.5 opacity-50" />
      )}
    </Button>
  );
}

