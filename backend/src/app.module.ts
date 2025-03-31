import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { DatabaseModule } from './config/database.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Calendar, CalendarSchema } from './schemas/calendar.schema';
import {
  AvailabilitySchedule,
  AvailabilityScheduleSchema,
} from './schemas/availability-schedule.schema';
import { EventType, EventTypeSchema } from './schemas/event-type.schema';
import { Slot, SlotSchema } from './schemas/slot.schema';
import { Booking, BookingSchema } from './schemas/booking.schema';
import { AuthModule } from './auth/auth.module';
import { CalendarsModule } from './calendars/calendars.module';
import { SchedulesModule } from './schedules/schedules.module';
import { EventTypesModule } from './event-types/event-types.module';
import { SlotsModule } from './slots/slots.module';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [
    CommonModule,
    DatabaseModule,
    AuthModule,
    CalendarsModule,
    SchedulesModule,
    EventTypesModule,
    SlotsModule,
    BookingsModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Calendar.name, schema: CalendarSchema },
      { name: AvailabilitySchedule.name, schema: AvailabilityScheduleSchema },
      { name: EventType.name, schema: EventTypeSchema },
      { name: Slot.name, schema: SlotSchema },
      { name: Booking.name, schema: BookingSchema },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
