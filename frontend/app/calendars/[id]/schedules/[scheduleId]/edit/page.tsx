"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { calendarApi, CalendarResponse } from "@/lib/calendar";
import { scheduleApi, UpdateScheduleDto } from "@/lib/schedule";
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

interface PageProps {
  params: Promise<{
    id: string;
    scheduleId: string;
  }>;
}

export default function EditSchedulePage(props: PageProps) {
  const params = use(props.params);
  const calendarId = params.id;
  const scheduleId = params.scheduleId;
  const router = useRouter();
  const [calendar, setCalendar] = useState<CalendarResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([]);

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
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [calendarData, scheduleData] = await Promise.all([
          calendarApi.getCalendar(calendarId),
          scheduleApi.getSchedule(scheduleId),
        ]);

        // Verify this schedule belongs to the specified calendar
        if (scheduleData.calendarId !== calendarId) {
          toast.error("Schedule does not belong to this calendar");
          router.push(`/calendars/${calendarId}/schedules`);
          return;
        }

        setCalendar(calendarData);

        // Initialize form values
        setName(scheduleData.name);
        setStartTime(scheduleData.startTime);
        setEndTime(scheduleData.endTime);
        setDaysOfWeek(scheduleData.daysOfWeek);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Failed to load schedule");
        router.push(`/calendars/${calendarId}/schedules`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [calendarId, scheduleId, router]);

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
      const updatedSchedule: UpdateScheduleDto = {
        name,
        startTime,
        endTime,
        daysOfWeek: daysOfWeek.sort((a, b) => a - b), // Sort days for consistency
      };

      await scheduleApi.updateSchedule(scheduleId, updatedSchedule);
      toast.success("Schedule updated successfully");
      router.push(`/calendars/${calendarId}/schedules`);
    } catch (error) {
      console.error("Failed to update schedule:", error);
      toast.error("Failed to update schedule");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/calendars">Calendars</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>
                <Skeleton className="h-4 w-24 inline-block" />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>
                <Skeleton className="h-4 w-20 inline-block" />
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div>
          <Skeleton className="h-9 w-60 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <Skeleton className="h-10 w-full" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-24 w-full" />
              <div className="flex justify-end space-x-2">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <BreadcrumbPage>Edit Schedule</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-3xl font-bold">Edit Schedule</h1>
        <p className="text-gray-500 mt-1">
          Update your availability hours and days
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
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
