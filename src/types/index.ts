// Re-export types from schema.ts for backward compatibility
export * from './schema';

/**
 * Generic API response wrapper
 * @template T The type of data returned by the API
 */
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Utility type for components that accept children
 * @template T Additional props type, defaults to Record<string, unknown>
 */
export type WithChildren<T = Record<string, unknown>> = T & {
  children?: React.ReactNode;
};

/**
 * Form status states for handling loading and error states
 */
export type FormStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * Common pagination parameters for API requests
 */
export type PaginationParams = {
  page?: number;
  limit?: number;
  cursor?: string;
};

// Add new shared types here as needed
