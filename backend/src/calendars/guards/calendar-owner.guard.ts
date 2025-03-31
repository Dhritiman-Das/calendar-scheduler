import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, Document } from 'mongoose';
import { Calendar } from '../../schemas/calendar.schema';
import { RequestWithUser } from '../../auth/interfaces/request-with-user.interface';

@Injectable()
export class CalendarOwnerGuard implements CanActivate {
  constructor(
    @InjectModel(Calendar.name)
    private calendarModel: Model<Calendar & Document>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const userId = request.user?.userId;

    if (!userId) {
      throw new ForbiddenException('User not authenticated');
    }

    const calendarId = request.params?.id || request.params?.calendarId;
    if (!calendarId || !Types.ObjectId.isValid(calendarId)) {
      throw new NotFoundException('Calendar not found');
    }

    const calendar = await this.calendarModel.findById(calendarId);
    if (!calendar) {
      throw new NotFoundException('Calendar not found');
    }

    // Check if the calendar belongs to the current user
    const calendarUserId =
      calendar.userId instanceof Types.ObjectId
        ? calendar.userId.toString()
        : calendar.userId;

    if (calendarUserId !== userId) {
      throw new ForbiddenException('You do not have access to this calendar');
    }

    return true;
  }
}
