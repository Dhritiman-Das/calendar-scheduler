import { ApiProperty } from '@nestjs/swagger';
import { BookingStatus } from '../../schemas/booking.schema';

export class BookingResponseDto {
  @ApiProperty({
    example: '60d21b4667d0d8992e610c85',
    description: 'Unique identifier for the booking',
  })
  id: string;

  @ApiProperty({
    example: '60d21b4667d0d8992e610c85',
    description: 'Calendar ID this booking belongs to',
  })
  calendarId: string;

  @ApiProperty({
    example: '60d21b4667d0d8992e610c85',
    description: 'Event type ID this booking belongs to',
  })
  eventTypeId: string;

  @ApiProperty({
    example: '60d21b4667d0d8992e610c85',
    description: 'Slot ID that was booked',
  })
  slotId: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Name of the person who booked',
  })
  name: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'Email of the person who booked',
  })
  email: string;

  @ApiProperty({
    example: 'Discussion about project',
    description: 'Additional notes for the booking',
  })
  notes: string;

  @ApiProperty({
    example: '2023-01-01T10:00:00.000Z',
    description: 'Start time of the booking',
  })
  startTime: Date;

  @ApiProperty({
    example: '2023-01-01T10:30:00.000Z',
    description: 'End time of the booking',
  })
  endTime: Date;

  @ApiProperty({
    example: 'CONFIRMED',
    description: 'Status of the booking',
    enum: BookingStatus,
  })
  status: BookingStatus;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'When the booking was created',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'When the booking was last updated',
  })
  updatedAt: Date;
}
