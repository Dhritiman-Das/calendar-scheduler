import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SlotsService } from './slots.service';
import { SlotsController } from './slots.controller';
import { Slot, SlotSchema } from '../schemas/slot.schema';
import { CalendarsModule } from '../calendars/calendars.module';
import { EventTypesModule } from '../event-types/event-types.module';
import { SchedulesModule } from '../schedules/schedules.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Slot.name, schema: SlotSchema }]),
    CalendarsModule,
    EventTypesModule,
    SchedulesModule,
  ],
  controllers: [SlotsController],
  providers: [SlotsService],
  exports: [SlotsService],
})
export class SlotsModule {}
