import apiClient from "./axios";

export interface ScheduleResponse {
  _id: string;
  calendarId: string;
  name: string;
  daysOfWeek: number[];
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateScheduleDto {
  name: string;
  daysOfWeek: number[];
  startTime: string;
  endTime: string;
}

export interface UpdateScheduleDto {
  name?: string;
  daysOfWeek?: number[];
  startTime?: string;
  endTime?: string;
}

export const scheduleApi = {
  getSchedules: async (calendarId: string): Promise<ScheduleResponse[]> => {
    const response = await apiClient.get<ScheduleResponse[]>(
      `/calendars/${calendarId}/schedules`
    );
    return response.data;
  },

  getSchedule: async (id: string): Promise<ScheduleResponse> => {
    const response = await apiClient.get<ScheduleResponse>(`/schedules/${id}`);
    return response.data;
  },

  createSchedule: async (
    calendarId: string,
    data: CreateScheduleDto
  ): Promise<ScheduleResponse> => {
    const response = await apiClient.post<ScheduleResponse>(
      `/calendars/${calendarId}/schedules`,
      data
    );
    return response.data;
  },

  updateSchedule: async (
    id: string,
    data: UpdateScheduleDto
  ): Promise<ScheduleResponse> => {
    const response = await apiClient.patch<ScheduleResponse>(
      `/schedules/${id}`,
      data
    );
    return response.data;
  },

  deleteSchedule: async (id: string): Promise<void> => {
    await apiClient.delete(`/schedules/${id}`);
  },
};
