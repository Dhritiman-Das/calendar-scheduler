import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class AvailabilityQueryDto {
  @ApiProperty({
    example: '2023-01-01',
    description: 'Start date for availability query',
  })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({
    example: '2023-01-07',
    description: 'End date for availability query',
    required: false,
  })
  @IsDateString()
  endDate?: string;
}
