import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, Document } from 'mongoose';
import { Booking, BookingStatus } from '../schemas/booking.schema';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { SlotsService } from '../slots/slots.service';
import { EventTypesService } from '../event-types/event-types.service';
import { SlotStatus } from '../schemas/slot.schema';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name)
    private bookingModel: Model<Booking & Document>,
    private slotsService: SlotsService,
    private eventTypesService: EventTypesService,
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    const { slotId, name, email, notes } = createBookingDto;

    if (!Types.ObjectId.isValid(slotId)) {
      throw new BadRequestException('Invalid slot ID');
    }

    // Get the slot
    const slot = await this.slotsService.findOne(slotId);

    // Check if slot is available
    if (slot.status !== SlotStatus.AVAILABLE) {
      throw new BadRequestException('Slot is not available');
    }

    // Get the event type to validate it exists
    const eventTypeId =
      slot.eventTypeId instanceof Types.ObjectId
        ? slot.eventTypeId.toString()
        : String(slot.eventTypeId);

    await this.eventTypesService.findOne(eventTypeId);

    // Create booking
    const booking = await this.bookingModel.create({
      slotId: new Types.ObjectId(slotId),
      calendarId: slot.calendarId,
      eventTypeId: slot.eventTypeId,
      attendeeName: name,
      attendeeEmail: email,
      notes,
      status: BookingStatus.CONFIRMED,
      startTime: slot.startTime,
      endTime: slot.endTime,
    });

    // Mark slot as booked
    await this.slotsService.update(slotId, { status: SlotStatus.BOOKED });

    return booking;
  }

  async findAll(calendarId?: string): Promise<Booking[]> {
    if (calendarId) {
      if (!Types.ObjectId.isValid(calendarId)) {
        throw new BadRequestException('Invalid calendar ID');
      }
      return this.bookingModel.find({
        calendarId: new Types.ObjectId(calendarId),
      });
    }
    return this.bookingModel.find();
  }

  async findOne(id: string): Promise<Booking> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid booking ID');
    }

    const booking = await this.bookingModel.findById(id);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  async update(
    id: string,
    updateBookingDto: UpdateBookingDto,
  ): Promise<Booking> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid booking ID');
    }

    const booking = await this.bookingModel.findByIdAndUpdate(
      id,
      updateBookingDto,
      { new: true },
    );

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  async cancel(id: string, reason?: string): Promise<Booking> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid booking ID');
    }

    const booking = await this.findOne(id);

    // Update the booking status
    booking.status = BookingStatus.CANCELLED;
    if (reason) {
      booking.cancelReason = reason;
    }
    await booking.save();

    // Make the slot available again
    const slotId =
      booking.slotId instanceof Types.ObjectId
        ? booking.slotId.toString()
        : String(booking.slotId);

    await this.slotsService.update(slotId, {
      status: SlotStatus.AVAILABLE,
    });

    return booking;
  }

  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid booking ID');
    }

    const result = await this.bookingModel.deleteOne({
      _id: new Types.ObjectId(id),
    });

    if (result.deletedCount === 0) {
      throw new NotFoundException('Booking not found');
    }
  }
}
