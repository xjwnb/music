<template>
  <div>
    {{ msg }}
    <el-button>默认按钮</el-button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Login",
  data() {
    return {
      msg: "Login",
    };
  },
});
</script>

<style scoped>
</style>
