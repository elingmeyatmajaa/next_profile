export default function moneyFormat(money: number) {
  if (isNaN(money)) {
    return 0;
  } else {
    return Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(money);
  }
}
