import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Orders</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">View and manage customer orders</p>
      </div>

      <div class="card p-6">
        <div class="flex items-center gap-3 mb-4">
          <span class="text-2xl">📋</span>
          <div>
            <h3 class="font-semibold text-gray-800 dark:text-white">Order Lookup</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Orders are created via the customer app. Look up any order by its UUID.</p>
          </div>
        </div>

        <div class="flex gap-3 flex-col sm:flex-row">
          <input type="text" class="input flex-1" placeholder="Enter Order ID (UUID)..."
                 [value]="orderId()"
                 (input)="orderId.set($any($event.target).value)" />
          <button class="btn-primary whitespace-nowrap" (click)="lookup()" [disabled]="!orderId() || loadingOrder()">
            @if (loadingOrder()) { <span>⟳</span> } Look Up
          </button>
        </div>

        @if (orderError()) {
          <div class="mt-3 px-4 py-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">{{ orderError() }}</div>
        }

        @if (order()) {
          <div class="mt-6 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
            <div class="bg-gray-50 dark:bg-gray-800 px-4 py-3 flex items-center justify-between">
              <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">Order #{{ order()!.id.slice(0,8) }}…</span>
              <span class="badge" [class]="statusClass(order()!.status)">{{ order()!.status }}</span>
            </div>
            <div class="p-4 grid grid-cols-2 gap-4 text-sm">
              <div><span class="text-gray-400">Customer</span><p class="font-medium dark:text-white">{{ order()!.customerName }}</p></div>
              <div><span class="text-gray-400">Phone</span><p class="font-medium dark:text-white">{{ order()!.phone }}</p></div>
              <div><span class="text-gray-400">Area</span><p class="font-medium dark:text-white">{{ order()!.area }}</p></div>
              <div><span class="text-gray-400">Payment</span><p class="font-medium dark:text-white">{{ order()!.paymentMethod }}</p></div>
              <div><span class="text-gray-400">Subtotal</span><p class="font-bold text-primary-600">EGP {{ order()!.subtotal | number:'1.0-2' }}</p></div>
              <div><span class="text-gray-400">Total</span><p class="font-bold text-primary-600">EGP {{ order()!.total | number:'1.0-2' }}</p></div>
            </div>
            @if (order()!.items?.length) {
              <div class="border-t border-gray-100 dark:border-gray-800">
                <table class="w-full text-sm">
                  <thead class="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th class="table-header text-left">Item</th>
                      <th class="table-header text-right">Qty</th>
                      <th class="table-header text-right">Unit Price</th>
                      <th class="table-header text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (item of order()!.items; track item.menuItemId) {
                      <tr class="border-t border-gray-50 dark:border-gray-800">
                        <td class="table-cell">{{ item.menuItemName }}</td>
                        <td class="table-cell text-right">{{ item.quantity }}</td>
                        <td class="table-cell text-right">EGP {{ item.unitPrice | number:'1.0-2' }}</td>
                        <td class="table-cell text-right font-medium">EGP {{ item.subtotal | number:'1.0-2' }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }
          </div>
        }
      </div>

      <div class="card p-4 flex items-start gap-3 bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800">
        <span class="text-blue-500 text-xl">ℹ️</span>
        <div>
          <p class="text-sm font-medium text-blue-700 dark:text-blue-400">Orders are customer-initiated</p>
          <p class="text-xs text-blue-600 dark:text-blue-500 mt-0.5">Use the lookup above to retrieve full order details by UUID. Orders are placed through the customer-facing Get Mumm app.</p>
        </div>
      </div>
    </div>
  `
})
export class OrdersComponent {
  orderId      = signal('');
  order        = signal<any>(null);
  orderError   = signal('');
  loadingOrder = signal(false);

  lookup(): void {
    const id = this.orderId();
    if (!id) return;
    this.orderError.set('');
    this.order.set(null);
    this.loadingOrder.set(true);

    fetch(`/api/orders/${id}`)
      .then(r => { if (!r.ok) throw new Error(`Order not found (${r.status})`); return r.json(); })
      .then(data => { this.order.set(data); this.loadingOrder.set(false); })
      .catch((e: Error) => { this.orderError.set(e.message); this.loadingOrder.set(false); });
  }

  statusClass(status: string): string {
    const map: Record<string, string> = {
      Pending:   'bg-yellow-100 text-yellow-700',
      Confirmed: 'bg-blue-100 text-blue-700',
      Preparing: 'bg-orange-100 text-orange-700',
      Delivered: 'bg-green-100 text-green-700',
      Cancelled: 'bg-red-100 text-red-700',
    };
    return map[status] ?? 'bg-gray-100 text-gray-600';
  }
}
