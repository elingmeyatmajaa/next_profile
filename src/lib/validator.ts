// lib/validator.ts
import { t } from "./i18n";

export type ValidationError = Record<string, string | undefined>;

export function validateRequired(
  body: Record<string, any>,
  fields: string[],
  lang: string = "en"
) {
  const errors: ValidationError = {};

  fields.forEach((field) => {
    if (!body[field]) {
      errors[field] = t(`${field.toUpperCase()}_REQUIRED`, lang);
    }
  });

  const isValid = Object.keys(errors).length === 0;

  return { isValid, errors };
}
