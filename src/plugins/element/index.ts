import {
  // 组件
  ElButton,
  ElForm,
  ElFormItem,
  ElInput,


  // 插件
  ElLoading,
  ElMessage
} from "element-plus";

const components = [
  ElButton,
  ElForm,
  ElFormItem,
  ElInput,
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
