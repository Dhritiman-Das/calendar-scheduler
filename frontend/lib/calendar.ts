import apiClient from "./axios";

export interface CalendarResponse {
  _id: string;
  userId: string;
  name: string;
  description: string;
  slug: string;
  timezone: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCalendarDto {
  name: string;
  description: string;
  slug: string;
  timezone: string;
}

export interface UpdateCalendarDto {
  name?: string;
  description?: string;
  slug?: string;
  timezone?: string;
}

export const calendarApi = {
  getCalendars: async (): Promise<CalendarResponse[]> => {
    const response = await apiClient.get<CalendarResponse[]>("/calendars");
    return response.data;
  },

  getCalendar: async (id: string): Promise<CalendarResponse> => {
    const response = await apiClient.get<CalendarResponse>(`/calendars/${id}`);
    return response.data;
  },

  createCalendar: async (
    data: CreateCalendarDto
  ): Promise<CalendarResponse> => {
    const response = await apiClient.post<CalendarResponse>("/calendars", data);
    return response.data;
  },

  updateCalendar: async (
    id: string,
    data: UpdateCalendarDto
  ): Promise<CalendarResponse> => {
    const response = await apiClient.patch<CalendarResponse>(
      `/calendars/${id}`,
      data
    );
    return response.data;
  },

  deleteCalendar: async (id: string): Promise<void> => {
    await apiClient.delete(`/calendars/${id}`);
  },
};
