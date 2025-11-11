const isBrowser = () => typeof window !== 'undefined'

const encodeBase64 = (text: string) => {
  if (isBrowser() && typeof window.btoa === 'function') {
    return window.btoa(unescape(encodeURIComponent(text)))
  }
  const encoder = new TextEncoder()
  const bytes = encoder.encode(text)
  let binary = ''
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })
  if (typeof btoa === 'function') {
    return btoa(binary)
  }
  throw new Error('Base64 encoding not supported in this environment')
}

const decodeBase64 = (text: string) => {
  if (isBrowser() && typeof window.atob === 'function') {
    return decodeURIComponent(escape(window.atob(text)))
  }
  if (typeof atob === 'function') {
    const binary = atob(text)
    const bytes = new Uint8Array([...binary].map((char) => char.charCodeAt(0)))
    const decoder = new TextDecoder()
    return decoder.decode(bytes)
  }
  throw new Error('Base64 decoding not supported in this environment')
}

export const encodeSharePayload = (data: unknown): string => {
  const json = JSON.stringify(data)
  return encodeBase64(json)
}

export const decodeSharePayload = <T>(token: string): T | null => {
  try {
    const json = decodeBase64(token)
    return JSON.parse(json) as T
  } catch (error) {
    console.error('Failed to decode share payload', error)
    return null
  }
}
