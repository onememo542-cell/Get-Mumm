import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (type === 'cards') {
      <div [class]="'grid gap-4 ' + gridClass" aria-busy="true" aria-label="Loading...">
        @for (_ of items; track $index) {
          <div class="card overflow-hidden animate-pulse">
            <div class="h-40 bg-gray-200 dark:bg-gray-700"></div>
            <div class="p-4 space-y-2">
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div class="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/2"></div>
              <div class="h-3 bg-gray-100 dark:bg-gray-800 rounded w-2/3"></div>
            </div>
          </div>
        }
      </div>
    }
    @if (type === 'stat-cards') {
      <div [class]="'grid gap-4 ' + gridClass" aria-busy="true">
        @for (_ of items; track $index) {
          <div class="card p-6 flex items-start gap-4 animate-pulse">
            <div class="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-700 flex-shrink-0"></div>
            <div class="flex-1 space-y-2">
              <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              <div class="h-7 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            </div>
          </div>
        }
      </div>
    }
    @if (type === 'table') {
      <div class="card overflow-hidden animate-pulse" aria-busy="true">
        <div class="h-12 bg-gray-100 dark:bg-gray-800"></div>
        @for (_ of items; track $index) {
          <div class="flex gap-4 px-4 py-3 border-t border-gray-50 dark:border-gray-800">
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          </div>
        }
      </div>
    }
    @if (type === 'list') {
      <div class="space-y-3" aria-busy="true">
        @for (_ of items; track $index) {
          <div class="card p-4 flex items-center gap-4 animate-pulse">
            <div class="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              <div class="h-3 bg-gray-100 dark:bg-gray-800 rounded w-2/3"></div>
            </div>
          </div>
        }
      </div>
    }
  `
})
export class SkeletonComponent {
  @Input() type: 'cards' | 'stat-cards' | 'table' | 'list' = 'cards';
  @Input() count = 6;
  @Input() gridClass = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

  get items(): unknown[] { return Array(this.count).fill(null); }
}
