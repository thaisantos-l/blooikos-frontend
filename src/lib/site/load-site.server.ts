import 'server-only';
import { cache } from 'react';
import { readBuildCapture, readDevelopmentSnapshot } from './build-snapshot';
export const loadSiteCapture = cache(async () =>
  process.env.NODE_ENV === 'production'
    ? readBuildCapture()
    : readDevelopmentSnapshot(),
);
export const loadSite = cache(async () => (await loadSiteCapture()).content);
