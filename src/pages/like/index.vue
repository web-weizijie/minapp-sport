<template>
    <view class="like">
        <FixedTitle :back="true" :title="themeTitle"></FixedTitle>
        <view class="load-cont" :class="{show:firstLoad}">
            <block v-if="likeList.length > 0">
                <CircleList :list="likeList" @getCircleInfo="getCircleInfo" @userCircleLike="userCircleLike"></CircleList>
                <view class="load-more" v-if="loading || loaded">
                    <image src="/static/images/icon/loading.png" v-if="!loaded" mode="widthFix" />
                    <text v-else>已到底</text>
                </view>
            </block>
            <view class="empty-box" v-else>
                <Empty v-if="loaded" title="暂无数据" text="这片地方啥都没有..."></Empty>
            </view>
        </view>
        <VLoading :state="!firstLoad"></VLoading>
    </view>
</template>

<script>
import CircleList from "../../components/CircleList/CircleList";
import FixedTitle from "../../components/FixedTitle/FixedTitle";
import CircleDetail from "../../components/CircleDetail/CircleDetail";
import Empty from "../../base/Empty/Empty";
import VLoading from "../../components/Loading/Loading";
import store from "../../store/index";
import http from "../../utils/http.js";
import { showToast } from "../../utils/index.js";
import { formatTime } from "../../utils/index";
export default {
    data() {
        return {
            themeTitle: "点赞列表",
            likeList: [],
            page: 1,
            pageSize: 4,
            loaded: false,
            loading: false,
            likeState: false,
            firstLoad: false
        };
    },
    computed: {
        userInfo() {
            return store.getters.getUserInfo;
        }
    },
    components: {
        CircleList,
        FixedTitle,
        VLoading,
        Empty
    },
    mounted() {
        this.getLikeCircles();
    },
    onReachBottom() {
        this.getLikeCircles();
    },
    onUnload() {
        this.likeList = [];
        this.page = 1;
        this.pageSize = 4;
        this.loaded = false;
        this.loading = false;
        this.likeState = false;
        this.firstLoad = false
    },
    methods: {
        getCircleInfo(item) {
            wx.navigateTo({
                url: `/pages/circleDetail/main?id=${item.id}`
            });
        },
        userCircleLike(item) {
            if (this.likeState) {
                return;
            }

            let data = {
                userid: this.userInfo.userId,
                type: item.bZan ? 1 : 0,
                circleid: item.id
            };
            this.likeState = true;
            this.likeList.forEach(ele => {
                if (ele.id == item.id) {
                    ele.bZan = !ele.bZan;
                    ele.zanNum += item.bZan ? 1 : -1;
                }
            });
            item.bZan
                ? showToast("点赞成功", "none", 600)
                : showToast("取消点赞", "none", 600);
            http.get("/circle/controlCircleZan", data).then(res => {
                this.likeState = false;
            });
        },
        getLikeCircles() {
            if (this.loaded || this.loading) {
                return;
            }
            this.loading = true;
            http.get("circle/getLikeCirclesByUserId", {
                userId: this.userInfo.userId,
                page: this.page,
                pageSize: this.pageSize
            }).then(res => {
                if (res.status == 200 && res.data != null) {
                    res.data.rows.forEach(ele => {
                        ele.createTime = formatTime(new Date(ele.createTime));
                    });
                    this.loading = false;
                    this.likeList = this.likeList.concat(res.data.rows);
                    if (res.data.records <= this.likeList.length) {
                        this.loaded = true;
                    }
                    this.page++;
                    this.firstLoad = true;
                }
            });
        }
    }
};
</script>

<style scoped>
page {
    background: #f7f7f7;
}
.like {
    width: 750rpx;
    min-height: 100vh;
    box-sizing: border-box;
    padding-top: 150rpx;
    background: #f7f7f7;
}
.empty-box {
    width: 750rpx;
    position: fixed;
    top: 0;
    bottom: 0;
}
</style>
