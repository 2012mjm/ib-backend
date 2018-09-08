const self = module.exports = {

  ellipse: (text, maxLength=20) => {
    if(!text) return null
    if(text.length <= maxLength) return text

    const trimmedString = text.substr(0, maxLength)
    let out = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")))

    if(text.length > out.length) out += ' ...'
    return out
  },

  toEnglishDigits: (value) => {
    const id = { '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4', '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9' }
    return value.replace(/[^0-9.]/g, (w) => {
        return id[w] || w
    })
  },

  toPersianDigits: (value) => {
    const id = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
    return value.replace(/[^0-9.]/g, (w) => {
      return id[w] || w
    })
  }
}
