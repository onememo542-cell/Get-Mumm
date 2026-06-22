import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { BlogPostDto } from '../../models';
import { LoadingComponent } from '../../shared/components/loading.component';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingComponent, EmptyStateComponent],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Blog Posts</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ filtered().length }} published articles</p>
        </div>
      </div>

      <div class="card p-4">
        <input type="search" class="input w-full sm:w-80" placeholder="🔍 Search posts..." [(ngModel)]="search" (input)="applyFilter()" />
      </div>

      @if (loading()) {
        <app-loading />
      } @else if (filtered().length === 0) {
        <app-empty-state icon="📝" title="No blog posts" message="No posts match your search." />
      } @else {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          @for (post of filtered(); track post.id) {
            <div class="card overflow-hidden hover:shadow-md transition-shadow">
              <div class="h-40 bg-gray-100 dark:bg-gray-800">
                @if (post.imageUrl) {
                  <img [src]="post.imageUrl" [alt]="post.title" class="w-full h-full object-cover" loading="lazy" />
                } @else {
                  <div class="w-full h-full flex items-center justify-center text-4xl">📝</div>
                }
              </div>
              <div class="p-4">
                <h3 class="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2">{{ post.title }}</h3>
                <p class="text-xs text-gray-400 mt-1">{{ post.publishedAt | date:'mediumDate' }} · {{ post.author }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-3">{{ post.excerpt }}</p>
                @if (post.tags?.length) {
                  <div class="mt-3 flex flex-wrap gap-1">
                    @for (tag of post.tags.slice(0,3); track tag) {
                      <span class="badge bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs"># {{ tag }}</span>
                    }
                  </div>
                }
                <p class="text-xs text-gray-400 mt-2 font-mono">slug: {{ post.slug }}</p>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class BlogComponent implements OnInit {
  private api = inject(ApiService);
  loading  = signal(true);
  posts    = signal<BlogPostDto[]>([]);
  filtered = signal<BlogPostDto[]>([]);
  search   = '';

  ngOnInit(): void {
    this.api.getBlogPosts().subscribe({
      next: r => { this.posts.set(r); this.filtered.set(r); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  applyFilter(): void {
    const q = this.search.toLowerCase();
    this.filtered.set(q ? this.posts().filter(p => p.title.toLowerCase().includes(q) || p.author?.toLowerCase().includes(q)) : this.posts());
  }
}
