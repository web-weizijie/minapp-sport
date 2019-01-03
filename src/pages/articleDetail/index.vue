<template>
    <view>
        <FixedTitle :isShare="isShare" :back="true" :title="themeTitle"></FixedTitle>
        <view class="load-cont" :class="{show:article!=null}">
            <ArticlePage :article="article" v-if="article != null"></ArticlePage>
        </view>
        <VLoading :state="!load"></VLoading>
    </view>
</template>
<script>
import http from "../../utils/http";
import store from "../../store/index";
import { formatTime, firstRegistier } from "../../utils/index";
import ArticlePage from "../../components/Article/Article";
import FixedTitle from "../../components/FixedTitle/FixedTitle";
import VLoading from "../../components/Loading/Loading";
export default {
    data() {
        return {
            themeTitle: "文章详情",
            id: null,
            article: null,
            load: false,
            isShare: 0
        };
    },
    onLoad(ops) {
        this.id = ops.id;
        this.isShare = ops.isShare || 0;

        let saleId = ops.saleId || null;
        firstRegistier(saleId);
    },
    onUnload() {
        this.id = null;
        this.article = null;
        this.load = false;
        this.isShare = 0;
    },
    mounted() {
        this.getArticleDetail();
    },
    onShareAppMessage() {
        let path = `/pages/articleDetail/main?id=${this.id}&saleId=${
            this.saleId
        }&isShare=1`;
        return {
            title: this.article.title,
            path
        };
    },
    methods: {
        readArticle() {
            http.post("article/addReadCount", { id: this.id }).then(res => {});
        },
        getArticleDetail() {
            http.post("article/getArticleInfo", { id: this.id }).then(res => {
                if (res.status == 200) {
                    this.article = this.initArticle(res.data);
                    this.readArticle();
                }
                this.load = true;
            });
        },
        initArticle(data) {
            return {
                ...data,
                createTime: data.createTime,
                content: this.initCont(data.content)
            };
        },
        initCont(content) {
            let top = `<div style="font-size:16px; line-height:28px; color:#332b00;">`;
            let bot = `</div>`;
            let cont = content
                .replace(/(<p|<div|<a).*?>/g, item => {
                    return "<div>";
                })
                .replace(/(<\/p|<\/div|<\/a).*?>/g, item => {
                    return "</div>";
                })
                .replace(/(width="|height=").+?"/g, () => {
                    return "width='100%'";
                })
                .replace(/<img/g, item => {
                    return "<img style='display:block; margin:25px 0px;'";
                });
            return top + cont + bot;
        }
    },
    computed: {
        saleId() {
            return store.getters.getSaleId;
        }
    },
    components: {
        ArticlePage,
        FixedTitle,
        VLoading
    }
};
</script>

<style scoped>
</style>
