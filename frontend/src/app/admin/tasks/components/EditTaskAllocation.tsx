"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building2Icon,
  CalendarIcon,
  CheckIcon,
  FileIcon,
  PencilIcon,
  Trash2Icon,
  UserIcon,
  XIcon,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { MultiSelect } from "@/components/shared/ui/MultiSelect";
import { SectionCard } from "@/components/shared/ui/SectionCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const repeatedOptions = [
  { value: "1-day", label: "1 Day" },
  { value: "1-week", label: "1 Week" },
  { value: "1-month", label: "1 Month" },
] as const;

const priorityOptions = [
  { value: "Low", label: "Low", color: "bg-slate-400" },
  { value: "Medium", label: "Medium", color: "bg-amber-400" },
  { value: "High", label: "High", color: "bg-orange-400" },
  { value: "Urgent", label: "Urgent", color: "bg-red-400" },
] as const;

const editTaskSchema = z
  .object({
    taskTitle: z.string().min(1, "Task title is required"),
    repeatedSetting: z.string().optional(),
    assignType: z.enum(["teams", "staffs", "self"]),
    priority: z.string().min(1, "Priority is required"),
    selectedTeamIds: z.array(z.string()).optional(),
    selectedStaffIds: z.array(z.string()).optional(),
    dueDate: z.string().min(1, "Due date is required"),
    description: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.assignType === "teams") {
      if (!data.selectedTeamIds || data.selectedTeamIds.length === 0) {
        ctx.addIssue({
          path: ["selectedTeamIds"],
          code: z.ZodIssueCode.custom,
          message: "At least one team must be selected",
        });
      }
    }
    if (data.assignType === "staffs") {
      if (!data.selectedStaffIds || data.selectedStaffIds.length === 0) {
        ctx.addIssue({
          path: ["selectedStaffIds"],
          code: z.ZodIssueCode.custom,
          message: "At least one staff must be selected",
        });
      }
    }
  });

type EditTaskFormData = z.infer<typeof editTaskSchema>;

interface Team {
  id: string;
  name: string;
}

interface Staff {
  id: string;
  name: string;
}

export interface EditableTask {
  id: string;
  taskNumber: string;
  taskTitle: string;
  description: string;
  assignType: "teams" | "staffs" | "self";
  assignedTeams: string[];
  assignedStaffs: string[];
  priority: string;
  status: string;
  dueDate: string;
  repeatedSetting: string | null;
  fileCount: number;
  delegatedBy: string | null;
  delegatedStatus: string | null;
  postponedBy: string | null;
  postponedDate: string | null;
}

interface EditTaskAllocationProps {
  children: React.ReactNode;
  task: EditableTask;
  teams?: Team[];
  staffs?: Staff[];
  onSubmit?: (data: EditTaskFormData & { files: File[] }) => void;
}

function formatFileSize(bytes: number) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
}

