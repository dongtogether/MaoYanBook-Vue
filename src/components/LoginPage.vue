<template>
  <div id="login-page">

    <div class="loginContext">
      <el-card class="elcard-class" style="height: 380px">
        <div slot="header" class="login-title">
          <span id="text1" style="color: red"><a @click="accountLoginType">账号登录&nbsp;&nbsp;</a></span>
          <el-divider direction="vertical"></el-divider>
          <span id="text2"><a @click="codeLoginType">&nbsp;&nbsp;扫码登录</a></span>
        </div>
        <div  v-show="accountIsShow">
          <el-form ref="loginform" :model="user"  >
            <el-form-item label="用户名:" label-width="80px" prop="username">
              <el-input v-model="user.username" placeholder="请输入用户名"
                        style="width: 250px"
                        prefix-icon="el-icon-user" clearable></el-input>
            </el-form-item>
            <el-form-item label="密码:" label-width="80px" prop="password">
              <label slot="label">密&nbsp;&nbsp;&nbsp;&nbsp;码:</label>
              <el-input :type="pwdType" v-model="user.password" placeholder="请输入密码"
                        clearable
                        style="width: 250px"
                        prefix-icon="el-icon-lock"
                        @keydown.enter.native="doLogin('loginform')">
                <!-- @keydown.enter.native="doLogin"当按下enter键的时候也会执行doLogin方法-->
                <i slot="suffix" class="el-icon-view" @click="showPwd"></i></el-input>
            </el-form-item>
            <div class="option-box">
              <div class="left-option">
                <el-checkbox v-model="checked">一周内自动登录</el-checkbox>
              </div>
              <span class="right-option" @click="clearCookie">忘记密码？</span>
            </div>
            <el-form-item>
              <el-button style="width: 80%;background: #505458;border: none"
                         type="primary" @click="doLogin('loginform')">登录</el-button>
              <router-link to="register">
                <el-button style="width: 80%;margin-top: 10px">注册</el-button>
              </router-link>
            </el-form-item>
          </el-form>
        </div>

        <div v-show="codeIsShow">
          <vue-qr :logoSrc="codeImageUrl" :text="codeValue" :size="200"  ></vue-qr>
        </div>
      </el-card>
    </div>

  </div>
</template>

<script>
    import vueQr from 'vue-qr'
    export default {
        name: 'HelloWorld',
        data() {
            return {

                msg: 'Welcome to Your Vue.js App',
                user: {
                    username: '',
                    password: '',
                },
                pwdType: 'password',
                checked: false,
                accountIsShow:true,
                codeIsShow:false,
                codeImageUrl: require("../assets/logo.png"),
                codeValue:"https://www.baidu.com",

            }
        },
        components: {
            vueQr
        },

        mounted() {
            this.getCookie();//页面加载调用获取cookie值
        },
        methods: {

            /*登录方式1,2*/
            accountLoginType(){
                this.accountIsShow = true;
                this.codeIsShow = false;
                document.getElementById("text1").style.color="red";
                document.getElementById("text2").style.color="black";
            },
            codeLoginType(){
                this.accountIsShow = false;
                this.codeIsShow = true;
                document.getElementById("text1").style.color="black";
                document.getElementById("text2").style.color="red";
            },

            /*点击登录按钮*/
            doLogin(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        const self = this;
                        this.$axios({
                            url: '/login',
                            method: 'post',
                            data: {
                                username: this.user.username,
                                password: this.user.password
                            }
                        }).then(res => {
                            if (res.data.code === 200) {

                                self.$store.commit('login', res.data.data.userId)
                                var path = self.$route.query.redirect
                                self.$router.replace({path: path === '/' || path === undefined ? '/homePage' : path})

                                //判断复选框是否被勾选 勾选则调用配置cookie方法
                                if (self.checked == true) {
                                    //传入账号名，密码，和保存天数3个参数
                                    self.setCookie(self.user.username, self.user.password, 7);
                                } else {
                                    //清空Cookie
                                    self.clearCookie();
                                }
                            } else if(res.data.code === 400){
                                this.$message({
                                    message: '账号或密码错误',
                                    type: 'error'
                                });
                            }


                        }).catch(err => {
                            console.log(err);
                        })

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                })

            },

            /*设置cookie*/
            setCookie(c_name, c_pwd, exdays) {
                var exdate = new Date(); //获取时间
                exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays); //保存的天数
                //字符串拼接cookie
                window.document.cookie = "userName" + "=" + c_name + ";path=/;expires=" + exdate.toGMTString();
                window.document.cookie = "passWord" + "=" + c_pwd + ";path=/;expires=" + exdate.toGMTString();
            },
            /*读取cookie*/
            getCookie() {
                if (document.cookie.length > 0) {
                    var arr = document.cookie.split('; '); //这里显示的格式需要切割一下自己可输出看下
                    for (var i = 0; i < arr.length; i++) {
                        var arr2 = arr[i].split('='); //再次切割
                        //判断查找相对应的值
                        if (arr2[0] == 'userName') {
                            //  console.log(arr2[1])
                            this.user.username = arr2[1]; //保存到保存数据的地方
                        } else if (arr2[0] == 'passWord') {
                            // console.log(arr2[1])
                            this.user.password = arr2[1];
                        }
                    }
                    this.checked = true;
                }
            },
            clearCookie() {
                this.setCookie("", "", -1); //修改2值都为空，天数为负1天就好了
            },

            /*密码显隐表示*/
            showPwd() {
                this.pwdType === 'password' ? this.pwdType = '' : this.pwdType = 'password';
                let e = document.getElementsByClassName('el-icon-view')[0];
                this.pwdType == '' ? e.setAttribute('style', 'color: #409EFF') : e.setAttribute('style', 'color: #c0c4cc');
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #login-page{
    background:url("../assets/img/bg/eva1.jpg") no-repeat;
    background-position: center;
    height: 100%;
    width: 100%;
    background-size: cover;
    position: fixed;
  }

  .loginContext {
    display: flex;
    justify-content: center;
    margin-top: 120px;
  }
.elcard-class{
  width: 400px;
  border-radius: 15px;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}
  .login-title{
    text-align: center;
    font-size: 22px;
    color: #505458;

  }
  .login-title a:hover{
    color: red;
    cursor:pointer;
  }

  .option-box {
    width: 360px;
    height: 30px;
    margin-bottom: 10px;
  }

  .left-option {
    margin-left: 20px;
    float: left;
  }

  .right-option {
    float: right;
    cursor: pointer;
    color: #f19149;
    font-size: 0.8rem;
  }

</style>

