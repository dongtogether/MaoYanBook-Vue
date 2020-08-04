<template>
  <div>
    <el-dialog
      title="修改用户信息"
      :visible.sync="dialogFormVisible">
      <el-form v-model="selectedUser" style="text-align: left;width: 90%;" ref="dataForm">
        <el-form-item label="用户名:" :label-width="formLabelWidth" prop="username">
          <el-input v-model="selectedUser.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名:" :label-width="formLabelWidth" prop="name">
          <el-input v-model="selectedUser.realname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="年龄:" :label-width="formLabelWidth" prop="age">
          <el-input v-model="selectedUser.age" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号:" :label-width="formLabelWidth" prop="phone">
          <el-input v-model="selectedUser.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱:" :label-width="formLabelWidth" prop="email">
          <el-input v-model="selectedUser.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码:" :label-width="formLabelWidth" prop="password">
          <el-input style="width:60%" :type="pwdType" v-model="selectedUser.password" autocomplete="off">
            <i slot="suffix" class="el-icon-view" @click="showPwd"></i></el-input>
          <el-button type="warning" @click="resetPassword(selectedUser.username)">重置密码</el-button>
        </el-form-item>
        <el-form-item label="用户头像:" :label-width="formLabelWidth" prop="cover">
          <el-input v-model="selectedUser.cover" autocomplete="off" placeholder="图片 URL"></el-input>
          <img-upload @onUpload="uploadImg" ref="imgUpload"></img-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit(selectedUser)">确 定</el-button>
      </div>
    </el-dialog>

    <!--模块一 -->
    <div>
    <el-row style="margin: 18px 0px 0px 18px ">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>个人中心</el-breadcrumb-item>
        <el-breadcrumb-item>基本资料</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-card style="margin: 18px 2%;width: 95%">
     <el-divider></el-divider>
      <div class="personal-data">
        <el-row >
          <el-col :span="18" >
            <el-row >
              <el-col :span="8">
                <span>用&nbsp;户&nbsp;名:</span>&emsp;{{selectedUser.username}}
              </el-col>
              <el-col :span="8" :offset="2">
                <span>真实姓名:</span> &emsp;{{selectedUser.realname}}
              </el-col>
            </el-row>
            <br>
            <el-row >
             <el-col :span="8">
               <span>年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;龄:</span>&emsp;{{selectedUser.age}}
             </el-col>
              <el-col :span="8" :offset="2">
                <span>手&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;机:</span>&emsp;{{selectedUser.phone}}
              </el-col>
            </el-row>
            <br>
            <el-row >
              <el-col :span="8">
                <span>邮&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;箱:</span>&emsp;{{selectedUser.email}}
              </el-col>
              <el-col :span="8" :offset="2">
                <span>注册时间:</span>&emsp;{{selectedUser.registerDate}}
              </el-col>
            </el-row>

          </el-col>
          <el-col :span="6" >
            <el-card style="margin:-20px 0 0 0;width:150px;height: 170px"
                     bodyStyle="padding:10px" shadow="hover">
              <div >
                <el-image
                  style="width:130px;height: 130px"
                  :src="selectedUser.cover"></el-image>
              </div>
              <div style="text-align: center">
                <span>用户头像</span>
              </div>
            </el-card>

          </el-col>

        </el-row>
        <el-button round plain type="info" @click="editUser">信息修改</el-button>
      </div>

    </el-card>

    </div>

    <!--模块二 -->
    <div>
      <el-row style="margin: 18px 0px 0px 18px ">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>个人中心</el-breadcrumb-item>
          <el-breadcrumb-item>文章管理</el-breadcrumb-item>
        </el-breadcrumb>
      </el-row>
      <el-link href="/jotter/editor" :underline="false"  class="add-link">
        <el-button type="success">写文章</el-button>
      </el-link>
      <el-card style="margin: 18px 2%;width: 95%">
        <el-table
          :data="articles"
          stripe
          style="width: 100%"
          :max-height="tableHeight">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline>
                <el-form-item>
                  <span>{{ props.row.articleAbstract }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            prop="articleTitle"
            label="题目（展开查看摘要）"
            fit>
          </el-table-column>
          <el-table-column
            prop="articleDate"
            label="发布日期"
            width="200">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="180">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="viewArticle(scope.row.articleId)"
                type="text"
                size="small">
                查看
              </el-button>
              <el-button
                @click.native.prevent="editArticle(scope.row)"
                type="text"
                size="small">
                编辑
              </el-button>
              <el-button
                @click.native.prevent="deleteArticle(scope.row.articleId)"
                type="text"
                size="small">
                移除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin: 20px 0 50px 0">
          <el-pagination
            background
            style="float:right;"
            layout="total, prev, pager, next, jumper"
            @current-change="handleCurrentChangeArticle"
            :page-size="pageSize"
            :total="articleTotal">
          </el-pagination>
        </div>
      </el-card>
    </div>

    <!--模块三 -->
    <div>
      <el-row style="margin: 18px 0px 0px 18px ">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>个人中心</el-breadcrumb-item>
          <el-breadcrumb-item>图书管理</el-breadcrumb-item>
        </el-breadcrumb>
      </el-row>
      <el-card style="margin: 18px 2%;width: 95%">
        <el-table
          :data="collectBooks"

          style="width: 100%"
          :max-height="tableHeight"
          :row-class-name="tableRowClassName">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline>
                <el-form-item>
                  <span>{{ props.row.abs }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            prop="title"
            label="书名（展开查看摘要）"
            fit>
          </el-table-column>
          <el-table-column
            prop="category.name"
            label="分类"
            width="100">
          </el-table-column>
          <el-table-column
            prop="author"
            label="作者"
            fit>
          </el-table-column>
          <el-table-column
            prop="date"
            label="出版日期"
            width="120">
          </el-table-column>
          <el-table-column
            prop="press"
            label="出版社"
            fit>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="120">
            <template slot-scope="scope">
              <!--系统用户显示 -->
              <div v-show="isAdmin">
                <div v-show = "(booksForAdmin.indexOf(scope.row.bookId ) < 0)">
                  <el-button
                    @click.native.prevent="addCollectBook(scope.row.bookId)"
                    type="text"
                    size="mini">
                    收藏
                  </el-button>
                </div>
                <div v-show = "(booksForAdmin.indexOf(scope.row.bookId ) >= 0)">
                  <el-button
                    @click.native.prevent="deleteCollectBook(scope.row.bookId)"
                    type="text"
                    size="mini">
                    取消收藏
                  </el-button>
                </div>

              </div>
              <!--一般用户显示 -->
              <div v-show="!isAdmin">
                <el-button
                  @click.native.prevent="buyBook(scope.row)"
                  type="text"
                  size="small">
                  购买
                </el-button>
                <el-button
                  @click.native.prevent="deleteCollectBook(scope.row.bookId)"
                  type="text"
                  size="small">
                  取消收藏
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin: 20px 0 50px 0">
          <el-pagination
            background
            style="float:right;"
            layout="total, prev, pager, next, jumper"
            @current-change="handleCurrentChangeBook"
            :page-size="pageSize"
            :total="collectBooksTotal">
          </el-pagination>
        </div>
      </el-card>
    </div>

  </div>
</template>

<script>
    import ImgUpload from '../library/ImgUpload'
    export default {
        name: 'UserProfile',
        components:{ImgUpload},
        data () {
            return {
                formLabelWidth:'120px',
                dialogFormVisible: false,
                dialogForBook: false,
                pwdType: '',
                selectedUser: '',
                articles: [],
                collectBooks:[],
                booksForAdmin:[],
                pageSize: 5,
                articleTotal: 0,
                collectBooksTotal:0,
                isAdmin:this.$store.state.isAdmin,

            }
        },
        mounted () {
            this.listUsers()
            this.loadArticles()
            this.loadCollectBooks()
        },
        computed: {
            tableHeight () {
                return window.innerHeight - 320
            }
        },
        methods: {
            /*初始加载用户列表*/
            listUsers () {
                var _this = this
                this.$axios.get('/user/userInfo/'+ this.$store.state.user.userId).then(resp => {
                    if (resp && resp.status === 200) {
                        _this.selectedUser = resp.data.data
                    }
                })
            },

            /*编辑按钮*/
            editUser () {
                this.dialogFormVisible = true
            },

            /*用户信息编辑对话框*/
            onSubmit (user) {
                this.$axios.post('/user/editUserInfo', {
                    userId:user.userId,
                    username: user.username,
                    password:user.password,
                    realname: user.realname,
                    age:user.age,
                    phone: user.phone,
                    email: user.email,
                    cover:user.cover,
                }).then(resp => {
                    if (resp && resp.status === 200) {
                        this.$alert('用户信息修改成功')
                        this.dialogFormVisible = false
                    }
                })
            },

            /*上传图片*/
            uploadImg () {
                this.selectedUser.cover = this.$refs.imgUpload.url
            },

            /*对话框中重置密码按钮*/
            resetPassword (username) {
                this.$axios.post('/user/reset-password', {
                    username: username
                }).then(resp => {
                    if (resp && resp.status === 200) {
                        this.selectedUser.password="123456"
                        this.$alert('密码已重置为 123456')
                    }
                })
            },

            /*密码显隐表示*/
            showPwd() {
                this.pwdType === 'password' ? this.pwdType = '' : this.pwdType = 'password';
                let e = document.getElementsByClassName('el-icon-view')[0];
                this.pwdType == '' ? e.setAttribute('style', 'color: #409EFF') : e.setAttribute('style', 'color: #c0c4cc');
            },

            //////////////////////////////////////////////////////////////////////////
            /*初始加载文章*/
            loadArticles () {
                var _this = this

                this.$axios.get('/jotter/article/'+ this.$store.state.user.userId +'/'+ this.pageSize + '/1').then(resp => {
                    if (resp && resp.status === 200) {
                        _this.articles = resp.data.data.content
                        _this.articleTotal = resp.data.data.totalSize
                    }
                })
            },
            handleCurrentChangeArticle (page) {
                var _this = this
                this.$axios.get('/jotter/article/' + this.$store.state.user.userId +'/'+ this.pageSize + '/' + page).then(resp => {
                    if (resp && resp.status === 200) {
                        _this.articles = resp.data.data.content
                        _this.articleTotal = resp.data.data.totalSize
                    }
                })
            },

            /*查看文章，新窗口*/
            viewArticle (articleId) {
                let articleUrl = this.$router.resolve(
                    {
                        path: '../../jotter/article',
                        query: {
                            articleId: articleId
                        }
                    }
                )
                window.open(articleUrl.href, '_blank')
            },
            /*编辑文章*/
            editArticle (article) {
                this.$router.push(
                    {
                        name: 'Editor',
                        params: {
                            article: article
                        }
                    }
                )
            },
            /*删除文章*/
            deleteArticle (articleId) {
                this.$confirm('此操作将永久删除该文章, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                        this.$axios
                            .delete('/jotter/article/' + articleId).then(resp => {
                            if (resp && resp.status === 200) {
                                this.loadArticles()
                            }
                        })
                    }
                ).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },

            ///////////////////////////////////////////////////////////////////////////
            /*初始table显示收藏图书*/
            loadCollectBooks () {
                var _this = this
                if(this.isAdmin){
                    //系统用户--返回所有书籍
                    this.$axios.get('/booksByPage/'+ this.pageSize + '/1').then(resp => {
                        if (resp && resp.status === 200) {
                            _this.collectBooks = resp.data.data.content
                            _this.collectBooksTotal = resp.data.data.totalSize
                        }
                    })
                    this.$axios.get('/books/collectBook/'+ this.$store.state.user.userId ).then(resp => {
                        if (resp && resp.status === 200) {
                            _this.booksForAdmin = resp.data.data
                        }
                    })
                } //一般用户--返回收藏书籍
                else{
                    this.$axios.get('/books/collectBook/'+ this.$store.state.user.userId +'/'+ this.pageSize + '/1').then(resp => {
                        if (resp && resp.status === 200) {
                            _this.collectBooks = resp.data.data.content
                            _this.collectBooksTotal = resp.data.data.totalSize
                        }
                    })
                }


            },
            /*图书换页*/
            handleCurrentChangeBook (page) {
                var _this = this
                //系统用户--返回所有书籍
                if(this.isAdmin){
                    this.$axios.get('/booksByPage/'+ this.pageSize + '/'+page).then(resp => {
                        if (resp && resp.status === 200) {
                            _this.collectBooks = resp.data.data.content
                            _this.collectBooksTotal = resp.data.data.totalSize
                        }
                    })
                }//一般用户--返回收藏书籍
                else{
                    this.$axios.get('/books/collectBook/' + this.$store.state.user.userId +'/'+ this.pageSize + '/' + page).then(resp => {
                        if (resp && resp.status === 200) {
                            _this.collectBooks = resp.data.data.content
                            _this.collectBooksTotal = resp.data.data.totalSize
                        }
                    })
                }

            },

            /*table行带状态表格*/
            tableRowClassName({row,rowIndex}) {
                //admin 收藏的书显示红色
                if (this.booksForAdmin.indexOf(this.collectBooks[rowIndex].bookId ) >= 0) {
                    return 'success-row';
                } else  {
                    return '';
                }
            },

            /*收藏书籍*/
            addCollectBook(bookId){
                this.$axios.post('/book/addCollectBook',
                    {
                        userId:this.$store.state.user.userId,
                        bookId:bookId
                    })
                    .then(resp => {
                        if (resp && resp.status === 200) {
                            this.loadCollectBooks()
                            this.$message({
                                type: 'info',
                                offset:'250',
                                message: '收藏成功'
                            })
                        }
                    })
            },

            /*删除收藏书籍*/
            deleteCollectBook(bookId){
                this.$axios.post('/book/deleteCollectBook',
                    {
                        userId: this.$store.state.user.userId,
                        bookId: bookId
                    })
                    .then(resp => {
                        if (resp && resp.status === 200) {
                            this.loadCollectBooks()
                            this.$message({
                                type: 'info',
                                offset: '250',
                                message: '已取消收藏'
                            })

                        }
                    })
            }
        },


    }
</script>

<style scoped>
  .personal-data{
    /*float: left;*/
    margin:10px 50px 10px 50px ;
    font-size: 18px;
  }

  .el-col {
    text-align: left;
    border-radius: 4px;
  }
  .add-link {
    margin: -25px 50px 0px 10px;
    float: right;
  }

</style>
<style>

  .el-table .success-row {
    background: oldlace;
  }
</style>
