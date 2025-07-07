import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface OrderEvent {
  type: 'order_placed' | 'order_updated' | 'order_cancelled';
  orderId?: string;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class OrderEventsService {
  private orderEvents = new Subject<OrderEvent>();

  // Observable that components can subscribe to
  orderEvents$ = this.orderEvents.asObservable();

  // Method to emit order events
  emitOrderEvent(event: OrderEvent): void {
    this.orderEvents.next(event);
  }

  // Convenience methods for common events
  emitOrderPlaced(orderId?: string, data?: any): void {
    this.emitOrderEvent({
      type: 'order_placed',
      orderId,
      data
    });
  }

  emitOrderUpdated(orderId?: string, data?: any): void {
    this.emitOrderEvent({
      type: 'order_updated',
      orderId,
      data
    });
  }

  emitOrderCancelled(orderId?: string, data?: any): void {
    this.emitOrderEvent({
      type: 'order_cancelled',
      orderId,
      data
    });
  }
} 