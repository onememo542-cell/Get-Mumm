import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

@Injectable({ providedIn: 'root' })
export class CacheService {
  private store = new Map<string, CacheEntry<unknown>>();

  /** Wrap an Observable with memory caching (default TTL: 5 minutes). */
  wrap<T>(key: string, source$: Observable<T>, ttlMs = 5 * 60 * 1000): Observable<T> {
    const entry = this.store.get(key) as CacheEntry<T> | undefined;
    if (entry && Date.now() < entry.expiresAt) {
      return of(entry.data);
    }
    return source$.pipe(
      tap(data => this.set(key, data, ttlMs))
    );
  }

  set<T>(key: string, data: T, ttlMs = 5 * 60 * 1000): void {
    this.store.set(key, { data, expiresAt: Date.now() + ttlMs });
  }

  invalidate(keyPrefix: string): void {
    for (const key of this.store.keys()) {
      if (key.startsWith(keyPrefix)) this.store.delete(key);
    }
  }

  clear(): void {
    this.store.clear();
  }
}
