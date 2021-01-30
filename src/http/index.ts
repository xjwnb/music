/*
 * @Author: your name
 * @Date: 2021-01-08 18:08:51
 * @LastEditTime: 2021-01-30 11:06:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \music\src\http\index.ts
 */

import axios from 'axios';

export function request(options: object) {
  return new Promise((resolve, reject) => {
    const instance = axios.create({
      baseURL: "/musicApi",
      timeout: 1000000
    });

    // 请求拦截
    instance.interceptors.request.use(req => {
      console.log("request", req);
      return req;
    })

    // 响应拦截
    instance.interceptors.response.use(res => {
      return res;
    })

    instance.defaults.withCredentials = true;


    instance(options)
      .then(res => {
        resolve(res);
      }).catch(err => {
        reject(err);
      })

  })
}


