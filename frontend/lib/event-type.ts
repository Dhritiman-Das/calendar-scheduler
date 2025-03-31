import apiClient from "./axios";

export interface EventTypeResponse {
  _id: string;
  calendarId: string;
  title: string;
  slug: string;
  description: string;
  duration: number;
  color: string;
  availabilityScheduleId?: string;
  bufferTimeBefore?: number;
  bufferTimeAfter?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventTypeDto {
  title: string;
  slug?: string;
  description: string;
  duration: number;
  color: string;
  availabilityScheduleId?: string;
  bufferTimeBefore?: number;
  bufferTimeAfter?: number;
}

export interface UpdateEventTypeDto {
  title?: string;
  slug?: string;
  description?: string;
  duration?: number;
  color?: string;
  availabilityScheduleId?: string;
  bufferTimeBefore?: number;
  bufferTimeAfter?: number;
}

export const eventTypeApi = {
  getEventTypes: async (calendarId: string): Promise<EventTypeResponse[]> => {
    const response = await apiClient.get<EventTypeResponse[]>(
      `/calendars/${calendarId}/event-types`
    );
    return response.data;
  },

  getEventType: async (id: string): Promise<EventTypeResponse> => {
    const response = await apiClient.get<EventTypeResponse>(
      `/event-types/${id}`
    );
    return response.data;
  },

  createEventType: async (
    calendarId: string,
    data: CreateEventTypeDto
  ): Promise<EventTypeResponse> => {
    const response = await apiClient.post<EventTypeResponse>(
      `/calendars/${calendarId}/event-types`,
      data
    );
    return response.data;
  },

  updateEventType: async (
    id: string,
    data: UpdateEventTypeDto
  ): Promise<EventTypeResponse> => {
    const response = await apiClient.patch<EventTypeResponse>(
      `/event-types/${id}`,
      data
    );
    return response.data;
  },

  deleteEventType: async (id: string): Promise<void> => {
    await apiClient.delete(`/event-types/${id}`);
  },
};
