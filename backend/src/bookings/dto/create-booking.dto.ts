import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({
    example: '60d21b4667d0d8992e610c85',
    description: 'ID of the slot to book',
  })
  @IsMongoId()
  @IsNotEmpty()
  slotId: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Name of the person booking',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'Email of the person booking',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'Discussion about project',
    description: 'Additional notes for the booking',
    required: false,
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
