<template>
    <view class="container">
        <view class="top-title">{{thememTitle}}</view>
        <view class="user">
            <view class="user-cont">
                <block v-if="hasLogin">
                    <view class="user-avator" @click="navToUserCenter">
                        <image class="avatar" :src="userInfo.avatarUrl" />
                        <image v-if="type == 1" class="vip" src="/static/images/icon/vip-icon.png" mode="widthFix" />
                    </view>
                    <view class="user-name">
                        {{userInfo.nickname}}
                    </view>
                </block>
                <button class="default-btn" v-if="!hasLogin" @getuserinfo="getUserInfo" open-type="getUserInfo">一键登录</button>
            </view>
            <view class="user-info flex-row">
                <view class="user-info-item" @click="navToFollow(0)">
                    <view class="title">{{focus}}</view>
                    <view>关注</view>
                </view>
                <view class="user-info-item" @click="navToFollow(1)">
                    <view class="title">{{fans}}</view>
                    <view>粉丝</view>
                </view>
                <view class="user-info-item" @click="navToLike">
                    <view class="title">{{likes}}</view>
                    <view>已赞</view>
                </view>
            </view>
        </view>
        <view class="nav-list">
            <view class="nav-item flex-row" @click="navToMsgCenter">
                <image class="nav-img" mode="widthFix" src="/static/images/user/message.png" />
                <view class="nav-text">
                    <text>消息中心</text>
                </view>
                <view class="tishi" v-if="msgLight"></view>
                <image class="left-icon" mode="widthFix" src="/static/images/icon/left.png" />
            </view>
            <view class="nav-item flex-row" @click="navToMyClass">
                <image class="nav-img" mode="widthFix" src="/static/images/user/tiyan.png" />
                <view class="nav-text">
                    <text>我的体验课</text>
                </view>
                <view class="tishi" v-if="myClassLight"></view>
                <image class="left-icon" mode="widthFix" src="/static/images/icon/left.png" />
            </view>
            <view class="nav-item flex-row" @click="navToMyLike">
                <image class="nav-img" mode="widthFix" src="/static/images/user/like.png" />
                <view class="nav-text">
                    <text>关注动态</text>
                </view>
                <image class="left-icon" mode="widthFix" src="/static/images/icon/left.png" />
            </view>
            <view class="nav-item flex-row" @click="navToQustion
            ">
                <image class="nav-img" mode="widthFix" src="/static/images/user/question.png" />
                <view class="nav-text">
                    <text>问题反馈</text>
                </view>
                <image class="left-icon" mode="widthFix" src="/static/images/icon/left.png" />
            </view>
            <view class="nav-item flex-row" @click="navToUserSetting">
                <image class="nav-img" mode="widthFix" src="/static/images/user/setting.png" />
                <view class="nav-text">
                    <text>用户设置</text>
                </view>
                <view class="tishi" v-if="phone == null"></view>
                <image class="left-icon" mode="widthFix" src="/static/images/icon/left.png" />
            </view>
        </view>
        <Login ref="login"></Login>
    </view>
</template>

