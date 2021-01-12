/*
 * @Author: your name
 * @Date: 2021-01-12 14:58:41
 * @LastEditTime: 2021-01-12 15:02:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \music\src\hooks\audioHooks\index.ts
 */
/**
 * 引入
 */
// 修改 audio id
import useChangeAudioId from "./useChangeAudioId";
// 增加 audio 列表
import useAddAudioList from "./useAddAudioList";



/**
 * 导出
 */
// 修改 audio id
export const useChangeAudioIdHooks = useChangeAudioId;
// 增加 audio 列表
export const useAddAudioListHooks = useAddAudioList;