import request from 'supertest';

/**
 * Extract a named cookie value from a supertest response's Set-Cookie headers
 */
export function getCookieValue(res: request.Response, name: string): string {
  const cookies = res.headers['set-cookie'] as unknown as string[] | undefined;
  if (!cookies) return '';
  for (const c of cookies) {
    if (c.startsWith(`${name}=`)) {
      return c.split(';')[0].split('=').slice(1).join('=');
    }
  }
  return '';
}
