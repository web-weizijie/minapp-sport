<template>
    <div class="container">
        <view :class="{filter:filterState}">
            <FixedTitle :scrollTop="scrollTop" :title="thememTitle"></FixedTitle>
            <view class="top-title">{{thememTitle}}</view>
            <Swiper v-if="bannerData.length > 0" :list="bannerData"></Swiper>
            <scroll-view class="icon-list" :scroll-x="true">
                <view class="icon-box">
                    <view class="icon" @click="openMap">
                        <image mode="widthFix" src="/static/images/icon/localtion.png" />
                        <view class="text">
                            <text>健身房</text>
                        </view>
                    </view>
                    <view class="icon" @click="navToTeacher">
                        <image mode="widthFix" src="/static/images/icon/icon-3.jpg" />
                        <view class="text">
                            <text>教练</text>
                        </view>
                    </view>
                    <view class="icon" @click="navToTasteClass">
                        <image mode="widthFix" src="/static/images/icon/icon-2.jpg" />
                        <view class="text">
                            <text>体验课</text>
                        </view>
                    </view>
                    <view class="icon" @click="previewImg">
                        <image mode="widthFix" src="/static/images/icon/icon-4.jpg" />
                        <view class="text">
                            <text>课程表</text>
                        </view>
                    </view>
                    <view class="icon" @click="navToMuscle">
                        <image mode="widthFix" src="/static/images/icon/icon-1.jpg" />
                        <view class="text">
                            <text>活动</text>
                        </view>
                    </view>
                    <!-- <view class="icon">
                        <image mode="widthFix" src="/static/images/icon/icon-5.jpg" />
                        <view class="text">
                            <text>骑行</text>
                        </view>
                    </view>

                    <view class="icon">
                        <image mode="widthFix" src="/static/images/icon/icon-6.jpg" />
                        <view class="text">
                            <text>健餐</text>
                        </view>
                    </view> -->
                </view>
            </scroll-view>
            <view class="card-space big">
                <Card-list title="健身视频" :list="cardData" v-if="cardData.length > 0" @getMoreEvent="getMoreEvent" @hundleVideo="hundleItem"></Card-list>
            </view>
            <view class="h2 discovery-title flex-row">
                <view class="left-icon"></view>
                <view class="text">
                    <text>精彩活动</text>
                </view>
                <view class="more" @click="navToActivity">
                    <image class="more-img" src="/static/images/icon/more.png" mode="widthFix" />
                </view>
            </view>
            <view class="card-space small">
                <VideoList :list="workList" v-if="workList.length > 0" @hundleVideo="navToArticleDetail"></VideoList>
            </view>
            <view class="card-space"></view>
        </view>
        <Phone></Phone>
        <WeChat @hide="filterHide" @show="filterShow" ref="wechat"></WeChat>
    </div>
</template>

