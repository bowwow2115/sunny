import constants from '@/Constants'
import CryptoJS from 'crypto-js'

const Utils = {
  regExpIp() {
    return /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]|[*])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]|[*])$/
  },
  // COOKIES
  setCookie(cName, cValue, seconds = 3600, path = '/') {
    let expire = new Date()
    expire.setTime(expire.getTime() + seconds * 1000)
    let cookies = cName + '=' + escape(cValue) + '; path=' + path
    if (typeof cDay != 'undefined')
      cookies += ';expires=' + expire.toGMTString() + ';'
    document.cookie = cookies
  },
  deleteCookie(cookieName, path = '') {
    let expireDate = new Date()
    if (path === '') path = '/'

    expireDate.setDate(expireDate.getDate() - 1)
    document.cookie =
      cookieName +
      '= ' +
      '; expires=' +
      expireDate.toGMTString() +
      '; path=' +
      path
  },
  getCookie(cName) {
    cName = cName + '='
    let cookieData = document.cookie
    let start = cookieData.indexOf(cName)
    let cValue = ''
    if (start != -1) {
      start += cName.length
      let end = cookieData.indexOf(';', start)
      if (end == -1) end = cookieData.length
      cValue = cookieData.substring(start, end)
    }
    return unescape(cValue)
  },
  getToken() {
    return Utils.getCookie('auth')
  },
  tripleDESenc(parameters) {
    const key = CryptoJS.enc.Utf8.parse('vf_9g13j4j91j27c582ji693')
    const iv = CryptoJS.enc.Utf8.parse('vf_iv000')

    let encrypt = CryptoJS.TripleDES.encrypt(parameters, key, {
      iv: iv,
      keySize: 8,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    })
    return encrypt.toString()
  },
  getTenant() {
    return Utils.getCookie('tenant')
  },
  isNull(str) {
    return str === null || str === undefined || str === ''
  },
  checkEnv(NODE_ENV) {
    if (NODE_ENV === 'production') {
      return `${constants.CONTEXT_PATH}/#/signIn`
    } else {
      return '/'
    }
  },
  convertDateToLocalDateTime(dateString) {
    return dateString + 'T00:00:00'
  },
  getTimeIntervals(startTime, endTime) {
    // 시간 문자열을 Date 객체로 변환하는 함수
    function parseTime(timeStr) {
      const [hours, minutes] = timeStr.split(':').map(Number)
      const date = new Date()
      date.setHours(hours)
      date.setMinutes(minutes)
      date.setSeconds(0)
      return date
    }

    // Date 객체를 "HH:mm" 형식의 문자열로 변환하는 함수
    function formatTime(date) {
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      return `${hours}:${minutes}`
    }

    const start = parseTime(startTime)
    const end = parseTime(endTime)
    const intervals = []

    while (start <= end) {
      intervals.push(formatTime(start))
      start.setMinutes(start.getMinutes() + 1) // 5분 단위로 증가
    }

    return intervals
  },
  truncateString(str, maxLength) {
    if (str.length <= maxLength) {
      return str
    }
    return str.slice(0, maxLength) + '...'
  },
}

export default Utils
