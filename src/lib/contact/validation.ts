export const CONTACT_FIELDS = [
  'name',
  'email',
  'phone',
  'company',
  'message',
] as const;
export type ContactField = (typeof CONTACT_FIELDS)[number];
export type ContactValues = Record<ContactField | 'website', string>;
export type FieldError = 'REQUIRED' | 'INVALID' | 'TOO_SHORT' | 'TOO_LONG';
export type ContactErrors = Partial<Record<ContactField, FieldError>>;
export const CONTACT_LIMITS = {
  name: 120,
  email: 254,
  phone: 40,
  company: 120,
  message: 3000,
};

export function validateContact(values: ContactValues): ContactErrors {
  const errors: ContactErrors = {};
  for (const field of CONTACT_FIELDS) {
    const value = values[field].trim();
    const length = Array.from(value).length;
    if (!value && field !== 'company') errors[field] = 'REQUIRED';
    else if (length > CONTACT_LIMITS[field]) errors[field] = 'TOO_LONG';
    else if (
      value &&
      ((field === 'name' && length < 2) || (field === 'message' && length < 10))
    )
      errors[field] = 'TOO_SHORT';
    else if (
      /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value) ||
      /<[^>]*>/.test(value)
    )
      errors[field] = 'INVALID';
    else if (
      field === 'email' &&
      (/[\r\n]/.test(values.email) ||
        !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)+$/.test(
          value,
        ))
    )
      errors[field] = 'INVALID';
    else if (
      field === 'phone' &&
      (!/^\+?[0-9 ()-]+$/.test(value) ||
        !/^\d{8,15}$/.test(value.replace(/\D/g, '')))
    )
      errors[field] = 'INVALID';
  }
  return errors;
}

export function responseErrors(value: unknown): ContactErrors {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const result: ContactErrors = {};
  for (const field of CONTACT_FIELDS) {
    const code = (value as Record<string, unknown>)[field];
    if (
      code === 'REQUIRED' ||
      code === 'INVALID' ||
      code === 'TOO_SHORT' ||
      code === 'TOO_LONG'
    )
      result[field] = code;
  }
  return result;
}
