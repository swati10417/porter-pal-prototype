export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  pickupAddress: string;
  deliveryAddress: string;
  items: OrderItem[];
  status: 'available' | 'accepted' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';
  paymentAmount: number;
  pickupTime: string;
  deliveryTime?: string;
  estimatedDeliveryTime: string;
  distance: string;
  notes?: string;
  createdAt: string;
  acceptedAt?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicleType: 'bike' | 'scooter' | 'car' | 'van';
  licensePlate: string;
  rating: number;
  totalDeliveries: number;
  totalEarnings: number;
  status: 'online' | 'offline' | 'busy';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
}

export interface NotificationData {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
}

export interface TripData {
  id: string;
  startTime: string;
  endTime?: string;
  startLocation: string;
  endLocation?: string;
  distance: number;
  earnings: number;
  orders: string[];
}

// Mock data
export const mockDriver: Driver = {
  id: '1',
  name: 'John Smith',
  email: 'john.smith@porter.com',
  phone: '+1-555-0123',
  vehicleType: 'car',
  licensePlate: 'ABC-123',
  rating: 4.8,
  totalDeliveries: 245,
  totalEarnings: 3240.50,
  status: 'online',
  location: {
    lat: 40.7128,
    lng: -74.0060,
    address: 'Manhattan, NY'
  }
};

export const mockOrders: Order[] = [
  {
    id: '1',
    customerId: 'c1',
    customerName: 'Sarah Johnson',
    customerPhone: '+1-555-0101',
    pickupAddress: '123 Restaurant Ave, Downtown',
    deliveryAddress: '456 Home St, Uptown',
    items: [
      { id: '1', name: 'Burger Combo', quantity: 2, price: 24.99 },
      { id: '2', name: 'Fries', quantity: 1, price: 4.99 },
      { id: '3', name: 'Coca Cola', quantity: 2, price: 3.99 }
    ],
    status: 'available',
    paymentAmount: 38.95,
    pickupTime: '12:30 PM',
    estimatedDeliveryTime: '1:15 PM',
    distance: '2.3 miles',
    notes: 'Leave at door, ring bell',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    customerId: 'c2',
    customerName: 'Mike Chen',
    customerPhone: '+1-555-0102',
    pickupAddress: '789 Pizza Palace, Food District',
    deliveryAddress: '321 Office Tower, Business District',
    items: [
      { id: '4', name: 'Large Pepperoni Pizza', quantity: 1, price: 19.99 },
      { id: '5', name: 'Garlic Bread', quantity: 1, price: 6.99 }
    ],
    status: 'accepted',
    paymentAmount: 31.47,
    pickupTime: '12:45 PM',
    estimatedDeliveryTime: '1:30 PM',
    distance: '1.8 miles',
    createdAt: new Date(Date.now() - 300000).toISOString(),
    acceptedAt: new Date(Date.now() - 60000).toISOString()
  },
  {
    id: '3',
    customerId: 'c3',
    customerName: 'Emily Davis',
    customerPhone: '+1-555-0103',
    pickupAddress: '555 Grocery Mart, Suburb Lane',
    deliveryAddress: '888 Residential Way, Quiet Neighborhood',
    items: [
      { id: '6', name: 'Grocery Package', quantity: 1, price: 45.20 }
    ],
    status: 'picked_up',
    paymentAmount: 52.73,
    pickupTime: '11:30 AM',
    estimatedDeliveryTime: '12:45 PM',
    distance: '4.2 miles',
    notes: 'Heavy package, use elevator',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    acceptedAt: new Date(Date.now() - 3300000).toISOString(),
    pickedUpAt: new Date(Date.now() - 1800000).toISOString()
  },
  {
    id: '4',
    customerId: 'c4',
    customerName: 'Robert Wilson',
    customerPhone: '+1-555-0104',
    pickupAddress: '222 Sushi Bar, Entertainment District',
    deliveryAddress: '777 Apartment Complex, Riverside',
    items: [
      { id: '7', name: 'Sushi Deluxe Set', quantity: 1, price: 32.99 },
      { id: '8', name: 'Miso Soup', quantity: 2, price: 8.99 }
    ],
    status: 'delivered',
    paymentAmount: 46.67,
    pickupTime: '10:15 AM',
    deliveryTime: '11:20 AM',
    estimatedDeliveryTime: '11:15 AM',
    distance: '3.1 miles',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    acceptedAt: new Date(Date.now() - 6900000).toISOString(),
    pickedUpAt: new Date(Date.now() - 6000000).toISOString(),
    deliveredAt: new Date(Date.now() - 3900000).toISOString()
  }
];

