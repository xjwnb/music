<!--
 * @Author: your name
 * @Date: 2021-01-27 15:26:42
 * @LastEditTime: 2021-01-27 17:50:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \music\src\components\Tabs\index.vue
-->
<template>
  <div class="tabs">
    <div 
      v-for="(tab, index) in data" 
      :key="tab.id" 
      :class="['tab', currentTab === tab.name ? 'active': '']"
      @click.stop="clickTabHandle(tab, index)">
      {{ tab.name }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from "vue";

export default defineComponent({
  name: "Tabs",
  props: {
    data: Array, 
    default: []
  },
  setup(props, { emit }) {
    let prop: any = toRefs(props);
    console.log(prop);
    let name = prop.data.value && prop.data.value[0].name;
    const currentTab = ref(name)
    const clickTabHandle = (tab: any, index: number) => {
      currentTab.value = tab.name;
      emit("click", tab, index);
    }
    return {
      clickTabHandle,
      currentTab,
    }
  }
})
</script>

<style lang="less" scoped>
.tabs {
  display: flex;
  .tab {
    padding: 5px 10px;
    cursor: pointer;
    color: #5e5959;
    margin: 0 10px;
  }
  .active {
    border-bottom: 1px solid #e77c7c;
    color: #000000;
    font-size: 16px;
    font-weight: 700;
  }
}
</style>