import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BookingStatus } from '../../schemas/booking.schema';

export class UpdateBookingDto {
  @ApiProperty({
    example: 'CONFIRMED',
    description: 'Status of the booking',
    enum: BookingStatus,
    required: false,
  })
  @IsEnum(BookingStatus)
  @IsOptional()
  status?: BookingStatus;

  @ApiProperty({
    example: 'Discussion about project updates',
    description: 'Additional notes for the booking',
    required: false,
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
