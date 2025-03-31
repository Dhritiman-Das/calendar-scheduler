"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { calendarApi, CalendarResponse } from "@/lib/calendar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Calendar,
  Clock,
  Globe,
  Link as LinkIcon,
  Pencil,
  Share2,
  Copy,
  Users,
  CalendarRange,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import Link from "next/link";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function CalendarDetailPage(props: PageProps) {
  const params = use(props.params);
  const id = params.id;
  const router = useRouter();
  const [calendar, setCalendar] = useState<CalendarResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const fetchCalendar = async () => {
      setIsLoading(true);
      try {
        const data = await calendarApi.getCalendar(id);
        setCalendar(data);
      } catch (error) {
        console.error("Failed to fetch calendar:", error);
        toast.error("Calendar not found");
        router.push("/calendars");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCalendar();
  }, [id, router]);

  const copyLink = () => {
    if (!calendar) return;

    const url = `${window.location.origin}/${calendar.slug}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      toast.success("Public link copied to clipboard");
      setTimeout(() => setCopiedLink(false), 2000);
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-full max-w-md" />
        </div>
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  if (!calendar) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Calendar not found</h2>
        <p className="text-gray-500 mt-2">
          The calendar you&apos;re looking for doesn&apos;t exist or you
          don&apos;t have access to it.
        </p>
        <Button className="mt-6" asChild>
          <Link href="/calendars">Go back to calendars</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/calendars">Calendars</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{calendar.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{calendar.name}</h1>
          <p className="text-gray-500 mt-1">
            {calendar.description || "No description provided"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={copyLink}>
            {copiedLink ? (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Share2 className="mr-2 h-4 w-4" />
                Copy Link
              </>
            )}
          </Button>
          <Button asChild>
            <Link href={`/calendars/${id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Calendar Details</CardTitle>
          <CardDescription>
            View and manage your calendar settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="overview"
            onValueChange={setActiveTab}
            value={activeTab}
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="event-types">Event Types</TabsTrigger>
              <TabsTrigger value="schedules">Schedules</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Calendar Name</h3>
                      <p className="text-gray-600">{calendar.name}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Globe className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Timezone</h3>
                      <p className="text-gray-600">{calendar.timezone}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <LinkIcon className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Public Link</h3>
                      <div className="flex items-center mt-1">
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                          {`${window.location.origin}/${calendar.slug}`}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="ml-2 h-8 w-8"
                          onClick={copyLink}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Created</h3>
                      <p className="text-gray-600">
                        {new Date(calendar.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <CalendarRange className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Schedules</h3>
                      <p className="text-gray-600">
                        <Button variant="link" className="p-0 h-auto" asChild>
                          <Link href={`/calendars/${id}/schedules`}>
                            Manage availability schedules
                          </Link>
                        </Button>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Users className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Event Types</h3>
                      <p className="text-gray-600">
                        <Button variant="link" className="p-0 h-auto" asChild>
                          <Link href={`/calendars/${id}/event-types`}>
                            Manage event types
                          </Link>
                        </Button>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="event-types">
              <div className="py-6 text-center">
                <h3 className="text-lg font-medium mb-2">Event Types</h3>
                <p className="text-gray-500 mb-4">
                  Create and manage different types of meetings that people can
                  book with you
                </p>
                <Button asChild>
                  <Link href={`/calendars/${id}/event-types`}>
                    Manage Event Types
                  </Link>
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="schedules">
              <div className="py-6 text-center">
                <h3 className="text-lg font-medium mb-2">
                  Availability Schedules
                </h3>
                <p className="text-gray-500 mb-4">
                  Set when you&apos;re available for appointments and meetings
                </p>
                <Button asChild>
                  <Link href={`/calendars/${id}/schedules`}>
                    Manage Schedules
                  </Link>
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="bookings">
              <div className="py-6 text-center">
                <h3 className="text-lg font-medium mb-2">Bookings</h3>
                <p className="text-gray-500 mb-4">
                  View and manage your upcoming and past bookings
                </p>
                <Button asChild>
                  <Link href={`/calendars/${id}/bookings`}>View Bookings</Link>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
