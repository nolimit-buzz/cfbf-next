import { revalidateTag } from 'next/cache';
import { HOME_CACHE_TAG } from '@/lib/cms/home';

/**
 * Webhook target for Strapi: purges the cached homepage when an editor
 * publishes. Point the CMS at POST /api/revalidate-home with the shared secret
 * in an `x-webhook-secret` header.
 */
export async function POST(request: Request) {
  const secret = process.env.CMS_WEBHOOK_SECRET;

  if (!secret) {
    return Response.json({ error: 'CMS_WEBHOOK_SECRET is not configured' }, { status: 500 });
  }

  if (request.headers.get('x-webhook-secret') !== secret) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // `expire: 0` is the documented form for external webhooks that need the
  // cached entry dropped immediately rather than on the next cache profile tick.
  revalidateTag(HOME_CACHE_TAG, { expire: 0 });

  return Response.json({ revalidated: true, tag: HOME_CACHE_TAG });
}
