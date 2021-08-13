type time = `${number}${unit}`

interface config {
  remainTime: time
  expUnit: keyof typeof unit
  expName: string
}

interface Payload {}

const defaultConfig: config = {
  remainTime: '5m',
  expUnit: 's',
  expName: 'exp',
}

type isNotExpired = boolean
type isLeft = boolean

type CheckReturn = [isNotExpired: isNotExpired, isLeft: isLeft]

enum unit {
  s = 's',
  S = 'S',
  m = 'm',
  M = 'M',
  h = 'h',
  H = 'H',
  d = 'd',
  D = 'D',
}

type keyUnitValueNumber = {
  [index in unit]: number
}

const unitToSecond: keyUnitValueNumber = {
  s: 1,
  S: 1,
  m: 60,
  M: 60,
  h: 3600,
  H: 3600,
  d: 86400,
  D: 86400,
}

class CheckJWT {
  defaultConfig: config
  constructor(config: Partial<config>) {
    this.defaultConfig = { ...defaultConfig, ...config }
  }

  setConfig(config: Partial<config>): void {
    this.defaultConfig = { ...this.defaultConfig, ...config }
  }

  private static getTokenPayload(token: string): any {
    return JSON.parse(atob(token.split('.')[1]))
  }

  private getUpperSecond(): number {
    const [num, unit] = this.defaultConfig.remainTime.match(
      /[a-zA-Z]+|[0-9]+/g
    ) as [string, unit]

    return parseInt(num) * unitToSecond[unit]
  }

  private getTokenExp(token: string): number {
    const exp = parseInt(
      CheckJWT.getTokenPayload(token)[this.defaultConfig.expName]
    )
    return exp * unitToSecond[this.defaultConfig.expUnit]
  }
  private getTimeNow(): number {
    const dateNow = Date.now()
    return Math.round(dateNow / 1000)
  }

  private checkIsNotTimeOut(
    tokenExpTime: number,
    nowTime: number,
    upperSecond = 0
  ): boolean {
    const targetTime = tokenExpTime - upperSecond
    if (targetTime - nowTime >= 1) return true
    return false
  }

  private checkIsOverTokenExp(token: string): boolean {
    return this.checkIsNotTimeOut(this.getTokenExp(token), this.getTimeNow())
  }

  private checkIsOverLimitTime(token: string): boolean {
    return this.checkIsNotTimeOut(
      this.getTokenExp(token),
      this.getTimeNow(),
      this.getUpperSecond()
    )
  }

  create(config: Partial<config>): CheckJWT {
    const checkJwt = new CheckJWT({ ...this.defaultConfig, ...config })
    return checkJwt
  }

  check(token: string | null): CheckReturn {
    if (!token) return [false, false]
    const isNotExpired = this.checkIsOverTokenExp(token)
    const isNotOverTime = isNotExpired
      ? this.checkIsOverLimitTime(token)
      : false
    return [isNotExpired, isNotOverTime]
  }
}

const checkJWT = new CheckJWT(defaultConfig)

export default checkJWT
