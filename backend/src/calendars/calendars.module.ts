import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CalendarsService } from './calendars.service';
import { CalendarsController } from './calendars.controller';
import { Calendar, CalendarSchema } from '../schemas/calendar.schema';
import { CalendarOwnerGuard } from './guards/calendar-owner.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Calendar.name, schema: CalendarSchema },
    ]),
  ],
  controllers: [CalendarsController],
  providers: [CalendarsService, CalendarOwnerGuard],
  exports: [CalendarsService, CalendarOwnerGuard, MongooseModule],
})
export class CalendarsModule {}
