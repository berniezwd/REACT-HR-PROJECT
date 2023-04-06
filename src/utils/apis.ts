import http from './http'

export type LoginPayload = {
  email: string
  pass: string
}
export function loginRequestFn(payload: LoginPayload) {
  return http.post('/users/login', payload, { method: 'post' })
}
