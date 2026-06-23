"use client";

import { Check, ChevronsUpDown, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface MultiSelectOption {
  id: string;
  label: string;
  sublabel?: string;
  meta?: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  selectedIds: string[];
  onIdsChange: (ids: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function MultiSelect({
  options,
  selectedIds,
  onIdsChange,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  emptyText = "No results found.",
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);

  const selectedItems = options.filter((o) => selectedIds.includes(o.id));

  return (
    <div className="space-y-1.5">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "h-8 w-full justify-between",
              selectedIds.length === 0 && "text-muted-foreground",
            )}
          >
            {selectedIds.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {selectedItems.slice(0, 2).map((item) => (
                  <Badge
                    key={item.id}
                    variant="secondary"
                    className="gap-1 rounded-sm px-1 py-0 text-xs"
                  >
                    <span className="inline-flex size-3.5 items-center justify-center rounded-[2px] bg-muted-foreground/20 text-[9px] font-semibold">
                      {getInitials(item.label)}
                    </span>
                    {item.label}
                  </Badge>
                ))}
                {selectedIds.length > 2 && (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1.5 py-0 text-xs"
                  >
                    +{selectedIds.length - 2}
                  </Badge>
                )}
              </div>
            ) : (
              placeholder
            )}
            <ChevronsUpDown className="ml-auto size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = selectedIds.includes(option.id);
                  return (
                    <CommandItem
                      key={option.id}
                      value={option.label}
                      onSelect={() => {
                        if (isSelected) {
                          onIdsChange(
                            selectedIds.filter((id) => id !== option.id),
                          );
                        } else {
                          onIdsChange([...selectedIds, option.id]);
                        }
                      }}
                    >
                      <div
                        className={cn(
                          "mr-2 flex size-4 items-center justify-center rounded-sm border",
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted-foreground/30",
                        )}
                      >
                        {isSelected && <Check className="size-3" />}
                      </div>
                      <span className="inline-flex size-5 items-center justify-center rounded-[3px] bg-muted text-[10px] font-semibold text-muted-foreground">
                        {getInitials(option.label)}
                      </span>
                      <div className="flex flex-col">
                        <span>{option.label}</span>
                        {option.sublabel && (
                          <span className="text-xs text-muted-foreground">
                            {option.sublabel}
                          </span>
                        )}
                      </div>
                      {option.meta && (
                        <span className="ml-auto text-xs text-muted-foreground">
                          {option.meta}
                        </span>
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {selectedItems.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedItems.map((item) => (
            <Badge
              key={item.id}
              variant="secondary"
              className="gap-1 rounded-sm pr-1"
            >
              <span className="inline-flex size-3.5 items-center justify-center rounded-[2px] bg-muted-foreground/20 text-[9px] font-semibold">
                {getInitials(item.label)}
              </span>
              {item.label}
              <button
                type="button"
                className="ml-0.5 rounded-full p-[1px] outline-hidden hover:bg-muted-foreground/20"
                onClick={() =>
                  onIdsChange(selectedIds.filter((id) => id !== item.id))
                }
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
