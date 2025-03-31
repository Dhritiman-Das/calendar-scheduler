import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class GenerateSlotsDto {
  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Start date for slot generation',
  })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({
    example: '2023-01-31T23:59:59.999Z',
    description: 'End date for slot generation',
  })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({
    example: '60d21b4667d0d8992e610c85',
    description: 'Event type ID to generate slots for (optional)',
    required: false,
  })
  @IsMongoId()
  @IsOptional()
  eventTypeId?: string;
}
