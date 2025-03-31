import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BookingResponseDto } from './dto/booking-response.dto';

@ApiTags('Bookings')
@Controller({
  path: 'bookings',
  version: '1',
})
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({
    status: 201,
    description: 'The booking has been successfully created.',
    type: BookingResponseDto,
  })
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all bookings' })
  @ApiQuery({
    name: 'calendarId',
    description: 'Filter by calendar ID',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'List of bookings.',
    type: [BookingResponseDto],
  })
  findAll(@Query('calendarId') calendarId?: string) {
    return this.bookingsService.findAll(calendarId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific booking by ID' })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiResponse({
    status: 200,
    description: 'The booking has been successfully retrieved.',
    type: BookingResponseDto,
  })
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a booking' })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiResponse({
    status: 200,
    description: 'The booking has been successfully updated.',
    type: BookingResponseDto,
  })
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingsService.update(id, updateBookingDto);
  }

  @Post(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel a booking' })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiQuery({
    name: 'reason',
    description: 'Reason for cancellation',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'The booking has been successfully cancelled.',
    type: BookingResponseDto,
  })
  cancel(@Param('id') id: string, @Query('reason') reason?: string) {
    return this.bookingsService.cancel(id, reason);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a booking' })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiResponse({
    status: 204,
    description: 'The booking has been successfully deleted.',
  })
  remove(@Param('id') id: string) {
    return this.bookingsService.remove(id);
  }
}
