<template>
    <view class="login" :class="{show:state}">
        <view class="login-bg" @click="hide"></view>
        <view class="login-cont">
            <view class="login-img">
                <image src="https://dootip.cn/xiudong/image/login-poputer.png" mode="widthFix" />
            </view>
            <view class="title">
                <text>您还未登陆</text>
            </view>
            <view class="text">
                <text>(请先登录再进行此操作)</text>
            </view>
            <button class="default-btn login-btn" open-type="getUserInfo" @getuserinfo="getUserInfo">微信一键登录</button>
            <view class="btn-cancle" @click="hide">取消</view>
        </view>
    </view>
</template>
<script>
import http from "../../utils/http";
import store from "../../store/index";
import { showToast } from "../../utils/index";
export default {
    data() {
        return {
            state: false
        };
    },
    methods: {
        show() {
            this.state = true;
        },
        hide() {
            this.state = false;
        },
        getUserInfo(e) {
            wx.showLoading({
                title: "登录中"
            });
            http.login(e.mp.detail).then(res => {
                wx.hideLoading();
                if (res.data != null) {
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
                    this.state = false;
                    this.$emit("loginSuccess");
                    showToast("登陆成功", "none", 800);
                } else {
                    showToast("登陆失败", "none", 800);
                }
            });
        }
    }
};
</script>
<style scoped>
.login {
    transform: translateY(100%);
    position: fixed;
    top: 0;
    left: 0;
    width: 750rpx;
    bottom: 0;
    z-index: 999;
    transition: all 0s ease 0.2s;
    text-align: center;
    color: #332b00;
}
.login.show {
    transform: translateY(0);
    transition: all 0s ease 0s;
}
.login .login-bg {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
}
.login-cont {
    position: absolute;
    left: 50%;
    top: 50%;
    border-radius: 10rpx;
    background: #ffffff;
    width: 550rpx;
    height: 550rpx;
    opacity: 0;
    transform: scale(0);
    margin-left: -275rpx;
    margin-top: -270rpx;
    transition: all 0.2s ease;
}
.login.show .login-cont {
    opacity: 1;
    transform: scale(1);
}
.login-btn {
    width: 480rpx;
    font-size: 32rpx;
    border-radius: 60rpx;
    margin: 0 auto;
    height: 94rpx;
    line-height: 94rpx;
}
.login-img image {
    position: absolute;
    width: 225rpx;
    border-radius: 50%;
    transform: translate3d(-50%, -41%, 0);
    top: 0;
    left: 50%;
    border: 16rpx solid #ffffff;
}
.btn-cancle {
    font-size: 28rpx;
    color: #cccccc;
    text-align: center;
    margin-top: 30rpx;
}
.login .title {
    margin-top: 180rpx;
    font-size: 37rpx;
    line-height: 37rpx;
    margin-bottom: 22rpx;
}
.login .text {
    font-size: 29rpx;
    line-height: 29rpx;
    margin-bottom: 80rpx;
}
</style>
