<template>
    <view class="circle">
        <view class="fixed-title flex-row">
            <image class="back-icon" src="/static/images/icon/back.png" @click="navBack" mode="widthFix" />
            <view class="tabbar flex-row">
                <view class="tab" :class="{active:current == 0}" @click="selectSwiper(0)">关注</view>
                <view class="tab" :class="{active:current == 1}" @click="selectSwiper(1)">粉丝</view>
            </view>
        </view>
        <view class="load-cont" :class="{show:load}">
            <swiper :current="current" class="swiper" @change="swiperChange($event)">
                <swiper-item>
                    <scroll-view class="scroll" scroll-y="true">
                        <view class="scroll-box">
                            <FollowList ref="follow" :list="followUserList" v-if="followUserList.length > 0" @followUser="followUser"></FollowList>
                            <Empty title="暂无数据" text="这片地方啥都没有..." v-else></Empty>
                        </view>
                    </scroll-view>
                </swiper-item>
                <swiper-item>
                    <scroll-view class="scroll" scroll-y="true">
                        <view class="scroll-box">
                            <FollowList ref="fans" :isFans="true" :list="fansUserList" v-if="fansUserList.length > 0" @followUser="followUser"></FollowList>
                            <Empty title="暂无数据" text="这片地方啥都没有..." v-else></Empty>
                        </view>
                    </scroll-view>
                </swiper-item>
            </swiper>
        </view>
        <VLoading :state="!load"></VLoading>
    </view>
</template>

<script>
import http from "../../utils/http";
import store from "../../store/index";
import Empty from "../../base/Empty/Empty";
import { showToast } from "../../utils/index.js";
import VLoading from "../../components/Loading/Loading";
import FollowList from "../../components/FollowList/FollowList";
export default {
    data() {
        return {
            thememTitle: "圈子",
            userList: [],
            current: 0,
            load: false,
            followUserList: [],
            fansUserList: []
        };
    },
    onLoad(options) {
        this.current = options.page;
    },
    onUnload() {
        this.userList = [];
        this.current = 0;
        this.load = false;
        this.followUserList = [];
        this.fansUserList = [];
        console.log(unOnload);
    },
    mounted() {
        this.queryMyFollowUsers();
        this.queryMyFans();
    },
    components: {
        VLoading,
        FollowList,
        Empty
    },
    created() {},
    methods: {
        followUser(params, isFans) {
            console.log(params, isFans);
            if (params.state == 0) {
                this.follow(params.userId, isFans);
            } else {
                this.unFollow(params.userId, isFans);
            }
        },
        follow(userFollowId, isFans) {
            let data = {
                userId: this.userInfo.userId,
                userFollowId
            };
            http.get("circle/followUser", data)
                .then(res => {
                    if (res.status == 200 && res.msg == "OK") {
                        this.changeState(userFollowId, isFans);
                    }
                    this.isFansType(isFans);
                })
                .catch(() => {
                    showToast("网络出小差了", "none", 800);
                });
        },
        unFollow(userFollowId, isFans) {
            let data = {
                userId: this.userInfo.userId,
                userFollowId
            };
            http.get("circle/unFollowUser", data)
                .then(res => {
                    if (res.status == 200 && res.msg == "OK") {
                        this.changeState(userFollowId, isFans);
                    }
                    this.isFansType(isFans);
                })
                .catch(() => {
                    showToast("网络出小差了", "none", 800);
                });
        },
        changeState(userFollowId, isFans) {
            if (isFans) {
                this.fansUserList.forEach(ele => {
                    if (userFollowId == ele.userId) {
                        ele.state
                            ? showToast("取消关注", "none", 800)
                            : showToast("关注成功", "none", 800);
                        ele.state = ele.state ? 0 : 1;
                    }
                });
            } else {
                this.followUserList.forEach(ele => {
                    if (userFollowId == ele.userId) {
                        ele.state = ele.state ? 0 : 1;
                    }
                });
            }
        },
        isFansType(isFans) {
            if (isFans) {
                this.$refs.fans.hide();
            } else {
                this.$refs.follow.hide();
            }
        },
        queryMyFollowUsers() {
            http.get("user/queryMyFollowUsers", {
                userId: this.userInfo.userId
            })
                .then(res => {
                    if (res.msg == "OK") {
                        this.followUserList = res.data;
                    }
                })
                .catch(() => {
                    showToast("网络出小差了", "none", 800);
                });
        },
        queryMyFans() {
            http.get("user/queryMyFans", {
                userId: this.userInfo.userId
            })
                .then(res => {
                    if (res.msg == "OK") {
                        this.fansUserList = res.data;
                    }
                    this.load = true;
                })
                .catch(() => {
                    this.load = true;
                    showToast("网络出小差了", "none", 800);
                });
        },
        selectSwiper(n) {
            this.current = n;
        },
        swiperChange(event) {
            this.current = event.mp.detail.current;
        },
        navBack() {
            wx.navigateBack();
        }
    },
    computed: {
        userInfo() {
            return store.getters.getUserInfo;
        }
    }
};
</script>

<style scoped>
.cont {
    opacity: 0;
    transition: all 0.3s ease;
}
.show {
    opacity: 1;
}
.circle {
    min-height: 100vh;
}

.tabbar {
    justify-content: flex-start;
    font-size: 30rpx;
    font-weight: 400;
    height: 80rpx;
}
.tabbar .tab {
    padding-top: 34rpx;
    position: relative;
    color: #868686;
    text-align: center;
    width: 90rpx;
    margin-right: 20rpx;
}
.tabbar .tab.active {
    font-weight: 400;
    color: #332b00;
}
.tabbar .tab:first-child::after {
    position: absolute;
    content: "";
    width: 90rpx;
    height: 4rpx;
    background: #ffd500;
    bottom: -14rpx;
    left: 155rpx;
    transition: all 0.3s linear;
    transform: translateX(-50%);
}
.tabbar .tab.active:first-child::after {
    left: 45rpx;
}

.swiper {
    height: 100vh;
    width: 100%;
}
.scroll {
    width: 100%;
    height: 100%;
}
.scroll-box {
    padding-top: 150rpx;
    box-sizing: border-box;
    height: 100vh;
}
.fixed-title {
    position: fixed;
    top: 0;
    height: 120rpx;
    background: #ffffff;
    left: 0;
    width: 750rpx;
    text-align: center;
    z-index: 99;
    color: #332b00;
    font-weight: 500;
    opacity: 0.95;
}
.back-icon {
    padding: 10rpx;
    width: 34rpx;
    position: absolute;
    left: 16rpx;
    top: 52rpx;
}
</style>
