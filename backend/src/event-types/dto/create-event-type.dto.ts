import { ApiProperty } from '@nestjs/swagger';
import {
  IsHexColor,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateEventTypeDto {
  @ApiProperty({
    example: 'Consultation',
    description: 'Title of the event type',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  title: string;

  @ApiProperty({
    example: 'consultation',
    description: 'URL friendly identifier for the event type',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  slug: string;

  @ApiProperty({
    example: 'Initial consultation session',
    description: 'Description of the event type',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @ApiProperty({
    example: 30,
    description: 'Duration in minutes (15, 30, 60)',
  })
  @IsInt()
  @Min(5)
  @Max(240)
  duration: number;

  @ApiProperty({
    example: '#3174F1',
    description: 'Color for UI display',
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsHexColor()
  color?: string;

  @ApiProperty({
    example: '60d21b4667d0d8992e610c85',
    description: 'ID of the availability schedule to use',
  })
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  availabilityScheduleId: string;

  @ApiProperty({
    example: 5,
    description: 'Buffer time in minutes before each slot',
    required: false,
  })
  @IsInt()
  @IsOptional()
  @Min(0)
  @Max(60)
  bufferTimeBefore?: number;

  @ApiProperty({
    example: 5,
    description: 'Buffer time in minutes after each slot',
    required: false,
  })
  @IsInt()
  @IsOptional()
  @Min(0)
  @Max(60)
  bufferTimeAfter?: number;
}
