<template>
  <div class="login-div">
    <div class="login-form">
      <div class="login-title">登录</div>
      <el-form
        :model="loginFormData"
        :rules="loginRules"
        ref="loginForm"
        label-width="100px"
      >
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="loginFormData.phone"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="loginFormData.password"></el-input>
        </el-form-item>
        <!-- <el-form-item> -->
        <el-button type="primary" @click="submitForm">登录</el-button>
        <!-- </el-form-item> -->
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
// vue
import { defineComponent } from "vue";
// 接口
import { phoneLoginInterface } from "@/interface/public/login";
// 登录请求
import { phoneLogin } from "@/api/login/index";
// ele
import { ElMessage } from "element-plus";
// hooks
import { useLogiHandle } from "@/hooks/login/useLoginHandle";
// vuex
import store from "@/store";
// mutation 函数名
import { LOGIN_HANDLE } from "@/store/mutation-types";

export default defineComponent({
  name: "Login",
  data() {
    return {
      // 登录表单信息
      loginFormData: {
        phone: "",
        password: "",
      },
      // 登录表单规则
      loginRules: {
        phone: [
          { required: true, message: "请输入手机号码！", trigger: "change" },
        ],
        password: [
          { required: true, message: "请输入密码！", trigger: "change" },
        ],
      },
    };
  },
  setup() {},
  methods: {
    /**
     * 提交表单事件
     */
    submitForm() {
      (this.$refs.loginForm as any).validate(async (valid: any) => {
        // 校验成功
        if (valid) {
          // 获取登录后的信息
          try {
            let result = await useLogiHandle(this.loginFormData);
            console.log(result);
            // 登录信息返回 400 失败
            if ((result as any).code === 400) {
              ElMessage.warning({
                message: "手机号码或者密码错误！",
                type: "warning",
              });
              // // 登录信息返回 200 成功
            } else if ((result as any).code === 200) {
              ElMessage.success({
                message: "登录成功！",
                type: "success",
              });
              // vuex 修改登录状态
              store.commit(LOGIN_HANDLE);
              this.$router.push("/");
            }
          } catch (error) {
            // console.log(error);
            ElMessage.error({
              message: "服务器异常！",
              type: "error",
            });
          }
        } else {
          // console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm() {
      (this.$refs.loginForm as any).resetFields();
    },
  },
});
</script>

<style lang="less" scoped>
.login-div {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .login-form {
    position: relative;
    width: 25rem;
    padding: 2rem;
    border-radius: 0.5rem;
    // border: 1px solid #000000;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    .login-title {
      text-align: center;
      font-size: 1.5rem;
      font-weight: 700;
      font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
      margin-bottom: 1rem;
    }

    .el-button {
      width: 100%;
    }
  }
}
</style>
