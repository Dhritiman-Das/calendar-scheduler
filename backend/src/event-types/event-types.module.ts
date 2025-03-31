import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventTypesService } from './event-types.service';
import { EventTypesController } from './event-types.controller';
import { EventType, EventTypeSchema } from '../schemas/event-type.schema';
import { CalendarsModule } from '../calendars/calendars.module';
import { SchedulesModule } from '../schedules/schedules.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EventType.name, schema: EventTypeSchema },
    ]),
    CalendarsModule,
    SchedulesModule,
  ],
  controllers: [EventTypesController],
  providers: [EventTypesService],
  exports: [EventTypesService],
})
export class EventTypesModule {}
