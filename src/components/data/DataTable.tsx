import { useIsMobile } from "@/hooks/use-mobile";
import { usePreferencesStore } from "@/store/preferences";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type ColumnDef,
  type ColumnFiltersState,
  type Column,
  type SortingState,
  type Table as TanstackTable,
  type VisibilityState,
  useReactTable,
} from "@tanstack/react-table";
import { isValidElement, useMemo, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, Columns3, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type DataTableRowAction<TData> = {
  label: string;
  onSelect: (row: TData) => void;
  destructive?: boolean;
};

export type DataTableProps<TData> = {
  data: TData[];
  columns: ColumnDef<TData, unknown>[];
  getRowId?: (row: TData, index: number) => string;
  loading?: boolean;
  globalFilterPlaceholder?: string;
  mobileCard?: (row: TData) => ReactNode;
  onRowClick?: (row: TData) => void;
};

function humanizeColumnId(columnId: string) {
  const spaced = columnId
    .replace(/[_-]+/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .trim();

  if (!spaced) return "Coluna";
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function extractTextFromReactNode(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractTextFromReactNode).join("");
  if (isValidElement(node)) return extractTextFromReactNode(node.props.children);
  return "";
}

function getColumnLabel<TData>(
  column: Column<TData, unknown>,
  renderedHeaderLabel?: string,
) {
  const meta = column.columnDef.meta as { label?: unknown } | undefined;
  const metaLabel = meta?.label;
  if (typeof metaLabel === "string" && metaLabel.trim()) return metaLabel;

  if (typeof renderedHeaderLabel === "string" && renderedHeaderLabel.trim()) {
    return renderedHeaderLabel.trim();
  }

  const header = column.columnDef.header;
  if (typeof header === "string" && header.trim()) return header;

  return humanizeColumnId(column.id);
}

export function DataTable<TData>({
  data,
  columns,
  getRowId,
  loading,
  globalFilterPlaceholder = "Buscar…",
  mobileCard,
  onRowClick,
}: DataTableProps<TData>) {
  const isMobile = useIsMobile();
  const { tableDensity } = usePreferencesStore();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  const selectionColumn = useMemo<ColumnDef<TData, unknown>>(
    () => ({
      id: "__select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected()
              ? true
              : table.getIsSomePageRowsSelected()
                ? "indeterminate"
                : false
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Selecionar todos"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Selecionar linha"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 42,
      meta: { headerClassName: "w-10" },
    }),
    [],
  );

  const table = useReactTable({
    data,
    columns: [selectionColumn, ...columns],
    getRowId,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    enableRowSelection: true,
    globalFilterFn: "includesString",
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const renderedHeaderLabelById = new Map<string, string>();
  for (const header of table.getFlatHeaders()) {
    if (header.isPlaceholder) continue;
    const rendered = flexRender(header.column.columnDef.header, header.getContext());
    const text = extractTextFromReactNode(rendered).replace(/\s+/g, " ").trim();
    if (text) renderedHeaderLabelById.set(header.column.id, text);
  }

  const selectedCount = table.getFilteredSelectedRowModel().rows.length;
  const filterableColumns = table
    .getAllLeafColumns()
    .filter((c) => c.getCanFilter() && c.id !== "__select");

  if (isMobile && mobileCard) {
    const rows = table.getRowModel().rows;
    return (
      <div className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Input
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder={globalFilterPlaceholder}
              className="max-w-sm"
            />
            {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          </div>

          <div className="flex items-center gap-2">
            <ColumnsMenu table={table} labelById={renderedHeaderLabelById} />
            {selectedCount > 0 && (
              <span className="text-sm text-muted-foreground">
                {selectedCount} selecionado(s)
              </span>
            )}
          </div>
        </div>

        {filterableColumns.length > 0 && (
          <div className="grid gap-2 sm:grid-cols-2">
            {filterableColumns.map((column) => (
              <ColumnFilter
                key={column.id}
                column={column}
                label={getColumnLabel(column, renderedHeaderLabelById.get(column.id))}
              />
            ))}
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <div className="rounded-lg border bg-card p-8 text-center text-sm text-muted-foreground">
            Nenhum resultado encontrado.
          </div>
        ) : (
          <div className="space-y-3">
            {rows.map((row) => (
              <div key={row.id} className="rounded-lg border bg-card p-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Selecionar"
                    className="mt-1"
                  />
                  <div className="min-w-0 flex-1">{mobileCard(row.original)}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <PaginationControls table={table} />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Input
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder={globalFilterPlaceholder}
            className="max-w-sm"
          />
          {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        </div>

        <div className="flex items-center gap-2">
          <ColumnsMenu table={table} labelById={renderedHeaderLabelById} />
          {selectedCount > 0 && (
            <span className="text-sm text-muted-foreground">
              {selectedCount} selecionado(s)
            </span>
          )}
        </div>
      </div>

      {filterableColumns.length > 0 && (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {filterableColumns.map((column) => (
            <ColumnFilter
              key={column.id}
              column={column}
              label={getColumnLabel(column, renderedHeaderLabelById.get(column.id))}
            />
          ))}
        </div>
      )}

      <div className="rounded-md border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={
                      // @ts-expect-error meta typing
                      header.column.columnDef.meta?.headerClassName
                    }
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i}>
                  {table.getAllLeafColumns().map((col) => (
                    <TableCell key={col.id}>
                      <Skeleton
                        className={col.id === "__select" ? "h-4 w-4" : "h-4 w-full"}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                  className={onRowClick ? "cursor-pointer" : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={tableDensity === "compact" ? "py-2" : undefined}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={table.getAllLeafColumns().length} className="h-24 text-center">
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <PaginationControls table={table} />
    </div>
  );
}

function ColumnsMenu<TData>({
  table,
  labelById,
}: {
  table: TanstackTable<TData>;
  labelById: ReadonlyMap<string, string>;
}) {
  const hideableColumns = table
    .getAllLeafColumns()
    .filter((c) => c.getCanHide() && c.id !== "__select");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Columns3 className="h-4 w-4" />
          Colunas
          <ChevronDown className="h-3 w-3 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Visibilidade</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {hideableColumns.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.id}
            checked={column.getIsVisible()}
            onCheckedChange={(value) => column.toggleVisibility(!!value)}
          >
            {getColumnLabel(column, labelById.get(column.id))}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function PaginationControls<TData>({ table }: { table: TanstackTable<TData> }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="text-sm text-muted-foreground">
        Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Próxima
        </Button>
      </div>
    </div>
  );
}

function ColumnFilter<TData>({
  column,
  label,
}: {
  column: Column<TData, unknown>;
  label: string;
}) {
  const meta = column.columnDef.meta as
    | {
        label?: string;
        filterVariant?: "text" | "select";
        options?: { label: string; value: string }[];
        placeholder?: string;
      }
    | undefined;

  const variant = meta?.filterVariant ?? "text";

  if (variant === "select") {
    const value = (column.getFilterValue() as string | undefined) ?? "";
    const options = meta?.options ?? [];
    return (
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <Select
          value={value}
          onValueChange={(v) =>
            column.setFilterValue(v === "__all__" ? undefined : v || undefined)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Todos</SelectItem>
            {options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <Input
        value={(column.getFilterValue() as string) ?? ""}
        onChange={(e) => column.setFilterValue(e.target.value)}
        placeholder={meta?.placeholder ?? "Filtrar…"}
      />
    </div>
  );
}
