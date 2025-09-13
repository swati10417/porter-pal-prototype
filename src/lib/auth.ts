// Authentication and user management for the porter driver app
export interface User {
  id: string;
  email: string;
  password: string; // In real app, this would be hashed
  name: string;
  phone: string;
  vehicleType: 'bike' | 'scooter' | 'car' | 'van';
  licensePlate: string;
  licenseNumber: string;
  isVerified: boolean;
  createdAt: string;
  status: 'pending' | 'approved' | 'suspended';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  name: string;
  phone: string;
  vehicleType: 'bike' | 'scooter' | 'car' | 'van';
  licensePlate: string;
  licenseNumber: string;
}

class AuthStore {
  private users: User[] = [
    {
      id: '1',
      email: 'john.smith@porter.com',
      password: 'password123', // In real app, this would be hashed
      name: 'John Smith',
      phone: '+1-555-0123',
      vehicleType: 'car',
      licensePlate: 'ABC-123',
      licenseNumber: 'DL123456789',
      isVerified: true,
      createdAt: new Date().toISOString(),
      status: 'approved'
    }
  ];

  private currentUser: User | null = null;

  signup(data: SignupData): { success: boolean; message: string; user?: User } {
    // Check if email already exists
    if (this.users.find(user => user.email === data.email)) {
      return { success: false, message: 'Email already registered' };
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      ...data,
      isVerified: false,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    this.users.push(newUser);
    
    return { 
      success: true, 
      message: 'Account created successfully! Please wait for admin approval.', 
      user: newUser 
    };
  }

  login(credentials: LoginCredentials): { success: boolean; message: string; user?: User } {
    const user = this.users.find(u => u.email === credentials.email);
    
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    if (user.password !== credentials.password) {
      return { success: false, message: 'Invalid password' };
    }

    if (user.status !== 'approved') {
      return { success: false, message: 'Account pending approval or suspended' };
    }

    this.currentUser = user;
    return { success: true, message: 'Login successful', user };
  }

  logout(): void {
    this.currentUser = null;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  updateProfile(updates: Partial<User>): { success: boolean; message: string } {
    if (!this.currentUser) {
      return { success: false, message: 'Not authenticated' };
    }

    const userIndex = this.users.findIndex(u => u.id === this.currentUser!.id);
    if (userIndex === -1) {
      return { success: false, message: 'User not found' };
    }

    // Update user
    this.users[userIndex] = { ...this.users[userIndex], ...updates };
    this.currentUser = this.users[userIndex];

    return { success: true, message: 'Profile updated successfully' };
  }
}

export const authStore = new AuthStore();