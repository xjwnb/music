<!--
 * @Author: your name
 * @Date: 2021-01-23 20:33:37
 * @LastEditTime: 2021-01-24 11:28:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \music\src\components\Drawer\index.vue
  , !value ? 'drawer-display-none-' + direction : ''
-->


<template>
  <!-- <transition name="drawer-move"> -->
  <div v-show="value" :class="['drawer']" :style="drawerStyle">
    <div
      :class="['drawer-content', drawerDirectionClass]"
      :style="drawerContentStyle"
    >
      <h1 v-if="title">{{ title }}</h1>
      <slot></slot>
    </div>
  </div>
  <!-- </transition> -->
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";

export default defineComponent({
  url: "Drawer",
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    direction: {
      type: String,
      default: "rtl",
    },
    title: {
      type: String,
      default: "",
    },
    top: {
      type: Number,
      default: 0,
    },
    right: {
      type: Number,
      default: 0,
    },
    left: {
      type: Number,
      default: 0,
    },
    bottom: {
      type: Number,
      default: 0,
    },
    width: {
      type: String,
      default: "60%",
    },
  },
  setup(props) {
    const { top, right, bottom, left, direction, width } = props;
    // wrader 样式
    const drawerStyle = computed(() => {
      return {
        top: top + "px",
        right: right + "px",
        bottom: bottom + "px",
        left: left + "px",
      };
    });
    //
    const drawerDirectionClass = ref(`drawer-${direction}`);
    // drawer-content 样式
    const drawerContentStyle = computed(() => {
      return {
        width: direction === "ltr" || direction === "rtl" ? width : "",
        height: direction === "ttb" || direction === "btt" ? width : "",
      };
    });

    return {
      drawerStyle,
      drawerDirectionClass,
      drawerContentStyle,
    };
  },
  computed: {},
});
</script>

<style lang="less" scoped>
.drawer {
  position: fixed;
  z-index: 100;
  background-color: rgba(77, 77, 77, 0.7);
  overflow: hidden;
  .drawer-rtl {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    height: 100%;
    background-color: #ffffff;
    transform: translateX(100%);
    animation: animatrtl 0.7s ease-out 0.5s 1 normal forwards;
    @keyframes animatrtl {
      0% {
        transform: translateX(100%);
      }
      100% {
        transform: translateX(0%);
      }
    }
  }
  .drawer-ltr {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    height: 100%;
    background-color: #ffffff;
    transform: translateX(-100%);
    animation: animatltr 0.7s ease-out 0.5s 1 normal forwards;
    @keyframes animatltr {
      0% {
        transform: translateX(-100%);
      }
      100% {
        transform: translateX(0%);
      }
    }
  }
  .drawer-ttb {
    position: absolute;
    right: 0;
    left: 0;
    top: 0;
    height: 100%;
    background-color: #ffffff;
    transform: translateY(-100%);
    animation: animatttb 0.7s ease-out 0.5s 1 normal forwards;
    @keyframes animatttb {
      0% {
        transform: translateY(-100%);
      }
      100% {
        transform: translateY(0%);
      }
    }
  }
  .drawer-btt {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100%;
    background-color: #ffffff;
    transform: translateY(100%);
    animation: animatbtt 0.7s ease-out 0.5s 1 normal forwards;
    @keyframes animatbtt {
      0% {
        transform: translateY(100%);
      }
      100% {
        transform: translateY(0%);
      }
    }
  }
}

.drawer-display-none-btt {
  transform: translateY(0%);
  animation: animatdisplayNonebtt 0.7s ease-out 0.5s 1 normal forwards;
  @keyframes animatdisplayNonebtt {
    0% {
      transform: translateY(0%);
    }
    100% {
      transform: translateY(100%);
    }
  }
}
</style>