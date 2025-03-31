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
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
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
import { ScheduleResponseDto } from './dto/schedule-response.dto';

@ApiTags('Availability Schedules')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller({
  version: '1',
})
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Post('calendars/:calendarId/schedules')
  @UseGuards(CalendarOwnerGuard)
  @ApiOperation({
    summary: 'Create a new availability schedule for a calendar',
  })
  @ApiParam({ name: 'calendarId', description: 'Calendar ID' })
  @ApiCreatedResponse({
    description: 'The schedule has been successfully created.',
    type: ScheduleResponseDto,
  })
  async create(
    @Param('calendarId') calendarId: string,
    @Body() createScheduleDto: CreateScheduleDto,
  ) {
    return this.schedulesService.create(calendarId, createScheduleDto);
  }

  @Get('calendars/:calendarId/schedules')
  @UseGuards(CalendarOwnerGuard)
  @ApiOperation({ summary: 'Get all availability schedules for a calendar' })
  @ApiParam({ name: 'calendarId', description: 'Calendar ID' })
  @ApiOkResponse({
    description: 'List of schedules for the calendar.',
    type: [ScheduleResponseDto],
  })
  async findAll(@Param('calendarId') calendarId: string) {
    return this.schedulesService.findAll(calendarId);
  }

  @Get('schedules/:id')
  @ApiOperation({ summary: 'Get a specific availability schedule by ID' })
  @ApiParam({ name: 'id', description: 'Schedule ID' })
  @ApiOkResponse({
    description: 'The schedule has been successfully retrieved.',
    type: ScheduleResponseDto,
  })
  async findOne(@Param('id') id: string) {
    return this.schedulesService.findOne(id);
  }

  @Patch('schedules/:id')
  @ApiOperation({ summary: 'Update an availability schedule' })
  @ApiParam({ name: 'id', description: 'Schedule ID' })
  @ApiOkResponse({
    description: 'The schedule has been successfully updated.',
    type: ScheduleResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {
    return this.schedulesService.update(id, updateScheduleDto);
  }

  @Delete('schedules/:id')
  @ApiOperation({ summary: 'Delete an availability schedule' })
  @ApiParam({ name: 'id', description: 'Schedule ID' })
  @ApiOkResponse({ description: 'The schedule has been successfully deleted.' })
  async remove(@Param('id') id: string) {
    await this.schedulesService.remove(id);
    return { message: 'Schedule deleted successfully' };
  }
}
