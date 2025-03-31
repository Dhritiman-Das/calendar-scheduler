"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { calendarApi, CalendarResponse } from "@/lib/calendar";
import { eventTypeApi, EventTypeResponse } from "@/lib/event-type";
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
import {
  Plus,
  Pencil,
  Trash2,
  Clock,
  Calendar,
  AlertCircle,
} from "lucide-react";
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

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EventTypesPage(props: PageProps) {
  const params = use(props.params);
  const calendarId = params.id;
  const router = useRouter();
  const [calendar, setCalendar] = useState<CalendarResponse | null>(null);
  const [eventTypes, setEventTypes] = useState<EventTypeResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [calendarData, eventTypesData] = await Promise.all([
          calendarApi.getCalendar(calendarId),
          eventTypeApi.getEventTypes(calendarId),
        ]);

        setCalendar(calendarData);
        setEventTypes(eventTypesData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Failed to load event types");
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
      await eventTypeApi.deleteEventType(deleteId);
      toast.success("Event type deleted successfully");
      setEventTypes(eventTypes.filter((et) => et._id !== deleteId));
    } catch (error) {
      console.error("Failed to delete event type:", error);
      toast.error("Failed to delete event type");
    } finally {
      setDeleteId(null);
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
      return `${hours} hr`;
    }
    return `${hours} hr ${remainingMinutes} min`;
  };

  const filteredEventTypes = eventTypes.filter((eventType) =>
    eventType.title.toLowerCase().includes(searchTerm.toLowerCase())
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
            <BreadcrumbPage>Event Types</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Event Types</h1>
          <p className="text-gray-500 mt-1">
            Manage appointment types that people can book
          </p>
        </div>
        <Button asChild>
          <Link href={`/calendars/${calendarId}/event-types/new`}>
            <Plus className="mr-2 h-4 w-4" />
            New Event Type
          </Link>
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search event types..."
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
      ) : filteredEventTypes.length === 0 ? (
        <div className="text-center p-12 border rounded-lg bg-white">
          {searchTerm ? (
            <>
              <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium">No event types found</h3>
              <p className="text-gray-500 mt-1">
                No event types match your search &quot;{searchTerm}&quot;
              </p>
            </>
          ) : (
            <>
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium">No event types yet</h3>
              <p className="text-gray-500 mt-1 mb-4">
                Create your first event type to start scheduling appointments
              </p>
              <Button asChild>
                <Link href={`/calendars/${calendarId}/event-types/new`}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create an event type
                </Link>
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {filteredEventTypes.map((eventType) => (
            <Card key={eventType._id}>
              <CardHeader
                className="pb-2 border-l-4"
                style={{ borderColor: eventType.color }}
              >
                <CardTitle>{eventType.title}</CardTitle>
                <CardDescription>
                  {eventType.description || "No description provided"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    <span>Duration: {formatDuration(eventType.duration)}</span>
                  </div>

                  <div className="flex justify-end space-x-2 pt-2">
                    <Button
                      variant="outline"
                      size="icon"
                      asChild
                      className="h-8 w-8"
                    >
                      <Link
                        href={`/calendars/${calendarId}/event-types/${eventType._id}/edit`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-600"
                      onClick={() => setDeleteId(eventType._id)}
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
              This will permanently delete this event type and all associated
              slots. Existing bookings will not be affected, but no new bookings
              can be made. This action cannot be undone.
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
