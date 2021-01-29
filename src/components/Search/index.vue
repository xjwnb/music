<!--
 * @Author: your name
 * @Date: 2021-01-26 16:49:42
 * @LastEditTime: 2021-01-29 15:04:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \music\src\components\Search\index.vue
-->
<template>
  <div class="search">
    <!-- 搜索 -->
    <el-popover ref="popover" placement="bottom" :width="300" trigger="click">
      <template #reference>
        <el-input
          placeholder="搜索"
          :value="text"
          v-model="SearchInputComputed"
          clearable
          @input="inputHandle"
          @keyup.enter="enterHandle(text)"
        />
      </template>
      <div class="search-result">
        <slot></slot>
      </div>
    </el-popover>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, toRefs, watch, toRef } from "vue";

export default defineComponent({
  name: "Search",
  props: ["text"],
  setup(props, { attrs, slots, emit }) {
    const searchInput = ref("");
    const { text } = toRefs(props);

    const SearchInputComputed = computed({
      get: () => {
        return text.value;
      },
      set: (val) => {
        emit("update:text", val);
      },
    });

    const inputHandle = (value: string | number) => {
      emit("input", value);
    };

    // 回车事件
    const enterHandle = (val: any) => {
      emit("enter", val);
    }

    return {
      searchInput,
      SearchInputComputed,
      text,
      inputHandle,
      enterHandle,
    };
  },
});
</script>

<style lang="less" scoped>
/* .search-result {
  width: 100%;
  height: 350px;
  overflow-y: scroll;
} */
/deep/ .el-popover.el-popper {
  padding: 0;
}
</style>