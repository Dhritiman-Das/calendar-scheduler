import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Calendar } from './calendar.schema';
import { AvailabilitySchedule } from './availability-schedule.schema';

@Schema({ timestamps: true })
export class EventType extends Document {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Calendar',
    required: true,
  })
  calendarId: Calendar;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  slug: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  duration: number; // in minutes

  @Prop({ default: '#3174F1' })
  color: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'AvailabilitySchedule',
    required: true,
  })
  availabilityScheduleId: AvailabilitySchedule;

  @Prop({ default: 0 })
  bufferTimeBefore: number; // in minutes

  @Prop({ default: 0 })
  bufferTimeAfter: number; // in minutes
}

export const EventTypeSchema = SchemaFactory.createForClass(EventType);
