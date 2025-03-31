import { ApiProperty } from '@nestjs/swagger';

export class EventTypeResponseDto {
  @ApiProperty({
    example: '60d21b4667d0d8992e610c85',
    description: 'Unique identifier for the event type',
  })
  id: string;

  @ApiProperty({
    example: '60d21b4667d0d8992e610c85',
    description: 'Calendar ID this event type belongs to',
  })
  calendarId: string;

  @ApiProperty({
    example: 'Consultation',
    description: 'Title of the event type',
  })
  title: string;

  @ApiProperty({
    example: 'consultation',
    description: 'URL friendly identifier for the event type',
  })
  slug: string;

  @ApiProperty({
    example: 'Initial consultation session',
    description: 'Description of the event type',
  })
  description: string;

  @ApiProperty({
    example: 30,
    description: 'Duration in minutes (15, 30, 60)',
  })
  duration: number;

  @ApiProperty({
    example: '#3174F1',
    description: 'Color for UI display',
  })
  color: string;

  @ApiProperty({
    example: '60d21b4667d0d8992e610c85',
    description: 'ID of the availability schedule to use',
  })
  availabilityScheduleId: string;

  @ApiProperty({
    example: 5,
    description: 'Buffer time in minutes before each slot',
  })
  bufferTimeBefore: number;

  @ApiProperty({
    example: 5,
    description: 'Buffer time in minutes after each slot',
  })
  bufferTimeAfter: number;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'When the event type was created',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'When the event type was last updated',
  })
  updatedAt: Date;
}
