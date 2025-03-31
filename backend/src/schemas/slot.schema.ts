import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Calendar } from './calendar.schema';
import { EventType } from './event-type.schema';

export enum SlotStatus {
  AVAILABLE = 'AVAILABLE',
  BOOKED = 'BOOKED',
}

@Schema({ timestamps: true })
export class Slot extends Document {
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
  startTime: Date;

  @Prop({ required: true })
  endTime: Date;

  @Prop({ type: String, enum: SlotStatus, default: SlotStatus.AVAILABLE })
  status: SlotStatus;
}

export const SlotSchema = SchemaFactory.createForClass(Slot);
