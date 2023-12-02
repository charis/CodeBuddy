// Library imports
import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

export const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!
});

// Rate-limiter, that allows 4 requests per 10 seconds
export const rateLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(4, '10 s'),

    /**
     * Optional prefix for the keys used in redis.
     * Useful if you want to share a redis instance with other
     * applications and want to avoid key collisions.
     * The default prefix is "@upstash/ratelimit"
     */
    prefix: '@upstash/ratelimit',
  })

