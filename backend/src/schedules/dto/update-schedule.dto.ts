import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ArrayMinSize,
  ArrayMaxSize,
  Min,
  Max,
  IsNumber,
  Matches,
} from 'class-validator';

export class UpdateScheduleDto {
  @ApiProperty({
    example: 'Work Hours',
    description: 'Name of the availability schedule',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(50)
  name?: string;

  @ApiProperty({
    example: [1, 2, 3, 4, 5],
    description: 'Days of week (1-7, where 1 is Monday and 7 is Sunday)',
    type: [Number],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @ArrayMinSize(1)
  @ArrayMaxSize(7)
  @IsNumber({}, { each: true })
  @Min(1, { each: true })
  @Max(7, { each: true })
  daysOfWeek?: number[];

  @ApiProperty({
    example: '09:00',
    description: 'Start time in 24-hour format (HH:MM)',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Start time must be in 24-hour format (HH:MM)',
  })
  startTime?: string;

  @ApiProperty({
    example: '17:00',
    description: 'End time in 24-hour format (HH:MM)',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'End time must be in 24-hour format (HH:MM)',
  })
  endTime?: string;
}
