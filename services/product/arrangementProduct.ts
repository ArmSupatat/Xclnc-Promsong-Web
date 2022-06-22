export default function arrangementProduct(keyword: string, product: object[]) {
  const allProduct = product

  if (keyword === 'สินค้าใหม่ล่าสุด') {
    allProduct.sort((a: any, b: any) => {
      const date = `${new Date()}`
      const dateA = Date.parse(date) - Date.parse(a.startDate)
      const dateB = Date.parse(date) - Date.parse(b.startDate)
      return dateA - dateB
    })
  } else if (keyword === 'ราคาต่ำสุด - สูงสุด') {
    allProduct.sort((current: any, next: any) => {
      return current.price - next.price
    })
  } else if (keyword === 'สูงสุด - ราคาต่ำสุด') {
    allProduct.sort((current: any, next: any) => {
      return next.price - current.price
    })
  } else if (keyword === 'ชื่อ') {
    allProduct.sort((current: any, next: any) => {
      const nameCurrent = current.name
      const nameNext = next.name
      return (
        nameCurrent.localeCompare(nameNext, 'th') -
        nameNext.localeCompare(nameCurrent, 'th')
      )
    })
  }
}
