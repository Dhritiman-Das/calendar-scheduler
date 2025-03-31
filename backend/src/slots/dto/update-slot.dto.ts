import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { SlotStatus } from '../../schemas/slot.schema';

export class UpdateSlotDto {
  @ApiProperty({
    example: 'AVAILABLE',
    description: 'Status of the slot',
    enum: SlotStatus,
    required: false,
  })
  @IsEnum(SlotStatus)
  @IsOptional()
  status?: SlotStatus;
}
