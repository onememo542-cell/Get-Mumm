import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { ChefDto } from '../../models';
import { LoadingComponent } from '../../shared/components/loading.component';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';

@Component({
  selector: 'app-chefs',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingComponent, EmptyStateComponent],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Chefs</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ filtered().length }} certified home chefs</p>
        </div>
      </div>

      <div class="card p-4">
        <input type="search" class="input w-full sm:w-80" placeholder="🔍 Search chefs..." [(ngModel)]="search" (input)="applyFilter()" />
      </div>

      @if (loading()) {
        <app-loading />
      } @else if (filtered().length === 0) {
        <app-empty-state icon="👨‍🍳" title="No chefs found" message="No chefs match your search." />
      } @else {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          @for (chef of filtered(); track chef.id) {
            <div class="card p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div class="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900/20 overflow-hidden mb-4 flex items-center justify-center">
                @if (chef.imageUrl) {
                  <img [src]="chef.imageUrl" [alt]="chef.name" class="w-full h-full object-cover" loading="lazy" />
                } @else {
                  <span class="text-3xl">👨‍🍳</span>
                }
              </div>
              <h3 class="font-bold text-gray-900 dark:text-white">{{ chef.name }}</h3>
              <p class="text-xs text-gray-400 mb-2">{{ chef.nameAr }}</p>
              <div class="flex items-center gap-2 mb-3">
                <span class="badge bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400">
                  ⭐ {{ chef.rating | number:'1.1-1' }}
                </span>
                <span class="badge bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                  {{ chef.itemCount }} dishes
                </span>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-3">{{ chef.bio }}</p>
              @if (chef.specialties?.length) {
                <div class="mt-3 flex flex-wrap gap-1 justify-center">
                  @for (spec of chef.specialties.slice(0,3); track spec) {
                    <span class="badge bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-xs">{{ spec }}</span>
                  }
                </div>
              }
            </div>
          }
        </div>
      }
    </div>
  `
})
export class ChefsComponent implements OnInit {
  private api = inject(ApiService);
  loading  = signal(true);
  chefs    = signal<ChefDto[]>([]);
  filtered = signal<ChefDto[]>([]);
  search   = '';

  ngOnInit(): void {
    this.api.getChefs().subscribe({
      next: r => { this.chefs.set(r.data); this.filtered.set(r.data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  applyFilter(): void {
    const q = this.search.toLowerCase();
    this.filtered.set(q ? this.chefs().filter(c => c.name.toLowerCase().includes(q) || c.nameAr.includes(q)) : this.chefs());
  }
}