<script>
import FixedTitle from "../../components/FixedTitle/FixedTitle";
import Login from "../../components/Login/Login";
import { showToast } from "../../utils/index";
import http from "../../utils/http";
import store from "../../store/index";
export default {
    data() {
        return {
            thememTitle: "用户",
            scrollTop: 0,
            focus: 0,
            fans: 0,
            likes: 0,
            msgLight: false,
            myClassLight: false
        };
    },
    onShow() {
        if (this.userInfo != null) {
            this.getUserFollowNum(this.userInfo.userId);
        }

        if (this.hasLogin) {
            this.getCoupon();
            this.getMsg();
        }
    },

    components: {
        Login,
        FixedTitle
    },
    computed: {
        type() {
            return store.getters.type;
        },
        userInfo() {
            return store.getters.getUserInfo;
        },
        phone() {
            return store.getters.getUserPhone;
        },
        hasLogin() {
            return store.getters.hasLogin;
        },
        newMsgTime() {
            return store.getters.getNewMsgTime;
        },
        newClassId() {
            return store.getters.getNewClassId;
        }
    },
    methods: {
        getCoupon(cb) {
            http.get("coupon/myCoupon", {
                userId: this.userInfo.userId
            }).then(res => {
                if (res.status == 200 && res.data.length > 0) {
                    if (this.newClassId != res.data[0].id) {
                        this.myClassLight = true;
                    } else {
                        this.myClassLight = false;
                    }
                }
                this.load = true;
            });
        },
        getMsg(cb) {
            http.get("user/getUserMsgList", {
                userId: this.userInfo.userId,
                pageSize: 1,
                page: 1
            }).then(res => {
                if (res.data != null) {
                    let rows = res.data.rows;
                    if (rows.length > 0) {
                        if (rows[0].createTime != this.newMsgTime) {
                            this.msgLight = true;
                        } else {
                            this.msgLight = false;
                        }
                    }
                }
            });
        },
        navToQustion() {
            wx.navigateTo({
                url: "/pages/question/main"
            });
        },
        navToMyLike() {
            if (this.hasLogin) {
                wx.navigateTo({
                    url: "/pages/myLike/main"
                });
            } else {
                this.$refs.login.show();
            }
        },
        navToMsgCenter() {
            wx.navigateTo({
                url: "/pages/msgCenter/main"
            });
        },
        navToMyClass() {
            wx.navigateTo({
                url: "/pages/myClass/main"
            });
        },
        navToUserCenter() {
            if (!this.hasLogin) {
                this.$refs.login.show();
                return;
            }
            wx.navigateTo({
                url: `/pages/userCenter/main?userId=${this.userInfo.userId}`
            });
        },
        getUserFollowNum(userId) {
            http.get("user/getUserById", { userId: userId }).then(res => {
                if (res.status == 200) {
                    this.focus = res.data.focus;
                    this.fans = res.data.fans;
                    this.likes = res.data.likes;
                }
            });
        },
        navToUserSetting() {
            wx.navigateTo({
                url: `/pages/userSetting/main`
            });
        },
        navToLike() {
            wx.navigateTo({
                url: `/pages/like/main`
            });
        },
        navToFollow(index) {
            wx.navigateTo({
                url: `/pages/follow/main?page=${index}`
            });
        },
        getUserInfo(e) {
            wx.showLoading({
                title: "登录中"
            });
            http.login(e.mp.detail).then(res => {
                wx.hideLoading();
                if (res.data != null && res.status == 200) {
                    let data = {
                        avatarUrl: res.data.avatarUrl,
                        userId: res.data.userId,
                        openid: res.data.openid,
                        nickname: res.data.nickname,
                        city: res.data.city,
                        phone: res.data.mobile,
                        type: res.data.type
                    };
                    store.dispatch("userLogin", data);
                    showToast("登陆成功", "none", 800);
                    this.getUserFollowNum(res.data.userId);
                } else {
                    showToast("登陆失败", "none", 800);
                }
            });
        }
    },
    onPageScroll(e) {
        this.scrollTop = e.scrollTop;
    },
    created() {}
};
</script>

<style scoped>
.user {
    width: 670rpx;
    height: 380rpx;
    border-radius: 14rpx;
    margin: 0 auto;
    box-shadow: 0 10rpx 20rpx #fff2dc;
    background: url("https://dootip.cn/xiudong/image/user-bg.png") #ffffff;
    background-size: 670rpx 380rpx;
    text-align: center;
}
.user-cont {
    height: 240rpx;
    padding-top: 2rpx;
}
.user .user-avator {
    border-radius: 50%;
    padding: 12rpx;
    border: 2rpx solid #fff196;
    margin: 23rpx auto 8rpx auto;
    display: inline-block;
}
.user .user-avator .avatar {
    width: 132rpx;
    height: 132rpx;
    display: block;
    border-radius: 50%;
}
.user .user-name {
    font-size: 34rpx;
    color: #332b00;
}
.user-info {
    justify-content: space-around;
    margin-top: 36rpx;
}
.user-info-item {
    width: 30%;
    font-size: 22rpx;
    line-height: 22rpx;
    color: #868686;
}
.user-info-item .title {
    font-size: 42rpx;
    line-height: 42rpx;
    color: #332b00;
    margin-bottom: 14rpx;
}
.nav-list {
    margin-top: 30rpx;
    padding: 0 46rpx;
}
.nav-item {
    padding: 0 30rpx 0 40rpx;
    height: 126rpx;
    border-bottom: 1rpx solid #e7e7e7;
}
.nav-item .nav-img {
    width: 106rpx;
    flex-shrink: 0;
}
.nav-item .nav-text {
    flex-grow: 1;
    font-size: 29rpx;
    color: #332b00;
    padding-left: 20rpx;
}
.nav-item .left-icon {
    width: 22rpx;
    opacity: 0.8;
    flex-shrink: 0;
    display: block;
}
.default-btn {
    margin: 100rpx auto 0 auto;
    width: 410rpx;
    font-size: 32rpx;
    height: 94rpx;
    line-height: 94rpx;
    border-radius: 60rpx;
    background: linear-gradient(70deg, #f1ca00, #ffe14b);
    box-shadow: 0 10rpx 20rpx #fff5c5;
    color: #332b00;
}
.tishi {
    width: 16rpx;
    height: 16rpx;
    border-radius: 50%;
    background: #f33d43;
    margin-right: 20rpx;
}
.user-avator {
    position: relative;
}
.user-avator .vip {
    position: absolute;
    width: 39rpx;
    bottom: 10rpx;
    right: 4rpx;
    border-radius: 50%;
}
</style>
