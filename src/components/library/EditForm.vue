<template>
  <div>
    <i class="el-icon-circle-plus-outline"  @click="dialogFormVisible = true" v-show="isAdmin"></i>
    <el-dialog
      :title=" (isAdmin ?'添加/修改图书' : '图书详情')"
      :visible.sync="dialogFormVisible"
      @close="clear">
      <!--系统用户 显示如下表单 -->
      <el-form :model="bookForm" style="text-align: left" ref="bookForm" :rules="rules" v-show="isAdmin" >
        <el-form-item label="书名:" :label-width="formLabelWidth" style="width: 90%" prop="title" >
          <el-input v-model="bookForm.title" autocomplete="off" placeholder="不加《》" ></el-input>
        </el-form-item>
        <el-form-item label="作者:" :label-width="formLabelWidth" style="width: 90%" prop="author">
          <el-input v-model="bookForm.author" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="出版日期:" :label-width="formLabelWidth" style="width: 90%" prop="date">
          <el-input v-model="bookForm.date" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="出版社:" :label-width="formLabelWidth" style="width: 90%" prop="press">
          <el-input v-model="bookForm.press" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="封面:" :label-width="formLabelWidth" style="width: 90%" prop="cover" >
          <el-input v-model="bookForm.cover" autocomplete="off" placeholder="图片 URL"></el-input>
          <img-upload @onUpload="uploadImg" ref="imgUpload"></img-upload>
        </el-form-item>
        <el-form-item label="简介:" :label-width="formLabelWidth" style="width: 90%" prop="abs">
          <el-input type="textarea" v-model="bookForm.abs" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类:" :label-width="formLabelWidth" prop="cid">
          <el-select v-model="bookForm.cid" placeholder="请选择分类">
            <el-option label="文学" value="1"></el-option>
            <el-option label="流行" value="2"></el-option>
            <el-option label="文化" value="3"></el-option>
            <el-option label="生活" value="4"></el-option>
            <el-option label="经管" value="5"></el-option>
            <el-option label="科技" value="6"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="bookId" style="height: 0">
          <el-input type="hidden" v-model="bookForm.bookId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item style="text-align: center;" >
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="onSubmit('bookForm')">确 定</el-button>
        </el-form-item>
      </el-form>

      <!--非系统用户 显示以下 -->
      <el-form v-show="!isAdmin">
        <el-form-item label="书名:" :label-width="formLabelWidth" style="width: 90%" prop="title" >
          <span class="bookDetails" >{{bookForm.title}}</span>
        </el-form-item>
        <el-form-item label="作者:" :label-width="formLabelWidth" style="width: 90%" prop="title" >
          <span class="bookDetails">{{bookForm.author}}</span>
        </el-form-item>
        <el-form-item label="出版日期:" :label-width="formLabelWidth" style="width: 90%" prop="title" >
          <span class="bookDetails">{{bookForm.date}}</span>
        </el-form-item>
        <el-form-item label="出版社:" :label-width="formLabelWidth" style="width: 90%" prop="title" >
          <span class="bookDetails">{{bookForm.press}}</span>
        </el-form-item>
        <el-form-item label="图书分类:" :label-width="formLabelWidth" style="width: 90%" prop="title" >
          <span class="bookDetails">{{bookForm.category.name}}</span>
        </el-form-item>
        <el-form-item label="简介:" :label-width="formLabelWidth" style="width: 90%" prop="title" >
          <span class="bookDetails">{{bookForm.abs}}</span>
        </el-form-item>
      </el-form>

    </el-dialog>
  </div>
</template>

<script>
    import ImgUpload from './ImgUpload'
    export default {
        name: 'EditForm',
        components:{ImgUpload},
        data () {
            return {
                dialogFormVisible: false,
                isAdmin:this.$store.state.isAdmin,
                bookForm: {
                    bookId: '',
                    title: '',
                    author: '',
                    date: '',
                    press: '',
                    cover: '',
                    abs: '',
                    cid:'',
                    category: {
                        id: '',
                        name: ''
                    }
                },

                formLabelWidth: '120px',
                rules: {
                    title: [
                        {required: true, message: '请输入书名', trigger: 'blur'}
                    ],
                    cid: [
                        {required: true, message: '请选择分类', trigger: 'change'}
                    ],
                }
            }
        },

        methods: {
            clear () {
                this.bookForm = {
                    bookId: '',
                    title: '',
                    author: '',
                    date: '',
                    press: '',
                    cover: '',
                    abs: '',
                    cid:'',
                    category: ''
                }
            },

            /*上传图片*/
            uploadImg () {
                this.bookForm.cover = this.$refs.imgUpload.url
            },

            /*提交表单*/
            onSubmit (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios
                            .post('/books', {
                                bookId: this.bookForm.bookId,
                                cover: this.bookForm.cover,
                                title: this.bookForm.title,
                                author: this.bookForm.author,
                                date: this.bookForm.date,
                                press: this.bookForm.press,
                                abs: this.bookForm.abs,
                                cid: this.bookForm.cid,
                                // category: this.form.category
                            }).then(resp => {
                            if (resp && resp.status === 200) {
                                this.dialogFormVisible = false
                                this.$emit('onSubmit')
                                this.$message({
                                    type: 'info',
                                    message: '图书操作成功！'
                                })
                            }
                        })

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                })
            }
        }
    }
</script>

<style scoped>
  .el-icon-circle-plus-outline {
    margin: 50px 0 0 20px;
    font-size: 100px;
    float: left;
    cursor: pointer;
  }
  .bookDetails{
    float: left;
    text-align: left;
    font-size: 16px;
  }
</style>


