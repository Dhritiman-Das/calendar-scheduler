import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { EventTypesService } from './event-types.service';
import { CreateEventTypeDto } from './dto/create-event-type.dto';
import { UpdateEventTypeDto } from './dto/update-event-type.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CalendarOwnerGuard } from '../calendars/guards/calendar-owner.guard';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { EventTypeResponseDto } from './dto/event-type-response.dto';

@ApiTags('Event Types')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller({
  version: '1',
})
export class EventTypesController {
  constructor(private readonly eventTypesService: EventTypesService) {}

  @Post('calendars/:calendarId/event-types')
  @UseGuards(CalendarOwnerGuard)
  @ApiOperation({ summary: 'Create a new event type for a calendar' })
  @ApiParam({ name: 'calendarId', description: 'Calendar ID' })
  @ApiCreatedResponse({
    description: 'The event type has been successfully created.',
    type: EventTypeResponseDto,
  })
  async create(
    @Param('calendarId') calendarId: string,
    @Body() createEventTypeDto: CreateEventTypeDto,
  ) {
    return this.eventTypesService.create(calendarId, createEventTypeDto);
  }

  @Get('calendars/:calendarId/event-types')
  @UseGuards(CalendarOwnerGuard)
  @ApiOperation({ summary: 'Get all event types for a calendar' })
  @ApiParam({ name: 'calendarId', description: 'Calendar ID' })
  @ApiOkResponse({
    description: 'List of event types for the calendar.',
    type: [EventTypeResponseDto],
  })
  async findAll(@Param('calendarId') calendarId: string) {
    return this.eventTypesService.findAll(calendarId);
  }

  @Get('event-types/:id')
  @ApiOperation({ summary: 'Get a specific event type by ID' })
  @ApiParam({ name: 'id', description: 'Event Type ID' })
  @ApiOkResponse({
    description: 'The event type has been successfully retrieved.',
    type: EventTypeResponseDto,
  })
  async findOne(@Param('id') id: string) {
    return this.eventTypesService.findOne(id);
  }

  @Patch('event-types/:id')
  @ApiOperation({ summary: 'Update an event type' })
  @ApiParam({ name: 'id', description: 'Event Type ID' })
  @ApiOkResponse({
    description: 'The event type has been successfully updated.',
    type: EventTypeResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateEventTypeDto: UpdateEventTypeDto,
  ) {
    return this.eventTypesService.update(id, updateEventTypeDto);
  }

  @Delete('event-types/:id')
  @ApiOperation({ summary: 'Delete an event type' })
  @ApiParam({ name: 'id', description: 'Event Type ID' })
  @ApiOkResponse({
    description: 'The event type has been successfully deleted.',
  })
  async remove(@Param('id') id: string) {
    await this.eventTypesService.remove(id);
    return { message: 'Event type deleted successfully' };
  }
}
