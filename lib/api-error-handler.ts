/**
 * API Error Handler with Sentry Integration
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Wraps API routes with standardized error handling and monitoring
 */

import { NextResponse } from 'next/server';
import { logger } from './logger';

export interface ApiError {
  status: number;
  message: string;
  code?: string;
  details?: unknown;
}

/**
 * Standard API error responses
 */
export const ApiErrors = {
  BadRequest: (message = 'Bad request', details?: unknown): ApiError => ({
    status: 400,
    message,
    code: 'BAD_REQUEST',
    details,
  }),

  Unauthorized: (message = 'Unauthorized', details?: unknown): ApiError => ({
    status: 401,
    message,
    code: 'UNAUTHORIZED',
    details,
  }),

  Forbidden: (message = 'Forbidden', details?: unknown): ApiError => ({
    status: 403,
    message,
    code: 'FORBIDDEN',
    details,
  }),

  NotFound: (message = 'Not found', details?: unknown): ApiError => ({
    status: 404,
    message,
    code: 'NOT_FOUND',
    details,
  }),

  Conflict: (message = 'Conflict', details?: unknown): ApiError => ({
    status: 409,
    message,
    code: 'CONFLICT',
    details,
  }),

  TooManyRequests: (message = 'Too many requests', details?: unknown): ApiError => ({
    status: 429,
    message,
    code: 'TOO_MANY_REQUESTS',
    details,
  }),

  InternalError: (message = 'Internal server error', details?: unknown): ApiError => ({
    status: 500,
    message,
    code: 'INTERNAL_ERROR',
    details,
  }),

  ServiceUnavailable: (message = 'Service unavailable', details?: unknown): ApiError => ({
    status: 503,
    message,
    code: 'SERVICE_UNAVAILABLE',
    details,
  }),
};

/**
 * Wrap API handler with error handling and monitoring
 */
export function withErrorHandler<T = unknown>(
  handler: (req: Request) => Promise<NextResponse<T>>
) {
  return async (req: Request): Promise<NextResponse> => {
    const startTime = Date.now();
    const url = new URL(req.url);

    try {
      // Execute the handler
      const response = await handler(req);

      // Log successful requests
      const duration = Date.now() - startTime;
      logger.info('API request completed', {
        operation: 'api_request',
        path: url.pathname,
        method: req.method,
        status: response.status,
        duration: `${duration}ms`,
      });

      return response;
    } catch (error) {
      const duration = Date.now() - startTime;

      // Determine if this is a known API error or unexpected error
      if (isApiError(error)) {
        // Known API error - log as warning
        logger.warn('API error response', {
          operation: 'api_error',
          path: url.pathname,
          method: req.method,
          status: error.status,
          code: error.code,
          message: error.message,
          duration: `${duration}ms`,
        });

        return NextResponse.json(
          {
            error: {
              code: error.code,
              message: error.message,
              details: error.details,
            },
          },
          { status: error.status }
        );
      }

      // Unexpected error - log as error and send to Sentry
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;

      logger.error(
        'Unexpected API error',
        {
          operation: 'api_error_unexpected',
          path: url.pathname,
          method: req.method,
          error: errorMessage,
          stack: errorStack,
          duration: `${duration}ms`,
        },
        error instanceof Error ? error : new Error(String(error))
      );

      // Return generic error to client (don't leak implementation details)
      return NextResponse.json(
        {
          error: {
            code: 'INTERNAL_ERROR',
            message: 'An unexpected error occurred',
          },
        },
        { status: 500 }
      );
    }
  };
}

/**
 * Type guard to check if error is an ApiError
 */
function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    'message' in error &&
    'code' in error
  );
}

/**
 * Throw an API error (to be caught by withErrorHandler)
 */
export function throwApiError(error: ApiError): never {
  throw error;
}
