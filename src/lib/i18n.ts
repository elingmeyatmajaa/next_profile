// lib/i18n.ts
type Lang = "en" | "id";
const messages = {
  en: {
    CREATED: "Created successfully",
    BAD_REQUEST: "Bad request",
    SERVER_ERROR: "Internal server error",
    LOGIN_SUCCESS: "Login successful",
    INVALID_CREDENTIALS: "Invalid credentials",
    EMAIL_EXISTS: "Email already registered",
    NAME_REQUIRED: "Name is required",
    EMAIL_REQUIRED: "Email is required",
    PASSWORD_REQUIRED: "Password is required",
    SUCCESS: "Success",
    NOT_FOUND: "Not Found",
    DELETED: "Deleted successfully",
    UPDATED: "Updated successfully",
    LOGOUT_SUCCESS: "Logout successful",
  },
  id: {
    CREATED: "Berhasil dibuat",
    BAD_REQUEST: "Permintaan tidak valid",
    SERVER_ERROR: "Terjadi kesalahan server",
    LOGIN_SUCCESS: "Login berhasil",
    INVALID_CREDENTIALS: "Kredensial salah",
    EMAIL_EXISTS: "Email sudah terdaftar",
    NAME_REQUIRED: "Nama wajib diisi",
    EMAIL_REQUIRED: "Email wajib diisi",
    PASSWORD_REQUIRED: "Password wajib diisi",

    SUCCESS: "Berhasil",
    NOT_FOUND: "Data tidak ditemukan",
    DELETED: "Berhasil dihapus",
    UPDATED: "Berhasil diperbarui",
    LOGOUT_SUCCESS: "Logout berhasil",
  },
} as const;

export function getLangFromHeader(header?: string | null): Lang {
  if (!header) return "en";
  if (header.toLowerCase().startsWith("id") || header.toLowerCase().includes("id-")) return "id";
  return "en";
}

export function t(key: keyof typeof messages["en"], header?: string | null) {
  const lang = getLangFromHeader(header);
  return messages[lang][key];
}
