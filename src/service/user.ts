import { post } from './request'

export type LoginParams = {
  username: string
  password: string
}

export type LoginResult = {
  token: string
}

export const userLogin = (params: LoginParams) => {
  return post<LoginResult>({}, '/api/login', params)
}
