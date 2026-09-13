import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from './auth';

export function json(data: unknown, init?: number) {
  return NextResponse.json(data, init ? { status: init } : undefined);
}

export function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

/** Wrap a mutating route handler so it 401s without a valid admin session, then revalidates the homepage. */
export function withAdmin<T extends (...args: any[]) => Promise<Response>>(handler: T): T {
  return (async (...args: Parameters<T>) => {
    const session = await requireAdmin();
    if (!session) return unauthorized();
    const res = await handler(...args);
    revalidatePath('/');
    return res;
  }) as T;
}
