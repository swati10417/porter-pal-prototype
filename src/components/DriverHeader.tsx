import { Driver } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Power, PowerOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DriverHeaderProps {
  driver: Driver;
  onToggleStatus: () => void;
}

export function DriverHeader({ driver, onToggleStatus }: DriverHeaderProps) {
  const isOnline = driver.status === 'online';
  
  return (
    <div className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground p-4 rounded-b-2xl mb-6">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h1 className="text-xl font-bold">Hello, {driver.name.split(' ')[0]}!</h1>
          <div className="flex items-center gap-2 mt-1">
            <MapPin className="h-4 w-4" />
            <span className="text-sm opacity-90">{driver.location.address}</span>
          </div>
        </div>
        
        <Button
          onClick={onToggleStatus}
          variant="secondary"
          size="sm"
          className={cn(
            "transition-all duration-200",
            isOnline 
              ? "bg-success/20 text-success-foreground hover:bg-success/30" 
              : "bg-destructive/20 text-destructive-foreground hover:bg-destructive/30"
          )}
        >
          {isOnline ? (
            <>
              <Power className="h-4 w-4 mr-1" />
              Online
            </>
          ) : (
            <>
              <PowerOff className="h-4 w-4 mr-1" />
              Offline
            </>
          )}
        </Button>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold">{driver.totalDeliveries}</div>
          <div className="text-xs opacity-80">Total Deliveries</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-2xl font-bold">{driver.rating}</span>
          </div>
          <div className="text-xs opacity-80">Rating</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold">${driver.totalEarnings.toFixed(0)}</div>
          <div className="text-xs opacity-80">Total Earned</div>
        </div>
      </div>
    </div>
  );
}