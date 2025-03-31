<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Calendar Scheduling API

A NestJS-based API for booking and managing calendar appointments. The application provides a robust backend for a Cal.com-like scheduling system, allowing users to create calendars, set availability, and manage bookings.

## Features

- User authentication (register, login, token refresh)
- Calendar management (create, update, delete)
- Availability scheduling (define when you're available)
- Event type configuration (different appointment types with varying durations)
- Slot generation based on availability
- Booking management (create, cancel, reschedule)
- Public API for attendees to book appointments

## Tech Stack

- **Framework**: NestJS
- **Database**: MongoDB
- **Authentication**: JWT-based
- **API Documentation**: Swagger/OpenAPI
- **Containerization**: Docker
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- MongoDB (v4 or later)
- pnpm (v8 or later)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
cd backend
pnpm install
```

3. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

4. Start the development server:

```bash
pnpm run start:dev
```

### Docker Setup

To run the application using Docker:

```bash
docker-compose up
```

This will start both the API and MongoDB in containers.

## API Documentation

The API documentation is available at `/docs` when the server is running. This provides a Swagger UI interface to explore and test the API endpoints.

### API Endpoints

The API is versioned, with all endpoints prefixed with `/v1`.

#### Authentication

- `POST /v1/auth/register` - Register a new user
- `POST /v1/auth/login` - Login with username and password
- `GET /v1/auth/me` - Get current user information
- `POST /v1/auth/refresh-token` - Refresh access token

#### Users

- `GET /v1/users` - List users
- `GET /v1/users/:id` - Get user details
- `PATCH /v1/users/:id` - Update user
- `DELETE /v1/users/:id` - Delete user

#### Calendars

- `POST /v1/calendars` - Create calendar
- `GET /v1/calendars` - List user's calendars
- `GET /v1/calendars/:id` - Get calendar details
- `PATCH /v1/calendars/:id` - Update calendar
- `DELETE /v1/calendars/:id` - Delete calendar

#### Availability Schedules

- `POST /v1/calendars/:calendarId/schedules` - Create schedule
- `GET /v1/calendars/:calendarId/schedules` - List schedules
- `GET /v1/schedules/:id` - Get schedule details
- `PATCH /v1/schedules/:id` - Update schedule
- `DELETE /v1/schedules/:id` - Delete schedule

#### Event Types

- `POST /v1/calendars/:calendarId/event-types` - Create event type
- `GET /v1/calendars/:calendarId/event-types` - List event types
- `GET /v1/event-types/:id` - Get event type details
- `PATCH /v1/event-types/:id` - Update event type
- `DELETE /v1/event-types/:id` - Delete event type

#### Slots

- `GET /v1/calendars/:calendarId/slots` - List all slots for a calendar
- `POST /v1/calendars/:calendarId/slots/generate` - Generate slots based on schedule
- `DELETE /v1/slots/:id` - Delete specific slot
- `PATCH /v1/slots/:id` - Update slot (e.g., mark as unavailable)

#### Bookings

- `GET /v1/calendars/:calendarId/bookings` - List all bookings
- `GET /v1/bookings/:id` - Get booking details
- `PATCH /v1/bookings/:id` - Update booking status
- `DELETE /v1/bookings/:id` - Delete booking

#### Public API

- `GET /v1/public/users/:username` - Get public user info
- `GET /v1/public/calendars/:slug` - Get public calendar info
- `GET /v1/public/calendars/:slug/event-types` - Get available event types
- `GET /v1/public/event-types/:slug/availability` - Get available slots for date range
- `POST /v1/public/event-types/:slug/book` - Book a slot
- `GET /v1/public/bookings/:id` - Get booking info using secure token
- `PATCH /v1/public/bookings/:id/cancel` - Cancel booking using secure token
- `PATCH /v1/public/bookings/:id/reschedule` - Reschedule booking using secure token

## License

[MIT](LICENSE)

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
