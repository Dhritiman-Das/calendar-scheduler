"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { calendarApi } from "@/lib/calendar";
import { eventTypeApi, CreateEventTypeDto } from "@/lib/event-type";
import { scheduleApi, ScheduleResponse } from "@/lib/schedule";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { use } from "react";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  slug: z
    .string()
    .min(2, { message: "Slug must be at least 2 characters." })
    .regex(/^[a-z0-9-]+$/, {
      message: "Slug can only contain lowercase letters, numbers, and hyphens.",
    })
    .optional(),
  description: z.string().optional(),
  duration: z.coerce
    .number()
    .min(5, {
      message: "Duration must be at least 5 minutes.",
    })
    .max(1440, {
      message: "Duration cannot exceed 24 hours (1440 minutes).",
    }),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, {
    message: "Color must be a valid hex color code (e.g., #FF5733).",
  }),
  availabilityScheduleId: z.string().optional(),
  bufferTimeBefore: z.coerce.number().min(0).max(60).default(0),
  bufferTimeAfter: z.coerce.number().min(0).max(60).default(0),
});

// Predefined color options
const colorOptions = [
  "#3B82F6", // blue
  "#10B981", // green
  "#F59E0B", // amber
  "#EF4444", // red
  "#8B5CF6", // purple
  "#EC4899", // pink
  "#6366F1", // indigo
  "#F97316", // orange
];

export default function NewEventTypePage(props: PageProps) {
  const params = use(props.params);
  const calendarId = params.id;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [calendarName, setCalendarName] = useState("");
  const [schedules, setSchedules] = useState<ScheduleResponse[]>([]);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      duration: 30,
      color: colorOptions[0],
      availabilityScheduleId: "none",
      bufferTimeBefore: 0,
      bufferTimeAfter: 0,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [calendarData, schedulesData] = await Promise.all([
          calendarApi.getCalendar(calendarId),
          scheduleApi.getSchedules(calendarId),
        ]);
        setCalendarName(calendarData.name);
        setSchedules(schedulesData);
      } catch (error) {
        console.error("Failed to fetch calendar data:", error);
        toast.error("Failed to load calendar data");
        router.push("/calendars");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [calendarId, router]);

  // Generate a slug from the title
  useEffect(() => {
    const title = form.watch("title");
    if (title && !form.getValues("slug")) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      form.setValue("slug", slug);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch("title")]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    // Create a clean copy of the data without the availabilityScheduleId
    const eventTypeData: Omit<CreateEventTypeDto, "availabilityScheduleId"> = {
      title: values.title,
      slug: values.slug,
      description: values.description || "",
      duration: values.duration,
      color: values.color,
      bufferTimeBefore: values.bufferTimeBefore,
      bufferTimeAfter: values.bufferTimeAfter,
    };

    // Add availabilityScheduleId only if it's a valid value (not "none")
    const finalData: CreateEventTypeDto = {
      ...eventTypeData,
      ...(values.availabilityScheduleId &&
      values.availabilityScheduleId !== "none"
        ? { availabilityScheduleId: values.availabilityScheduleId }
        : {}),
    };

    try {
      await eventTypeApi.createEventType(calendarId, finalData);
      toast.success("Event type created successfully");
      router.push(`/calendars/${calendarId}/event-types`);
    } catch (error) {
      console.error("Failed to create event type:", error);
      toast.error("Failed to create event type. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto pb-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/calendars">Calendars</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/calendars/${calendarId}`}>
              {isLoading ? (
                <Skeleton className="h-4 w-24 inline-block" />
              ) : (
                calendarName
              )}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/calendars/${calendarId}/event-types`}>
              Event Types
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>New</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-8">
        <Button variant="ghost" size="sm" className="mb-4" asChild>
          <Link href={`/calendars/${calendarId}/event-types`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to event types
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Create Event Type</h1>
        <p className="text-gray-500 mt-1">
          Define an appointment type that people can book
        </p>
      </div>

      <div className="bg-white p-8 rounded-lg shadow">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="15 Minute Meeting"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    The title of your event type shown to bookers
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL Slug</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 mr-2">
                        {window.location.origin}/
                      </span>
                      <Input
                        placeholder="15-minute-meeting"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    The URL path for this event type (auto-generated from title
                    if empty)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A brief description of this meeting type"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    A brief description of this event type (optional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (minutes)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormDescription>
                    How long the meeting will last
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="bufferTimeBefore"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Buffer before (minutes)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormDescription>
                      Time buffer before each meeting
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bufferTimeAfter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Buffer after (minutes)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormDescription>
                      Time buffer after each meeting
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {schedules.length > 0 && (
              <FormField
                control={form.control}
                name="availabilityScheduleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Availability Schedule</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value || "none");
                      }}
                      defaultValue={field.value}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an availability schedule" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">
                          Default (use all schedules)
                        </SelectItem>
                        {schedules.map((schedule) => (
                          <SelectItem key={schedule._id} value={schedule._id}>
                            {schedule.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose a specific availability schedule for this event
                      type
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <div className="flex flex-wrap gap-3">
                      {colorOptions.map((color) => (
                        <div
                          key={color}
                          className={`w-10 h-10 rounded-full cursor-pointer border-2 ${
                            field.value === color
                              ? "border-black"
                              : "border-transparent"
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => form.setValue("color", color)}
                        />
                      ))}
                      <Input
                        type="color"
                        {...field}
                        disabled={isSubmitting}
                        className="w-10 h-10 p-1 cursor-pointer"
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Choose a color for this event type
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-4 flex justify-end">
              <Button
                type="button"
                variant="outline"
                className="mr-2"
                disabled={isSubmitting}
                asChild
              >
                <Link href={`/calendars/${calendarId}/event-types`}>
                  Cancel
                </Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Event Type"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
