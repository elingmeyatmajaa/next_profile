export default function NumberFormat(number: number, locale: string = "id-ID") {
  return number.toLocaleString(locale);
}
