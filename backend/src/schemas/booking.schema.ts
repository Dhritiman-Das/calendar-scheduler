import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Calendar } from './calendar.schema';
import { EventType } from './event-type.schema';
import { Slot } from './slot.schema';

export enum BookingStatus {
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  RESCHEDULED = 'RESCHEDULED',
}

@Schema({ timestamps: true })
export class Booking extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Slot', required: true })
  slotId: Slot;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Calendar',
    required: true,
  })
  calendarId: Calendar;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'EventType',
    required: true,
  })
  eventTypeId: EventType;

  @Prop({ required: true })
  attendeeName: string;

  @Prop({ required: true })
  attendeeEmail: string;

  @Prop()
  attendeePhone: string;

  @Prop()
  notes: string;

  @Prop({ type: String, enum: BookingStatus, default: BookingStatus.CONFIRMED })
  status: BookingStatus;

  @Prop()
  cancelReason: string;

  @Prop({ type: Object })
  rescheduleInfo: {
    previousSlotId: MongooseSchema.Types.ObjectId;
    rescheduleReason: string;
  };
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
