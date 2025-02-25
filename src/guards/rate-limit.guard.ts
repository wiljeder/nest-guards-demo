import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import { Request } from 'express';
import { RATE_LIMITS } from 'src/constants/rate-limits';

const requestTimestamps = new Map<string, number[]>();

@Injectable()
export class RateLimitGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user;

    const userPlan = user?.plan || 'anonymous';
    const { limit, window } = RATE_LIMITS[userPlan];

    const userKey = user?.id
      ? `${user.id}-rate-limit`
      : `${request.ip}-rate-limit`;

    const currentTime = Date.now();
    const windowStart = currentTime - window * 1000;

    const timestamps = requestTimestamps.get(userKey) || [];
    const updatedTimestamps = timestamps.filter(
      (timestamp) => timestamp > windowStart,
    );

    if (updatedTimestamps.length >= limit) {
      const nextResetIn = Math.ceil(
        (updatedTimestamps[0] + window * 1000 - currentTime) / 1000,
      );

      throw new HttpException(
        `Rate limit exceeded. Try again in ${nextResetIn}s`,
        429,
      );
    }

    updatedTimestamps.push(currentTime);
    requestTimestamps.set(userKey, updatedTimestamps);

    return true;
  }
}
