import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { throwError, timer } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1000;

function shouldRetry(statusCode: number): boolean {
  return statusCode === 0 || statusCode === 429 || statusCode >= 500;
}

function retry(req: HttpRequest<unknown>, next: HttpHandlerFn, attempt: number): ReturnType<HttpHandlerFn> {
  return next(req).pipe(
    catchError(err => {
      if (attempt < MAX_RETRIES && shouldRetry(err.status)) {
        const delay = RETRY_DELAY_MS * Math.pow(2, attempt);
        return timer(delay).pipe(switchMap(() => retry(req, next, attempt + 1)));
      }
      return throwError(() => err);
    })
  );
}

export const retryInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.method !== 'GET') return next(req);
  return retry(req, next, 0);
};
