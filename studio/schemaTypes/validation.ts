export function isHttpsUrl(value: string): boolean {
  try {
    return new URL(value).protocol === 'https:'
  } catch {
    return false
  }
}

export function isFourDigitYear(value: string): boolean {
  return /^\d{4}$/.test(value)
}

export function isMailtoUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'mailto:' && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(url.pathname)
  } catch {
    return false
  }
}

export function isYearMonth(value: string): boolean {
  return /^\d{4}-(0[1-9]|1[0-2])$/.test(value)
}

export function uniqueOrder(values: Array<{order?: number}>): true | string {
  const orders = values.map(({order}) => order)

  if (orders.some((order) => !Number.isInteger(order))) {
    return 'Every record must have an integer order'
  }

  return new Set(orders).size === orders.length ? true : 'Order values must be unique'
}
