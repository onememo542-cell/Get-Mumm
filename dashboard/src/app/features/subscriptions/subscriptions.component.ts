import { Component, inject, OnInit, signal, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgIconComponent } from '@ng-icons/core';
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
  imports: [CommonModule, FormsModule, NgIconComponent, SkeletonComponent, EmptyStateComponent, ErrorStateComponent],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Subscriptions</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            @if (!loading()) { {{ items().length }} subscription{{ items().length !== 1 ? 's' : '' }} }
          </p>
        </div>
        <button class="btn-primary self-start sm:self-auto gap-2" (click)="showCreate.set(!showCreate())">
          @if (showCreate()) {
            <ng-icon name="lucideX" size="14" /> Cancel
          } @else {
            <ng-icon name="lucidePlus" size="14" /> New Subscription
          }
        </button>
      </div>

      <!-- Create Form -->
      @if (showCreate()) {
        <div class="card p-5 border-primary-200 dark:border-primary-800">
          <h3 class="text-sm font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <ng-icon name="lucidePlus" size="14" class="text-primary-500" />
            New Subscription
          </h3>
          <form (ngSubmit)="create()" #f="ngForm" novalidate>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label class="label" for="userId">User ID</label>
                <input id="userId" type="text" class="input font-mono" [(ngModel)]="form.userId" name="userId"
                       required placeholder="UUID" autocomplete="off" />
              </div>
              <div>
                <label class="label" for="subType">Type</label>
                <select id="subType" class="input" [(ngModel)]="form.type" name="type" required>
                  <option value="">Select type…</option>
                  <option>Weekly</option><option>Monthly</option>
                  <option>Quarterly</option><option>Annual</option>
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
              <button type="submit" class="btn-primary gap-2" [disabled]="saving() || !f.valid">
                @if (saving()) { <ng-icon name="lucideLoader" size="14" class="animate-spin" /> Saving… }
                @else { <ng-icon name="lucidePlus" size="14" /> Create }
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
        <app-empty-state iconName="lucideBell" title="No subscriptions yet" message="Create your first subscription above." />
      } @else {

        <!-- Desktop Table -->
        <div class="card overflow-hidden hidden md:block">
          <div class="overflow-x-auto">
            <table class="w-full" role="table">
              <thead class="bg-gray-50 dark:bg-gray-800/60">
                <tr>
                  <th class="table-header text-left" scope="col">ID</th>
                  <th class="table-header text-left" scope="col">User</th>
                  <th class="table-header text-left" scope="col">Type</th>
                  <th class="table-header text-left" scope="col">Status</th>
                  <th class="table-header text-left" scope="col">Start</th>
                  <th class="table-header text-left" scope="col">End</th>
                  <th class="table-header text-left" scope="col"></th>
                </tr>
              </thead>
              <tbody>
                @for (sub of items(); track sub.id) {
                  <tr class="border-t border-gray-50 dark:border-gray-800 hover:bg-gray-50/60 dark:hover:bg-gray-800/30 transition-colors">
                    <td class="table-cell font-mono text-xs text-gray-400" [title]="sub.id">{{ sub.id.slice(0, 8) }}…</td>
                    <td class="table-cell font-mono text-xs" [title]="sub.userId">{{ sub.userId.slice(0, 8) }}…</td>
                    <td class="table-cell">
                      <span class="badge bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400">{{ sub.type }}</span>
                    </td>
                    <td class="table-cell">
                      <span class="badge" [class]="statusBadge(sub.status)">{{ sub.status }}</span>
                    </td>
                    <td class="table-cell text-sm whitespace-nowrap">{{ sub.startDate | date:'dd MMM yyyy' }}</td>
                    <td class="table-cell text-sm whitespace-nowrap">{{ sub.endDate | date:'dd MMM yyyy' }}</td>
                    <td class="table-cell">
                      <button class="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                              (click)="deleteSub(sub.id)" [attr.aria-label]="'Delete ' + sub.id.slice(0,8)">
                        <ng-icon name="lucideTrash2" size="14" />
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <!-- Mobile Cards -->
        <div class="space-y-3 md:hidden" role="list">
          @for (sub of items(); track sub.id) {
            <div class="card p-4" role="listitem">
              <div class="flex items-start justify-between mb-3 gap-3">
                <div class="min-w-0">
                  <p class="text-xs font-mono text-gray-400">{{ sub.id.slice(0, 8) }}…</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">User: <code>{{ sub.userId.slice(0, 8) }}…</code></p>
                </div>
                <div class="flex gap-2 items-center flex-shrink-0">
                  <span class="badge bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs">{{ sub.type }}</span>
                  <span class="badge text-xs" [class]="statusBadge(sub.status)">{{ sub.status }}</span>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
                <div class="flex items-center gap-1"><ng-icon name="lucideCalendar" size="11" /> {{ sub.startDate | date:'dd MMM yyyy' }}</div>
                <div class="flex items-center gap-1"><ng-icon name="lucideCalendar" size="11" /> {{ sub.endDate | date:'dd MMM yyyy' }}</div>
              </div>
              <button class="btn-danger text-xs py-1.5 w-full justify-center gap-1.5" (click)="deleteSub(sub.id)">
                <ng-icon name="lucideTrash2" size="12" /> Delete
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
    this.loading.set(true); this.error.set(false);
    this.api.getSubscriptions().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: r  => { this.items.set(r); this.loading.set(false); },
      error: () => { this.error.set(true); this.loading.set(false); this.toast.error('Failed to load subscriptions'); },
    });
  }

  create(): void {
    this.saving.set(true);
    this.api.createSubscription(this.form).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.toast.success('Subscription created');
        this.saving.set(false); this.showCreate.set(false);
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
