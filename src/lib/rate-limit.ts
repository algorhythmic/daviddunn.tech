import { headers } from 'next/headers';

export class RateLimit {
  private static attempts = new Map<string, { count: number; timestamp: number }>();
  private static readonly WINDOW_MS = 15 * 60 * 1000; // 15 minutes
  private static readonly MAX_ATTEMPTS = 5;

  static async check(identifier: string): Promise<{ success: boolean; remaining: number; reset: Date }> {
    this.clearOldAttempts();

    const attempt = this.attempts.get(identifier) || { count: 0, timestamp: Date.now() };
    attempt.count++;
    this.attempts.set(identifier, attempt);

    const remaining = this.MAX_ATTEMPTS - attempt.count;
    const reset = new Date(attempt.timestamp + this.WINDOW_MS);

    return {
      success: attempt.count <= this.MAX_ATTEMPTS,
      remaining: Math.max(0, remaining),
      reset,
    };
  }

  static async getIdentifier(): Promise<string> {
    const headersList = await headers();
    const forwarded = headersList.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : 'localhost';
    return ip;
  }

  private static clearOldAttempts() {
    const now = Date.now();
    for (const [key, value] of this.attempts.entries()) {
      if (now - value.timestamp > this.WINDOW_MS) {
        this.attempts.delete(key);
      }
    }
  }

  static reset(identifier: string) {
    this.attempts.delete(identifier);
  }
}
