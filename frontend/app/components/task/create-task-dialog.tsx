// Modal dialog and form for creating a new task in a project

import { useCreateTaskMutation } from "@/hooks/use-task";
import { createTaskSchema } from "@/lib/schema";
import type { ProjectMemberRole, User } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { Checkbox } from "../ui/checkbox";

// Props for the CreateTaskDialog component
interface CreateTaskDialogProps {
  open: boolean;
  // Function to open or close dialog
  onOpenChange: (open: boolean) => void;
  projectId: string;
  projectMembers: {
    user: User;
    role: ProjectMemberRole;
  }[];
}

// Type for task form data
export type CreateTaskFormData = z.infer<typeof createTaskSchema>;

// Modal dialog for creating a new task
export const CreateTaskDialog = ({
  open,
  onOpenChange,
  projectId,
  projectMembers,
}: CreateTaskDialogProps) => {
  // Sets up form with validation
  const form = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "To Do",
      priority: "Medium",
      dueDate: "",
      assignees: [],
    },
  });

  // Gets mutation function for creating task
  const { mutate, isPending } = useCreateTaskMutation();

  // Handles form submission
  const onSubmit = (values: CreateTaskFormData) => {
    mutate(
      {
        projectId,
        taskData: values,
      },
      {
        onSuccess: () => {
          toast.success("Task created successfully");
          form.reset();
          onOpenChange(false);
        },
        onError: (error: any) => {
          const errorMessage = error.response.data.message;
          toast.error(errorMessage);
          console.log(error);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
        </DialogHeader>

        {/* Task creation form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                {/* Task title field */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter task title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Task description field */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter task description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Status and Priority dropdowns */}
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Status dropdown */}
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormItem>
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>

                              <SelectContent>
                                <SelectItem value="To Do">To Do</SelectItem>
                                <SelectItem value="In Progress">
                                  In Progress
                                </SelectItem>
                                <SelectItem value="Done">Done</SelectItem>
                              </SelectContent>
                            </FormItem>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Priority dropdown */}
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormItem>
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                              </FormControl>

                              <SelectContent>
                                <SelectItem value="Low">Low</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="High">High</SelectItem>
                              </SelectContent>
                            </FormItem>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Due date picker */}
                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Due Date</FormLabel>
                        <FormControl>
                          <Popover modal={true}>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={
                                  "w-full justify-start text-left font-normal" +
                                  (!field.value ? "text-muted-foreground" : "")
                                }
                              >
                                <CalendarIcon className="size-4 mr-2" />
                                {field.value ? (
                                  format(new Date(field.value), "PPPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </PopoverTrigger>

                            <PopoverContent>
                              <Calendar
                                mode="single"
                                selected={
                                  field.value
                                    ? new Date(field.value)
                                    : undefined
                                }
                                onSelect={(date) => {
                                  field.onChange(
                                    date?.toISOString() || undefined
                                  );
                                }}
                              />
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Assignees selection */}
                  <FormField
                    control={form.control}
                    name="assignees"
                    render={({ field }) => {
                      const selectedMembers = field.value || [];

                      return (
                        <FormItem>
                          <FormLabel>Assignees</FormLabel>
                          <FormControl>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant={"outline"}
                                  className="w-full justify-start text-left font-normal min-h-11"
                                >
                                  {/* Show selected members or placeholder text */}
                                  {selectedMembers.length == 0 ? (
                                    <span className="text-muted-foreground">
                                      Selected assignees
                                    </span>
                                  ) : selectedMembers.length <= 2 ? (
                                    selectedMembers
                                      .map((m) => {
                                        const member = projectMembers.find(
                                          (wm) => wm.user._id === m
                                        );
                                        return `${member?.user.name}`;
                                      })
                                      .join(", ")
                                  ) : (
                                    `${selectedMembers.length} assignees selected`
                                  )}
                                </Button>
                              </PopoverTrigger>

                              {/* List of project members to select */}
                              <PopoverContent
                                className="w-sm max-h-60 overflow-y-auto p-2"
                                align="start"
                              >
                                <div className="flex flex-col gap-2">
                                  {projectMembers.map((member) => {
                                    const selectedMember = selectedMembers.find(
                                      (m) => m === member.user?._id
                                    );

                                    return (
                                      <div
                                        key={member.user._id}
                                        className="flex items-center gap-2 p-2 border rounded"
                                      >
                                        {/* Checkbox to select or deselect member */}
                                        <Checkbox
                                          checked={!!selectedMember}
                                          onCheckedChange={(checked) => {
                                            if (checked) {
                                              field.onChange([
                                                ...selectedMembers,
                                                member.user._id,
                                              ]);
                                            } else {
                                              field.onChange(
                                                selectedMembers.filter(
                                                  (m) => m !== member.user._id
                                                )
                                              );
                                            }
                                          }}
                                          id={`member-${member.user._id}`}
                                        />

                                        <span className="truncate flex-1">
                                          {member.user.name}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </PopoverContent>
                            </Popover>
                          </FormControl>
                        </FormItem>
                      );
                    }}
                  />
                </div>
              </div>

              {/* Submit button */}
              <DialogFooter>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Creating..." : "Create Task"}
                </Button>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
