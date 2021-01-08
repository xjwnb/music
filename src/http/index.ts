
import axios from 'axios';

export function request(options: object) {
  return new Promise((resolve, reject) => {
    const instance = axios.create({
      baseURL: "/api",
      timeout: 1000
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


