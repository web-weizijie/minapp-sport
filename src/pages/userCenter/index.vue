<template>
    <view class="user-center">
        <UserFiexHead :title="title" :scrollTop="scrollTop" :item="userInfo" @pageBack="pageBack" :followState="titleFollow"></UserFiexHead>
        <view class="box" :class="{show:state}" v-if="navState">
            <view class="user-cont" v-if="userInfo != null">
                <view class="user flex-row" :class="{noboder:userInfo.coach == null}">
                    <image class="avator" :src="userInfo.avatar_url" mode="widthFix" />
                    <view class="user-info">
                        <view class="user-name flex-row">
                            <view>
                                <text>{{userInfo.nickname}}</text>
                            </view>
                            <image v-if="userInfo.type == 1" class="vip" src="/static/images/icon/vip-icon.png" mode="widthFix" />
                        </view>
                        <view class="flex-row user-follow">
                            <view>{{userInfo.focus}} 关注</view>
                            <view class="line"></view>
                            <view>{{userInfo.fans}} 粉丝</view>
                        </view>
                    </view>
                    <FollowBtn v-if="meId != userInfo.userId" ref="followBtn" :item="followInfo" @followClick="followClick"></FollowBtn>
                </view>
                <view class="user-about" :class="{noborder:userInfo.coach.videos.length <= 0}" v-if="userInfo.coach != null">
                    <view class="card-title">
                        教练介绍
                    </view>
                    <view>
                        <text>{{userInfo.coach.info}}</text>
                    </view>
                </view>
                <view class="video" v-if="userInfo.coach != null && userInfo.coach.videos.length > 0">
                    <Card-list :hidePlayBtn="false" :hideMore="true" title="视频列表" :padding="34" :list="userInfo.coach.videos" @hundleVideo="hundleItem"></Card-list>
                </view>
            </view>
            <view class="circle-list">
                <view class="circle-list-len">
                    全部圈子( {{records}} )
                </view>
                <userCircleList :circleList="circleList" @select="select" v-if="circleList.length > 0" @userCircleLike="userCircleLike"></userCircleList>
            </view>
            <view class="load-more" v-if="loading || loaded">
                <image src="/static/images/icon/loading.png" v-if="!loaded" mode="widthFix" />
                <text v-else>已到底</text>
            </view>
        </view>
        <Login ref="login" @loginSuccess="loginSuccess"></Login>
        <TeacherVideo ref="TeacherVideo" :url="videoUrl"></TeacherVideo>
        <VLoading :state="!firstLoad"></VLoading>
    </view>
