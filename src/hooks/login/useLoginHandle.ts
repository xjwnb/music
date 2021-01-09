
// 接口
import { phoneLoginInterface } from "@/interface/public/login";

// 登录请求
import { phoneLogin } from "@/api/login/index";

/**
 * 
 * @param loginInfo phoneLoginInterface
 * @returns Promise
 */
export function useLogiHandle(loginInfo: phoneLoginInterface) {
  let result = {};
  // 登录请求
  return new Promise((resolve, reject) => {
    phoneLogin(loginInfo).then(res => {
      result = (res as any).data;
      resolve((res as any).data);
    }).catch(err => {
      if (err) {
        reject(err);
      }
    })
  })
}