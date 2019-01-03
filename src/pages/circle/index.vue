<template>
    <view>
        <view class="circle">
            <FixedTitle :scrollTop="scrollTop" :title="themeTitle"></FixedTitle>
            <view class="top-title">{{themeTitle}}</view>
            <view class="scroll">
                <view class="scroll-box">
                    <UserList :list="userList" v-if="userList.length > 0" @hundleClick="hundleClick"></UserList>
                    <CircleList ref="clircleList" :list="circleList" v-if="circleList.length > 0" @userfollow="userfollow" @getCircleInfo="getCircleInfo" @userCircleLike="userCircleLike"></CircleList>
                    <view class="load-more" v-if="hotLoading || hotLoaded">
                        <image src="/static/images/icon/loading.png" v-if="!hotLoaded" mode="widthFix" />
                        <text v-else>已到底</text>
                    </view>
                </view>
            </view>
            <Loading :state="circleList.length <= 0"></Loading>
        </view>
        <view class="camera" @click="navToPostUser">
            <image class="icon-camera" src="/static/images/icon/camera.png" mode="widthFix" />
        </view>
        <Login ref="login"></Login>
    </view>
</template>

<script>
import UserList from "../../components/UserList/UserList";
import CircleList from "../../components/CircleList/CircleList";
import FixedTitle from "../../components/FixedTitle/FixedTitle";
import Empty from "../../base/Empty/Empty";
import Loading from "../../components/Loading/Loading";
import Login from "../../components/Login/Login";
import store from "../../store/index";
import http from "../../utils/http.js";
import { showToast } from "../../utils/index.js";
import { hasLogin } from "../../store/getters.js";
import { formatTime } from "../../utils/index";
export default {
    data() {
        return {
            themeTitle: "圈子",
            userList: [],
            circleList: [],
            scrollTop: 0,
            hotpage: 1,
            hotLoaded: false,
            hotAllNum: 0,
            hotLoading: false,
            likeState: false,
            load: false
        };
    },
    mounted() {},
    onShow() {
        if (this.postTrue) {
            this.circleList = [];
            store.commit("setPostTrue", false);
        }
        this.getCommunityInfoList(true);
        this.getUsersByFans();
    },
    components: {
        UserList,
        CircleList,
        FixedTitle,
        Loading,
        Empty,
        Login
    },
    computed: {
        postTrue() {
            return store.getters.getPostTrue;
        },
        hasLogin() {
            return store.getters.hasLogin;
        },
        userId() {
            return store.getters.getUserInfo == null
                ? null
                : store.getters.getUserInfo.userId;
        }
    },
    created() {},
    onPageScroll(e) {
        this.scrollTop = e.scrollTop;
    },
    onReachBottom() {
        this.getCommunityInfoList();
    },
    onPullDownRefresh() {
        this.getCommunityInfoList(true);
    },
    methods: {
        userfollow(item) {
            if (!this.hasLogin) {
                this.$refs.login.show();
                return;
            }
            if (this.load) {
                return;
            }
            this.$refs.clircleList.followShow();
            this.load = true;
            if (item.state == 0) {
                this.follow(item);
            } else {
                this.unFollow(item);
            }
        },
        follow(item) {
            let data = {
                userId: this.userId,
                userFollowId: item.userId
            };
            http.get("circle/followUser", data).then(res => {
                this.setFollowState(item, 1);
                this.load = false;
                this.$refs.clircleList.followHide();
            });
        },
        unFollow: function(item) {
            let data = {
                userId: this.userId,
                userFollowId: item.userId
            };
            http.get("circle/unFollowUser", data).then(res => {
                this.setFollowState(item, 0);
                this.load = false;
                this.$refs.clircleList.followHide();
            });
        },
        setFollowState(item, val) {
            this.circleList.forEach(ele => {
                if (ele.userId == item.userId) {
                    ele.state = val;
                }
            });
        },
        loginSuccess() {
            this.getCommunityInfoList(true);
        },
        userCircleLike(item) {
            if (!this.hasLogin) {
                this.$refs.login.show();
                return;
            }
            if (this.likeState) {
                return;
            }

            let data = {
                userid: this.userId,
                type: item.bZan ? 1 : 0,
                circleid: item.id,
                masterId: item.userId
            };
            this.likeState = true;
            this.circleList.forEach(ele => {
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
        getCommunityInfoList(init = false, cb = null) {
            let pageSize = 6;
            if (this.hotLoaded && !init) {
                return;
            }
            if (init) {
                let len = this.circleList.length;
                this.hotpage = 1;
                this.hotLoaded = false;
                pageSize = len == 0 ? 6 : len;
            } else {
                this.hotpage = this.hotpage + 1;
            }

            this.hotLoading = true;
            http
                .get("circle/getCommunityInfoList", {
                    userid: this.userId,
                    page: this.hotpage,
                    pageSize
                })
                .then(res => {
                    if (res.status == 200) {
                        res.data.rows.forEach(ele => {
                            ele.createTime = ele.timeAgoStr;
                            ele.commentNum = ele.pagedResult.records;
                        });
                        init
                            ? (this.circleList = res.data.rows)
                            : (this.circleList = this.circleList.concat(
                                  res.data.rows
                              ));

                        this.hotAllNum = res.data.records;
                        if (this.circleList.length >= this.hotAllNum) {
                            this.hotLoaded = true;
                        }
                        if (cb != null) {
                            cb();
                        }
                    } else {
                        showToast("网络出小差了", "none", 800);
                    }
                    wx.stopPullDownRefresh();
                    this.hotLoading = false;
                })
                .catch(() => {
                    this.hotLoading = false;
                });
        },
        getUsersByFans() {
            http.get("user/getUsersByFans", { pageSize: 10 }).then(res => {
                this.userList = res.data;
            });
        },

        navToPostUser() {
            if (this.hasLogin) {
                wx.navigateTo({
                    url: "/pages/postUser/main"
                });
            } else {
                this.$refs.login.show();
            }
        },
        hundleClick(item) {
            wx.navigateTo({
                url: `/pages/userCenter/main?userId=${item.userId}`
            });
        },
        getCircleInfo(item) {
            wx.navigateTo({
                url: `/pages/circleDetail/main?id=${item.id}`
            });
        }
    }
};
</script>

<style scoped>
.circle {
    background: #f7f7f7;
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
    height: 100%;
    box-sizing: border-box;
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
.user-post {
    position: absolute;
    left: 32rpx;
    top: 60rpx;
}
.user-post image {
    width: 52rpx;
}
.uploading {
    width: 170rpx;
    height: 70rpx;
    transition: all 0.3s ease;
    position: fixed;
    opacity: 0;
    border-radius: 10rpx;
    background: rgba(0, 0, 0, 0.7);
    color: #ffffff;
    font-size: 24rpx;
    z-index: 999;
    text-align: center;
    line-height: 70rpx;
    top: 45%;
    left: 50%;
    font-weight: 600;
    transform: translate3d(-50%, -50%, 0);
}
.uploading.show {
    opacity: 1;
    top: 50%;
}
.camera {
    position: fixed;
    bottom: 50rpx;
    right: 30rpx;
}
.camera image {
    width: 90rpx;
}
</style>
