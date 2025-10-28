declare module '@auth0/nextjs-auth0/edge' {
  import type { NextRequest, NextFetchEvent } from 'next/server';
  import type { NextResponse } from 'next/server';

  export interface Session {
    user?: {
      name?: string;
      email?: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  }

  export function handleAuth(): any;
  export function getSession(
    req?: NextRequest,
    res?: NextResponse | NextFetchEvent
  ): Promise<Session | null>;
}


