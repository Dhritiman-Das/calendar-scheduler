"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { calendarApi, CalendarResponse } from "@/lib/calendar";
import { scheduleApi, ScheduleResponse } from "@/lib/schedule";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Plus, Pencil, Trash2, CalendarRange, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const dayOfWeekNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function SchedulesPage(props: PageProps) {
  const params = use(props.params);
  const calendarId = params.id;
  const router = useRouter();
  const [calendar, setCalendar] = useState<CalendarResponse | null>(null);
  const [schedules, setSchedules] = useState<ScheduleResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [calendarData, schedulesData] = await Promise.all([
          calendarApi.getCalendar(calendarId),
          scheduleApi.getSchedules(calendarId),
        ]);

        setCalendar(calendarData);
        setSchedules(schedulesData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Failed to load schedules");
        router.push("/calendars");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [calendarId, router]);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await scheduleApi.deleteSchedule(deleteId);
      toast.success("Schedule deleted successfully");
      setSchedules(schedules.filter((schedule) => schedule._id !== deleteId));
    } catch (error) {
      console.error("Failed to delete schedule:", error);
      toast.error("Failed to delete schedule");
    } finally {
      setDeleteId(null);
    }
  };

  // Format time from "HH:MM" format to "h:MM AM/PM"
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hoursNum = parseInt(hours, 10);
    const ampm = hoursNum >= 12 ? "PM" : "AM";
    const formattedHours = hoursNum % 12 || 12; // Convert 0 to 12 for 12 AM
    return `${formattedHours}:${minutes} ${ampm}`;
  };

  const filteredSchedules = schedules.filter((schedule) =>
    schedule.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <BreadcrumbPage>Schedules</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Availability Schedules</h1>
          <p className="text-gray-500 mt-1">
            Manage when you&apos;re available for appointments
          </p>
        </div>
        <Button asChild>
          <Link href={`/calendars/${calendarId}/schedules/new`}>
            <Plus className="mr-2 h-4 w-4" />
            New Schedule
          </Link>
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search schedules..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {isLoading ? (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-2/3 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="pt-4">
                    <Skeleton className="h-8 w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredSchedules.length === 0 ? (
        <div className="text-center p-12 border rounded-lg bg-white">
          {searchTerm ? (
            <>
              <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium">No schedules found</h3>
              <p className="text-gray-500 mt-1">
                No schedules match your search &quot;{searchTerm}&quot;
              </p>
            </>
          ) : (
            <>
              <CalendarRange className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium">No schedules yet</h3>
              <p className="text-gray-500 mt-1 mb-4">
                Create your first availability schedule
              </p>
              <Button asChild>
                <Link href={`/calendars/${calendarId}/schedules/new`}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create a schedule
                </Link>
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {filteredSchedules.map((schedule) => (
            <Card key={schedule._id}>
              <CardHeader>
                <CardTitle>{schedule.name}</CardTitle>
                <CardDescription>
                  {formatTime(schedule.startTime)} -{" "}
                  {formatTime(schedule.endTime)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {schedule.daysOfWeek.map((day) => (
                      <Badge key={day} variant="outline">
                        {dayOfWeekNames[day]}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex justify-end space-x-2 pt-2">
                    <Button
                      variant="outline"
                      size="icon"
                      asChild
                      className="h-8 w-8"
                    >
                      <Link
                        href={`/calendars/${calendarId}/schedules/${schedule._id}/edit`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-600"
                      onClick={() => setDeleteId(schedule._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this schedule. Any slots generated
              using this schedule will not be affected. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
