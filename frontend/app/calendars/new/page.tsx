"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { calendarApi, CreateCalendarDto } from "@/lib/calendar";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be at least 3 characters.",
  }),
  description: z.string().optional(),
  slug: z
    .string()
    .min(3, {
      message: "Slug must be at least 3 characters.",
    })
    .regex(/^[a-z0-9-]+$/, {
      message: "Slug can only contain lowercase letters, numbers, and hyphens.",
    }),
  timezone: z.string(),
});

const COMMON_TIMEZONES = [
  "UTC",
  "America/New_York", // Eastern Time
  "America/Chicago", // Central Time
  "America/Denver", // Mountain Time
  "America/Los_Angeles", // Pacific Time
  "Europe/London", // GMT
  "Europe/Paris", // Central European Time
  "Asia/Tokyo", // Japan Time
  "Asia/Shanghai", // China Time
  "Australia/Sydney", // Australian Eastern Time
  "Pacific/Auckland", // New Zealand Time
];

export default function NewCalendarPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      slug: "",
      timezone: "UTC",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    const calendarData: CreateCalendarDto = {
      name: values.name,
      description: values.description || "",
      slug: values.slug,
      timezone: values.timezone,
    };

    try {
      const result = await calendarApi.createCalendar(calendarData);
      toast.success("Calendar created successfully");
      router.push(`/calendars/${result._id}`);
    } catch (error) {
      console.error("Failed to create calendar:", error);
      toast.error("Failed to create calendar. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    form.setValue("name", name);

    // Only auto-generate slug if the user hasn't manually edited it
    if (
      !form.getValues("slug") ||
      form.getValues("slug") ===
        form
          .getValues("name")
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "")
    ) {
      const slug = name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      form.setValue("slug", slug);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-8">
        <Button variant="ghost" size="sm" className="mb-4" asChild>
          <Link href="/calendars">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to calendars
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Create a new calendar</h1>
        <p className="text-gray-500 mt-1">
          Set up a new calendar for scheduling appointments
        </p>
      </div>

      <div className="bg-white p-8 rounded-lg shadow">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Calendar name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="My Calendar"
                      {...field}
                      onChange={handleNameChange}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    This is the name that will be shown to your clients.
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
                      placeholder="Schedule appointments with me"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    A brief description of your calendar (optional).
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
                      <span className="bg-gray-100 text-gray-500 px-3 py-2 border border-r-0 rounded-l-md">
                        /
                      </span>
                      <Input
                        className="rounded-l-none"
                        placeholder="my-calendar"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    This will be used in the URL for your public booking page
                    (e.g., /my-calendar).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="timezone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Timezone</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a timezone" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {COMMON_TIMEZONES.map((timezone) => (
                        <SelectItem key={timezone} value={timezone}>
                          {timezone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    All appointment times will be displayed in this timezone.
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
                <Link href="/calendars">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Calendar"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
