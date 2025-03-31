import { ApiProperty } from '@nestjs/swagger';
import { SlotStatus } from '../../schemas/slot.schema';

export class SlotResponseDto {
  @ApiProperty({
    example: '60d21b4667d0d8992e610c85',
    description: 'Unique identifier for the slot',
  })
  id: string;

  @ApiProperty({
    example: '60d21b4667d0d8992e610c85',
    description: 'Calendar ID this slot belongs to',
  })
  calendarId: string;

  @ApiProperty({
    example: '60d21b4667d0d8992e610c85',
    description: 'Event type ID this slot belongs to',
  })
  eventTypeId: string;

  @ApiProperty({
    example: '2023-01-01T10:00:00.000Z',
    description: 'Start time of the slot',
  })
  startTime: Date;

  @ApiProperty({
    example: '2023-01-01T10:30:00.000Z',
    description: 'End time of the slot',
  })
  endTime: Date;

  @ApiProperty({
    example: 'AVAILABLE',
    description: 'Status of the slot',
    enum: SlotStatus,
  })
  status: SlotStatus;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'When the slot was created',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'When the slot was last updated',
  })
  updatedAt: Date;
}