<script>
import Phone from "../../base/Phone/Phone";
import VideoList from "../../components/VideoList/VideoList";
import CardList from "../../components/CardList/CardList";
import Swiper from "../../components/Swiper/Swiper";
import FixedTitle from "../../components/FixedTitle/FixedTitle";
import WeChat from "../../components/WeChat/WeChat";
import { showToast, firstRegistier } from "../../utils/index";
import http from "../../utils/http.js";
import store from "../../store";
export default {
    data() {
        return {
            thememTitle: "推荐",
            motto: "Hello World",
            userInfo: {},
            scrollTop: 0,
            bannerData: [],
            cardData: [],
            workList: [],
            page: 1,
            loaded: false,
            loading: false,
            location: null,
            filterState: false,
            subjectImg: null,
            appName: null
        };
    },
    mounted() {
        this.getBanner();
        this.getVideoList();
        this.getWorks();
        this.getName()
    },
    onLoad(options) {
        let saleId = options.saleId || null;
        firstRegistier(saleId, () => {
            if (this.phoneNumber == null) {
                setTimeout(() => {
                    this.$refs.wechat.showPop();
                }, 100);
            }
        });
        this.getSubjectImg();
    },
    components: {
        CardList,
        Swiper,
        FixedTitle,
        VideoList,
        WeChat,
        Phone
    },
    computed: {
        phoneNumber() {
            return store.getters.getUserPhone;
        },
        saleId() {
            return store.getters.getSaleId;
        }
    },
    onShareAppMessage(e) {
        return {
            title: `${this.appName}送你一张健身体验卡`,
            path: `/pages/index/main?saleId=${this.saleId}`,
            imageUrl: "/static/images/icon/share.jpg"
        };
    },
    methods: {
        getName() {
            http.post("gym/queryGym").then(res => {
                if (res.status == 200 && res.data != null) {
                    this.appName = res.data.name;
                }
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
        openMap() {
            wx.navigateTo({
                url: "/pages/map/main"
            });
        },
        filterHide() {
            this.filterState = false;
        },
        filterShow() {
            this.filterState = true;
        },
        navToTasteClass() {
            wx.navigateTo({
                url: "/pages/tasteClass/main"
            });
        },
        navToActivity() {
            wx.navigateTo({
                url: "/pages/muscle/main"
            });
        },
        getMoreEvent() {
            wx.switchTab({
                url: "/pages/discovery/main"
            });
        },
        navToArticleDetail(item) {
            wx.navigateTo({
                url: `/pages/articleDetail/main?id=${item.id}`
            });
        },
        getWorks() {
            http
                .post("eventGreat/list", { page: this.page, pageSize: 4 })
                .then(res => {
                    if (res.status == 200 && res.data.rows) {
                        let workList = res.data.rows.map(item => {
                            return {
                                imgUrl: item.cover,
                                id: item.articleId,
                                title: item.title,
                                createTime: item.createTime
                            };
                        });
                        this.workList = workList;
                    } else {
                        showToast("网络出小差了", "none", 800);
                    }
                });
        },
        getBanner() {
            http.post("banner/list").then(res => {
                res.data.forEach(item => {
                    this.bannerData.push({
                        imgUrl: item.bannerUrl
                    });
                });
            });
        },
        getVideoList() {
            http
                .post("courseOrigin/list", { page: 1, pageSize: 6 })
                .then(res => {
                    res.data.rows.forEach(item => {
                        this.cardData.push({
                            imgUrl: item.cover,
                            id: item.id,
                            text: item.name
                        });
                    });
                });
        },
        navToMuscle() {
            wx.navigateTo({
                url: "/pages/muscle/main"
            });
        },
        navToTeacher() {
            wx.navigateTo({
                url: "/pages/teacher/main"
            });
        },
        hundleItem(item) {
            wx.navigateTo({
                url: `/pages/videoPlay/main?id=${item.id}`
            });
        }
    },
    created() {},
    onPageScroll(e) {
        this.scrollTop = e.scrollTop;
    }
};
</script>

<style scoped>
.card-space.big {
    padding-top: 74rpx;
}
.card-space.small {
    padding: 0 56rpx;
}
.icon-list {
    width: 750rpx;
}
.icon-box {
    width: 800rpx;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    padding-left: 28rpx;
}
.icon-list .icon {
    width: 100rpx;
    height: 100rpx;
    margin: 40rpx 30rpx;
    text-align: center;
}
.icon-list .icon image {
    width: 100%;
    display: block;
}
.icon-list .text {
    color: #332b00;
    font-size: 24rpx;
    padding-top: 8rpx;
    font-weight: 300;
}
.discovery-title {
    margin: 74rpx 56rpx 0rpx 56rpx;
    justify-content: flex-start;
    line-height: 35rpx;
    color: #332b00;
}
.discovery-title .left-icon {
    width: 4rpx;
    background: #ffd500;
    height: 35rpx;
    margin-right: 12rpx;
}
.more {
    padding: 8rpx;
    margin-right: 10rpx;
}
.more-img {
    width: 32rpx;
}
.discovery-title .text {
    flex-grow: 1;
}
</style>
