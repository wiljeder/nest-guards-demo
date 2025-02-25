export const RATE_LIMITS = {
  anonymous: { limit: 5, window: 60 }, // 5 requests per minute
  free: { limit: 15, window: 60 },
  pro: { limit: 120, window: 60 },
  enterprise: { limit: 600, window: 60 },
};
