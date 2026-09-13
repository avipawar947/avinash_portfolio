import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SESSION_COOKIE = 'ap_admin_session';
const secret = () => new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret-change-me');

export async function createSession(email: string) {
  const token = await new SignJWT({ email, role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret());

  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function destroySession() {
  cookies().delete(SESSION_COOKIE);
}

export async function getSession() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload as { email: string; role: string };
  } catch {
    return null;
  }
}

/** Use inside any mutating API route to reject unauthenticated requests. */
export async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return null;
  }
  return session;
}
