import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff, Truck, Mail, Lock, User, Phone, Car, FileText } from 'lucide-react';
import { authStore, SignupData } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { VoiceAssistant } from './VoiceAssistant';

interface SignupPageProps {
  onSignupSuccess: () => void;
  onSwitchToLogin: () => void;
}

export function SignupPage({ onSignupSuccess, onSwitchToLogin }: SignupPageProps) {
  const [formData, setFormData] = useState<SignupData>({
    email: '',
    password: '',
    name: '',
    phone: '',
    vehicleType: 'bike',
    licensePlate: '',
    licenseNumber: ''
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters long",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = authStore.signup(formData);
      
      if (result.success) {
        toast({
          title: "Account Created!",
          description: result.message,
        });
        onSignupSuccess();
      } else {
        toast({
          title: "Signup Failed",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceCommand = (command: string) => {
    if (command === 'signup' || command === 'create_account') {
      handleSubmit(new Event('submit') as any);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <VoiceAssistant onCommand={handleVoiceCommand} />
      
      <Card className="w-full max-w-md p-8 space-y-6 my-8">
        <div className="text-center space-y-2">
          <div className="mx-auto h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Truck className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Join Porter</h1>
          <p className="text-muted-foreground">Create your driver account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vehicleType">Vehicle Type</Label>
            <div className="relative">
              <Car className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
              <Select 
                value={formData.vehicleType} 
                onValueChange={(value) => setFormData({ ...formData, vehicleType: value as any })}
              >
                <SelectTrigger className="pl-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bike">Bike</SelectItem>
                  <SelectItem value="scooter">Scooter</SelectItem>
                  <SelectItem value="car">Car</SelectItem>
                  <SelectItem value="van">Van</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="licensePlate">License Plate</Label>
            <div className="relative">
              <Car className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="licensePlate"
                type="text"
                placeholder="Enter license plate number"
                value={formData.licensePlate}
                onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="licenseNumber">Driver License Number</Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="licenseNumber"
                type="text"
                placeholder="Enter driver license number"
                value={formData.licenseNumber}
                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="pl-10 pr-10"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-8 w-8 p-0"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 pr-10"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-8 w-8 p-0"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>

        <div className="text-center text-sm">
          Already have an account?{" "}
          <Button variant="link" onClick={onSwitchToLogin} className="p-0 h-auto">
            Sign in here
          </Button>
        </div>
      </Card>
    </div>
  );
}