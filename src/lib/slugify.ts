export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")      // ganti spasi dengan -
    .replace(/[^\w\-]+/g, "")  // hapus karakter non-alphanumeric
    .replace(/\-\-+/g, "-");   // ganti -- menjadi -
}
