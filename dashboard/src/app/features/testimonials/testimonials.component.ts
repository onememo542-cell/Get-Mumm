import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { TestimonialDto } from '../../models';
import { LoadingComponent } from '../../shared/components/loading.component';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule, LoadingComponent, EmptyStateComponent],
  template: `
    <div class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Testimonials</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ items().length }} customer reviews</p>
      </div>

      @if (loading()) {
        <app-loading />
      } @else if (items().length === 0) {
        <app-empty-state icon="⭐" title="No testimonials" message="Customer reviews will appear here." />
      } @else {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          @for (t of items(); track t.id) {
            <div class="card p-6 flex flex-col gap-3 hover:shadow-md transition-shadow">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center text-primary-700 dark:text-primary-400 font-bold">
                  {{ t.customerName?.charAt(0)?.toUpperCase() }}
                </div>
                <div>
                  <p class="text-sm font-semibold text-gray-800 dark:text-white">{{ t.customerName }}</p>
                  <p class="text-xs text-gray-400">{{ t.createdAt | date:'mediumDate' }}</p>
                </div>
                <div class="ml-auto text-amber-400 text-sm">
                  {{ '⭐'.repeat(t.rating) }}
                </div>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-300 italic line-clamp-4">"{{ t.content }}"</p>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class TestimonialsComponent implements OnInit {
  private api = inject(ApiService);
  loading = signal(true);
  items   = signal<TestimonialDto[]>([]);

  ngOnInit(): void {
    this.api.getTestimonials().subscribe({
      next: r => { this.items.set(r); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }
}
