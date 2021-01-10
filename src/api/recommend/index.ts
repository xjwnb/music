
import { request } from "@/http";

// 请求 banner 
export function getRecommendBanner() {
  return request({
    url: "/banner?type=0"
  })
}

// 推荐歌单
export function getPersonalized() {
  return request({
    url: "/personalized?limit=10"
  })
}
