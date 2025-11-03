export const CountryFlag = ({ country }: { country: string }) => {
  const toFlagEmoji = (code: string) => {
    if (!code) return ''
    const cc = code.trim().toUpperCase()
    if (!/^[A-Z]{2}$/.test(cc)) return ''
    const codePoints = [...cc].map((c) => 0x1f1e6 + (c.charCodeAt(0) - 65))
    return String.fromCodePoint(...codePoints)
  }

  const flag = toFlagEmoji(country)
  return (
    <span role="img" aria-label={country}>
      {flag}
    </span>
  )
}
