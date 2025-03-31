import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateCalendarDto {
  @ApiProperty({
    example: 'Work Calendar',
    description: 'Name of the calendar',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(50)
  name?: string;

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
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(50)
  slug?: string;

  @ApiProperty({
    example: 'America/New_York',
    description: 'Timezone for the calendar',
    required: false,
  })
  @IsString()
  @IsOptional()
  timezone?: string;
}
