import 'server-only';
import { cache } from 'react';
import { readBuildCapture, readPublicSnapshot } from './build-snapshot';
export const loadSiteCapture = cache(async () =>
  process.env.NODE_ENV === 'production'
    ? readBuildCapture()
    : readPublicSnapshot('development'),
);
export const loadSite = cache(async () => (await loadSiteCapture()).content);