</template>
<script>
import UserFiexHead from "../../components/UserFiexHead/UserFiexHead";
import VLoading from "../../components/Loading/Loading";
import CardList from "../../components/CardList/CardList";
import userCircleList from "../../components/userCircleList/userCircleList";
import FollowBtn from "../../components/FollowBtn/FollowBtn";
import { showToast } from "../../utils/index";
import Login from "../../components/Login/Login";
import TeacherVideo from "../../components/TeacherVideo/TeacherVideo";
import store from "../../store/index";
import http from "../../utils/http";
import { formatTime } from "../../utils/index";
const dataArr = [];
export default {
    data() {
        return {
            title: "个人中心",
            scrollTop: 0,
            userInfo: null,
            cardData: [],
            circleList: [],
            page: 1,
            loaded: false,
            loading: false,
            userId: null,
            navState: true,
            followInfo: {
                state: false
            },
            records: 0,
            likeState: false,
            firstLoad: false,
            videoUrl: null
        };
    },
    onLoad(options) {
        this.initData();
        Object.assign(this.$data, { userId: options.userId });
        this.getCircleList(this.userId);
        this.getUserInfo(this.userId);
        this.userFollowState();
    },
    onShow() {
        this.navState = true;
    },
    onUnload() {
        this.initData();
        const dataNum = dataArr.length;
        if (!dataNum) return;
        Object.assign(this.$data, dataArr[dataNum - 1], { navState: false });
    },
    onReachBottom() {
        this.getCircleList(this.userId);
    },
    methods: {
        userCircleLike(item) {
            if (this.likeState) {
                return;
            }

            let data = {
                userid: this.meId,
                type: item.bZan ? 1 : 0,
                circleid: item.id,
                masterId:this.userId
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
        loginSuccess() {
            this.userFollowState();
        },
        pageBack() {},
        initData() {
            this.userInfo = null;
            this.cardData = [];
            this.circleList = [];
            this.scrollTop = 0;
            this.page = 0;
            this.loaded = false;
            this.loading = false;
            this.likeState = false;
            this.firstLoad = false;
            this.videoUrl = null;
        },
        getUserInfo(userId) {
            http
                .get("user/getUserById", { userId })
                .then(res => {
                    if (
                        res.status == 200 &&
                        res.data != null &&
                        res.data != ""
                    ) {
                        if (res.data.fans == null) {
                            res.data.fans = 0;
                        }
                        if (res.data.focus == null) {
                            res.data.focus = 0;
                        }
                        res.data.avatar_url = res.data.avatarUrl;
                        if (res.data.coach != null) {
                            res.data.coach.videos.forEach(ele => {
                                ele.imgUrl = ele.cover;
                                ele.id = ele.id;
                                ele.text = ele.name;
                            });
                        }

                        this.userInfo = res.data;
                    } else {
                        showToast("网络出小差了", "none", 800);
                    }
                    setTimeout(() => {
                        this.firstLoad = true;
                    }, 100);
                })
                .catch(err => {
                    console.log(err);
                });
        },
        getCircleList(userId) {
            if (this.loaded || this.loading) {
                return;
            }
            this.loading = true;
            http
                .get("circle/getCommunityListMine", {
                    page: this.page,
                    pageSize: 4,
                    userId
                })
                .then(res => {
                    if (res.status == 200) {
                        res.data.rows.forEach(element => {
                            element.createTime = formatTime(
                                new Date(element.createTime)
                            );
                            element.commentNum = element.pagedResult.records;
                        });
                        this.records = res.data.records;
                        this.circleList = this.circleList.concat(res.data.rows);
                        this.page++;
                        if (this.records <= this.circleList.length) {
                            this.loaded = true;
                        }
                    } else {
                        showToast("网络出小差了", "none", 800);
                    }
                    this.loading = false;
                })
                .catch(err => {
                    this.loading = false;
                });
        },
        hundleItem(item) {
            this.videoUrl = item.videosUrl;
            this.$refs.TeacherVideo.showVideo();
        },
        select(item) {
            wx.navigateTo({
                url: `/pages/circleDetail/main?id=${item.id}`
            });
            dataArr.push({ ...this.$data });
        },
        follow() {
            let data = {
                userId: this.meId,
                userFollowId: this.userId
            };
            http.get("circle/followUser", data).then(res => {
                this.$refs.followBtn.hide();
                this.followInfo.state = 1;
                this.load = false;
            });
        },
        unFollow: function() {
            let data = {
                userId: this.meId,
                userFollowId: this.userId
            };
            http.get("circle/unFollowUser", data).then(res => {
                this.$refs.followBtn.hide();
                this.followInfo.state = 0;
                this.load = false;
            });
        },
        userFollowState() {
            http
                .get("circle/userFollowState", {
                    userId: this.meId,
                    userFollowId: this.userId
                })
                .then(res => {
                    this.followInfo = res.data;
                });
        },
        followClick(item) {
            if (!this.hasLogin) {
                this.$refs.login.show();
                return;
            }
            if (this.load) {
                return;
            }
            this.$refs.followBtn.show();
            this.load = true;
            if (item.state == 0) {
                this.follow(item);
            } else {
                this.unFollow(item);
            }
        }
    },
    computed: {
        titleFollow() {
            return this.followInfo == null ? 0 : this.followInfo.state;
        },
        hasLogin() {
            return store.getters.hasLogin;
        },
        meId() {
            return store.getters.getUserInfo == null
                ? null
                : store.getters.getUserInfo.userId;
        },
        state() {
            return this.userInfo != null;
        }
    },
    components: {
        UserFiexHead,
        CardList,
        userCircleList,
        VLoading,
        FollowBtn,
        Login,
        TeacherVideo
    },
    onPageScroll(e) {
        this.scrollTop = e.scrollTop;
    }
};
</script>
<style scoped>
.user-about {
    border-bottom: 1rpx solid #eaeaea;
    margin: 0 36rpx;
    font-size: 28rpx;
    color: #332b00;
    padding: 40rpx 0rpx;
}
.user-about.noborder{
    border: 0;
}
.card-title {
    padding: 0rpx 0rpx 22rpx 0rpx;
    font-size: 33rpx;
    color: #362b00;
    line-height: 33rpx;
}
.box {
    transition: all 0.4s ease;
    opacity: 0;
}
.box.show {
    opacity: 1;
}
.circle-list {
    padding-bottom: 34rpx;
}
.user-center {
    min-height: 100vh;
    width: 750rpx;
    background: #f7f7f7;
}
.user {
    border-bottom: 1rpx solid #eaeaea;
    padding-bottom: 40rpx;
    margin: 0 34rpx;
}
.user.noboder {
    border: 0;
}
.user-cont {
    padding: 160rpx 0rpx 0rpx 0rpx;
    box-shadow: 0 10rpx 20rpx #f0f0f0;
    background: #ffffff;
}
.user .avator {
    width: 136rpx;
    height: 136rpx;
    border-radius: 50%;
}
.user .user-name {
    font-size: 38rpx;
    line-height: 38rpx;
    color: #332b00;
}
.user-info {
    flex-grow: 1;
    margin-left: 30rpx;
}
.user-follow {
    line-height: 26rpx;
    font-size: 26rpx;
    color: #868686;
    justify-content: flex-start;
    margin-top: 32rpx;
}
.user-follow .line {
    width: 1rpx;
    height: 26rpx;
    background: #eaeaea;
    margin: 0 20rpx;
}
.user .button {
    width: 140rpx;
    height: 50rpx;
    border: 1rpx solid #332b00;
    color: #332b00;
    font-size: 26rpx;
    border-radius: 20rpx;
    text-align: center;
    line-height: 50rpx;
    margin-right: 4rpx;
}
.video {
    margin-top: 36rpx;
    padding-bottom: 48rpx;
}
.circle-list-len {
    font-size: 24rpx;
    color: #868686;
    padding: 24rpx 40rpx 14rpx 40rpx;
}
.user-name {
    justify-content: flex-start;
}
.user-name image {
    margin-left: 8rpx;
    display: block;
    width: 34rpx;
}
</style>
