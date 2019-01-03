<template>
    <view class="muscle">
        <FixedTitle :scrollTop="scrollTop" :title="thememTitle" :back="true"></FixedTitle>
        <view class="load-cont" :class="{show:firstLoad}">
            <view class="video-box">
                <VideoList :list="activityList" v-if="activityList.length > 0" @hundleVideo="navToArticleDetail"></VideoList>
            </view>
            <view class="load-more" v-show="loaded || loading">
                <view v-show="!loaded" mode="widthFix">
                    <image src="/static/images/icon/loading.png" mode="widthFix" />
                </view>
                <view v-show="loaded && activityList.length > 0">
                    <text>已到底</text>
                </view>
            </view>
            <view class="empty-box" v-if="activityList.length <= 0 && loaded">
                <Empty title="暂无数据" text="这地方啥都没有..."></Empty>
            </view>
        </view>
        <VLoading :state="!firstLoad"></VLoading>
        <!-- <view class="menu-list" @click="showSlide">
        <image class="menu-list-icon" src="/static/images/icon/2_13.jpg"/>
        </view>
        <RightSlide :state="state" @hideSlide="hideSlide"></RightSlide> -->
    </view>
</template>

<script>
import FixedTitle from "../../components/FixedTitle/FixedTitle";
import VideoList from "../../components/VideoList/VideoList";
import RightSlide from "../../components/RightSlide/RightSlide";
import VLoading from "../../components/Loading/Loading";
import Empty from "../../base/Empty/Empty";
import http from "../../utils/http";
export default {
    data() {
        return {
            thememTitle: "活动",
            scrollTop: 0,
            activityList: [],
            state: false,
            loaded: false,
            loading: false,
            page: 0,
            firstLoad: false
        };
    },
    onReachBottom() {
        this.getActivityList();
    },
    mounted() {
        this.getActivityList();
    },
    components: {
        VideoList,
        FixedTitle,
        RightSlide,
        Empty,
        VLoading
    },
    onUnload() {
        this.thememTitle = "活动";
        this.scrollTop = 0;
        this.activityList = [];
        this.state = false;
        this.loaded = false;
        this.loading = false;
        this.page = 0;
        this.firstLoad = false;
    },
    methods: {
        navToArticleDetail(item) {
            wx.navigateTo({
                url: `/pages/articleDetail/main?id=${item.id}`
            });
        },
        getActivityList() {
            if (this.loading || this.loaded) {
                return;
            }
            this.loading = true;
            http.post("eventGreat/list", { page: this.page, pageSize: 6 }).then(
                res => {
                    if (res.status == 200 && res.data.rows) {
                        let activityList = res.data.rows.map(item => {
                            return {
                                imgUrl: item.cover,
                                id: item.articleId,
                                title: item.title,
                                createTime: item.createTime
                            };
                        });
                        this.activityList = this.activityList.concat(
                            activityList
                        );
                        this.loading = false;
                        this.page++;
                        if (this.activityList.length >= res.data.records) {
                            this.loaded = true;
                        }
                    }
                    this.firstLoad = true;
                }
            );
        },
        showSlide() {
            this.state = true;
        },
        hideSlide() {
            this.state = false;
        }
    },
    onPageScroll(e) {
        this.scrollTop = e.scrollTop;
    },
    created() {}
};
</script>

<style scoped>
.empty-box {
    height: 100vh;
}
.menu-list {
    width: 80rpx;
    height: 80rpx;
    background: #ffffff;
    border-radius: 50%;
    position: fixed;
    bottom: 140rpx;
    right: 40rpx;
    box-shadow: 0 4rpx 20rpx #e2e2e2;
}
.menu-list-icon {
    width: 42rpx;
    height: 38rpx;
    display: block;
    margin: 24rpx auto 0 auto;
}
.menu-list-text {
    font-size: 28rpx;
    line-height: 28rpx;
}
.video-box {
    padding-top: 130rpx;
    width: 680rpx;
    margin: 0 auto;
}
</style>
