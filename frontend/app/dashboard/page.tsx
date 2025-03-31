"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { calendarApi, CalendarResponse } from "@/lib/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  Clock,
  Plus,
  Users,
  Bookmark,
  Calendar as CalendarIcon,
  Info,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { user } = useAuth();
  const [calendars, setCalendars] = useState<CalendarResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCalendars = async () => {
      try {
        const data = await calendarApi.getCalendars();
        setCalendars(data);
      } catch (error) {
        console.error("Failed to fetch calendars:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCalendars();
  }, []);

  // Placeholder stats
  const stats = [
    {
      title: "Total Calendars",
      value: calendars.length,
      icon: <Calendar className="h-6 w-6 text-blue-500" />,
      color: "bg-blue-50",
    },
    {
      title: "Upcoming Bookings",
      value: "0",
      icon: <Clock className="h-6 w-6 text-green-500" />,
      color: "bg-green-50",
    },
    {
      title: "Total Bookings",
      value: "0",
      icon: <Bookmark className="h-6 w-6 text-purple-500" />,
      color: "bg-purple-50",
    },
    {
      title: "Event Types",
      value: "0",
      icon: <Users className="h-6 w-6 text-amber-500" />,
      color: "bg-amber-50",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Welcome back, {user?.firstName} {user?.lastName}
          </p>
        </div>
        <Button asChild>
          <Link href="/calendars/new">
            <Plus className="mr-2 h-4 w-4" />
            New Calendar
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6 flex items-start space-x-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>{stat.icon}</div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {stat.title}
                </p>
                {isLoading ? (
                  <Skeleton className="h-8 w-16 mt-1" />
                ) : (
                  <p className="text-2xl font-bold">{stat.value}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Calendars */}
      <div>
        <h2 className="text-xl font-bold mb-4">Your Calendars</h2>
        {isLoading ? (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : calendars.length === 0 ? (
          <Card className="text-center p-8">
            <div className="flex flex-col items-center justify-center">
              <CalendarIcon className="h-12 w-12 text-gray-300 mb-4" />
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
            </div>
          </Card>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {calendars.map((calendar) => (
              <Card key={calendar._id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {calendar.name}
                    <Info className="h-4 w-4 text-gray-400" />
                  </CardTitle>
                  <p className="text-sm text-gray-500">
                    {calendar.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center text-sm">
                      <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                      <span>
                        <strong>URL:</strong>{" "}
                        <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">
                          /{calendar.slug}
                        </code>
                      </span>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="text-xs"
                      >
                        <Link href={`/calendars/${calendar._id}`}>Manage</Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="text-xs"
                      >
                        <Link href={`/calendars/${calendar._id}/event-types`}>
                          Event Types
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
