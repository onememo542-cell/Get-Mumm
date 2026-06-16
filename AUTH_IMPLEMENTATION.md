# Authentication Implementation Guide

## ✅ Recommendation: Use Supabase Auth

**Why:** Fast, secure, industry-standard, zero maintenance.

---

## 🏗️ Architecture

```
Frontend (React)
  ↓ (uses @supabase/auth-helpers-react)
Supabase Auth (User Management)
  ├─ Signup/Login/OAuth
  ├─ JWT Token Generation
  └─ Session Management
  ↓ (sends JWT token)
Backend Express API
  ├─ Validates JWT token
  ├─ Gets user info from token
  └─ Protects routes
```

---

## 🚀 Implementation Steps

### Step 1: Frontend Setup (React)

```bash
cd frontend
pnpm add @supabase/supabase-js @supabase/auth-helpers-react
```

Create `src/contexts/AuthContext.tsx`:

```typescript
import { createContext, useContext } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  session: Session | null;
  isLoading: boolean;
  user: User | null;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription?.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name }
      }
    });
    if (error) throw error;
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ session, isLoading, user: session?.user, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

Update `src/App.tsx`:

```typescript
import { AuthProvider } from '@/contexts/AuthContext';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {/* ... rest of providers ... */}
      </AuthProvider>
    </QueryClientProvider>
  );
}
```

Update `src/components/auth/AuthModal.tsx`:

```typescript
import { useAuth } from '@/contexts/AuthContext';

export function AuthModal({ isOpen, onClose, defaultTab = "login" }: AuthModalProps) {
  const { signIn, signUp } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(loginForm.email, loginForm.password);
      toast({ title: "Welcome back!", description: "You're signed in." });
      onClose();
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signUp(regForm.email, regForm.password, regForm.name);
      toast({ title: "Account created!", description: "Check your email to confirm." });
      onClose();
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // ... rest of component
}
```

### Step 2: Backend Setup (Express)

Update `backend/.env`:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
```

Create `src/middlewares/auth.ts`:

```typescript
import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import { UnauthorizedError } from '../lib/errors';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    throw new UnauthorizedError('Missing authentication token');
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      throw new UnauthorizedError('Invalid token');
    }

    (req as any).user = user;
    next();
  } catch (error) {
    throw new UnauthorizedError('Authentication failed');
  }
}

export function getUser(req: Request) {
  return (req as any).user;
}
```

Update protected routes:

```typescript
import { requireAuth, getUser } from '../middlewares/auth';

// Protected route
router.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = getUser(req);
    res.json({ user });
  })
);

// Protected route with order access
router.get(
  "/orders/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = getUser(req);
    const order = await orderService.getOrderById(req.params.id, user.id);
    res.json(order);
  })
);
```

### Step 3: Frontend Token Handling

Create `src/lib/api-client.ts`:

```typescript
import { supabase } from './supabase';

export async function getAuthHeaders() {
  const { data: { session } } = await supabase.auth.getSession();
  return {
    'Authorization': `Bearer ${session?.access_token || ''}`
  };
}

export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const headers = await getAuthHeaders();
  
  return fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
    ...options,
    headers: { ...headers, ...options.headers }
  });
}
```

---

## 🔒 Security Best Practices

### Frontend

```typescript
// ✅ Good - Token always sent securely
const headers = await getAuthHeaders();
fetch('/api/protected', { headers });

// ❌ Bad - Token in localStorage accessible to XSS
localStorage.setItem('token', token);
fetch('/api/protected', { headers: { 'Authorization': localStorage.getItem('token') } });
```

### Backend

```typescript
// ✅ Good - Validate every protected route
router.get("/orders", requireAuth, asyncHandler(...));

// ✅ Good - Check user ownership
const order = await db.orders.where({ id, userId: user.id });

// ❌ Bad - Trust client to send userId
const userId = req.query.userId; // Attacker can change this!

// ❌ Bad - No ownership check
const order = await db.orders.find(id);
```

---

## 🧪 Testing

### Test Login Flow

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"password123"}'

# Response:
# { "token": "eyJhbGc...", "user": {...} }
```

### Test Protected Route

```bash
curl http://localhost:3000/api/me \
  -H "Authorization: Bearer eyJhbGc..."

# Response:
# { "user": { "id": "...", "email": "..." } }
```

---

## 📚 File Checklist

### Frontend Changes

- [ ] Install `@supabase/auth-helpers-react`
- [ ] Create `src/contexts/AuthContext.tsx`
- [ ] Update `src/App.tsx` with AuthProvider
- [ ] Update `src/components/auth/AuthModal.tsx` with real auth
- [ ] Create `src/lib/api-client.ts` with token handling
- [ ] Create `src/hooks/useAuth.ts` (optional, for convenience)
- [ ] Test AuthModal with real Supabase credentials

### Backend Changes

- [ ] Create `src/middlewares/auth.ts`
- [ ] Add `SUPABASE_URL` and `SUPABASE_ANON_KEY` to `.env`
- [ ] Add `requireAuth` middleware to protected routes
- [ ] Test protected routes with curl/Postman
- [ ] Verify JWT token validation

---

## 🚨 What NOT to Do

- ❌ Don't store passwords in database (Supabase handles this)
- ❌ Don't send tokens in query params (use headers)
- ❌ Don't trust client-provided user IDs (validate server-side)
- ❌ Don't skip token validation on any protected route
- ❌ Don't expose sensitive data in error messages

---

## 🔄 OAuth (Google/Facebook)

For OAuth, just add to AuthModal:

```typescript
const handleGoogleLogin = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/auth/callback` }
  });
};
```

Supabase handles the rest!

---

## 📞 Support

For issues, check:
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [React Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- Backend `src/middlewares/auth.ts` for validation examples

---

**Status:** Ready to implement. Start with Frontend setup, then Backend.
