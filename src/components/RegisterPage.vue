<template>
  <body id="paper">

  <el-form class="register-container" label-position="left"
           label-width="0px" v-loading="loading"
           ref="registerForm" :model="registerForm"  :rules="rules">
    <h3 class="register_title">用户注册</h3>
    <el-divider></el-divider>
    <el-form-item label="用户名:" label-width="90px" prop="username">
      <el-input type="text" v-model="registerForm.username" clearable
                auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item label="密码:" label-width="90px" prop="password">
      <el-input type="password" v-model="registerForm.password" clearable
                auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-form-item label="确认密码:" label-width="90px" prop="checkPass">
      <el-input type="password" v-model="registerForm.checkPass" clearable
                auto-complete="off" placeholder="确认密码"></el-input>
    </el-form-item>
    <el-form-item style="width: 100%">
      <el-button type="primary" style="width: 40%;background: #505458;border: none"
                 v-on:click="register('registerForm')">注册
      </el-button>
      <el-button type="primary" style="width: 40%;background: #1ec2ff;border: none"
                 v-on:click="resetForm('registerForm')">重置
      </el-button>

    </el-form-item>
    <div style="margin-bottom: 40px">
      <span class="right-option" @click="$router.replace('/login')">已有账号？
      <strong style="color: red">请登录>></strong>
      </span>
    </div>

    </el-form>
  </body>
</template>
<script>
    export default {
        data() {
            /*自定义校验规则*/
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.registerForm.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                registerForm: {
                    username: '',
                    password: '',
                    checkPass:'',
                },
                loading: false,
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ],
                    checkPass: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        { validator: validatePass, trigger: 'blur' }
                    ],
                },

            }
        },
        methods: {
            register(formName) {
                var _this = this
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios
                            .post('/register', {
                                username: this.registerForm.username,
                                password: this.registerForm.password
                            })
                            .then(resp => {
                                if (resp.data.code === 200) {
                                    this.$alert('注册成功', '提示', {
                                        confirmButtonText: '确定'
                                    })
                                    _this.$router.replace('/login')
                                } else {
                                    this.$alert(resp.data.message, '提示', {
                                        confirmButtonText: '确定'
                                    })
                                }
                            })
                            .catch(failResponse => {
                                console.log(failResponse);
                            })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                })
            },

            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        }

    }
</script>
<style>
  #paper {
    background: url("../assets/img/bg/eva1.jpg") no-repeat;
    background-position: center;
    height: 100%;
    width: 100%;
    background-size: cover;
    position: fixed;
  }

  /*body{*/
  /*  margin: -5px 0px;*/
  /*}*/
  .register-container {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 120px auto;
    width: 350px;
    padding: 15px 30px 15px 30px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }

  .register_title {
    margin: 0px auto 0px auto;
    text-align: center;
    color: #505458;
  }

  .right-option {
    float: right;
    cursor: pointer;
    font-size: 0.8rem;
  }
</style>