// Data management functions
class DataStore {
  private orders: Order[] = [...mockOrders];
  private driver: Driver = { ...mockDriver };
  private notifications: NotificationData[] = [];
  private currentTrip: TripData | null = null;
  private tripHistory: TripData[] = [];

  getOrders(): Order[] {
    return this.orders;
  }

  getOrderById(id: string): Order | undefined {
    return this.orders.find(order => order.id === id);
  }

  getAvailableOrders(): Order[] {
    return this.orders.filter(order => order.status === 'available');
  }

  getActiveOrders(): Order[] {
    return this.orders.filter(order => 
      ['accepted', 'picked_up', 'in_transit'].includes(order.status)
    );
  }

  getCompletedOrders(): Order[] {
    return this.orders.filter(order => 
      ['delivered', 'cancelled'].includes(order.status)
    );
  }

  updateOrderStatus(orderId: string, status: Order['status']): void {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      const now = new Date().toISOString();
      
      switch (status) {
        case 'accepted':
          order.acceptedAt = now;
          break;
        case 'picked_up':
          order.pickedUpAt = now;
          break;
        case 'delivered':
          order.deliveredAt = now;
          order.deliveryTime = new Date().toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          });
          // Update driver earnings
          this.driver.totalEarnings += order.paymentAmount * 0.15; // 15% commission
          this.driver.totalDeliveries += 1;
          break;
      }
    }
  }

  getDriver(): Driver {
    return this.driver;
  }

  updateDriverStatus(status: Driver['status']): void {
    this.driver.status = status;
  }

  getTodayEarnings(): number {
    const today = new Date().toDateString();
    return this.getCompletedOrders()
      .filter(order => new Date(order.deliveredAt || '').toDateString() === today)
      .reduce((total, order) => total + (order.paymentAmount * 0.15), 0);
  }

  getTodayDeliveries(): number {
    const today = new Date().toDateString();
    return this.getCompletedOrders()
      .filter(order => new Date(order.deliveredAt || '').toDateString() === today)
      .length;
  }

  // Notification management
  addNotification(notification: Omit<NotificationData, 'id' | 'timestamp' | 'read'>): void {
    const newNotification: NotificationData = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false
    };
    this.notifications.unshift(newNotification);
  }

  getNotifications(): NotificationData[] {
    return this.notifications;
  }

  markNotificationRead(id: string): void {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
    }
  }

  getUnreadNotificationsCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  // Trip management
  startTrip(startLocation: string): void {
    this.currentTrip = {
      id: Date.now().toString(),
      startTime: new Date().toISOString(),
      startLocation,
      distance: 0,
      earnings: 0,
      orders: []
    };
  }

  endTrip(endLocation: string): TripData | null {
    if (!this.currentTrip) return null;

    const trip: TripData = {
      ...this.currentTrip,
      endTime: new Date().toISOString(),
      endLocation
    };

    this.tripHistory.unshift(trip);
    this.currentTrip = null;
    
    return trip;
  }

  getCurrentTrip(): TripData | null {
    return this.currentTrip;
  }

  getTripHistory(): TripData[] {
    return this.tripHistory;
  }

  updateTripDistance(additionalDistance: number): void {
    if (this.currentTrip) {
      this.currentTrip.distance += additionalDistance;
    }
  }

  addOrderToTrip(orderId: string): void {
    if (this.currentTrip && !this.currentTrip.orders.includes(orderId)) {
      this.currentTrip.orders.push(orderId);
    }
  }

  // Emergency features
  sendSOSAlert(): void {
    this.addNotification({
      title: 'SOS Alert Sent',
      message: 'Emergency services and Porter support have been notified of your location.',
      type: 'warning'
    });
  }

  reportIssue(issue: string): void {
    this.addNotification({
      title: 'Issue Reported',
      message: `Your report: "${issue}" has been submitted to Porter support.`,
      type: 'info'
    });
  }
}

export const dataStore = new DataStore();