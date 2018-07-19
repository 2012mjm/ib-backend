const self = module.exports = {

  ellipse: (text, maxLength=20) => {
    if(!text) return null
    if(text.length <= maxLength) return text

    const trimmedString = text.substr(0, maxLength)
    let out = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")))

    if(text.length > out.length) out += ' ...'
    return out
  },
}