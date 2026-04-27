import { useAppStore } from '@/stores/app'
import { pinia } from '@/pinia'
import Utils from '@/utils/utils'
import * as api from '@/api/api'
import constants from '@/Constants'
import type { LoginForm, PasswordForm, ApiResponse } from '@/types'

function appStore() {
  return useAppStore(pinia)
}

interface TokenData {
  accessToken?: string
  refreshToken?: string
  [key: string]: any
}

function parseToken(result: any): void {
  const tokenData: TokenData = result.data || result

  if (tokenData && tokenData.accessToken) {
    Utils.setCookie('auth', tokenData.accessToken, 3600 * 24, '/')
    if (tokenData.refreshToken) {
      Utils.setCookie(
        'refreshToken',
        tokenData.refreshToken,
        3600 * 24 * 30,
        '/'
      )
    }
  }
}

function loggedIn(): Promise<ApiResponse> {
  return new Promise((resolve, reject) => {
    let url = ''
    const sid = Utils.getCookie(constants.TOKEN)
    if (sid != null && sid !== '') {
      url = `${constants.CONTEXT_PATH}/auth/validation`
    }
    if (url !== '') {
      api
        .get(url, { sid })
        .then((response: any) => {
          console.log('loggedIn Check : ', response)
          if (response.code == '0') {
            if (response.data[0].authority == 'ROLE_ADMIN') {
              appStore().setAdmin(true)
            }
            if (
              response.data[1].userId != null ||
              response.data[1].userId != undefined
            ) {
              appStore().setUserId(response.data[1].userId)
            }
            resolve(response)
          } else if (response.code == 'EXPIRED-TOKEN') {
            const refreshToken = Utils.getCookie('refreshToken')
            const param = { refreshToken }
            api.refreshToken(param).then((r: any) => {
              if (r.code == '0') resolve(r)
              else {
                Utils.deleteCookie('auth', '/')
                Utils.deleteCookie('lang')
                window.location.hash = '#/SignIn'
              }
            })
          } else {
            reject(new Error('validation failure'))
          }
        })
        .catch((error: any) => {
          if (error.response) reject(new Error(error.response.data))
          else reject(new Error('validation failure'))
        })
    } else {
      reject(new Error('No cookie'))
    }
  })
}

function renewJWT(): Promise<void> {
  return new Promise((resolve, reject) => {
    const url = '/auth/json/jwt/renew'
    api
      .get(url)
      .then((response) => {
        parseToken(response)
        resolve()
      })
      .catch(() => {
        reject(new Error('renew failure'))
      })
  })
}

function login(form: LoginForm): Promise<any> {
  return new Promise((resolve, reject) => {
    api
      .post(`${constants.CONTEXT_PATH}/login`, form)
      .then((r: any) => {
        console.log('login call : ', r)
        if (r.code != '0') {
          reject(r.code)
          return
        }
        parseToken(r)
        if (r.data.roles[0].authority == 'ROLE_ADMIN') {
          appStore().setAdmin(true)
        }
        if (r.data.userId != null || r.data.userId != undefined) {
          appStore().setUserId(r.data.userId)
        }
        resolve(r.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

function logout(): void {
  appStore().resetState()

  Utils.deleteCookie('auth', '/')
  Utils.deleteCookie('JSESSIONID', '/')
  Utils.deleteCookie('refreshToken', '/')
  Utils.deleteCookie('lang')

  appStore().setAdmin(false)
  appStore().setUserId('')

  location.href = Utils.checkEnv(import.meta.env.MODE)
  window.location.reload()
}

function resetPwdate(user: string): Promise<any> {
  const data = { userId: user }

  return new Promise((resolve, reject) => {
    api
      .post(`${constants.CONTEXT_PATH}/resetPwdate`, data)
      .then((r) => resolve(r))
      .catch((error: any) => {
        alert(error.response)
        reject(error)
      })
  })
}

function changePassword(passwordForm: PasswordForm): Promise<any> {
  const key = 'exAdm1111'
  let data: Record<string, string> | null = null

  if (key) {
    data = {
      method: 'AES',
      userId: Utils.tripleDESenc(passwordForm.userId),
      currentPwd: Utils.tripleDESenc(passwordForm.currentPwd),
      newPwd: Utils.tripleDESenc(passwordForm.newPwd),
    }
  } else {
    data = {
      userId: passwordForm.userId,
      currentPwd: passwordForm.currentPwd,
      newPwd: passwordForm.newPwd,
    }
  }

  return new Promise((resolve, reject) => {
    api
      .postUrlEncoded(`${constants.CONTEXT_PATH}/changePw`, data!, false)
      .then((r) => resolve(r))
      .catch((error) => reject(error))
  })
}

export default {
  loggedIn,
  login,
  logout,
  renewJWT,
  resetPwdate,
  changePassword,
}
