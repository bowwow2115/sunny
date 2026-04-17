import axios, { AxiosInstance, AxiosResponse } from 'axios'
import Utils from '@/utils/utils'
import constants from '@/Constants'
import type { ApiResponse } from '@/types'

function createAxiosInstance(contentType: string | null = null): AxiosInstance {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${Utils.getToken()}`,
    Pragma: 'no-cache',
    'X-Requested-With': 'XMLHttpRequest',
    'X-TenantID': Utils.getTenant(),
  }
  if (contentType) headers['Content-Type'] = contentType

  return axios.create({ headers })
}

function handleLogout(): void {
  Utils.deleteCookie('auth', '/')
  Utils.deleteCookie('lang')
}

function validateResponse<T = any>(
  response: AxiosResponse<ApiResponse<T>>,
  withNoty = false
): ApiResponse<T> | null {
  const data = response.data
  if (data.code && data.code !== '0') {
    if (data.code === 'EXPIRED-TOKEN') {
      handleLogout()
      return null
    }
    if (withNoty && window.vue?.$showError) {
      window.vue.$showError(
        data.message || '요청 처리 중 오류가 발생했습니다.'
      )
    }
    throw data
  }
  return data
}

function handleError(error: any, withNoty = false): null {
  console.error(error)
  if (error.response?.status === 401) {
    handleLogout()
    return null
  }
  if (withNoty && error.response?.data?.message && window.vue?.$showError) {
    window.vue.$showError(error.response.data.message)
  }
  throw error.response?.data || error
}

export function get<T = any>(
  url: string,
  params: Record<string, any> = {},
  withNoty = false
): Promise<ApiResponse<T> | null> {
  return createAxiosInstance()
    .get<ApiResponse<T>>(url, { params })
    .then((response) => validateResponse<T>(response, withNoty))
    .catch((error) => handleError(error, withNoty))
}

export function post<T = any>(
  url: string,
  data: any = {},
  withNoty = false
): Promise<ApiResponse<T> | null> {
  return createAxiosInstance('application/json')
    .post<ApiResponse<T>>(url, data)
    .then((response) => validateResponse<T>(response, withNoty))
    .catch((error) => handleError(error, withNoty))
}

export function postForm<T = any>(
  url: string,
  data: FormData,
  withNoty = false
): Promise<ApiResponse<T> | null> {
  return createAxiosInstance('multipart/form-data')
    .post<ApiResponse<T>>(url, data)
    .then((response) => validateResponse<T>(response, withNoty))
    .catch((error) => handleError(error, withNoty))
}

export function put<T = any>(
  url: string,
  data: any = {},
  withNoty = false
): Promise<ApiResponse<T> | null> {
  return createAxiosInstance('application/json')
    .put<ApiResponse<T>>(url, data)
    .then((response) => validateResponse<T>(response, withNoty))
    .catch((error) => handleError(error, withNoty))
}

export function putForm<T = any>(
  url: string,
  data: FormData,
  withNoty = false
): Promise<ApiResponse<T> | null> {
  return createAxiosInstance('multipart/form-data')
    .put<ApiResponse<T>>(url, data)
    .then((response) => validateResponse<T>(response, withNoty))
    .catch((error) => handleError(error, withNoty))
}

export function deleteRequest<T = any>(
  url: string,
  params: Record<string, any> = {},
  withNoty = false
): Promise<ApiResponse<T> | null> {
  return createAxiosInstance()
    .delete<ApiResponse<T>>(url, { params })
    .then((response) => validateResponse<T>(response, withNoty))
    .catch((error) => handleError(error, withNoty))
}

export function deleteRequestWithBody<T = any>(
  url: string,
  data: any = {},
  withNoty = false
): Promise<ApiResponse<T> | null> {
  return createAxiosInstance()
    .delete<ApiResponse<T>>(url, { data })
    .then((response) => validateResponse<T>(response, withNoty))
    .catch((error) => handleError(error, withNoty))
}

// ========== Child API ==========
export function getAllChildren() {
  return get(`${constants.CONTEXT_PATH}/child/all`)
}

export function getChildById(id: number | string) {
  return get(`${constants.CONTEXT_PATH}/child`, { id })
}

export function getAttendingChildren() {
  return get(`${constants.CONTEXT_PATH}/child/all/attending`)
}

export function getBirthMonthChild() {
  return get(`${constants.CONTEXT_PATH}/child/birth`)
}

export function checkChild(param: Record<string, any>) {
  return get(`${constants.CONTEXT_PATH}/child/checkChild`, param)
}

export function addChild(param: Record<string, any>) {
  return post(`${constants.CONTEXT_PATH}/child`, param)
}

export function updateChild(param: Record<string, any>) {
  return put(`${constants.CONTEXT_PATH}/child`, param)
}

export function deleteChild(id: number | string) {
  return deleteRequest(`${constants.CONTEXT_PATH}/child`, { id })
}

export function registChildAsExcel(param: FormData) {
  return postForm(`${constants.CONTEXT_PATH}/excel/child`, param)
}

export function updateChildrenClass(param: any, _className?: string) {
  return put(`${constants.CONTEXT_PATH}/child/all/class`, param, false)
}

// ========== Class API ==========
export function getClassList() {
  return get(`${constants.CONTEXT_PATH}/class`)
}

export function addClass(param: Record<string, any>) {
  return post(`${constants.CONTEXT_PATH}/class`, param)
}

export function deleteClass(id: number | string) {
  return deleteRequest(`${constants.CONTEXT_PATH}/class`, { id })
}

// ========== Ride API ==========
export function getRideList() {
  return get(`${constants.CONTEXT_PATH}/ride/all`)
}

export function addRide(param: Record<string, any>) {
  return post(`${constants.CONTEXT_PATH}/ride`, param)
}

export function updateRide(param: Record<string, any>) {
  return put(`${constants.CONTEXT_PATH}/ride`, param)
}

export function deleteRide(id: number | string) {
  return deleteRequest(`${constants.CONTEXT_PATH}/ride`, { id })
}

// ========== ChildRide API ==========
export function addChildRide(param: Record<string, any>) {
  return post(`${constants.CONTEXT_PATH}/childRide`, param)
}

export function addChildRideList(param: any[]) {
  return post(`${constants.CONTEXT_PATH}/childRide/list`, param)
}

export function updateChildRide(param: Record<string, any>) {
  return put(`${constants.CONTEXT_PATH}/childRide`, param)
}

export function deleteChildRide(id: number | string) {
  return deleteRequest(`${constants.CONTEXT_PATH}/childRide`, { id })
}

// ========== Parents API ==========
export function addParents(param: Record<string, any>) {
  return post(`${constants.CONTEXT_PATH}/parents`, param)
}

export function updateParents(param: Record<string, any>) {
  return put(`${constants.CONTEXT_PATH}/parents`, param)
}

export function deleteParents(id: number | string) {
  return deleteRequest(`${constants.CONTEXT_PATH}/parents`, { id })
}

// ========== Meeting Location API ==========
export function addMeetingLocation(param: Record<string, any>) {
  return post(`${constants.CONTEXT_PATH}/meetingLocation`, param)
}

export function updateMeetingLocation(param: Record<string, any>) {
  return put(`${constants.CONTEXT_PATH}/meetingLocation`, param)
}

export function deleteMeetingLocation(id: number | string) {
  return deleteRequest(`${constants.CONTEXT_PATH}/meetingLocation`, { id })
}

// ========== User API ==========
export function getUsers() {
  return get(`${constants.CONTEXT_PATH}/user/all`)
}

export function addUser(param: Record<string, any>) {
  return post(`${constants.CONTEXT_PATH}/user`, param)
}

// ========== Auth API ==========
export function refreshToken(param: Record<string, any>) {
  return post(`${constants.CONTEXT_PATH}/jwt/refresh`, param)
}

export function checkDuplicateUserId(_userId: string) {
  return null
}
