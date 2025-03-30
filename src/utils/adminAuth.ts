import { jwtDecode } from 'jwt-decode';

interface AdminToken {
  sub: string;
  role: 'admin';
  exp: number;
}

const API_URL = 'http://localhost:5001/api';

// Development-only admin credentials
const DEV_ADMIN_EMAIL = 'admin@nearbyimplants.com';
const DEV_ADMIN_PASSWORD = 'NearbyImplants@2024';

export const isAdminAuthenticated = (): boolean => {
  const token = localStorage.getItem('adminToken');
  if (!token) return false;

  try {
    const decoded = jwtDecode<AdminToken>(token);
    return decoded.role === 'admin' && decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

export const adminLogin = async (email: string, password: string): Promise<boolean> => {
  try {
    console.log('Attempting admin login to:', `${API_URL}/admin/login`);
    
    const response = await fetch(`${API_URL}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    console.log('Login response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Login failed:', errorData);
      throw new Error('Login failed');
    }

    const { token } = await response.json();
    console.log('Login successful, token received');
    
    localStorage.setItem('adminToken', token);
    return true;
  } catch (error) {
    console.error('Admin login error:', error);
    return false;
  }
};

export const adminLogout = (): void => {
  localStorage.removeItem('adminToken');
}; 