
import { request } from "@/http";
// 引用接口
import { phoneLoginInterface } from "@/interface/public/login";


export function phoneLogin(option: phoneLoginInterface) {
  return request({
    url: `/login/cellphone?phone=${option.phone}&password=${option.password}`
  })
}

