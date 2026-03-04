import * as React from "react";

export function Table({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="overflow-hidden rounded-2xl border border-black/5 bg-background shadow-sm">
      <table
        className={`w-full border-separate border-spacing-0 text-left text-xs ${className}`}
        {...props}
      />
    </div>
  );
}

export function TableHeader(
  props: React.HTMLAttributes<HTMLTableSectionElement>,
) {
  return <thead className="bg-muted/60 text-[11px] uppercase tracking-wide text-foreground/60" {...props} />;
}

export function TableBody(
  props: React.HTMLAttributes<HTMLTableSectionElement>,
) {
  return <tbody {...props} />;
}

export function TableRow(
  props: React.HTMLAttributes<HTMLTableRowElement>,
) {
  return (
    <tr
      className="border-b border-black/5 last:border-0 hover:bg-muted/40"
      {...props}
    />
  );
}

export function TableHead(
  props: React.ThHTMLAttributes<HTMLTableCellElement>,
) {
  return (
    <th className="px-4 py-3 font-medium first:rounded-tl-2xl last:rounded-tr-2xl" {...props} />
  );
}

export function TableCell(
  props: React.TdHTMLAttributes<HTMLTableCellElement>,
) {
  return <td className="px-4 py-3 align-middle text-xs" {...props} />;
}

