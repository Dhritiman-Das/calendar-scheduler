"use client";

import { useState, useEffect, use } from "react";
import { notFound } from "next/navigation";
import { CalendarResponse } from "@/lib/calendar";
import apiClient from "@/lib/axios";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface EventType {
  _id: string;
  name: string;
  description: string;
  duration: number;
  color: string;
  calendarId: string;
}

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function CalendarPublicPage({ params }: PageProps) {
  const { slug } = use(params);
  const [calendar, setCalendar] = useState<CalendarResponse | null>(null);
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCalendarBySlug = async () => {
      setIsLoading(true);
      try {
        const { data } = await apiClient.get<{
          calendar: CalendarResponse;
          eventTypes: EventType[];
        }>(`/public/calendars/slug/${slug}`);
        setCalendar(data.calendar);
        setEventTypes(data.eventTypes || []);
      } catch (err) {
        console.error("Failed to fetch calendar:", err);
        setError("Calendar not found");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCalendarBySlug();
  }, [slug]);

  if (error) {
    notFound();
  }

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {isLoading ? (
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <Skeleton className="h-10 w-1/2 mx-auto" />
              <Skeleton className="h-6 w-2/3 mx-auto" />
            </div>
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 mt-12">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold">{calendar?.name}</h1>
              {calendar?.description && (
                <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
                  {calendar.description}
                </p>
              )}
            </div>

            {eventTypes.length === 0 ? (
              <div className="text-center p-12 border rounded-lg bg-white">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium">
                  No event types available
                </h3>
                <p className="text-gray-500 mt-1">
                  This calendar does not have any bookable event types yet.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                {eventTypes.map((eventType) => (
                  <Card
                    key={eventType._id}
                    className="overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <Link
                      href={`/${slug}/${eventType._id}`}
                      className="block h-full"
                    >
                      <CardHeader
                        className={`pb-2 border-l-4`}
                        style={{ borderColor: eventType.color || "#6366f1" }}
                      >
                        <CardTitle>{eventType.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <p className="text-gray-600 text-sm mb-4">
                          {eventType.description || "No description provided"}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{formatDuration(eventType.duration)}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1"
                            asChild
                          >
                            <div>
                              Select <ArrowRight className="h-4 w-4" />
                            </div>
                          </Button>
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
