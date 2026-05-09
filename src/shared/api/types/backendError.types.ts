/** Spring `GlobalExceptionHandler` ErrorResponse ile uyumlu (JSON alanları) */
export interface BackendErrorPayload {
  status?: string
  httpStatus?: number
  message?: string | null
  errorCode?: string | null
  validationErrors?: Record<string, string> | null
}
