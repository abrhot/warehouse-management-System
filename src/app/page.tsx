import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { jwtVerify } from 'jose';
import LandingContent from './landing-content';

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = cookies();
  const token = cookieStore.get('authToken')?.value;
  if (!token) return false;

  // Try JWT verification
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-key');
    await jwtVerify(token, secret);
    return true;
  } catch {}

  // Fallback: base64 legacy token
  try {
    const decoded = JSON.parse(atob(token));
    if (decoded.id && decoded.role) return true;
  } catch {}

  return false;
}

export default async function RootPage() {
  const authenticated = await isAuthenticated();
  if (authenticated) {
    redirect('/dashboard');
  }
  return <LandingContent />;
}
