export default {
  addCurrencyFormat(price: number, showCurrency: boolean) {
    const currency = '฿'
    const priceStr = price.toLocaleString('th-TH', {
      minimumFractionDigits: 2,
    })
    return showCurrency ? `${currency}${priceStr}` : `${priceStr}`
  },
}
