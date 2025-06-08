// تبدیل اعداد انگلیسی به فارسی
export function toPersianDigits(num: string | number): string {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"]
  return num.toString().replace(/\d/g, (digit) => persianDigits[Number.parseInt(digit)])
}

// تبدیل اعداد فارسی به انگلیسی
export function toEnglishDigits(str: string): string {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"]
  const englishDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]

  let result = str
  persianDigits.forEach((persian, index) => {
    result = result.replace(new RegExp(persian, "g"), englishDigits[index])
  })
  return result
}

// فرمت کردن عدد با جداکننده هزارگان فارسی
export function formatPersianNumber(num: number): string {
  return toPersianDigits(num.toLocaleString("fa-IR"))
}
