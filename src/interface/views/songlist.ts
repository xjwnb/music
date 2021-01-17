/*
 * @Author: your name
 * @Date: 2021-01-16 19:01:40
 * @LastEditTime: 2021-01-17 17:40:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \music\src\interface\views\songlist.ts
 */
// 歌单歌曲信息接口
export interface songlistInterface {
  num: string, // 歌曲排序
  id: string,    // 歌曲 id
  title: string,  // 歌曲名称
  picUrl: string,  // 歌曲图片 url
  songer: string,  // 歌手
  album: string,  // 专辑
  playTimeFormat: string, // 时长
  playTime: number
}


// 歌单评论信息接口
export interface songlistCommentInterface {
  nickName: string, // 用户昵称
  picUrl: string, // 用户头像 url
  content: string, // 评论内容
  likedCount: number, // 点赞数量
  replied?: [], // 其他用户回答
  time: string, // 时间
}