export function EditTaskAllocation({
  children,
  task,
  teams = [],
  staffs = [],
  onSubmit,
}: EditTaskAllocationProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const form = useForm<EditTaskFormData>({
    resolver: zodResolver(editTaskSchema),
    defaultValues: {
      taskTitle: task.taskTitle,
      repeatedSetting: task.repeatedSetting ?? undefined,
      assignType: task.assignType,
      priority: task.priority,
      selectedTeamIds: task.assignedTeams,
      selectedStaffIds: task.assignedStaffs,
      dueDate: task.dueDate,
      description: task.description,
    },
  });

  const assignType = form.watch("assignType");
  const selectedTeamIds = form.watch("selectedTeamIds") || [];
  const selectedStaffIds = form.watch("selectedStaffIds") || [];

  const resetForm = useCallback(() => {
    form.reset({
      taskTitle: task.taskTitle,
      repeatedSetting: task.repeatedSetting ?? undefined,
      assignType: task.assignType,
      priority: task.priority,
      selectedTeamIds: task.assignedTeams,
      selectedStaffIds: task.assignedStaffs,
      dueDate: task.dueDate,
      description: task.description,
    });
    setUploadedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [form, task]);

  const handleFormSubmit = (data: EditTaskFormData) => {
    onSubmit?.({ ...data, files: uploadedFiles });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const MAX_SIZE = 10 * 1024 * 1024;
    const valid: File[] = [];
    const rejected: string[] = [];
    for (const file of files) {
      if (file.size > MAX_SIZE) {
        rejected.push(file.name);
      } else {
        valid.push(file);
      }
    }
    if (rejected.length > 0) {
      window.alert(
        `The following files exceed the 10MB limit and were not uploaded:\n${rejected.join("\n")}`,
      );
    }
    setUploadedFiles((prev) => [...prev, ...valid]);
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (!nextOpen) {
        timeoutRef.current = setTimeout(() => resetForm(), 200);
      }
    },
    [resetForm],
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  return (
    <Dialog onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="!w-[95vw] !max-w-2xl max-h-[90vh] !flex !flex-col gap-0 p-0 overflow-hidden rounded-xl"
        showCloseButton={false}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="shrink-0 px-6 pt-6 pb-5 border-b border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                <PencilIcon className="size-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold text-foreground">
                  Edit Task
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Update task details for {task.taskNumber}.
                </DialogDescription>
              </div>
            </div>
            <DialogClose asChild>
              <button
                type="button"
                className="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <XIcon className="size-4" />
              </button>
            </DialogClose>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="flex flex-col flex-1 min-h-0 overflow-hidden"
          >
            <div className="flex-1 overflow-y-auto px-6 py-2">
              <div className="py-4 space-y-4">
                <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
                  <p className="text-sm font-medium text-primary">
                    Editing Task {task.taskNumber}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Modify the task fields below.
                  </p>
                </div>

                <SectionCard icon={FileIcon} title="Task Information">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="taskTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-medium text-muted-foreground">
                              Task Title *
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter task title"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="repeatedSetting"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-medium text-muted-foreground">
                              Repeated Setting{" "}
                              <span className="text-muted-foreground/50">
                                (optional)
                              </span>
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select repetition" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {repeatedOptions.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium text-muted-foreground">
                            Description
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe the task..."
                              className="resize-none"
                              rows={3}
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </SectionCard>

                <SectionCard icon={UserIcon} title="Assignee Details">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: "teams", label: "Teams", icon: Building2Icon },
                        { value: "staffs", label: "Staffs", icon: UserIcon },
                        { value: "self", label: "Self", icon: CheckIcon },
                      ].map(({ value, label, icon: Icon }) => (
                        <div key={value}>
                          <Button
                            type="button"
                            variant={
                              assignType === value ? "default" : "outline"
                            }
                            className={cn(
                              "w-full justify-start gap-2 h-9 text-sm",
                              assignType === value &&
                                "bg-primary text-primary-foreground",
                            )}
                            onClick={() =>
                              form.setValue(
                                "assignType",
                                value as "teams" | "staffs" | "self",
                              )
                            }
                          >
                            <Icon className="size-4" />
                            {label}
                          </Button>
                        </div>
                      ))}
                    </div>

                    {assignType === "teams" && (
                      <div className="animate-in fade-in slide-in-from-top-2">
                        <FormField
                          control={form.control}
                          name="selectedTeamIds"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-medium text-muted-foreground">
                                Select Teams *
                              </FormLabel>
                              <FormControl>
                                <MultiSelect
                                  options={teams.map((t) => ({
                                    id: t.id,
                                    label: t.name,
                                  }))}
                                  selectedIds={selectedTeamIds}
                                  onIdsChange={field.onChange}
                                  placeholder="Select teams..."
                                  searchPlaceholder="Search teams..."
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {assignType === "staffs" && (
                      <div className="animate-in fade-in slide-in-from-top-2">
                        <FormField
                          control={form.control}
                          name="selectedStaffIds"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-medium text-muted-foreground">
                                Select Staffs *
                              </FormLabel>
                              <FormControl>
                                <MultiSelect
                                  options={staffs.map((s) => ({
                                    id: s.id,
                                    label: s.name,
                                  }))}
                                  selectedIds={selectedStaffIds}
                                  onIdsChange={field.onChange}
                                  placeholder="Select staffs..."
                                  searchPlaceholder="Search staffs..."
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {assignType === "self" && (
                      <div className="flex items-center gap-2 p-3 rounded-md bg-green-50 border border-green-200 text-green-700 text-sm">
                        <CheckIcon className="size-4 shrink-0" />
                        Task will be self-assigned to you
                      </div>
                    )}
                  </div>
                </SectionCard>

                <SectionCard icon={CalendarIcon} title="Deadline & Priority">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="dueDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium text-muted-foreground">
                            Due Date *
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input type="date" {...field} className="pr-10" />
                              <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium text-muted-foreground">
                            Priority *
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {priorityOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  <div className="flex items-center gap-2">
                                    <div
                                      className={cn(
                                        "size-2 rounded-full",
                                        option.color,
                                      )}
                                    />
                                    {option.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </SectionCard>

                <SectionCard icon={FileIcon} title="Attachments">
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="file-upload"
                        className="text-xs font-medium text-muted-foreground block mb-1.5"
                      >
                        Upload Files
                      </label>
                      <Input
                        id="file-upload"
                        ref={fileInputRef}
                        type="file"
                        multiple
                        className="cursor-pointer"
                        onChange={handleFileChange}
                      />
                      <p className="text-[11px] text-muted-foreground mt-1">
                        Maximum 10MB per file. Any file type allowed.
                      </p>
                    </div>

                    {uploadedFiles.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-border">
                        <p className="text-xs font-medium text-muted-foreground">
                          Uploaded Files ({uploadedFiles.length})
                        </p>
                        <div className="space-y-1.5">
                          {uploadedFiles.map((file, index) => (
                            <div
                              key={`${file.name}-${file.size}-${index}`}
                              className="flex items-center justify-between bg-muted/50 rounded-md px-3 py-2 text-sm"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <FileIcon className="size-4 shrink-0 text-muted-foreground" />
                                <span className="truncate max-w-[200px] md:max-w-[300px]">
                                  {file.name}
                                </span>
                                <span className="text-muted-foreground text-xs shrink-0">
                                  ({formatFileSize(file.size)})
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveFile(index)}
                                className="shrink-0 text-muted-foreground hover:text-destructive transition-colors"
                              >
                                <Trash2Icon className="size-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </SectionCard>
              </div>
            </div>

            <div className="shrink-0 flex items-center justify-end px-6 py-4 border-t border-border bg-muted/20 gap-2">
              <DialogClose asChild>
                <Button type="button" variant="ghost" size="sm">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" size="sm" className="gap-1.5">
                <PencilIcon className="size-4" />
                Update Task
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
