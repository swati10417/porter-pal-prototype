import { Order } from '@/lib/data';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, DollarSign, Package, User, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrderCardProps {
  order: Order;
  onAccept?: (orderId: string) => void;
  onDecline?: (orderId: string) => void; 
  onUpdateStatus?: (orderId: string, status: Order['status']) => void;
  onViewDetails?: (orderId: string) => void;
}

const statusConfig = {
  available: { label: 'Available', color: 'bg-primary text-primary-foreground' },
  accepted: { label: 'Accepted', color: 'bg-warning text-warning-foreground' },
  picked_up: { label: 'Picked Up', color: 'bg-accent text-accent-foreground' },
  in_transit: { label: 'In Transit', color: 'bg-accent text-accent-foreground' },
  delivered: { label: 'Delivered', color: 'bg-success text-success-foreground' },
  cancelled: { label: 'Cancelled', color: 'bg-destructive text-destructive-foreground' }
};

export function OrderCard({ order, onAccept, onDecline, onUpdateStatus, onViewDetails }: OrderCardProps) {
  const statusInfo = statusConfig[order.status];
  
  const getNextAction = () => {
    switch (order.status) {
      case 'accepted':
        return { label: 'Mark as Picked Up', action: () => onUpdateStatus?.(order.id, 'picked_up') };
      case 'picked_up':
        return { label: 'Mark In Transit', action: () => onUpdateStatus?.(order.id, 'in_transit') };
      case 'in_transit':
        return { label: 'Mark as Delivered', action: () => onUpdateStatus?.(order.id, 'delivered') };
      default:
        return null;
    }
  };

  const nextAction = getNextAction();

  return (
    <Card className={cn(
      "p-4 mb-4 transition-all duration-300 hover:shadow-lg",
      "bg-gradient-to-br from-card to-card/50 border-border/50",
      order.status === 'available' && "hover:border-primary/50 hover:shadow-primary/10"
    )}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold text-foreground">{order.customerName}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-3 w-3" />
            <span>{order.customerPhone}</span>
          </div>
        </div>
        <Badge className={statusInfo.color}>
          {statusInfo.label}
        </Badge>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <div className="font-medium text-foreground">Pickup:</div>
            <div className="text-muted-foreground">{order.pickupAddress}</div>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <div className="font-medium text-foreground">Delivery:</div>
            <div className="text-muted-foreground">{order.deliveryAddress}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-muted/30 rounded-lg">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
            <DollarSign className="h-3 w-3" />
            <span>Earn</span>
          </div>
          <div className="font-bold text-success">${(order.paymentAmount * 0.15).toFixed(2)}</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
            <Clock className="h-3 w-3" />
            <span>Time</span>
          </div>
          <div className="font-bold text-foreground">{order.estimatedDeliveryTime}</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
            <Package className="h-3 w-3" />
            <span>Distance</span>
          </div>
          <div className="font-bold text-foreground">{order.distance}</div>
        </div>
      </div>

      <div className="mb-3">
        <div className="text-sm font-medium text-foreground mb-1">Items:</div>
        <div className="text-sm text-muted-foreground">
          {order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
        </div>
      </div>

      {order.notes && (
        <div className="mb-3 p-2 bg-warning/10 rounded text-sm">
          <span className="font-medium text-warning-foreground">Note: </span>
          <span className="text-muted-foreground">{order.notes}</span>
        </div>
      )}

      <div className="flex gap-2">
        {order.status === 'available' && (
          <>
            <Button 
              onClick={() => onAccept?.(order.id)}
              className="flex-1 bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 transition-opacity"
            >
              Accept Order
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onDecline?.(order.id)}
              className="px-4"
            >
              Decline
            </Button>
          </>
        )}
        
        {nextAction && (
          <Button 
            onClick={nextAction.action}
            className="flex-1 bg-gradient-to-r from-accent to-warning hover:opacity-90 transition-opacity"
          >
            {nextAction.label}
          </Button>
        )}
        
        {order.status !== 'available' && (
          <Button 
            variant="outline" 
            onClick={() => onViewDetails?.(order.id)}
            className="flex-1"
          >
            View Details
          </Button>
        )}
      </div>
    </Card>
  );
}