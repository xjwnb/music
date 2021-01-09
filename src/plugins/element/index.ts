/*
 * @Author: your name
 * @Date: 2021-01-08 18:39:20
 * @LastEditTime: 2021-01-09 18:53:56
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \music\src\plugins\element\index.ts
 */
import {
  
  // 组件
  ElButton,
  ElContainer,
  ElFooter,
  ElForm,
  ElFormItem,
  ElHeader,
  ElInput,
  ElAside,
  ElMain,
  ElMenu,
  ElMenuItem,
  ElSubmenu,

  // 插件
  ElLoading,

  ElMessage
} from "element-plus";

const components = [
  ElButton,
  ElForm,
  ElFormItem,
  ElInput,
  ElContainer,
  ElAside,
  ElHeader,
  ElMain,
  ElFooter,
  ElMenu,
  ElMenuItem,
  ElSubmenu
];

const plugins = [
  ElLoading,
  ElMessage
];


export function getEle(app: any) {
  components.forEach(component => {
    app.component(component.name, component);
  });

  plugins.forEach(plugin => {
    app.use(plugin)
  })
}
