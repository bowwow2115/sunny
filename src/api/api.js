import axios from 'axios'
import Utils from '@/utils/utils'

export function ax(contentType = null) {
  let headers = {}
  headers = { Authorization: `Bearer ${Utils.getToken()}` }
  if (contentType) headers['Content-Type'] = contentType
  headers.Pragma = 'no-cache'
  headers['X-Requested-With'] = 'XMLHttpRequest'
  headers['X-TenantID'] = Utils.getTenant()
  return axios.create({
    headers,
    cache: false,
  })
}

export function toLogin() {
  Utils.deleteCookie('auth', '/')
  Utils.deleteCookie('lang')
}

export function postUrl(url, content = '', withNoty = false) {
  return post2(
    url,
    content,
    'application/x-www-form-urlencoded; charset=UTF-8',
    withNoty
  )
}

export function post(url, content = '', overwrite = false, onupload) {
  return new Promise((resolve, reject) => {
    const request = new window.XMLHttpRequest()
    request.open('POST', `${url}`, true)
    request.setRequestHeader(
      'Authorization',
      `Bearer ${Utils.getCookie('auth')}`
    )
    request.setRequestHeader('Content-Type', 'application/json')
    if (typeof onupload === 'function') {
      request.upload.onprogress = onupload
    }

    if (overwrite) {
      request.setRequestHeader('Action', 'override')
    }

    request.onload = () => {
      if (request.status === 200) {
        resolve(request.responseText)
      } else if (request.status === 409) {
        reject(request.status)
      } else {
        reject(request.responseText)
      }
    }

    request.onerror = (error) => {
      reject(error)
    }
    request.send(content)
  })
}

export function get(url, params = '', withNoty = false) {
  return new Promise((resolve, reject) => {
    ax()
      .get(url, { params })
      .then((response) => {
        if (response.data.code && response.data.code != '0') {
          // -100 is expired session
          if (response.data.code == 'EXPIRED-TOKEN') {
            toLogin()
            return
          }
          if (withNoty) vue.$showError(`${response.data.message}`)
          reject(response.data)
          return
        }
        resolve(response.data)
      })
      .catch((error) => {
        console.log(error)
        if (error.response && error.response.status == 401) {
          toLogin()
          return
        }
        if (error.response && error.response.data) {
          if (withNoty && error.response.data.message) {
            vue.$showError(`${error.response.data.message}`)
          }
          reject(error.response.data)
        }
      })
  })
}

export function post2(
  url,
  content = '',
  contentType = 'application/json',
  withNoty = false
) {
  return new Promise((resolve, reject) => {
    ax(contentType)
      .post(url, content)
      .then((response) => {
        if (response.data.code && response.data.code != '0') {
          // -100 is expired session
          if (response.data.code === 'EXPIRED-TOKEN') {
            toLogin()
            return
          }
          if (withNoty) vue.$showError(`${response.data.message}`)
          reject(response.data)
          return
        }
        resolve(response.data)
      })
      .catch((error) => {
        console.log(error)
        if (error.response.status == 401) {
          toLogin()
          return
        }
        if (error.response.data) {
          if (withNoty) vue.$showError(error.response.data)
          reject(error.response.data)
        }
      })
  })
}

export function postForm(url, data, withNoty = false) {
  return new Promise((resolve, reject) => {
    ax('multipart/form-data')
      .post(url, data)
      .then((response) => {
        if (response.data.code != '0') {
          // -100 is expired session
          if (response.data.code === 'EXPIRED-TOKEN') {
            toLogin()
            return
          }
          reject(response.data)
          return
        }
        resolve(response.data)
      })
      .catch((error) => {
        console.log(error)
        if (error.response.data) {
          if (withNoty) vue.$showError(error.response.data)
          else reject(error.response.data)
        }
      })
  })
}
export function put(
  url,
  content = '',
  contentType = 'application/json',
  withNoty = false
) {
  return new Promise((resolve, reject) => {
    ax(contentType)
      .put(url, content)
      .then((response) => {
        if (response.data.code && response.data.code != '0') {
          // -100 is expired session
          if (response.data.code === 'EXPIRED-TOKEN') {
            toLogin()
            return
          }
          if (withNoty) vue.$showError(`${response.data.message}`)
          reject(response.data)
          return
        }
        resolve(response.data)
      })
      .catch((error) => {
        console.log(error)
        if (error.response.status == 401) {
          toLogin()
          return
        }
        if (error.response.data) {
          if (withNoty) vue.$showError(error.response.data)
          reject(error.response.data)
        }
      })
  })
}
export function putForm(url, data, withNoty = false) {
  return new Promise((resolve, reject) => {
    ax('multipart/form-data')
      .put(url, data)
      .then((response) => {
        if (response.data.code != '0') {
          // -100 is expired session
          if (response.data.code === 'EXPIRED-TOKEN') {
            toLogin()
            return
          }
          reject(response.data)
          return
        }
        resolve(response.data)
      })
      .catch((error) => {
        console.log(error)
        if (error.response.data) {
          if (withNoty) showErrMsgBox(null, error.response.data)
          // vue.$showError(error.response.data);
          else reject(error.response.data)
        }
      })
  })
}
export function deleteCall(
  url,
  params = '',
  contentType = '',
  withNoty = false
) {
  return new Promise((resolve, reject) => {
    ax(contentType)
      .delete(url, { params })
      .then((response) => {
        if (response.data.code && response.data.code != '0') {
          // -100 is expired session
          if (response.data.code == 'EXPIRED-TOKEN') {
            toLogin()
            return
          }
          if (withNoty) vue.$showError(`${response.data.message}`)
          reject(response.data)
          return
        }
        resolve(response.data)
      })
      .catch((error) => {
        console.log(error)
        if (error.response && error.response.status == 401) {
          toLogin()
          return
        }
        if (error.response && error.response.data) {
          if (withNoty && error.response.data.message) {
            vue.$showError(`${error.response.data.message}`)
          }
          reject(error.response.data)
        }
      })
  })
}
export function deleteBody(
  url,
  params = '',
  contentType = 'application/json',
  withNoty = false
) {
  return new Promise((resolve, reject) => {
    ax(contentType)
      .delete(url, { data: params })
      .then((response) => {
        if (response.data.code && response.data.code != '0') {
          // -100 is expired session
          if (response.data.code == 'EXPIRED-TOKEN') {
            toLogin()
            return
          }
          if (withNoty) vue.$showError(`${response.data.message}`)
          reject(response.data)
          return
        }
        resolve(response.data)
      })
      .catch((error) => {
        console.log(error)
        if (error.response && error.response.status == 401) {
          toLogin()
          return
        }
        if (error.response && error.response.data) {
          if (withNoty && error.response.data.message) {
            vue.$showError(`${error.response.data.message}`)
          }
          reject(error.response.data)
        }
      })
  })
}

export function getChildren() {
  return get(`/sunny/child/all`)
}

export function getChildById(id) {
  return get(`/sunny/child?id=${id}`)
}

export function addChild(param) {
  return post2(`/sunny/child`, param)
}

export function getClassList() {
  return get(`/sunny/class`)
}

export function getRideList() {
  return get(`/sunny/ride`)
}

export function addParents(param) {
  return post2(`/sunny/parents`, param)
}

export function updateParents(param) {
  return put(`/sunny/parents`, param)
}

export function addChildRide(param) {
  return post2(`/sunny/childRide`, param)
}

export function updateChildRide(param) {
  return put(`/sunny/childRide`, param)
}

export function deleteParents(id) {
  return deleteCall(`/sunny/parents?id=${id}`)
}
