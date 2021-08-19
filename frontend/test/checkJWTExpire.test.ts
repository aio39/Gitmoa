import { check } from 'prettier'
import checkJWT from '../src/checkJWTExpire'

const makeTestToken = (payload: Object) => {
  const serializedPayload = JSON.stringify(payload)
  const base64EncodedPayload = Buffer.from(serializedPayload, 'utf-8').toString(
    'base64'
  )
  const mockToken = `abcd.${base64EncodedPayload}.abcd`
  return mockToken
}

const makePayload = ({ expName = 'exp', unit = 's', addTime = 0 }) => {
  const payload = {
    [expName]: Date.now() / 1000 + addTime,
  }

  return payload
}

describe('should ', () => {
  Date.now = jest.fn(() => Date.UTC(2020, 1, 1, 12, 0, 0))

  describe('test make test token', () => {
    const mockMakePayload = jest.fn(makePayload)
    it('should be return valid payload', () => {
      expect(mockMakePayload({ addTime: 60 }).exp).toBe(
        {
          exp: 1580558400 + 60,
        }.exp
      )
    })
  })

  describe('checkJWTExpire Test', () => {
    it('should be return true true', () => {
      expect(
        checkJWT.check(makeTestToken(makePayload({ addTime: 301 })))
      ).toMatchObject({ isValid: true, isLeft: true })
    })
    it('should be return true false', () => {
      expect(
        checkJWT.check(makeTestToken(makePayload({ addTime: 200 })))
      ).toMatchObject({ isValid: true, isLeft: false })
    })
    it('should be return false false', () => {
      expect(
        checkJWT.check(makeTestToken(makePayload({ addTime: -1 })))
      ).toMatchObject({ isValid: false, isLeft: false })
    })
  })

  describe('a', () => {
    it('should be true, false ', () => {
      checkJWT.defaultConfig.remainTime = '30s'
      expect(
        checkJWT.check(makeTestToken(makePayload({ addTime: 25 })))
      ).toEqual({
        isValid: true,
        isLeft: false,
      })
      expect(
        checkJWT.check(makeTestToken(makePayload({ addTime: 40 })))
      ).toEqual({
        isValid: true,
        isLeft: true,
      })
      expect(
        checkJWT.check(makeTestToken(makePayload({ addTime: -1 })))
      ).toEqual({
        isValid: false,
        isLeft: false,
      })
    })
  })
})
