import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, Document } from 'mongoose';
import { AvailabilitySchedule } from '../schemas/availability-schedule.schema';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { CalendarsService } from '../calendars/calendars.service';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectModel(AvailabilitySchedule.name)
    private scheduleModel: Model<AvailabilitySchedule & Document>,
    private calendarsService: CalendarsService,
  ) {}

  async create(
    calendarId: string,
    createScheduleDto: CreateScheduleDto,
  ): Promise<AvailabilitySchedule> {
    if (!Types.ObjectId.isValid(calendarId)) {
      throw new BadRequestException('Invalid calendar ID');
    }

    // Check if calendar exists and user has access to it
    await this.calendarsService.findOne(calendarId);

    // Validate that start time is before end time
    if (
      !this.isValidTimeRange(
        createScheduleDto.startTime,
        createScheduleDto.endTime,
      )
    ) {
      throw new BadRequestException('Start time must be before end time');
    }

    const schedule = await this.scheduleModel.create({
      ...createScheduleDto,
      calendarId: new Types.ObjectId(calendarId),
    });

    return schedule;
  }

  async findAll(calendarId: string): Promise<AvailabilitySchedule[]> {
    if (!Types.ObjectId.isValid(calendarId)) {
      throw new BadRequestException('Invalid calendar ID');
    }

    // Check if calendar exists and user has access to it
    await this.calendarsService.findOne(calendarId);

    return this.scheduleModel.find({
      calendarId: new Types.ObjectId(calendarId),
    });
  }

  async findOne(id: string): Promise<AvailabilitySchedule> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid schedule ID');
    }

    const schedule = await this.scheduleModel.findById(id);
    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }

    return schedule;
  }

  async update(
    id: string,
    updateScheduleDto: UpdateScheduleDto,
  ): Promise<AvailabilitySchedule> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid schedule ID');
    }

    // Check if schedule exists
    const existingSchedule = await this.findOne(id);

    // Validate that start time is before end time if provided
    const startTime = updateScheduleDto.startTime || existingSchedule.startTime;
    const endTime = updateScheduleDto.endTime || existingSchedule.endTime;

    if (!this.isValidTimeRange(startTime, endTime)) {
      throw new BadRequestException('Start time must be before end time');
    }

    const schedule = await this.scheduleModel.findByIdAndUpdate(
      id,
      updateScheduleDto,
      { new: true },
    );

    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }

    return schedule;
  }

  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid schedule ID');
    }

    const result = await this.scheduleModel.deleteOne({
      _id: new Types.ObjectId(id),
    });

    if (result.deletedCount === 0) {
      throw new NotFoundException('Schedule not found');
    }
  }

  private isValidTimeRange(startTime: string, endTime: string): boolean {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    if (startHour < endHour) {
      return true;
    }

    if (startHour === endHour) {
      return startMinute < endMinute;
    }

    return false;
  }
}
