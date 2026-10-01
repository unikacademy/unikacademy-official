"use client";

import { MoreHorizontalIcon, PlusIcon, RotateCwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface PageMenuItem {
  label: string;
  onSelect: () => void;
  destructive?: boolean;
}

/**
 * ERPNext-style page header: bold title on the left; refresh, "⋯" menu and a
 * primary "+ Add …" button on the right. Any extra controls go in `children`.
 */
export function PageHeader({
  title,
  onRefresh,
  refreshing = false,
  menu,
  primaryAction,
  children,
}: {
  title: string;
  onRefresh?: () => void;
  refreshing?: boolean;
  menu?: PageMenuItem[];
  primaryAction?: { label: string; onClick: () => void };
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-xl font-semibold tracking-tight text-gray-900">
        {title}
      </h1>
      <div className="flex items-center gap-2">
        {children}
        {onRefresh && (
          <Button
            variant="outline"
            size="icon-sm"
            onClick={onRefresh}
            disabled={refreshing}
            aria-label="Refresh"
            title="Refresh"
          >
            <RotateCwIcon className={cn(refreshing && "animate-spin")} />
          </Button>
        )}
        {menu && menu.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  size="icon-sm"
                  aria-label="More actions"
                />
              }
            >
              <MoreHorizontalIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {menu.map((item) => (
                <DropdownMenuItem
                  key={item.label}
                  variant={item.destructive ? "destructive" : "default"}
                  onClick={item.onSelect}
                >
                  {item.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {primaryAction && (
          <Button size="sm" onClick={primaryAction.onClick}>
            <PlusIcon />
            {primaryAction.label}
          </Button>
        )}
      </div>
    </div>
  );
}
