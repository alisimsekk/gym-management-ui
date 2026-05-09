export class ApiError extends Error {
  readonly status?: number
  readonly errorCode?: string | null
  readonly validationErrors?: Record<string, string> | null

  constructor(
    message: string,
    status?: number,
    meta?: {
      errorCode?: string | null
      validationErrors?: Record<string, string> | null
    },
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errorCode = meta?.errorCode ?? null
    this.validationErrors = meta?.validationErrors ?? null
  }
}
