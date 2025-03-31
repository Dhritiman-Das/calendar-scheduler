import { ApiProperty } from '@nestjs/swagger';

export class ScheduleResponseDto {
  @ApiProperty({
    example: '60d21b4667d0d8992e610c85',
    description: 'Unique identifier for the availability schedule',
  })
  id: string;

  @ApiProperty({
    example: '60d21b4667d0d8992e610c85',
    description: 'Calendar ID this schedule belongs to',
  })
  calendarId: string;

  @ApiProperty({
    example: 'Work Hours',
    description: 'Name of the availability schedule',
  })
  name: string;

  @ApiProperty({
    example: [1, 2, 3, 4, 5],
    description: 'Days of week (1-7, where 1 is Monday and 7 is Sunday)',
    type: [Number],
  })
  daysOfWeek: number[];

  @ApiProperty({
    example: '09:00',
    description: 'Start time in 24-hour format (HH:MM)',
  })
  startTime: string;

  @ApiProperty({
    example: '17:00',
    description: 'End time in 24-hour format (HH:MM)',
  })
  endTime: string;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'When the schedule was created',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'When the schedule was last updated',
  })
  updatedAt: Date;
}
