type time = `${number}${unit}`

interface config {
  time: time
  expUnit: string
  expName: string
}

const defaultConfig: config = {
  time: '5m',
  expUnit: 's',
  expName: 'exp',
}

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
  [index in unit]?: number
}

const unitToSecond: keyUnitValueNumber = {
  s: 1,
  S: 1,
  m: 60,
  M: 60,
  h: 3600,
  H: 3600,
}

class CheckJWT {
  defaultConfig: config
  constructor(config: Partial<config>) {
    this.defaultConfig = { ...defaultConfig, ...config }
  }

  setConfig(config: Partial<config>): void {
    this.defaultConfig = { ...this.defaultConfig, ...config }
  }

  private static parse(token: string): JSON | null {
    try {
      return JSON.parse(atob(token.split('.')[1]))
    } catch (e) {
      return null
    }
  }

  private calcLimitTime(): number {
    const [num, unit] = this.defaultConfig.time.match(/[a-zA-Z]+|[0-9]+/g)
    return parseInt(num) * unitToSecond[unit]
  }

  private getExp(token: string): number {
    const exp = parseInt(CheckJWT.parse(token)[this.defaultConfig.expName])
    return exp * unitToSecond[this.defaultConfig.expUnit]
  }
  private getTimeNow(): number {
    const dateNow = Date.now()
    return Math.round(dateNow / 1000)
  }

  private checkIsNotTimeOut(
    tokenExpTime: number,
    nowTime: number,
    remainTime = 0
  ): boolean {
    const targetTime = tokenExpTime - remainTime
    if (targetTime - nowTime >= 1) return true
    return false
  }

  private checkValid(token: string): boolean {
    return this.checkIsNotTimeOut(this.getExp(token), this.getTimeNow())
  }

  private checkRemain(token: string): boolean {
    return this.checkIsNotTimeOut(
      this.getExp(token),
      this.getTimeNow(),
      this.calcLimitTime()
    )
  }

  create(config: Partial<config>): CheckJWT {
    const checkJwt = new CheckJWT({ ...this.defaultConfig, ...config })
    return checkJwt
  }

  check(token: string): { isValid: boolean; isLeft: boolean } {
    const isValid = this.checkValid(token)
    const isLeft = this.checkRemain(token)
    return { isValid, isLeft }
  }
}

const checkJWT = new CheckJWT(defaultConfig)

export default checkJWT
