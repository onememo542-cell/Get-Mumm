import { Component, inject, signal, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent } from '@ng-icons/core';
import { TranslatePipe } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService } from '../../core/services/api.service';
import { OrderDto } from '../../models';

@Component({
  selector: 'app-orders',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NgIconComponent, TranslatePipe],
  template: `
    <div class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{{ 'ORDERS.TITLE' | translate }}</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{{ 'ORDERS.SUBTITLE' | translate }}</p>
      </div>

      <div class="card p-6">
        <div class="flex items-center gap-3 mb-5">
          <div class="w-9 h-9 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
            <ng-icon name="lucideClipboardList" size="18" class="text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h3 class="font-semibold text-gray-800 dark:text-white text-sm">{{ 'ORDERS.LOOKUP_TITLE' | translate }}</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ 'ORDERS.LOOKUP_DESC' | translate }}</p>
          </div>
        </div>

        <div class="flex gap-3 flex-col sm:flex-row">
          <div class="relative flex-1">
            <ng-icon name="lucideSearch" size="15" class="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input type="text" class="input ps-9 font-mono"
                   [placeholder]="'ORDERS.PLACEHOLDER' | translate"
                   [value]="orderId()" (input)="orderId.set($any($event.target).value)"
                   [attr.aria-label]="'ORDERS.LOOKUP_TITLE' | translate"
                   autocomplete="off" />
          </div>
          <button class="btn-primary whitespace-nowrap gap-2" (click)="lookup()" [disabled]="!orderId().trim() || loadingOrder()">
            @if (loadingOrder()) {
              <ng-icon name="lucideLoader" size="14" class="animate-spin" />
            } @else {
              <ng-icon name="lucideEye" size="14" />
            }
            {{ 'ORDERS.LOOK_UP' | translate }}
          </button>
        </div>

        @if (orderError()) {
          <div class="mt-4 flex items-start gap-2.5 px-4 py-3 bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400
                      rounded-xl text-sm border border-red-100 dark:border-red-800" role="alert">
            <ng-icon name="lucideAlertTriangle" size="15" class="flex-shrink-0 mt-0.5" />
            {{ orderError() }}
          </div>
        }

        @if (order()) {
          <div class="mt-6 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden">
            <div class="bg-gray-50 dark:bg-gray-800 px-5 py-3.5 flex flex-wrap items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <ng-icon name="lucideClipboardList" size="14" class="text-gray-500" />
                <span class="text-sm font-semibold text-gray-700 dark:text-gray-300 font-mono">#{{ order()!.id.slice(0,8) }}…</span>
              </div>
              <span class="badge font-medium" [class]="statusClass(order()!.status)">{{ order()!.status }}</span>
            </div>
            <div class="p-5 grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 text-sm">
              <div>
                <p class="text-xs text-gray-400 mb-0.5">{{ 'ORDERS.CUSTOMER' | translate }}</p>
                <p class="font-semibold text-gray-800 dark:text-white">{{ order()!.customerName }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-400 mb-0.5">{{ 'ORDERS.PHONE' | translate }}</p>
                <p class="font-medium text-gray-700 dark:text-gray-300">{{ order()!.phone }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-400 mb-0.5">{{ 'ORDERS.AREA' | translate }}</p>
                <p class="font-medium text-gray-700 dark:text-gray-300">{{ order()!.area }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-400 mb-0.5">{{ 'ORDERS.PAYMENT' | translate }}</p>
                <p class="font-medium text-gray-700 dark:text-gray-300">{{ order()!.paymentMethod }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-400 mb-0.5">{{ 'ORDERS.SUBTOTAL' | translate }}</p>
                <p class="font-bold text-primary-600 dark:text-primary-400">EGP {{ order()!.subtotal | number:'1.0-2' }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-400 mb-0.5">{{ 'ORDERS.TOTAL' | translate }}</p>
                <p class="font-bold text-primary-600 dark:text-primary-400 text-base">EGP {{ order()!.total | number:'1.0-2' }}</p>
              </div>
            </div>
            @if (order()!.items?.length) {
              <div class="border-t border-gray-100 dark:border-gray-800">
                <table class="w-full text-sm hidden sm:table" role="table">
                  <thead class="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th class="table-header text-start" scope="col">{{ 'ORDERS.ITEM' | translate }}</th>
                      <th class="table-header text-end" scope="col">{{ 'ORDERS.QTY' | translate }}</th>
                      <th class="table-header text-end" scope="col">{{ 'ORDERS.UNIT_PRICE' | translate }}</th>
                      <th class="table-header text-end" scope="col">{{ 'ORDERS.SUBTOTAL' | translate }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (item of order()!.items; track item.menuItemId) {
                      <tr class="border-t border-gray-50 dark:border-gray-800 hover:bg-gray-50/60 dark:hover:bg-gray-800/30 transition-colors">
                        <td class="table-cell font-medium">{{ item.menuItemName }}</td>
                        <td class="table-cell text-end text-gray-500">{{ item.quantity }}</td>
                        <td class="table-cell text-end text-gray-500">EGP {{ item.unitPrice | number:'1.0-2' }}</td>
                        <td class="table-cell text-end font-semibold text-gray-800 dark:text-white">EGP {{ item.subtotal | number:'1.0-2' }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
                <div class="sm:hidden divide-y divide-gray-50 dark:divide-gray-800">
                  @for (item of order()!.items; track item.menuItemId) {
                    <div class="px-5 py-3 flex items-center justify-between gap-3">
                      <div>
                        <p class="text-sm font-medium text-gray-800 dark:text-white">{{ item.menuItemName }}</p>
                        <p class="text-xs text-gray-400">× {{ item.quantity }} · EGP {{ item.unitPrice | number:'1.0-2' }}</p>
                      </div>
                      <p class="text-sm font-bold text-primary-600 dark:text-primary-400">EGP {{ item.subtotal | number:'1.0-2' }}</p>
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        }
      </div>

      <div class="card p-4 flex items-start gap-3 bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800" role="note">
        <ng-icon name="lucideInfo" size="16" class="text-blue-500 flex-shrink-0 mt-0.5" />
        <div>
          <p class="text-sm font-medium text-blue-700 dark:text-blue-400">{{ 'ORDERS.INFO_TITLE' | translate }}</p>
          <p class="text-xs text-blue-600 dark:text-blue-500 mt-0.5">{{ 'ORDERS.INFO_DESC' | translate }}</p>
        </div>
      </div>
    </div>
  `
})
export class OrdersComponent {
  private api        = inject(ApiService);
  private destroyRef = inject(DestroyRef);
  orderId      = signal('');
  order        = signal<OrderDto | null>(null);
  orderError   = signal('');
  loadingOrder = signal(false);

  lookup(): void {
    const id = this.orderId().trim();
    if (!id) return;
    this.orderError.set(''); this.order.set(null); this.loadingOrder.set(true);
    this.api.getOrder(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: data => { this.order.set(data); this.loadingOrder.set(false); },
      error: (e: { status?: number }) => {
        this.orderError.set(e.status === 404 ? `Order not found: ${id.slice(0, 8)}…` : 'Failed to fetch order. Check the UUID and try again.');
        this.loadingOrder.set(false);
      },
    });
  }

  statusClass(status: string): string {
    return ({
      Pending:   'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
      Confirmed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
      Preparing: 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400',
      Delivered: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
      Cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
    } as Record<string, string>)[status] ?? 'bg-gray-100 text-gray-600';
  }
}
