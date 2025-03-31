import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CalendarsService } from './calendars.service';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { UpdateCalendarDto } from './dto/update-calendar.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CalendarOwnerGuard } from './guards/calendar-owner.guard';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CalendarResponseDto } from './dto/calendar-response.dto';
import { RequestWithUser } from '../auth/interfaces/request-with-user.interface';

@ApiTags('Calendars')
@Controller({
  path: 'calendars',
  version: '1',
})
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CalendarsController {
  constructor(private readonly calendarsService: CalendarsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new calendar' })
  @ApiCreatedResponse({
    description: 'The calendar has been successfully created.',
    type: CalendarResponseDto,
  })
  async create(
    @Request() req: RequestWithUser,
    @Body() createCalendarDto: CreateCalendarDto,
  ) {
    return this.calendarsService.create(req.user.userId, createCalendarDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all calendars for the current user' })
  @ApiOkResponse({
    description: 'List of calendars for the current user.',
    type: [CalendarResponseDto],
  })
  async findAll(@Request() req: RequestWithUser) {
    return this.calendarsService.findAll(req.user.userId);
  }

  @Get(':id')
  @UseGuards(CalendarOwnerGuard)
  @ApiOperation({ summary: 'Get a specific calendar by ID' })
  @ApiParam({ name: 'id', description: 'Calendar ID' })
  @ApiOkResponse({
    description: 'The calendar has been successfully retrieved.',
    type: CalendarResponseDto,
  })
  async findOne(@Param('id') id: string) {
    return this.calendarsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(CalendarOwnerGuard)
  @ApiOperation({ summary: 'Update a calendar' })
  @ApiParam({ name: 'id', description: 'Calendar ID' })
  @ApiOkResponse({
    description: 'The calendar has been successfully updated.',
    type: CalendarResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateCalendarDto: UpdateCalendarDto,
  ) {
    return this.calendarsService.update(id, updateCalendarDto);
  }

  @Delete(':id')
  @UseGuards(CalendarOwnerGuard)
  @ApiOperation({ summary: 'Delete a calendar' })
  @ApiParam({ name: 'id', description: 'Calendar ID' })
  @ApiOkResponse({ description: 'The calendar has been successfully deleted.' })
  async remove(@Param('id') id: string) {
    await this.calendarsService.remove(id);
    return { message: 'Calendar deleted successfully' };
  }
}
