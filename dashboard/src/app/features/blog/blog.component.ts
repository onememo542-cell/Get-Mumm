import { Component, inject, OnInit, signal, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent } from '@ng-icons/core';
import { TranslatePipe } from '@ngx-translate/core';
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
  imports: [CommonModule, NgIconComponent, TranslatePipe, SkeletonComponent, EmptyStateComponent, ErrorStateComponent],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{{ 'BLOG.TITLE' | translate }}</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            @if (!loading()) { {{ filtered().length }} {{ 'BLOG.SUBTITLE_COUNT' | translate }} }
          </p>
        </div>
        <button class="btn-secondary gap-2" (click)="load()" [attr.aria-label]="'COMMON.REFRESH' | translate">
          <ng-icon name="lucideRefreshCw" size="14" />
        </button>
      </div>

      <div class="card p-4">
        <div class="relative w-full sm:w-80">
          <ng-icon name="lucideSearch" size="15" class="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input type="search" class="input ps-9"
                 [placeholder]="'BLOG.SEARCH_PLACEHOLDER' | translate"
                 [value]="search()" (input)="search$.next($any($event.target).value)"
                 [attr.aria-label]="'COMMON.SEARCH' | translate" />
        </div>
      </div>

      @if (loading()) {
        <app-skeleton type="cards" [count]="6" gridClass="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" />
      } @else if (error()) {
        <app-error-state (retry)="load()" />
      } @else if (filtered().length === 0) {
        <app-empty-state iconName="lucideNewspaper"
                         [title]="'BLOG.EMPTY_TITLE' | translate"
                         [message]="'BLOG.EMPTY_MSG' | translate" />
      } @else {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" role="list">
          @for (post of filtered(); track post.id) {
            <article class="card overflow-hidden hover:shadow-md transition-shadow group flex flex-col" role="listitem">
              <div class="h-44 bg-gray-100 dark:bg-gray-800 overflow-hidden flex-shrink-0">
                @if (post.imageUrl) {
                  <img [src]="post.imageUrl" [alt]="post.title"
                       class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                       loading="lazy" decoding="async" />
                } @else {
                  <div class="w-full h-full flex items-center justify-center">
                    <ng-icon name="lucideNewspaper" size="40" class="text-gray-300 dark:text-gray-600" />
                  </div>
                }
              </div>
              <div class="p-4 flex flex-col flex-1">
                <h3 class="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 mb-1.5" [title]="post.title">{{ post.title }}</h3>
                <p class="text-xs text-gray-400 mb-2 flex items-center gap-1.5">
                  <ng-icon name="lucideCalendar" size="11" />
                  {{ post.publishedAt | date:'dd MMM yyyy' }}
                  <span class="opacity-40">·</span>
                  <ng-icon name="lucideUser" size="11" />
                  {{ post.author }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-3 flex-1">{{ post.excerpt }}</p>
                <div class="mt-3 flex items-center justify-between gap-2">
                  @if (post.tags?.length) {
                    <div class="flex flex-wrap gap-1 min-w-0">
                      @for (tag of post.tags.slice(0, 2); track tag) {
                        <span class="badge bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs">#{{ tag }}</span>
                      }
                      @if (post.tags.length > 2) {
                        <span class="text-xs text-gray-400">+{{ post.tags.length - 2 }}</span>
                      }
                    </div>
                  }
                  <code class="text-xs text-gray-300 dark:text-gray-600 font-mono truncate ms-auto">{{ post.slug }}</code>
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
    this.loading.set(true); this.error.set(false);
    this.api.getBlogPosts().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: r  => { this.posts.set(r); this.filtered.set(r); this.loading.set(false); },
      error: () => { this.error.set(true); this.loading.set(false); },
    });
  }

  applyFilter(): void {
    const q = this.search().toLowerCase().trim();
    this.filtered.set(q ? this.posts().filter(p => p.title.toLowerCase().includes(q) || (p.author ?? '').toLowerCase().includes(q)) : this.posts());
  }
}
