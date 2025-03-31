import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, Document } from 'mongoose';
import { EventType } from '../schemas/event-type.schema';
import { CreateEventTypeDto } from './dto/create-event-type.dto';
import { UpdateEventTypeDto } from './dto/update-event-type.dto';
import { CalendarsService } from '../calendars/calendars.service';
import { SchedulesService } from '../schedules/schedules.service';

@Injectable()
export class EventTypesService {
  constructor(
    @InjectModel(EventType.name)
    private eventTypeModel: Model<EventType & Document>,
    private calendarsService: CalendarsService,
    private schedulesService: SchedulesService,
  ) {}

  async create(
    calendarId: string,
    createEventTypeDto: CreateEventTypeDto,
  ): Promise<EventType> {
    if (!Types.ObjectId.isValid(calendarId)) {
      throw new BadRequestException('Invalid calendar ID');
    }

    // Check if calendar exists and user has access to it
    await this.calendarsService.findOne(calendarId);

    // Check if schedule exists
    await this.schedulesService.findOne(
      createEventTypeDto.availabilityScheduleId,
    );

    // Check if event type with same slug already exists for this calendar
    const existingEventType = await this.eventTypeModel.findOne({
      calendarId: new Types.ObjectId(calendarId),
      slug: createEventTypeDto.slug,
    });

    if (existingEventType) {
      throw new BadRequestException('Event type with this slug already exists');
    }

    const eventType = await this.eventTypeModel.create({
      ...createEventTypeDto,
      calendarId: new Types.ObjectId(calendarId),
      availabilityScheduleId: new Types.ObjectId(
        createEventTypeDto.availabilityScheduleId,
      ),
      color: createEventTypeDto.color || '#3174F1',
      bufferTimeBefore: createEventTypeDto.bufferTimeBefore || 0,
      bufferTimeAfter: createEventTypeDto.bufferTimeAfter || 0,
    });

    return eventType;
  }

  async findAll(calendarId: string): Promise<EventType[]> {
    if (!Types.ObjectId.isValid(calendarId)) {
      throw new BadRequestException('Invalid calendar ID');
    }

    // Check if calendar exists and user has access to it
    await this.calendarsService.findOne(calendarId);

    return this.eventTypeModel.find({
      calendarId: new Types.ObjectId(calendarId),
    });
  }

  async findOne(id: string): Promise<EventType> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid event type ID');
    }

    const eventType = await this.eventTypeModel.findById(id);
    if (!eventType) {
      throw new NotFoundException('Event type not found');
    }

    return eventType;
  }

  async findBySlug(calendarId: string, slug: string): Promise<EventType> {
    if (!Types.ObjectId.isValid(calendarId)) {
      throw new BadRequestException('Invalid calendar ID');
    }

    const eventType = await this.eventTypeModel.findOne({
      calendarId: new Types.ObjectId(calendarId),
      slug,
    });

    if (!eventType) {
      throw new NotFoundException('Event type not found');
    }

    return eventType;
  }

  async update(
    id: string,
    updateEventTypeDto: UpdateEventTypeDto,
  ): Promise<EventType> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid event type ID');
    }

    // Find the existing event type
    const existingEventType = await this.findOne(id);

    // If availabilityScheduleId is being updated, check if it exists
    if (updateEventTypeDto.availabilityScheduleId) {
      await this.schedulesService.findOne(
        updateEventTypeDto.availabilityScheduleId,
      );
    }

    // If slug is being updated, check if it already exists
    if (updateEventTypeDto.slug) {
      const duplicateSlug = await this.eventTypeModel.findOne({
        _id: { $ne: new Types.ObjectId(id) },
        calendarId: existingEventType.calendarId,
        slug: updateEventTypeDto.slug,
      });

      if (duplicateSlug) {
        throw new BadRequestException(
          'Event type with this slug already exists',
        );
      }
    }

    // Create a copy of the DTO to modify
    const updateData = { ...updateEventTypeDto };

    // Process MongoDB ObjectId fields
    if (updateData.availabilityScheduleId) {
      updateData.availabilityScheduleId = new Types.ObjectId(
        updateData.availabilityScheduleId,
      ) as any; // Use 'any' to bypass TypeScript's type checking
    }

    const eventType = await this.eventTypeModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true },
    );

    if (!eventType) {
      throw new NotFoundException('Event type not found');
    }

    return eventType;
  }

  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid event type ID');
    }

    const result = await this.eventTypeModel.deleteOne({
      _id: new Types.ObjectId(id),
    });

    if (result.deletedCount === 0) {
      throw new NotFoundException('Event type not found');
    }
  }
}
