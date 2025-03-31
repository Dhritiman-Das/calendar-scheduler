import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, Document } from 'mongoose';
import { Slot, SlotStatus } from '../schemas/slot.schema';
import { UpdateSlotDto } from './dto/update-slot.dto';
import { GenerateSlotsDto } from './dto/generate-slots.dto';
import { CalendarsService } from '../calendars/calendars.service';
import { EventTypesService } from '../event-types/event-types.service';
import { SchedulesService } from '../schedules/schedules.service';
import { AvailabilityQueryDto } from './dto/availability-query.dto';
import { EventType } from '../schemas/event-type.schema';

@Injectable()
export class SlotsService {
  constructor(
    @InjectModel(Slot.name)
    private slotModel: Model<Slot & Document>,
    private calendarsService: CalendarsService,
    private eventTypesService: EventTypesService,
    private schedulesService: SchedulesService,
  ) {}

  async generateSlots(
    calendarId: string,
    generateSlotsDto: GenerateSlotsDto,
  ): Promise<{ total: number; message: string }> {
    if (!Types.ObjectId.isValid(calendarId)) {
      throw new BadRequestException('Invalid calendar ID');
    }

    // Check if calendar exists and user has access to it
    await this.calendarsService.findOne(calendarId);

    const startDate = new Date(generateSlotsDto.startDate);
    const endDate = new Date(generateSlotsDto.endDate);

    if (startDate >= endDate) {
      throw new BadRequestException('Start date must be before end date');
    }

    // Get all event types for this calendar, or specific one if provided
    let eventTypes: EventType[] = [];
    if (generateSlotsDto.eventTypeId) {
      if (!Types.ObjectId.isValid(generateSlotsDto.eventTypeId)) {
        throw new BadRequestException('Invalid event type ID');
      }
      const eventType = await this.eventTypesService.findOne(
        generateSlotsDto.eventTypeId,
      );

      // Safe way to convert calendarId to string
      let eventTypeCalendarId: string;
      if (eventType.calendarId instanceof Types.ObjectId) {
        eventTypeCalendarId = eventType.calendarId.toString();
      } else if (typeof eventType.calendarId === 'string') {
        eventTypeCalendarId = eventType.calendarId;
      } else {
        eventTypeCalendarId = String(eventType.calendarId);
      }

      if (eventTypeCalendarId !== calendarId) {
        throw new BadRequestException(
          'Event type does not belong to this calendar',
        );
      }
      eventTypes = [eventType];
    } else {
      eventTypes = await this.eventTypesService.findAll(calendarId);
    }

    if (eventTypes.length === 0) {
      throw new BadRequestException(
        'No event types found. Please create at least one event type for this calendar',
      );
    }

    // Delete any existing slots in this date range for these event types
    const eventTypeIds = eventTypes.map((et) => et._id);
    await this.slotModel.deleteMany({
      calendarId: new Types.ObjectId(calendarId),
      eventTypeId: { $in: eventTypeIds },
      startTime: { $gte: startDate, $lte: endDate },
    });

    // Generate slots for each event type
    let totalSlotsGenerated = 0;
    for (const eventType of eventTypes) {
      try {
        // Get the availability schedule for this event type
        let scheduleId: string;
        if (eventType.availabilityScheduleId instanceof Types.ObjectId) {
          scheduleId = eventType.availabilityScheduleId.toString();
        } else if (typeof eventType.availabilityScheduleId === 'string') {
          scheduleId = eventType.availabilityScheduleId;
        } else {
          scheduleId = String(eventType.availabilityScheduleId);
        }

        const schedule = await this.schedulesService.findOne(scheduleId);

        // Generate slots
        const slotsToCreate = await this.generateSlotsForEventType(
          startDate,
          endDate,
          schedule.daysOfWeek,
          schedule.startTime,
          schedule.endTime,
          eventType,
          calendarId,
        );

        if (slotsToCreate.length > 0) {
          await this.slotModel.insertMany(slotsToCreate);
          totalSlotsGenerated += slotsToCreate.length;
        }
      } catch (error) {
        console.error(
          `Error generating slots for event type ${String(eventType._id)}:`,
          error,
        );
        // Continue with next event type
      }
    }

    return {
      total: totalSlotsGenerated,
      message: `Generated ${totalSlotsGenerated} slots for the specified date range`,
    };
  }

  async findAll(calendarId: string): Promise<Slot[]> {
    if (!Types.ObjectId.isValid(calendarId)) {
      throw new BadRequestException('Invalid calendar ID');
    }

    // Check if calendar exists and user has access to it
    await this.calendarsService.findOne(calendarId);

    return this.slotModel.find({
      calendarId: new Types.ObjectId(calendarId),
    });
  }

