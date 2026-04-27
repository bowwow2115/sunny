import constants from '@/Constants'
import CryptoJS from 'crypto-js'

const Utils = {
  regExpIp(): RegExp {
    return /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]|[*])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]|[*])$/
  },

  setCookie(cName: string, cValue: string, seconds = 3600, path = '/'): void {
    const expire = new Date()
    expire.setTime(expire.getTime() + seconds * 1000)
    let cookies =
      cName + '=' + encodeURIComponent(cValue) + '; path=' + path + ';'
    cookies += 'expires=' + expire.toUTCString() + ';'
    document.cookie = cookies
  },

  deleteCookie(cookieName: string, path = ''): void {
    const expireDate = new Date()
    if (path === '') path = '/'
    expireDate.setDate(expireDate.getDate() - 1)
    document.cookie =
      cookieName +
      '= ' +
      '; expires=' +
      expireDate.toUTCString() +
      '; path=' +
      path
  },

  getCookie(cName: string): string {
    const key = cName + '='
    const cookieData = document.cookie
    let start = cookieData.indexOf(key)
    let cValue = ''
    if (start !== -1) {
      start += key.length
      let end = cookieData.indexOf(';', start)
      if (end === -1) end = cookieData.length
      cValue = cookieData.substring(start, end)
    }
    return decodeURIComponent(cValue)
  },

  getToken(): string {
    return Utils.getCookie('auth')
  },

  tripleDESenc(parameters: string): string {
    const keyStr =
      import.meta.env.VITE_TRIPLEDES_KEY || 'vf_9g13j4j91j27c582ji693'
    const ivStr = import.meta.env.VITE_TRIPLEDES_IV || 'vf_iv000'
    const key = CryptoJS.enc.Utf8.parse(keyStr)
    const iv = CryptoJS.enc.Utf8.parse(ivStr)
    const encrypt = CryptoJS.TripleDES.encrypt(parameters, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    } as any)
    return encrypt.toString()
  },

  getTenant(): string {
    return Utils.getCookie('tenant')
  },

  isNull(str: unknown): boolean {
    return str === null || str === undefined || str === ''
  },

  checkEnv(NODE_ENV: string | undefined): string {
    if (NODE_ENV === 'production') {
      return `${constants.CONTEXT_PATH}/#/signIn`
    }
    return '/'
  },

  convertDateToLocalDateTime(dateString: string): string {
    return dateString + 'T00:00:00'
  },

  getTimeIntervals(startTime: string, endTime: string): string[] {
    function parseTime(timeStr: string): Date {
      const [hours, minutes] = timeStr.split(':').map(Number)
      const date = new Date()
      date.setHours(hours)
      date.setMinutes(minutes)
      date.setSeconds(0)
      return date
    }

    function formatTime(date: Date): string {
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      return `${hours}:${minutes}`
    }

    const start = parseTime(startTime)
    const end = parseTime(endTime)
    const intervals: string[] = []

    while (start <= end) {
      intervals.push(formatTime(start))
      start.setMinutes(start.getMinutes() + 1)
    }

    return intervals
  },

  truncateString(str: string, maxLength: number): string {
    if (str.length <= maxLength) return str
    return str.slice(0, maxLength) + '...'
  },
}

export default Utils
