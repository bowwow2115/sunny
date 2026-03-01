import store from '@/store'
import Utils from '@/utils/utils'
import * as api from '@/api/api'
import constants from '@/Constants'

function parseToken(result, reset = false) {
  // result = { code: '0', data: { accessToken, refreshToken, ... } }
  // 또는 result = { accessToken, refreshToken, ... }
  const tokenData = result.data || result

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

function loggedIn() {
  return new Promise((resolve, reject) => {
    let url = ''
    const sid = Utils.getCookie(constants.TOKEN)
    if (sid != null && sid !== '')
      url = `${constants.CONTEXT_PATH}/auth/validation`
    if (url !== '') {
      api
        .get(url, { sid })
        .then((response) => {
          console.log('loggedIn Check : ', response)
          //parseToken(response.data, true);
          if (response.code == '0') {
            if (response.data[0].authority == 'ROLE_ADMIN') {
              store.commit('SET_ADMIN', true)
            }
            if (
              response.data[1].userId != null ||
              response.data[1].userId != undefined
            ) {
              store.commit('SET_USERID', response.data[1].userId)
            }
            resolve(response)
          } else if (response.code == 'EXPIRED-TOKEN') {
            const refreshToken = Utils.getCookie('refreshToken')
            let param = {}
            param.refreshToken = refreshToken
            api.refreshToken(param).then((response) => {
              if (response.code == '0') resolve(response)
              else {
                Utils.deleteCookie('auth', '/')
                Utils.deleteCookie('lang')
                router.push({
                  path: '/signIn',
                })
              }
            })
          } else {
            reject(new Error('validation failure'))
          }
        })
        .catch((error) => {
          if (error.response) reject(new Error(error.response.data))
          else reject(new Error('validation failure'))
        })
    } else {
      reject(new Error('No cookie'))
    }
  })
}

function renewJWT() {
  return new Promise((resolve, reject) => {
    let url = ''
    url = '/auth/json/jwt/renew'
    if (url !== '') {
      api
        .get(url)
        .then((response) => {
          parseToken(response, true)
          resolve()
        })
        .catch((error) => {
          reject(new Error('renew failure'))
        })
    } else {
      reject(new Error('No cookie'))
    }
  })
}

function login(form) {
  return new Promise((resolve, reject) => {
    api
      .post(`${constants.CONTEXT_PATH}/login`, form)
      .then((r) => {
        console.log('login call : ', r)
        if (r.code != '0') {
          reject(r.code)
          return
        } else {
          parseToken(r)
          if (r.data.roles[0].authority == 'ROLE_ADMIN')
            store.commit('SET_ADMIN', true)
          if (r.data.userId != null || r.data.userId != undefined) {
            store.commit('SET_USERID', r.data.userId)
          }
          resolve(r.data)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}

function logout(user) {
  // clear store
  store.dispatch('resetState')

  Utils.deleteCookie('auth', '/')
  Utils.deleteCookie('JSESSIONID', '/')
  Utils.deleteCookie('refreshToken', '/')

  Utils.deleteCookie('lang')

  store.commit('SET_ADMIN', false)
  store.commit('SET_USERID', '')

  location.href = Utils.checkEnv(process.env.NODE_ENV)
  window.location.reload()
}

function resetPwdate(user) {
  let data = {
    userId: user,
  }

  return new Promise((resolve, reject) => {
    api
      .post(`${constants.CONTEXT_PATH}/resetPwdate`, data)
      .then((r) => {
        resolve(r)
      })
      .catch((error) => {
        alert(error.response)
        reject(error)
      })
  })
}

function changePassword(passwordForm) {
  const key = 'exAdm1111' // Utils.featuresDefault('security.key', '');
  let data = null

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
      .post(`${constants.CONTEXT_PATH}/changePw`, jQuery.param(data))
      .then((r) => {
        resolve(r)
      })
      .catch((error) => {
        reject(error)
      })
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
