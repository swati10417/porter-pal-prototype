import { useState, useEffect } from 'react';
import { dataStore, Order, Driver } from '@/lib/data';
import { DriverHeader } from './DriverHeader';
import { OrderCard } from './OrderCard';
import { BottomNavigation } from './BottomNavigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Package, DollarSign, TrendingUp, User, Phone, MapPin, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState<Order[]>([]);
  const [driver, setDriver] = useState<Driver>();
  const { toast } = useToast();

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setOrders(dataStore.getOrders());
    setDriver(dataStore.getDriver());
  };

  const handleAcceptOrder = (orderId: string) => {
    dataStore.updateOrderStatus(orderId, 'accepted');
    refreshData();
    toast({
      title: "Order Accepted!",
      description: "Navigate to pickup location to start delivery.",
    });
  };

  const handleDeclineOrder = (orderId: string) => {
    toast({
      title: "Order Declined",
      description: "The order has been declined.",
    });
  };

  const handleUpdateStatus = (orderId: string, status: Order['status']) => {
    dataStore.updateOrderStatus(orderId, status);
    refreshData();
    
    const statusMessages = {
      'picked_up': "Order picked up! Navigate to delivery location.",
      'in_transit': "On the way to delivery location.",
      'delivered': "Order delivered successfully! Great job!"
    };
    
    toast({
      title: "Status Updated",
      description: statusMessages[status] || "Order status updated.",
    });
  };

  const handleToggleDriverStatus = () => {
    if (!driver) return;
    const newStatus = driver.status === 'online' ? 'offline' : 'online';
    dataStore.updateDriverStatus(newStatus);
    refreshData();
    
    toast({
      title: newStatus === 'online' ? "You're Online!" : "You're Offline",
      description: newStatus === 'online' 
        ? "You'll receive new delivery requests." 
        : "You won't receive new delivery requests.",
    });
  };

  const renderDashboard = () => {
    const availableOrders = dataStore.getAvailableOrders();
    const todayEarnings = dataStore.getTodayEarnings();
    const todayDeliveries = dataStore.getTodayDeliveries();

    return (
      <div className="pb-20">
        {driver && (
          <DriverHeader driver={driver} onToggleStatus={handleToggleDriverStatus} />
        )}
        
        <div className="px-4">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card className="p-4 bg-gradient-to-br from-success/10 to-success/5 border-success/20">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-success" />
                <span className="text-sm font-medium">Today's Earnings</span>
              </div>
              <div className="text-2xl font-bold text-success">${todayEarnings.toFixed(2)}</div>
            </Card>
            
            <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Package className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Deliveries</span>
              </div>
              <div className="text-2xl font-bold text-primary">{todayDeliveries}</div>
            </Card>
          </div>

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Available Orders</h2>
            <Badge variant="secondary">{availableOrders.length} available</Badge>
          </div>

          {availableOrders.length === 0 ? (
            <Card className="p-8 text-center">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">No orders available</h3>
              <p className="text-muted-foreground text-sm">
                New delivery requests will appear here when available.
              </p>
            </Card>
          ) : (
            availableOrders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                onAccept={handleAcceptOrder}
                onDecline={handleDeclineOrder}
              />
            ))
          )}
        </div>
      </div>
    );
  };

  const renderActiveOrders = () => {
    const activeOrders = dataStore.getActiveOrders();

    return (
      <div className="p-4 pb-20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Active Orders</h2>
          <Badge variant="secondary">{activeOrders.length} active</Badge>
        </div>

        {activeOrders.length === 0 ? (
          <Card className="p-8 text-center">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">No active orders</h3>
            <p className="text-muted-foreground text-sm">
              Accepted orders will appear here.
            </p>
          </Card>
        ) : (
          activeOrders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onUpdateStatus={handleUpdateStatus}
            />
          ))
        )}
      </div>
    );
  };

  const renderHistory = () => {
    const completedOrders = dataStore.getCompletedOrders();

    return (
      <div className="p-4 pb-20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Order History</h2>
          <Badge variant="secondary">{completedOrders.length} completed</Badge>
        </div>

        {completedOrders.length === 0 ? (
          <Card className="p-8 text-center">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">No completed orders</h3>
            <p className="text-muted-foreground text-sm">
              Your delivery history will appear here.
            </p>
          </Card>
        ) : (
          completedOrders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))
        )}
      </div>
    );
  };

  const renderEarnings = () => {
    const completedOrders = dataStore.getCompletedOrders();
    const todayEarnings = dataStore.getTodayEarnings();
    const todayDeliveries = dataStore.getTodayDeliveries();
    const avgEarningsPerDelivery = todayDeliveries > 0 ? todayEarnings / todayDeliveries : 0;

    return (
      <div className="p-4 pb-20">
        <h2 className="text-2xl font-bold mb-6">Earnings</h2>
        
        <div className="grid grid-cols-1 gap-4 mb-6">
          <Card className="p-6 bg-gradient-to-br from-success to-success/80 text-success-foreground">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-success-foreground/80 text-sm">Today's Earnings</p>
                <p className="text-3xl font-bold">${todayEarnings.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8" />
            </div>
          </Card>
          
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Package className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Deliveries</span>
              </div>
              <div className="text-xl font-bold">{todayDeliveries}</div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-accent" />
                <span className="text-sm font-medium">Avg/Order</span>
              </div>
              <div className="text-xl font-bold">${avgEarningsPerDelivery.toFixed(2)}</div>
            </Card>
          </div>
        </div>

        <h3 className="font-semibold mb-4">Recent Completed Orders</h3>
        {completedOrders.slice(0, 5).map(order => (
          <Card key={order.id} className="p-4 mb-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{order.customerName}</p>
                <p className="text-sm text-muted-foreground">{order.deliveryAddress}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-success">+${(order.paymentAmount * 0.15).toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">
                  {order.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString() : ''}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  const renderProfile = () => {
    if (!driver) return null;

    return (
      <div className="p-4 pb-20">
        <h2 className="text-2xl font-bold mb-6">Profile</h2>
        
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">{driver.name}</h3>
              <div className="flex items-center gap-1 mt-1">
                <Star className="h-4 w-4 text-warning fill-current" />
                <span className="font-medium">{driver.rating}</span>
                <span className="text-muted-foreground text-sm">({driver.totalDeliveries} deliveries)</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{driver.phone}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{driver.location.address}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="capitalize">{driver.vehicleType} - {driver.licensePlate}</span>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{driver.totalDeliveries}</div>
            <div className="text-sm text-muted-foreground">Total Deliveries</div>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-success">${driver.totalEarnings.toFixed(0)}</div>
            <div className="text-sm text-muted-foreground">Total Earned</div>
          </Card>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'active':
        return renderActiveOrders();
      case 'history':
        return renderHistory();
      case 'earnings':
        return renderEarnings();
      case 'profile':
        return renderProfile();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderContent()}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}