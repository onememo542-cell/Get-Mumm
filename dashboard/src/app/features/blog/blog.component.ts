import { Component, inject, OnInit, signal, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService } from '../../core/services/api.service';
import { BlogPostDto } from '../../models';
import { SkeletonComponent } from '../../shared/components/skeleton.component';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';
import { ErrorStateComponent } from '../../shared/components/error-state.component';

@Component({
  selector: 'app-blog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, SkeletonComponent, EmptyStateComponent, ErrorStateComponent],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Blog Posts</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            @if (!loading()) { {{ filtered().length }} published articles }
          </p>
        </div>
        <button class="btn-secondary" (click)="load()" aria-label="Refresh blog posts">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
        </button>
      </div>

      <div class="card p-3 md:p-4">
        <div class="relative w-full sm:w-80">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0"/></svg>
          <input type="search" class="input pl-9" placeholder="Search posts..."
                 [value]="search()"
                 (input)="search$.next($any($event.target).value)"
                 aria-label="Search blog posts" />
        </div>
      </div>

      @if (loading()) {
        <app-skeleton type="cards" [count]="6" gridClass="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" />
      } @else if (error()) {
        <app-error-state (retry)="load()" />
      } @else if (filtered().length === 0) {
        <app-empty-state icon="📝" title="No blog posts" message="No posts match your search." />
      } @else {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" role="list">
          @for (post of filtered(); track post.id) {
            <article class="card overflow-hidden hover:shadow-md transition-shadow group flex flex-col" role="listitem">
              <div class="h-44 bg-gray-100 dark:bg-gray-800 overflow-hidden flex-shrink-0">
                @if (post.imageUrl) {
                  <img [src]="post.imageUrl" [alt]="post.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" decoding="async" />
                } @else {
                  <div class="w-full h-full flex items-center justify-center text-5xl opacity-30">📝</div>
                }
              </div>
              <div class="p-4 flex flex-col flex-1">
                <h3 class="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 mb-1" [title]="post.title">{{ post.title }}</h3>
                <p class="text-xs text-gray-400 mb-2">{{ post.publishedAt | date:'dd MMM yyyy' }} · {{ post.author }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-3 flex-1">{{ post.excerpt }}</p>
                <div class="mt-3 flex items-center justify-between">
                  @if (post.tags?.length) {
                    <div class="flex flex-wrap gap-1">
                      @for (tag of post.tags.slice(0, 2); track tag) {
                        <span class="badge bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs">#{{ tag }}</span>
                      }
                      @if (post.tags.length > 2) {
                        <span class="text-xs text-gray-400">+{{ post.tags.length - 2 }}</span>
                      }
                    </div>
                  }
                  <span class="text-xs text-gray-300 dark:text-gray-600 font-mono ml-auto">{{ post.slug }}</span>
                </div>
              </div>
            </article>
          }
        </div>
      }
    </div>
  `
})
export class BlogComponent implements OnInit {
  private api        = inject(ApiService);
  private destroyRef = inject(DestroyRef);

  loading  = signal(true);
  error    = signal(false);
  posts    = signal<BlogPostDto[]>([]);
  filtered = signal<BlogPostDto[]>([]);
  search   = signal('');

  readonly search$ = new Subject<string>();

  ngOnInit(): void {
    this.search$.pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(q => { this.search.set(q); this.applyFilter(); });
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(false);
    this.api.getBlogPosts().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: r => { this.posts.set(r); this.filtered.set(r); this.loading.set(false); },
      error: () => { this.error.set(true); this.loading.set(false); },
    });
  }

  applyFilter(): void {
    const q = this.search().toLowerCase().trim();
    this.filtered.set(q ? this.posts().filter(p => p.title.toLowerCase().includes(q) || (p.author ?? '').toLowerCase().includes(q)) : this.posts());
  }
}
