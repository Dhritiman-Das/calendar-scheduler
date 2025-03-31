import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Calendar } from './calendar.schema';

@Schema({ timestamps: true })
export class AvailabilitySchedule extends Document {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Calendar',
    required: true,
  })
  calendarId: Calendar;

  @Prop({ required: true })
  name: string;

  @Prop({ type: [Number], required: true, default: [1, 2, 3, 4, 5] }) // Monday to Friday
  daysOfWeek: number[];

  @Prop({ required: true })
  startTime: string; // "09:00" format

  @Prop({ required: true })
  endTime: string; // "17:00" format
}

export const AvailabilityScheduleSchema =
  SchemaFactory.createForClass(AvailabilitySchedule);
