"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { calendarApi, CalendarResponse } from "@/lib/calendar";
import { scheduleApi, CreateScheduleDto } from "@/lib/schedule";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const DEFAULT_START_TIME = "09:00";
const DEFAULT_END_TIME = "17:00";

export default function NewSchedulePage(props: PageProps) {
  const params = use(props.params);
  const calendarId = params.id;
  const router = useRouter();
  const [calendar, setCalendar] = useState<CalendarResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [startTime, setStartTime] = useState(DEFAULT_START_TIME);
  const [endTime, setEndTime] = useState(DEFAULT_END_TIME);
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([1, 2, 3, 4, 5]); // Mon-Fri by default
  const [isDefault, setIsDefault] = useState(false);

  const daysOfWeekOptions = [
    { id: 0, label: "Sunday" },
    { id: 1, label: "Monday" },
    { id: 2, label: "Tuesday" },
    { id: 3, label: "Wednesday" },
    { id: 4, label: "Thursday" },
    { id: 5, label: "Friday" },
    { id: 6, label: "Saturday" },
  ];

  useEffect(() => {
    const fetchCalendar = async () => {
      setIsLoading(true);
      try {
        const calendarData = await calendarApi.getCalendar(calendarId);
        setCalendar(calendarData);
      } catch (error) {
        console.error("Failed to fetch calendar:", error);
        toast.error("Failed to load calendar");
        router.push("/calendars");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCalendar();
  }, [calendarId, router]);

  const handleDayToggle = (dayId: number) => {
    setDaysOfWeek((current) =>
      current.includes(dayId)
        ? current.filter((id) => id !== dayId)
        : [...current, dayId]
    );
  };

  const validateForm = () => {
    if (!name.trim()) {
      toast.error("Please enter a name for your schedule");
      return false;
    }

    if (daysOfWeek.length === 0) {
      toast.error("Please select at least one day of the week");
      return false;
    }

    if (!startTime || !endTime) {
      toast.error("Please set both start and end times");
      return false;
    }

    // Check that end time is after start time
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    if (endMinutes <= startMinutes) {
      toast.error("End time must be after start time");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const newSchedule: CreateScheduleDto = {
        name,
        startTime,
        endTime,
        daysOfWeek: daysOfWeek.sort((a, b) => a - b), // Sort days for consistency
      };

      await scheduleApi.createSchedule(calendarId, newSchedule);
      toast.success("Schedule created successfully");
      router.push(`/calendars/${calendarId}/schedules`);
    } catch (error) {
      console.error("Failed to create schedule:", error);
      toast.error("Failed to create schedule");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <Breadcrumb>
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
                calendar?.name
              )}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/calendars/${calendarId}/schedules`}>
              Schedules
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>New Schedule</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-3xl font-bold">Create New Schedule</h1>
        <p className="text-gray-500 mt-1">
          Set your regular availability for appointments
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Schedule Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Schedule Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Work Week, Weekends Only"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1"
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="mt-1"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="mt-1"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <Label className="block mb-2">Days of Week</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {daysOfWeekOptions.map((day) => (
                    <div key={day.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`day-${day.id}`}
                        checked={daysOfWeek.includes(day.id)}
                        onCheckedChange={() => handleDayToggle(day.id)}
                        disabled={isSubmitting}
                      />
                      <Label htmlFor={`day-${day.id}`}>{day.label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isDefault"
                  checked={isDefault}
                  onCheckedChange={setIsDefault}
                  disabled={isSubmitting}
                />
                <Label htmlFor="isDefault">Set as default schedule</Label>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  router.push(`/calendars/${calendarId}/schedules`)
                }
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Schedule"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
