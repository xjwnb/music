/*
 * @Author: your name
 * @Date: 2021-01-08 18:25:08
 * @LastEditTime: 2021-01-19 18:45:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \music\src\api\login\index.ts
 */

import { request } from "@/http";
// 引用接口
import { phoneLoginInterface } from "@/interface/public/login";

// 手机登录
export function phoneLogin(option: phoneLoginInterface) {
  return request({
    url: `/login/cellphone?phone=${option.phone}&password=${option.password}`
  })
}

// 获得登录状态
export function getLoginStatus() {
  return request({
    url: "/login/status",
  })
}

// 退出登录
export function logout() {
  return request({
    url: "/logout"
  })
}
