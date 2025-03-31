import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { SlotsService } from './slots.service';
import { UpdateSlotDto } from './dto/update-slot.dto';
import { GenerateSlotsDto } from './dto/generate-slots.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CalendarOwnerGuard } from '../calendars/guards/calendar-owner.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SlotResponseDto } from './dto/slot-response.dto';
import { AvailabilityQueryDto } from './dto/availability-query.dto';

@ApiTags('Slots')
@Controller('calendars/:calendarId/slots')
@ApiBearerAuth()
export class SlotsController {
  constructor(private readonly slotsService: SlotsService) {}

  @Post('generate')
  @UseGuards(JwtAuthGuard, CalendarOwnerGuard)
  @ApiOperation({ summary: 'Generate slots for a calendar' })
  @ApiParam({ name: 'calendarId', description: 'Calendar ID' })
  @ApiResponse({
    status: 201,
    description: 'Slots have been generated',
    type: Object,
  })
  generate(
    @Param('calendarId') calendarId: string,
    @Body() generateSlotsDto: GenerateSlotsDto,
  ) {
    return this.slotsService.generateSlots(calendarId, generateSlotsDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, CalendarOwnerGuard)
  @ApiOperation({ summary: 'Get all slots for a calendar' })
  @ApiParam({ name: 'calendarId', description: 'Calendar ID' })
  @ApiResponse({
    status: 200,
    description: 'Return all slots for this calendar',
    type: [SlotResponseDto],
  })
  findAll(@Param('calendarId') calendarId: string) {
    return this.slotsService.findAll(calendarId);
  }

  @Get('event-types/:eventTypeId/availability')
  @ApiOperation({ summary: 'Get available slots for an event type' })
  @ApiParam({ name: 'calendarId', description: 'Calendar ID' })
  @ApiParam({ name: 'eventTypeId', description: 'Event Type ID' })
  @ApiResponse({
    status: 200,
    description: 'Return available slots for this event type',
    type: [SlotResponseDto],
  })
  findAvailableSlots(
    @Param('calendarId') calendarId: string,
    @Param('eventTypeId') eventTypeId: string,
    @Query() availabilityQuery: AvailabilityQueryDto,
  ) {
    return this.slotsService.findAvailableSlots(
      calendarId,
      eventTypeId,
      availabilityQuery,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a slot by ID' })
  @ApiParam({ name: 'calendarId', description: 'Calendar ID' })
  @ApiParam({ name: 'id', description: 'Slot ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the slot',
    type: SlotResponseDto,
  })
  findOne(@Param('id') id: string) {
    return this.slotsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, CalendarOwnerGuard)
  @ApiOperation({ summary: 'Update a slot' })
  @ApiParam({ name: 'calendarId', description: 'Calendar ID' })
  @ApiParam({ name: 'id', description: 'Slot ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the updated slot',
    type: SlotResponseDto,
  })
  update(@Param('id') id: string, @Body() updateSlotDto: UpdateSlotDto) {
    return this.slotsService.update(id, updateSlotDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, CalendarOwnerGuard)
  @ApiOperation({ summary: 'Delete a slot' })
  @ApiParam({ name: 'calendarId', description: 'Calendar ID' })
  @ApiParam({ name: 'id', description: 'Slot ID' })
  @ApiResponse({ status: 204, description: 'Slot has been deleted' })
  remove(@Param('id') id: string) {
    return this.slotsService.remove(id);
  }
}