  async findAvailableSlots(
    calendarId: string,
    eventTypeId: string,
    availabilityQuery: AvailabilityQueryDto,
  ): Promise<Slot[]> {
    if (!Types.ObjectId.isValid(calendarId)) {
      throw new BadRequestException('Invalid calendar ID');
    }

    if (!Types.ObjectId.isValid(eventTypeId)) {
      throw new BadRequestException('Invalid event type ID');
    }

    // Parse dates
    const startDate = new Date(availabilityQuery.startDate);
    // If no end date provided, default to 7 days from start date
    const endDate = availabilityQuery.endDate
      ? new Date(availabilityQuery.endDate)
      : new Date(startDate);

    if (!availabilityQuery.endDate) {
      endDate.setDate(startDate.getDate() + 7);
    }

    // Set time to end of day for endDate
    endDate.setHours(23, 59, 59, 999);

    // Check if the calendar and event type exist
    await this.calendarsService.findOne(calendarId);
    await this.eventTypesService.findOne(eventTypeId);

    // Find all available slots in the date range
    return this.slotModel
      .find({
        calendarId: new Types.ObjectId(calendarId),
        eventTypeId: new Types.ObjectId(eventTypeId),
        startTime: { $gte: startDate, $lte: endDate },
        status: SlotStatus.AVAILABLE,
      })
      .sort({ startTime: 1 });
  }

  async findOne(id: string): Promise<Slot> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid slot ID');
    }

    const slot = await this.slotModel.findById(id);
    if (!slot) {
      throw new NotFoundException('Slot not found');
    }

    return slot;
  }

  async update(id: string, updateSlotDto: UpdateSlotDto): Promise<Slot> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid slot ID');
    }

    const slot = await this.slotModel.findByIdAndUpdate(id, updateSlotDto, {
      new: true,
    });

    if (!slot) {
      throw new NotFoundException('Slot not found');
    }

    return slot;
  }

  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid slot ID');
    }

    const result = await this.slotModel.deleteOne({
      _id: new Types.ObjectId(id),
    });

    if (result.deletedCount === 0) {
      throw new NotFoundException('Slot not found');
    }
  }

  private async generateSlotsForEventType(
    startDate: Date,
    endDate: Date,
    daysOfWeek: number[],
    scheduleStartTime: string, // Format: "09:00"
    scheduleEndTime: string, // Format: "17:00"
    eventType: EventType,
    calendarId: string,
  ): Promise<Partial<Slot>[]> {
    const slots: Partial<Slot>[] = [];
    const currentDate = new Date(startDate);
    const [startHour, startMinute] = scheduleStartTime.split(':').map(Number);
    const [endHour, endMinute] = scheduleEndTime.split(':').map(Number);
    const durationMinutes = eventType.duration || 30; // Default 30 minutes if not specified
    const bufferAfterMinutes = eventType.bufferTimeAfter || 0;
    const totalSlotMinutes = durationMinutes + bufferAfterMinutes;

    // Loop through each day in the date range
    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay() === 0 ? 7 : currentDate.getDay(); // Convert Sunday (0) to 7 for compatibility

      // Check if this day is in the availability schedule
      if (daysOfWeek.includes(dayOfWeek)) {
        // Create slots for this day
        const slotStartDate = new Date(currentDate);
        slotStartDate.setHours(startHour, startMinute, 0, 0);

        const slotEndDate = new Date(currentDate);
        slotEndDate.setHours(endHour, endMinute, 0, 0);

        // Create slots in the schedule time range with buffer consideration
        let currentSlotStart = new Date(slotStartDate);

        while (true) {
          const slotEndTime = new Date(currentSlotStart);
          slotEndTime.setMinutes(slotEndTime.getMinutes() + durationMinutes);

          // Calculate next slot start time including buffer
          const nextSlotStart = new Date(currentSlotStart);
          nextSlotStart.setMinutes(
            nextSlotStart.getMinutes() + totalSlotMinutes,
          );

          const calendar = await this.calendarsService.findOne(calendarId);

          // Check if the slot fits within schedule hours
          if (slotEndTime <= slotEndDate) {
            slots.push({
              calendarId: calendar,
              eventTypeId: eventType,
              startTime: new Date(currentSlotStart),
              endTime: new Date(slotEndTime),
              status: SlotStatus.AVAILABLE,
            });
          } else {
            // We've reached the end of the schedule for today
            break;
          }

          // Move to the next slot
          currentSlotStart = nextSlotStart;
        }
      }

      // Move to the next day
      currentDate.setDate(currentDate.getDate() + 1);
      currentDate.setHours(0, 0, 0, 0);
    }

    return slots;
  }
}
