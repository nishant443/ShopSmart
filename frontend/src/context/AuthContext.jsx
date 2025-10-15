import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

// Simple client-side auth using localStorage. This is intentionally minimal
// so you can replace it with real server-backed auth later (JWT/session).
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('auth_user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem('auth_user', JSON.stringify(user));
    else localStorage.removeItem('auth_user');
  }, [user]);

  // Keep a simple demo token so API calls can be authenticated against the demo middleware
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token && user && user.email) {
      try {
        const b64 = btoa(user.email);
        localStorage.setItem('token', `demo:${b64}`);
      } catch (err) {
        localStorage.setItem('token', `demo:${user.email}`);
      }
    }
  }, [user]);

  const register = async ({ name, email, password }) => {
    // Very small client-side user store (localStorage). For demo only.
    const usersJson = localStorage.getItem('demo_users');
    const users = usersJson ? JSON.parse(usersJson) : [];

    if (users.find(u => u.email === email)) {
      throw new Error('User with this email already exists');
    }

    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem('demo_users', JSON.stringify(users));

    // Auto-login after signup
    setUser({ name, email });
    // create demo token
    try {
      const b64 = btoa(email);
      localStorage.setItem('token', `demo:${b64}`);
    } catch (err) {
      // fallback: store plain email (not recommended outside demo)
      localStorage.setItem('token', `demo:${email}`);
    }
    return { name, email };
  };

  const login = async ({ email, password }) => {
    const usersJson = localStorage.getItem('demo_users');
    const users = usersJson ? JSON.parse(usersJson) : [];
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) throw new Error('Invalid email or password');
    setUser({ name: found.name, email: found.email });
    try {
      const b64 = btoa(found.email);
      localStorage.setItem('token', `demo:${b64}`);
    } catch (err) {
      localStorage.setItem('token', `demo:${found.email}`);
    }
    return { name: found.name, email: found.email };
  };

  const logout = () => {
    setUser(null);
    // Redirect user to home after logout
    try {
      navigate('/');
    } catch (err) {
      // ignore navigation errors
    }
    // remove demo token
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
