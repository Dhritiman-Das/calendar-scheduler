import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCalendarDto {
  @ApiProperty({
    example: 'Work Calendar',
    description: 'Name of the calendar',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @ApiProperty({
    example: 'My work appointments',
    description: 'Description of the calendar',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @ApiProperty({
    example: 'work-calendar',
    description: 'URL friendly identifier for the calendar',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  slug: string;

  @ApiProperty({
    example: 'America/New_York',
    description: 'Timezone for the calendar',
    default: 'UTC',
  })
  @IsString()
  @IsOptional()
  timezone?: string;
}
