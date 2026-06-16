/**
 * Centralized error handling
 */

export class ApiException extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public details?: unknown,
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = "ApiException";
  }
}

export class ValidationError extends ApiException {
  constructor(message: string, details?: unknown) {
    super(400, message, details);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends ApiException {
  constructor(message: string = "Resource not found") {
    super(404, message);
    this.name = "NotFoundError";
  }
}

export class DatabaseError extends ApiException {
  constructor(message: string = "Database error", details?: unknown) {
    super(500, message, details);
    this.name = "DatabaseError";
  }
}

export class UnauthorizedError extends ApiException {
  constructor(message: string = "Unauthorized") {
    super(401, message);
    this.name = "UnauthorizedError";
  }
}
