import { Component, inject, OnInit, signal, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { SubscriptionDto, CreateSubscriptionRequest } from '../../models';
import { SkeletonComponent } from '../../shared/components/skeleton.component';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';
import { ErrorStateComponent } from '../../shared/components/error-state.component';

@Component({
  selector: 'app-subscriptions',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, SkeletonComponent, EmptyStateComponent, ErrorStateComponent],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Subscriptions</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            @if (!loading()) { {{ items().length }} subscription{{ items().length !== 1 ? 's' : '' }} }
          </p>
        </div>
        <button class="btn-primary self-start sm:self-auto" (click)="showCreate.set(!showCreate())">
          {{ showCreate() ? '✕ Cancel' : '+ New Subscription' }}
        </button>
      </div>

      <!-- Create Form -->
      @if (showCreate()) {
        <div class="card p-5 border-primary-200 dark:border-primary-800" role="region" aria-label="New subscription form">
          <h3 class="text-base font-semibold text-gray-800 dark:text-white mb-4">New Subscription</h3>
          <form (ngSubmit)="create()" #f="ngForm" novalidate>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label class="label" for="userId">User ID</label>
                <input id="userId" type="text" class="input" [(ngModel)]="form.userId" name="userId"
                       required placeholder="UUID" autocomplete="off" />
              </div>
              <div>
                <label class="label" for="subType">Subscription Type</label>
                <select id="subType" class="input" [(ngModel)]="form.type" name="type" required>
                  <option value="">Select type…</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                  <option>Quarterly</option>
                  <option>Annual</option>
                </select>
              </div>
              <div>
                <label class="label" for="startDate">Start Date</label>
                <input id="startDate" type="date" class="input" [(ngModel)]="form.startDate" name="startDate" required />
              </div>
              <div>
                <label class="label" for="endDate">End Date</label>
                <input id="endDate" type="date" class="input" [(ngModel)]="form.endDate" name="endDate" required />
              </div>
            </div>
            <div class="flex gap-3">
              <button type="submit" class="btn-primary" [disabled]="saving() || !f.valid">
                @if (saving()) { <span class="animate-spin inline-block">⟳</span> Saving… } @else { Create Subscription }
              </button>
              <button type="button" class="btn-secondary" (click)="showCreate.set(false)">Cancel</button>
            </div>
          </form>
        </div>
      }

      @if (loading()) {
        <app-skeleton type="table" [count]="5" />
      } @else if (error()) {
        <app-error-state (retry)="load()" />
      } @else if (items().length === 0) {
        <app-empty-state icon="🔔" title="No subscriptions yet" message="Create your first subscription above." />
      } @else {
        <!-- Desktop Table -->
        <div class="card overflow-hidden hidden md:block">
          <div class="overflow-x-auto">
            <table class="w-full text-sm" role="table">
              <thead class="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th class="table-header text-left" scope="col">ID</th>
                  <th class="table-header text-left" scope="col">User</th>
                  <th class="table-header text-left" scope="col">Type</th>
                  <th class="table-header text-left" scope="col">Status</th>
                  <th class="table-header text-left" scope="col">Start</th>
                  <th class="table-header text-left" scope="col">End</th>
                  <th class="table-header text-left" scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (sub of items(); track sub.id) {
                  <tr class="border-t border-gray-50 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                    <td class="table-cell font-mono text-xs text-gray-400" [title]="sub.id">{{ sub.id.slice(0, 8) }}…</td>
                    <td class="table-cell font-mono text-xs" [title]="sub.userId">{{ sub.userId.slice(0, 8) }}…</td>
                    <td class="table-cell">
                      <span class="badge bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400">{{ sub.type }}</span>
                    </td>
                    <td class="table-cell">
                      <span class="badge" [class]="statusBadge(sub.status)">{{ sub.status }}</span>
                    </td>
                    <td class="table-cell whitespace-nowrap">{{ sub.startDate | date:'dd MMM yyyy' }}</td>
                    <td class="table-cell whitespace-nowrap">{{ sub.endDate | date:'dd MMM yyyy' }}</td>
                    <td class="table-cell">
                      <button class="text-red-500 hover:text-red-700 text-xs font-medium transition-colors px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/10"
                              (click)="deleteSub(sub.id)" [attr.aria-label]="'Delete subscription ' + sub.id.slice(0,8)">
                        Delete
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <!-- Mobile Card List -->
        <div class="space-y-3 md:hidden" role="list">
          @for (sub of items(); track sub.id) {
            <div class="card p-4" role="listitem">
              <div class="flex items-start justify-between mb-3">
                <div>
                  <p class="text-xs font-mono text-gray-400">{{ sub.id.slice(0, 8) }}…</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">User: {{ sub.userId.slice(0, 8) }}…</p>
                </div>
                <div class="flex gap-2 items-center">
                  <span class="badge bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs">{{ sub.type }}</span>
                  <span class="badge text-xs" [class]="statusBadge(sub.status)">{{ sub.status }}</span>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
                <div><span class="text-gray-400">Start:</span> {{ sub.startDate | date:'dd MMM yyyy' }}</div>
                <div><span class="text-gray-400">End:</span> {{ sub.endDate | date:'dd MMM yyyy' }}</div>
              </div>
              <button class="btn-danger text-xs py-1 w-full justify-center" (click)="deleteSub(sub.id)">
                Delete Subscription
              </button>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class SubscriptionsComponent implements OnInit {
  private api        = inject(ApiService);
  private toast      = inject(ToastService);
  private destroyRef = inject(DestroyRef);

  loading    = signal(true);
  error      = signal(false);
  saving     = signal(false);
  showCreate = signal(false);
  items      = signal<SubscriptionDto[]>([]);

  form: CreateSubscriptionRequest = { userId: '', type: '', startDate: '', endDate: '' };

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.error.set(false);
    this.api.getSubscriptions().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: r  => { this.items.set(r); this.loading.set(false); },
      error: () => { this.error.set(true); this.loading.set(false); this.toast.error('Failed to load subscriptions'); },
    });
  }

  create(): void {
    this.saving.set(true);
    this.api.createSubscription(this.form).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.toast.success('Subscription created successfully');
        this.saving.set(false);
        this.showCreate.set(false);
        this.form = { userId: '', type: '', startDate: '', endDate: '' };
        this.load();
      },
      error: () => { this.toast.error('Failed to create subscription'); this.saving.set(false); },
    });
  }

  deleteSub(id: string): void {
    if (!confirm('Permanently delete this subscription?')) return;
    this.api.deleteSubscription(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next:  () => { this.toast.success('Subscription deleted'); this.load(); },
      error: () => this.toast.error('Failed to delete subscription'),
    });
  }

  statusBadge(status: string): string {
    return ({
      Active:    'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
      Expired:   'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
      Cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
    } as Record<string, string>)[status] ?? 'bg-gray-100 text-gray-600';
  }
}
