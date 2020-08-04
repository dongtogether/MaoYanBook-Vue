<template>
  <div class="articles-area">
    <el-card style="text-align: left;width: 990px;margin: 35px auto 0 auto">
      <div>
        <span style="font-size: 20px"><strong>{{article.articleTitle}}</strong></span>
        <el-button style="float: right;" @click="$router.back(-1)">返回</el-button>
        <el-divider content-position="left">{{article.articleDate}}</el-divider>
        <div class="markdown-body">
          <div v-html="article.articleContentHtml"></div>
        </div>
        <div style="float: right; margin-right: 20px;margin-bottom: 10px;">
          <el-badge :value="12" >
            <el-button icon="el-icon-star-off" round size="small" @click="">点赞</el-button>
          </el-badge>
        </div>
        <div style="float: right;margin-right: 10px;margin-bottom: 10px;">
          <el-badge :value="3"  type="primary">
          <el-button icon="el-icon-edit" round size="small" @click="">评论 </el-button>
          </el-badge>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
    export default {
        name: 'ArticleDetails',
        data () {
            return {
                article: []
            }
        },
        mounted () {
            this.loadArticle()
        },
        methods: {
            loadArticle () {
                var _this = this
                this.$axios.get('/jotter/article/' + this.$route.query.articleId).then(resp => {
                    if (resp && resp.status === 200) {
                        console.log(resp)
                        _this.article = resp.data.data
                    }
                })
            }
        }
    }
</script>

<style scoped>
  @import "../../styles/markdown.css";
</style>

