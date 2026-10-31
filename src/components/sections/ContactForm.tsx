'use client';

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
} from 'react';
import { Button } from '../ui/Button';
import {
  CONTACT_FIELDS,
  CONTACT_LIMITS,
  responseErrors,
  validateContact,
  type ContactErrors,
  type ContactField,
  type ContactValues,
} from '../../lib/contact/validation';
import styles from './Contact.module.scss';

const labels: Record<ContactField, string> = {
  name: 'Nome completo',
  email: 'E-mail',
  phone: 'Telefone / WhatsApp',
  company: 'Empresa',
  message: 'Mensagem',
};
const autocomplete = {
  name: 'name',
  email: 'email',
  phone: 'tel',
  company: 'organization',
  message: 'off',
};
const errorText = {
  REQUIRED: 'Preencha este campo.',
  INVALID: 'Confira o formato deste campo.',
  TOO_SHORT: 'Digite mais caracteres neste campo.',
  TOO_LONG: 'O limite de caracteres foi excedido.',
};
const failure =
  'Não foi possível confirmar o envio. Tente novamente ou use os contatos ao lado.';

const subscribeHydration = () => () => {};
const clientReady = () => true;
const serverReady = () => false;

export function ContactForm({ endpoint }: { endpoint: string }) {
  const ready = useSyncExternalStore(
    subscribeHydration,
    clientReady,
    serverReady,
  );
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState('');
  const inFlight = useRef(false);
  const controller = useRef<AbortController | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  useEffect(() => {
    return () => controller.current?.abort();
  }, []);
  useEffect(() => {
    const first = CONTACT_FIELDS.find((field) => errors[field]);
    if (!sending && first)
      (
        formRef.current?.elements.namedItem(first) as HTMLElement | null
      )?.focus();
  }, [errors, sending]);

  function invalid(form: HTMLFormElement, next: ContactErrors) {
    setErrors(next);
    const first = CONTACT_FIELDS.find((field) => next[field]);
    if (first) (form.elements.namedItem(first) as HTMLElement | null)?.focus();
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ready || inFlight.current) return;
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form)) as ContactValues;
    const next = validateContact(values);
    if (Object.keys(next).length) {
      invalid(form, next);
      setStatus('Confira os campos indicados.');
      return;
    }
    inFlight.current = true;
    setSending(true);
    setErrors({});
    setStatus('Enviando…');
    const abort = new AbortController();
    controller.current = abort;
    const timeout = setTimeout(() => abort.abort(), 20000);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        credentials: 'omit',
        redirect: 'error',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
        signal: abort.signal,
      });
      const result: unknown = await response.json();
      if (!result || typeof result !== 'object' || Array.isArray(result))
        throw new Error('response');
      const data = result as Record<string, unknown>;
      if (
        response.status === 200 &&
        data.ok === true &&
        data.code === 'CONTACT_ACCEPTED' &&
        typeof data.requestId === 'string' &&
        data.requestId
      ) {
        form.reset();
        setStatus('Sua mensagem foi encaminhada. Obrigado pelo contato.');
      } else if (
        response.status === 429 &&
        data.code === 'RATE_LIMITED' &&
        typeof data.retryAfter === 'number' &&
        Number.isFinite(data.retryAfter) &&
        data.retryAfter > 0
      ) {
        setStatus(
          `Limite de tentativas atingido. Aguarde ${Math.ceil(data.retryAfter)} segundos antes de tentar novamente.`,
        );
      } else {
        if (response.status === 400 && data.code === 'VALIDATION_ERROR')
          invalid(form, responseErrors(data.fieldErrors));
        setStatus(failure);
      }
    } catch {
      setStatus(failure);
    } finally {
      clearTimeout(timeout);
      controller.current = null;
      inFlight.current = false;
      setSending(false);
    }
  }

  return (
    <form
      ref={formRef}
      className={styles.form}
      method="post"
      onSubmit={submit}
      noValidate
    >
      <fieldset disabled={!ready || sending} className={styles.fields}>
        <legend className="sr-only">Enviar mensagem</legend>
        {CONTACT_FIELDS.map((field) => {
          const id = `contact-${field}`;
          const props = {
            id,
            name: field,
            required: field !== 'company',
            maxLength: CONTACT_LIMITS[field],
            autoComplete: autocomplete[field],
            'aria-invalid': errors[field] ? true : undefined,
            'aria-describedby': errors[field] ? `${id}-error` : undefined,
          };
          return (
            <div
              key={field}
              className={`${styles.field} ${field === 'email' || field === 'phone' ? styles.half : ''}`}
            >
              <label htmlFor={id}>
                {labels[field]}{' '}
                <span className={styles.requirement}>
                  ({field === 'company' ? 'opcional' : 'obrigatório'})
                </span>
              </label>
              {field === 'message' ? (
                <textarea {...props} rows={5} />
              ) : (
                <input
                  {...props}
                  type={
                    field === 'email'
                      ? 'email'
                      : field === 'phone'
                        ? 'tel'
                        : 'text'
                  }
                />
              )}
              {errors[field] ? (
                <p id={`${id}-error`} className={styles.error}>
                  {errorText[errors[field]]}
                </p>
              ) : null}
            </div>
          );
        })}
        <div hidden aria-hidden="true">
          <label htmlFor="contact-website">Website</label>
          <input
            id="contact-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
          />
        </div>
        <Button
          type="submit"
          disabled={!ready || sending}
          className={styles.submit}
        >
          {sending ? 'Enviando…' : 'Enviar mensagem'}
        </Button>
      </fieldset>
      <p
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={styles.status}
      >
        {status}
      </p>
      <noscript>
        Ative o JavaScript para enviar o formulário ou use os contatos ao lado.
      </noscript>
    </form>
  );
}
