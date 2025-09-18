// lib/utils/validation.ts
export function validateFormData(
  formData: FormData,
  requiredFields: string[]
): { [key: string]: string } | null {
  const errors: { [key: string]: string } = {};

  requiredFields.forEach((field) => {
    const value = formData.get(field);
    if (!value || String(value).trim() === "") {
      errors[field] = `${field} is required`;
    }
  });

  return Object.keys(errors).length > 0 ? errors : null;
}
