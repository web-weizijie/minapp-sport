<template>
    <view class="dicovery-box">
        <view :class="{filter:filterState}">
            <FixedTitle :scrollTop="scrollTop" :title="thememTitle"></FixedTitle>
            <view class="top-title">{{thememTitle}}</view>
            <view class="discovery">
                <view class="discovery-top flex-row">
                    <view class="discovery-hot item" @click="previewImg">
                        <view>
                            <text>健身课程</text>
                        </view>
                        <view class="text">
                            <text>最新健身清单</text>
                        </view>
                    </view>
                    <view class="discovery-collection item" @click="navToTasteClass">
                        <view>
                            <text>免费体验</text>
                        </view>
                        <view class="text">
                            <text>店内体验课</text>
                        </view>
                    </view>
                </view>
            </view>
            <view class="h2 discovery-title flex-row">
                <view class="left-icon"></view>
                <view>
                    <text>训练课程</text>
                </view>
            </view>
            <view class="video-box">
                <VideoList :list="videoList" v-if="videoList.length > 0" @hundleVideo="hundleVideo"></VideoList>
            </view>
            <view class="load-more" v-if="loadMore || loaded">
                <image src="/static/images/icon/loading.png" v-if="!loaded" mode="widthFix" />
                <text v-else>已到底</text>
            </view>
        </view>
    </view>
</template>

<script>
import VideoList from "../../components/VideoList/VideoList";
import FixedTitle from "../../components/FixedTitle/FixedTitle";
import WeChat from "../../components/WeChat/WeChat";
import http from "../../utils/http.js";
export default {
    data() {
        return {
            thememTitle: "原创",
            videoList: [],
            scrollTop: 0,
            page: 1,
            pageSize: 4,
            records: -1,
            loadMore: false,
            loaded: false,
            filterState: false,
            subjectImg: null
        };
    },
    onLoad() {
        this.getSubjectImg();
    },
    mounted() {
        this.getVideoList();
    },
    components: {
        VideoList,
        FixedTitle,
        WeChat
    },
    onReachBottom() {
        this.getVideoList();
    },
    onPullDownRefresh() {
        this.page = 1;
        this.loaded = false;
        this.videoList = [];
        this.getVideoList();
    },
    methods: {
        navToTasteClass() {
            wx.navigateTo({
                url: "/pages/tasteClass/main"
            });
        },
        previewImg() {
            if (this.subjectImg != null) {
                wx.previewImage({
                    current: this.subjectImg,
                    urls: [this.subjectImg]
                });
            }
        },
        getSubjectImg() {
            http.post("schedule/getSchedule").then(res => {
                if (res.data != null) {
                    this.subjectImg = res.data.url;
                }
            });
        },
        filterHide() {
            this.filterState = false;
        },
        filterShow() {
            this.filterState = true;
        },
        hundleVideo(item) {
            wx.navigateTo({
                url: "/pages/videoPlay/main?id=" + item.id
            });
        },
        getVideoList() {
            if (this.loaded) {
                return;
            }
            this.loadMore = true;
            http.post("courseOrigin/list", {
                page: this.page,
                pageSize: this.pageSize
            }).then(res => {
                this.records = res.data.records;
                this.loadMore = false;
                res.data.rows.forEach(item => {
                    this.videoList.push({
                        imgUrl: item.cover,
                        id: item.id,
                        info: item.courseInfo,
                        title: item.name
                    });
                });
                wx.stopPullDownRefresh();
                if (this.records > 0 && this.videoList.length == this.records) {
                    this.loaded = true;
                }
            });

            this.page++;
        }
    },
    created() {},
    onPageScroll(e) {
        this.scrollTop = e.scrollTop;
    }
};
</script>

<style scoped>
.dicovery-box {
    background: #fcfcfc;
    min-height: 100vh;
}
.discovery-top .item {
    width: 330rpx;
    height: 206rpx;
    background-size: 330rpx 206rpx;
    box-shadow: 0 10rpx 20rpx #fdded2;
    border-radius: 24rpx;
    box-sizing: border-box;
    padding: 40rpx 0 0 20rpx;
    color: #ffffff;
    font-size: 36rpx;
    font-weight: 400;
}
.discovery-top .item .text {
    font-size: 25rpx;
    padding-top: 12rpx;
    opacity: 0.7;
    font-weight: 300;
}
.discovery-hot {
    margin-right: 30rpx;
    background: url("https://dootip.cn/xiudong/image/3_03.png") no-repeat;
}
.discovery-collection {
    background: url("https://dootip.cn/xiudong/image/3_05.png") no-repeat;
}
.discovery-title {
    margin: 60rpx 0 18rpx 38rpx;
    justify-content: flex-start;
    line-height: 35rpx;
    color: #332b00;
}
.discovery-title .left-icon {
    width: 4rpx;
    background: #ffd500;
    height: 35rpx;
    margin-right: 14rpx;
}
.video-box {
    width: 680rpx;
    margin: 0 auto;
}
</style>
