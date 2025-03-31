"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { calendarApi, CalendarResponse } from "@/lib/calendar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Pencil, Trash2, AlertCircle, CalendarDays } from "lucide-react";
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

export default function CalendarsPage() {
  const [calendars, setCalendars] = useState<CalendarResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchCalendars();
  }, []);

  const fetchCalendars = async () => {
    setIsLoading(true);
    try {
      const data = await calendarApi.getCalendars();
      setCalendars(data);
    } catch (error) {
      console.error("Failed to fetch calendars:", error);
      toast.error("Failed to load calendars");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await calendarApi.deleteCalendar(deleteId);
      toast.success("Calendar deleted successfully");
      setCalendars(calendars.filter((cal) => cal._id !== deleteId));
    } catch (error) {
      console.error("Failed to delete calendar:", error);
      toast.error("Failed to delete calendar");
    } finally {
      setDeleteId(null);
    }
  };

  const filteredCalendars = calendars.filter((calendar) =>
    calendar.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Calendars</h1>
          <p className="text-gray-500 mt-1">Manage your scheduling calendars</p>
        </div>
        <Button asChild>
          <Link href="/calendars/new">
            <Plus className="mr-2 h-4 w-4" />
            New Calendar
          </Link>
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search calendars..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {isLoading ? (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
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
      ) : filteredCalendars.length === 0 ? (
        <div className="text-center p-12 border rounded-lg bg-white">
          {searchTerm ? (
            <>
              <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium">No calendars found</h3>
              <p className="text-gray-500 mt-1">
                No calendars match your search &quot;{searchTerm}&quot;
              </p>
            </>
          ) : (
            <>
              <CalendarDays className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium">No calendars yet</h3>
              <p className="text-gray-500 mt-1 mb-4">
                Create your first calendar to start scheduling appointments
              </p>
              <Button asChild>
                <Link href="/calendars/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create a calendar
                </Link>
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {filteredCalendars.map((calendar) => (
            <Card key={calendar._id}>
              <CardHeader>
                <CardTitle>{calendar.name}</CardTitle>
                <CardDescription>{calendar.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Slug</p>
                      <p className="font-medium">/{calendar.slug}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Timezone</p>
                      <p className="font-medium">{calendar.timezone}</p>
                    </div>
                  </div>
                  <div className="flex justify-between pt-4">
                    <div className="space-x-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/calendars/${calendar._id}/event-types`}>
                          Event Types
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/calendars/${calendar._id}/schedules`}>
                          Schedules
                        </Link>
                      </Button>
                    </div>
                    <div className="space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        asChild
                        className="h-8 w-8"
                      >
                        <Link href={`/calendars/${calendar._id}/edit`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-600"
                        onClick={() => setDeleteId(calendar._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
              This will permanently delete this calendar, all of its event
              types, schedules, and all bookings. This action cannot be undone.
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
