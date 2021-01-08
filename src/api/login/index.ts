import { request } from "@/http";

interface phoneLoginInterface {
  phone: string,
  password: string
}


export function phoneLogin(option: phoneLoginInterface) {
  return request({
    url: `/login/cellphone?phone=${option.phone}&password=${option.password}`
  })
}

