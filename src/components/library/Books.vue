<template>
  <div>
    <el-row style="height: 840px;">
      <search-bar @onSearch="searchResult" ref="searchBar"></search-bar>
      <el-tooltip effect="dark" placement="right"
                  v-for="item in books.slice((currentPage-1)*pageSize,currentPage*pageSize)"
                  :key="item.bookId">
        <p slot="content" style="font-size: 14px;margin-bottom: 6px;">{{item.title}}</p>
        <p slot="content" style="font-size: 13px;margin-bottom: 6px">
          <span>{{item.author}}</span> /
          <span>{{item.date}}</span> /
          <span>{{item.press}}</span>
        </p>
        <p slot="content" style="width: 300px" class="abstract">{{item.abs}}</p>
        <el-card style="width: 135px;margin-bottom: 20px;height: 233px;float: left;margin-right: 15px"
                 class="book"
                 bodyStyle="padding:10px" shadow="hover">
          <div class="cover" @click="editBook(item)" >
            <img :src="item.cover" alt="封面">
          </div>

          <div class="info">
            <div class="title">
              <a href="">{{item.title}}</a>
            </div>
            <!--根据是否管理者用户，显示不同内容 -->
            <i class="el-icon-delete" @click="deleteBook(item.bookId)" v-show="isAdmin"></i>
            <img ref="collectImg" class="el-icon-collect" v-show="!isAdmin"
                 :src="(collectBooks.indexOf(item.bookId) < 0 ) ? require('../../assets/img/icon/collect1.png') : require('../../assets/img/icon/collect2.png')"
                 style="height:16px; width:16px;"
                 @click="collectBook(item.bookId)"/>

          </div>
          <div class="author">{{item.author}}</div>
        </el-card>
      </el-tooltip>
        <edit-form @onSubmit="loadBooks()" ref="edit" ></edit-form>
    </el-row>
    <el-row>
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total">
      </el-pagination>
    </el-row>

  </div>
</template>

<script>
    import EditForm from './EditForm'
    import SearchBar from './SearchBar'
    export default {
        name: 'Books',
        components: {EditForm, SearchBar},
        data () {
            return {
                books: [],
                currentPage: 1,
                pageSize: 17,
                total: 0,
                collectBooks:[],
                isAdmin:this.$store.state.isAdmin,
            }
        },
        mounted () {
            this.pageSize = this.isAdmin ? 17 : 18 //根据用户定义每页显示多少项
            this.loadBooks()
        },
        methods: {

            loadBooks() {
                var _this = this
                //返回所有书籍
                this.$axios.get('/booksByPage/'+ this.pageSize + '/1').then(resp => {
                    if (resp && resp.status === 200) {
                        _this.books = resp.data.data.content
                        _this.total = resp.data.data.totalSize
                    }
                })
                //返回收藏的书单
                this.$axios.get('/books/collectBook/'+ this.$store.state.user.userId).then(res => {
                    if (res && res.status === 200) {
                         _this.collectBooks = res.data.data
                    }
                })
            },

            handleCurrentChange (page) {
                var _this = this
                this.$axios.get('/booksByPage/'+  this.pageSize + '/' + page).then(resp => {
                    if (resp && resp.status === 200) {
                        _this.books = resp.data.data.content
                        _this.total = resp.data.data.totalSize
                    }
                })
            },

            searchResult () {
                var _this = this
                this.$axios
                    .post('/search', {
                        keywords: this.$refs.searchBar.keywords
                    }).then(resp => {
                    if (resp && resp.status === 200) {
                        _this.books = resp.data.data
                    }
                })
            },

            /*加入收藏*/
            collectBook (bookId) {
                //之前未收藏的，变为收藏
                if(this.collectBooks.indexOf(bookId) < 0){
                    // collectBooks.push(bookId)
                    this.$axios.post('/book/addCollectBook',
                        {
                            userId:this.$store.state.user.userId,
                            bookId:bookId
                        })
                        .then(resp => {
                            if (resp && resp.status === 200) {
                                this.loadBooks()
                                this.$message({
                                    type: 'success',
                                    offset:'250',
                                    message: '收藏成功'
                                })
                            }
                        })

                } else{//之前收藏的，变取消
                    this.$axios.post('/book/deleteCollectBook',
                        {
                            userId:this.$store.state.user.userId,
                            bookId:bookId
                        })
                        .then(resp => {
                            if (resp && resp.status === 200) {
                                this.loadBooks()
                                this.$message({
                                    type: 'success',
                                    offset:'250',
                                    message: '已取消收藏'
                                })
                            }
                        })
                }

            },

            /*删除图书*/
            deleteBook (bookId) {
                this.$confirm('此操作将永久删除该书籍, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                        this.$axios
                            .post('/delete', {bookId: bookId}).then(resp => {
                            if (resp && resp.status === 200) {
                                this.loadBooks()
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
            /*修改图书信息*/
            editBook (item) {

                this.$refs.edit.dialogFormVisible = true
                this.$refs.edit.bookForm = {
                    bookId: item.bookId,
                    cover: item.cover,
                    title: item.title,
                    author: item.author,
                    date: item.date,
                    press: item.press,
                    abs: item.abs,
                    cid:item.cid.toString(),
                    category: {
                        id: item.category.id.toString(),
                        name: item.category.name
                    }
                }
            },

        }
    }
</script>

<style scoped>
  .cover {
    width: 115px;
    height: 172px;
    margin-bottom: 7px;
    overflow: hidden;
    cursor: pointer;
  }

  img {
    width: 115px;
    height: 172px;
    /*margin: 0 auto;*/
  }

  .title {
    font-size: 14px;
    text-align: left;
  }

  .author {
    color: #333;
    width: 102px;
    font-size: 13px;
    margin-bottom: 6px;
    text-align: left;
  }

  .abstract {
    display: block;
    line-height: 17px;
  }
  .el-icon-delete {
    cursor: pointer;
    float: right;
  }
  .el-icon-collect {
    cursor: pointer;
    float: right;
  }

  .switch {
    display: flex;
    position: absolute;
    left: 780px;
    top: 25px;
  }

  a {
    text-decoration: none;
  }

  a:link, a:visited, a:focus {
    color: #3377aa;
  }
</style>

