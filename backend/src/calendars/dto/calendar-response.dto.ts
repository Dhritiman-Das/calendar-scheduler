import { ApiProperty } from '@nestjs/swagger';

export class CalendarResponseDto {
  @ApiProperty({
    example: '60d21b4667d0d8992e610c85',
    description: 'Unique identifier for the calendar',
  })
  id: string;

  @ApiProperty({
    example: '60d21b4667d0d8992e610c85',
    description: 'User ID of the calendar owner',
  })
  userId: string;

  @ApiProperty({
    example: 'Work Calendar',
    description: 'Name of the calendar',
  })
  name: string;

  @ApiProperty({
    example: 'My work appointments',
    description: 'Description of the calendar',
  })
  description: string;

  @ApiProperty({
    example: 'work-calendar',
    description: 'URL friendly identifier for the calendar',
  })
  slug: string;

  @ApiProperty({
    example: 'America/New_York',
    description: 'Timezone for the calendar',
  })
  timezone: string;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'When the calendar was created',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'When the calendar was last updated',
  })
  updatedAt: Date;
}
