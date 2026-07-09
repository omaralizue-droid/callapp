/**
 * Integration Error Classes
 *
 * Typed error hierarchy for the integrations module.
 * All errors extend IntegrationError so callers can use a single catch clause
 * while still being able to distinguish failure modes for logging and retry logic.
 *
 * Usage:
 *   throw new ConfigurationError('HUBSPOT', 'privateAppToken')
 *   throw new AuthenticationError('SLACK', 'Bot token rejected by Slack API')
 *   throw new RateLimitError('ZAPIER', 60)
 *   throw new DeliveryError('WEBHOOK', 502, 'Bad Gateway')
 *
 * In catch blocks:
 *   if (err instanceof RateLimitError) { scheduleRetry(err.retryAfterSeconds) }
 */

// ─── Base ─────────────────────────────────────────────────────────────────────

/**
 * Base error for all integration failures.
 * Always includes the provider name for structured logging.
 */
export class IntegrationError extends Error {
  /** The provider that raised this error (e.g. 'HUBSPOT', 'SLACK') */
  readonly provider: string
  /** Set to true for errors that are worth retrying after a delay */
  readonly isRetryable: boolean

  constructor(provider: string, message: string, isRetryable = false) {
    super(message)
    this.name = 'IntegrationError'
    this.provider = provider
    this.isRetryable = isRetryable
    // Maintain proper prototype chain in transpiled environments
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

// ─── Specific Error Types ─────────────────────────────────────────────────────

/**
 * Raised when a required configuration field is missing or invalid.
 * These errors are NOT retryable — the user must correct the config first.
 *
 * Example: missing API token, empty webhook URL.
 */
export class ConfigurationError extends IntegrationError {
  /** The specific config field key that is missing or invalid */
  readonly field: string

  constructor(provider: string, field: string, detail?: string) {
    const message = detail
      ? `[${provider}] Configuration error on field "${field}": ${detail}`
      : `[${provider}] Required field "${field}" is missing or invalid.`
    super(provider, message, false)
    this.name = 'ConfigurationError'
    this.field = field
  }
}

/**
 * Raised when the provider rejects the supplied credentials (e.g. 401 Unauthorized).
 * NOT retryable without new credentials.
 *
 * Example: expired OAuth token, revoked API key.
 */
export class AuthenticationError extends IntegrationError {
  constructor(provider: string, detail?: string) {
    const message = detail
      ? `[${provider}] Authentication failed: ${detail}`
      : `[${provider}] Authentication failed. Check your credentials and try reconnecting.`
    super(provider, message, false)
    this.name = 'AuthenticationError'
  }
}

/**
 * Raised when the provider returns HTTP 429 Too Many Requests.
 * IS retryable after the indicated delay.
 *
 * Example: Slack rate limit on chat.postMessage.
 */
export class RateLimitError extends IntegrationError {
  /** Seconds to wait before retrying. Defaults to 60. */
  readonly retryAfterSeconds: number

  constructor(provider: string, retryAfterSeconds = 60) {
    super(
      provider,
      `[${provider}] Rate limit exceeded. Retry after ${retryAfterSeconds}s.`,
      true,
    )
    this.name = 'RateLimitError'
    this.retryAfterSeconds = retryAfterSeconds
  }
}

/**
 * Raised when the provider endpoint is reachable but returns a non-2xx response.
 * May be retryable depending on the status code (5xx → yes, 4xx → no).
 *
 * Example: 502 Bad Gateway from a Zapier hook URL.
 */
export class DeliveryError extends IntegrationError {
  readonly httpStatus: number
  readonly responseBody?: string

  constructor(provider: string, httpStatus: number, responseBody?: string) {
    const isRetryable = httpStatus >= 500
    const message = responseBody
      ? `[${provider}] Delivery failed with HTTP ${httpStatus}: ${responseBody.slice(0, 200)}`
      : `[${provider}] Delivery failed with HTTP ${httpStatus}.`
    super(provider, message, isRetryable)
    this.name = 'DeliveryError'
    this.httpStatus = httpStatus
    this.responseBody = responseBody
  }
}

// ─── Type Guard ───────────────────────────────────────────────────────────────

/** Type guard: narrows any caught error to IntegrationError */
export function isIntegrationError(err: unknown): err is IntegrationError {
  return err instanceof IntegrationError
}
