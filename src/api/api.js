import axios from 'axios'
import Utils from '@/utils/utils'
import constants from '@/Constants'

// Axios 인스턴스 생성
function createAxiosInstance(contentType = null) {
  const headers = {
    Authorization: `Bearer ${Utils.getToken()}`,
    Pragma: 'no-cache',
    'X-Requested-With': 'XMLHttpRequest',
    'X-TenantID': Utils.getTenant(),
  }
  if (contentType) headers['Content-Type'] = contentType

  return axios.create({ headers, cache: false })
}

// 로그아웃 처리
function handleLogout() {
  Utils.deleteCookie('auth', '/')
  Utils.deleteCookie('lang')
}

// 응답 검증 및 에러 처리
function validateResponse(response, withNoty = false) {
  if (response.data.code && response.data.code !== '0') {
    if (response.data.code === 'EXPIRED-TOKEN') {
      handleLogout()
      return null
    }
    if (withNoty)
      vue.$showError(
        response.data.message || '요청 처리 중 오류가 발생했습니다.'
      )
    throw response.data
  }
  return response.data
}

// HTTP 에러 처리
function handleError(error, withNoty = false) {
  console.error(error)
  if (error.response?.status === 401) {
    handleLogout()
    return null
  }
  if (withNoty && error.response?.data?.message) {
    vue.$showError(error.response.data.message)
  }
  throw error.response?.data || error
}

// GET 요청
export function get(url, params = {}, withNoty = false) {
  return createAxiosInstance()
    .get(url, { params })
    .then((response) => validateResponse(response, withNoty))
    .catch((error) => handleError(error, withNoty))
}

// POST 요청
export function post(url, data = {}, withNoty = false) {
  return createAxiosInstance('application/json')
    .post(url, data)
    .then((response) => validateResponse(response, withNoty))
    .catch((error) => handleError(error, withNoty))
}

// POST 요청 (FormData)
export function postForm(url, data, withNoty = false) {
  return createAxiosInstance('multipart/form-data')
    .post(url, data)
    .then((response) => validateResponse(response, withNoty))
    .catch((error) => handleError(error, withNoty))
}

// PUT 요청
export function put(url, data = {}, withNoty = false) {
  return createAxiosInstance('application/json')
    .put(url, data)
    .then((response) => validateResponse(response, withNoty))
    .catch((error) => handleError(error, withNoty))
}

// PUT 요청 (FormData)
export function putForm(url, data, withNoty = false) {
  return createAxiosInstance('multipart/form-data')
    .put(url, data)
    .then((response) => validateResponse(response, withNoty))
    .catch((error) => handleError(error, withNoty))
}

// DELETE 요청
export function deleteRequest(url, params = {}, withNoty = false) {
  return createAxiosInstance()
    .delete(url, { params })
    .then((response) => validateResponse(response, withNoty))
    .catch((error) => handleError(error, withNoty))
}

// DELETE 요청 (body 포함)
export function deleteRequestWithBody(url, data = {}, withNoty = false) {
  return createAxiosInstance()
    .delete(url, { data })
    .then((response) => validateResponse(response, withNoty))
    .catch((error) => handleError(error, withNoty))
}
// ========== Child API ==========
export function getAllChildren() {
  return get(`${constants.CONTEXT_PATH}/child/all`)
}

export function getChildById(id) {
  return get(`${constants.CONTEXT_PATH}/child`, { id })
}

export function getAttendingChildren() {
  return get(`${constants.CONTEXT_PATH}/child/all/attending`)
}

export function getBirthMonthChild() {
  return get(`${constants.CONTEXT_PATH}/child/birth`)
}

export function checkChild(name, className) {
  return get(`${constants.CONTEXT_PATH}/child/checkChild`, { name, className })
}

export function addChild(param) {
  return post(`${constants.CONTEXT_PATH}/child`, param)
}

export function updateChild(param) {
  return put(`${constants.CONTEXT_PATH}/child`, param)
}

export function deleteChild(id) {
  return deleteRequest(`${constants.CONTEXT_PATH}/child`, { id })
}

export function registChildAsExcel(param) {
  return postForm(`${constants.CONTEXT_PATH}/excel/child`, param)
}

export function updateChildrenClass(param, className) {
  return put(`${constants.CONTEXT_PATH}/child/all/class`, param, false)
}

// ========== Class API ==========
export function getClassList() {
  return get(`${constants.CONTEXT_PATH}/class`)
}

export function addClass(param) {
  return post(`${constants.CONTEXT_PATH}/class`, param)
}

export function deleteClass(id) {
  return deleteRequest(`${constants.CONTEXT_PATH}/class`, { id })
}

// ========== Ride API ==========
export function getRideList() {
  return get(`${constants.CONTEXT_PATH}/ride/all`)
}

export function addRide(param) {
  return post(`${constants.CONTEXT_PATH}/ride`, param)
}

export function updateRide(param) {
  return put(`${constants.CONTEXT_PATH}/ride`, param)
}

export function deleteRide(id) {
  return deleteRequest(`${constants.CONTEXT_PATH}/ride`, { id })
}

// ========== ChildRide API ==========
export function addChildRide(param) {
  return post(`${constants.CONTEXT_PATH}/childRide`, param)
}

export function addChildRideList(param) {
  return post(`${constants.CONTEXT_PATH}/childRide/list`, param)
}

export function updateChildRide(param) {
  return put(`${constants.CONTEXT_PATH}/childRide`, param)
}

export function deleteChildRide(id) {
  return deleteRequest(`${constants.CONTEXT_PATH}/childRide`, { id })
}

// ========== Parents API ==========
export function addParents(param) {
  return post(`${constants.CONTEXT_PATH}/parents`, param)
}

export function updateParents(param) {
  return put(`${constants.CONTEXT_PATH}/parents`, param)
}

export function deleteParents(id) {
  return deleteRequest(`${constants.CONTEXT_PATH}/parents`, { id })
}

// ========== Meeting Location API ==========
export function addMeetingLocation(param) {
  return post(`${constants.CONTEXT_PATH}/meetingLocation`, param)
}

export function updateMeetingLocation(param) {
  return put(`${constants.CONTEXT_PATH}/meetingLocation`, param)
}

export function deleteMeetingLocation(id) {
  return deleteRequest(`${constants.CONTEXT_PATH}/meetingLocation`, { id })
}

// ========== User API ==========
export function getUsers() {
  return get(`${constants.CONTEXT_PATH}/user/all`)
}

export function addUser(param) {
  return post(`${constants.CONTEXT_PATH}/user`, param)
}

// ========== Auth API ==========
export function refreshToken(param) {
  return post(`${constants.CONTEXT_PATH}/jwt/refresh`, param)
}
