import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, Document } from 'mongoose';
import { Calendar } from '../schemas/calendar.schema';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { UpdateCalendarDto } from './dto/update-calendar.dto';

@Injectable()
export class CalendarsService {
  constructor(
    @InjectModel(Calendar.name)
    private calendarModel: Model<Calendar & Document>,
  ) {}

  async create(
    userId: string,
    createCalendarDto: CreateCalendarDto,
  ): Promise<Calendar> {
    // Check if calendar with same slug already exists for this user
    const existingCalendar = await this.calendarModel.findOne({
      userId: new Types.ObjectId(userId),
      slug: createCalendarDto.slug,
    });

    if (existingCalendar) {
      throw new BadRequestException('Calendar with this slug already exists');
    }

    const calendar = await this.calendarModel.create({
      ...createCalendarDto,
      userId: new Types.ObjectId(userId),
    });

    return calendar;
  }

  async findAll(userId: string): Promise<Calendar[]> {
    return this.calendarModel.find({ userId: new Types.ObjectId(userId) });
  }

  async findOne(id: string): Promise<Calendar> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid calendar ID');
    }

    const calendar = await this.calendarModel.findById(id);
    if (!calendar) {
      throw new NotFoundException('Calendar not found');
    }

    return calendar;
  }

  async findBySlug(slug: string): Promise<Calendar> {
    const calendar = await this.calendarModel.findOne({ slug });
    if (!calendar) {
      throw new NotFoundException('Calendar not found');
    }

    return calendar;
  }

  async update(
    id: string,
    updateCalendarDto: UpdateCalendarDto,
  ): Promise<Calendar> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid calendar ID');
    }

    // If slug is being updated, check if it already exists
    if (updateCalendarDto.slug) {
      const existingCalendar = await this.calendarModel.findOne({
        _id: { $ne: new Types.ObjectId(id) },
        slug: updateCalendarDto.slug,
      });

      if (existingCalendar) {
        throw new BadRequestException('Calendar with this slug already exists');
      }
    }

    const calendar = await this.calendarModel.findByIdAndUpdate(
      id,
      updateCalendarDto,
      { new: true },
    );

    if (!calendar) {
      throw new NotFoundException('Calendar not found');
    }

    return calendar;
  }

  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid calendar ID');
    }

    const result = await this.calendarModel.deleteOne({
      _id: new Types.ObjectId(id),
    });

    if (result.deletedCount === 0) {
      throw new NotFoundException('Calendar not found');
    }
  }
}
