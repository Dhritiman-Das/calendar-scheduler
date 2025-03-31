import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SchedulesService } from './schedules.service';
import { SchedulesController } from './schedules.controller';
import {
  AvailabilitySchedule,
  AvailabilityScheduleSchema,
} from '../schemas/availability-schedule.schema';
import { CalendarsModule } from '../calendars/calendars.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AvailabilitySchedule.name, schema: AvailabilityScheduleSchema },
    ]),
    CalendarsModule,
  ],
  controllers: [SchedulesController],
  providers: [SchedulesService],
  exports: [SchedulesService],
})
export class SchedulesModule {}
