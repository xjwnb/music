import {
  ElButton,
  ElLoading,
  ElMessage
} from "element-plus";

console.log("element-plus")


const components = [
  ElButton
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
