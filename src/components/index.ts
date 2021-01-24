/*
 * @Author: your name
 * @Date: 2021-01-10 15:31:48
 * @LastEditTime: 2021-01-23 21:19:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \music\src\components\index.ts
 */
/**
 * 统一引入
 */
import Carousel from "./Carousel/index.vue";
import ClassifyShow from "./ClassifyShow/index.vue";
import SongSheet from "./SongSheet/index.vue";
import LatestMusic from "./LatestMusic/index.vue";
import Singer from "./Singer/index.vue";
import AlbumDetail from "./AlbumDetail/index.vue";
import Drawer from "./Drawer/index.vue";


/**
 * 统一导出
 */
// 走马灯
export const CarouselCom = Carousel;
// 分类
export const ClassifyShowCom = ClassifyShow;
// 歌单
export const SongSheetCom = SongSheet;
// 最新音乐
export const LatestMusicCom = LatestMusic;
// 歌手
export const SingerCom = Singer;
// 专辑信息
export const AlbumDetailCom = AlbumDetail;
// 抽屉
export const DrawerCom = Drawer;