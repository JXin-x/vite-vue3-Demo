import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'

interface BaseResponse<T = any> {
    code: number | string
    message: string
    data: T
}
const service = axios.create({
    baseURL: import.meta.env.VITE_API_USE_MOCK
        ? import.meta.env.VITE_APP_MOCK_BASEURL
        : import.meta.env.VITE_APP_API_BASEURL,
    timeout: 10000
})
service.interceptors.request.use(
    (config) => {
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)
service.interceptors.response.use(
    (response) => {
        if (response.status === 200) {
            return response.data
        } else {
            ElMessage.error(response.data.message)
        }
    },
    (error) => {
        const { response } = error
        if (response) {
            ElMessage.error(response.data.message)
            return Promise.reject(error)
        }
        ElMessage.error('服务器异常')
    }
)

const requestInstance = <T = any>(config: AxiosRequestConfig): Promise<T> => {
    const conf = config
    return new Promise((resolve, reject) => {
        service.request<any, AxiosResponse<BaseResponse>>(conf).then((res: AxiosResponse<BaseResponse>) => {
            const data = res.data
            if (data.code !== 0) {
                ElMessage.error(data.message)
                reject(data.message)
            } else {
                resolve(data.data)
            }
        })
    })
}

export function get<T = any, U = any>(config: AxiosRequestConfig, url: string, params?: U): Promise<T> {
    return requestInstance<T>({ ...config, url, method: 'GET', params: params })
}

export function post<T = any, U = any>(config: AxiosRequestConfig, url: string, data?: U): Promise<T> {
    return requestInstance<T>({ ...config, url, method: 'POST', data })
}
export default service
