'use client';

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { SiteContent } from '../../lib/site/validate-content';
import type { ContentVersion } from '../../lib/site/content-version.shared';
import {
  ContentReadError,
  readRuntimeContent,
  type RuntimeConfig,
} from '../../lib/site/runtime-content';

interface ContentState {
  content: SiteContent;
  config: RuntimeConfig;
  retainForm: boolean;
}
const ContentContext = createContext<ContentState | null>(null);
export function useSiteContent() {
  const value = useContext(ContentContext);
  if (!value) throw new Error('CONTENT_PROVIDER_MISSING');
  return value;
}

export function ContentProvider({
  initialContent,
  metadata,
  config,
  children,
}: {
  initialContent: SiteContent;
  metadata: ContentVersion;
  config: RuntimeConfig;
  children: ReactNode;
}) {
  const [state, setState] = useState<ContentState>(() => ({
    content: initialContent,
    config,
    retainForm: initialContent.contact.showForm,
  }));
  const [unavailable, setUnavailable] = useState(false);
  const latest = useRef(metadata);
  useEffect(
    function coordinateContent() {
      let disposed = false;
      let timer: ReturnType<typeof setTimeout> | undefined;
      let active: AbortController | null = null;
      let requestNumber = 0;
      let etag: string | undefined;
      let errors = 0;
      let pendingRetries = 0;
      let nextAllowed = 0;
      function schedule(seconds: number) {
        clearTimeout(timer);
        if (!disposed && document.visibilityState === 'visible')
          timer = setTimeout(refresh, seconds * 1000);
      }
      async function refresh() {
        if (disposed || active || document.visibilityState !== 'visible')
          return;
        if (Date.now() < nextAllowed) {
          schedule((nextAllowed - Date.now()) / 1000);
          return;
        }
        const controller = new AbortController();
        active = controller;
        const request = ++requestNumber;
        const timeout = setTimeout(() => controller.abort(), 10000);
        let delay = 30;
        try {
          const result = await readRuntimeContent(
            config,
            latest.current,
            controller.signal,
            etag,
          );
          if (
            disposed ||
            controller.signal.aborted ||
            request !== requestNumber
          )
            return;
          if (result) {
            const changed =
              latest.current.epoch !== result.metadata.epoch ||
              latest.current.contentVersion !== result.metadata.contentVersion;
            latest.current = result.metadata;
            etag = result.etag;
            if (changed)
              setState((previous) => ({
                content: result.content,
                config,
                retainForm:
                  previous.retainForm || result.content.contact.showForm,
              }));
          }
          errors = 0;
          pendingRetries = 0;
          setUnavailable(false);
        } catch (error) {
          if (disposed || request !== requestNumber) return;
          errors++;
          if (error instanceof ContentReadError && error.kind === 'pending') {
            if (pendingRetries < 2) {
              pendingRetries++;
              delay = error.retryAfter;
            } else {
              pendingRetries = 0;
              setUnavailable(true);
            }
          } else {
            pendingRetries = 0;
            delay =
              error instanceof ContentReadError && error.kind === 'contract'
                ? 30
                : Math.min(120, 30 * 2 ** Math.min(errors - 1, 2));
            setUnavailable(true);
          }
        } finally {
          clearTimeout(timeout);
          active = null;
          nextAllowed = Date.now() + delay * 1000;
          schedule(delay);
        }
      }
      function visible() {
        clearTimeout(timer);
        if (document.visibilityState === 'visible') {
          if (!errors) nextAllowed = 0;
          void refresh();
        }
      }
      function online() {
        nextAllowed = 0;
        void refresh();
      }
      document.addEventListener('visibilitychange', visible);
      window.addEventListener('online', online);
      void refresh();
      return function cleanup() {
        disposed = true;
        requestNumber++;
        clearTimeout(timer);
        active?.abort();
        document.removeEventListener('visibilitychange', visible);
        window.removeEventListener('online', online);
      };
    },
    [config],
  );
  return (
    <ContentContext.Provider value={state}>
      {children}
      <p
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={unavailable ? undefined : 'sr-only'}
      >
        {unavailable
          ? 'A atualização de conteúdo está temporariamente indisponível. Exibimos a última versão carregada.'
          : ''}
      </p>
      <noscript>
        O conteúdo exibido corresponde à última versão do site. Ative o
        JavaScript para receber atualizações do CMS.
      </noscript>
    </ContentContext.Provider>
  );
}
