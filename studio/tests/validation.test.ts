import {describe, expect, it} from 'vitest'
import {
  isFourDigitYear,
  isHttpsUrl,
  isMailtoUrl,
  isYearMonth,
  uniqueOrder,
} from '../schemaTypes/validation'

describe('schema validators', () => {
  it('accepts HTTPS and rejects non-HTTPS URLs', () => {
    expect(isHttpsUrl('https://example.com')).toBe(true)
    expect(isHttpsUrl('http://example.com')).toBe(false)
    expect(isHttpsUrl('not-a-url')).toBe(false)
  })

  it('accepts only four-digit years', () => {
    expect(isFourDigitYear('2026')).toBe(true)
    expect(isFourDigitYear('26')).toBe(false)
    expect(isFourDigitYear('20260')).toBe(false)
  })

  it('accepts mailto links and rejects web links', () => {
    expect(isMailtoUrl('mailto:zy3690@nyu.edu')).toBe(true)
    expect(isMailtoUrl('https://example.com')).toBe(false)
  })

  it('accepts only valid zero-padded year-month values', () => {
    expect(isYearMonth('2026-07')).toBe(true)
    expect(isYearMonth('2026-7')).toBe(false)
    expect(isYearMonth('2026-13')).toBe(false)
  })

  it('requires unique integer order values', () => {
    expect(uniqueOrder([{order: 0}, {order: 1}])).toBe(true)
    expect(uniqueOrder([{order: 1}, {order: 1}])).toBe('Order values must be unique')
    expect(uniqueOrder([{order: 1}, {}])).toBe('Every record must have an integer order')
  })
})
