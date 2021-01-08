<template>
  <div>
    {{ msg }}
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
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- <el-button @click="loginHandle">默认按钮</el-button> -->
  </div>
</template>

<script lang="ts">
// vue
import { defineComponent } from "vue";
// 接口
import { phoneLoginInterface } from "@/interface/public/login";
// 登录请求
import { phoneLogin } from "@/api/login/index";
import { ElMessage } from "element-plus";

export default defineComponent({
  name: "Login",
  data() {
    return {
      msg: "Login",
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
    loginHandle() {
      const loginInfo: phoneLoginInterface = {
        phone: "13580404547",
        password: "171717ong",
      };

      phoneLogin(loginInfo)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    /**
     * 提交表单事件
     */
    submitForm() {
      (this.$refs.loginForm as any).validate((valid: any) => {
        // 校验成功
        if (valid) {
          // 登录请求
          phoneLogin(this.loginFormData)
            .then((res) => {
              if ((res as any).data.code === 400) {
                ElMessage.warning({
                  message: "手机号码或者密码错误！",
                  type: "warning",
                });
              } else if ((res as any).data.code === 200) {
                ElMessage.success({
                  message: "登录成功！",
                  type: "success",
                });
              }
            })
            .catch((err) => {
              ElMessage.error({
                message: "服务器出现错误！",
                type: "error",
              });
            });
        } else {
          console.log("error submit!!");
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

<style scoped>
</style>
