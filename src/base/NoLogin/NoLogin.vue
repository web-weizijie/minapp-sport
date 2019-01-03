<template>
  <view class="nologin">
    <view class="cont">
      <image class="img" src="https://dootip.cn/xiudong/image/nologin-bg.png" mode="widthFix" />
      <view class="title">
        <text>还没有登录哦</text>
      </view>
      <view class="text">
        <text>只要登录，即刻开启你的世界...</text>
      </view>
      <button class="default-btn" @getuserinfo="getUserInfo" open-type="getUserInfo">一键登录</button>
    </view>
  </view>
</template>
<script>
import http from "../../utils/http";
import store from "../../store/index";
import { showToast } from "../../utils/index";
export default {
    methods: {
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
                    this.$emit('loginSuccess')
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
.nologin {
    width: 100%;
    height: 100%;
    position: relative;
}
.cont {
    text-align: center;
    position: absolute;
    top: 44%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
}
.cont .img {
    display: block;
    width: 161rpx;
    margin: 0 auto;
}
.cont .title {
    font-size: 32rpx;
    color: #332b00;
    margin: 30rpx 0 18rpx 0;
}
.cont .text {
    font-size: 26rpx;
    color: #868686;
}
.default-btn {
    margin: 66rpx auto 0 auto;
    width: 280rpx;
    font-size: 32rpx;
    height: 80rpx;
    line-height: 80rpx;
    border-radius: 60rpx;
    background: linear-gradient(70deg, #f1ca00, #ffe14b);
    box-shadow: 0 8rpx 14rpx #fdefaa;
    color: #332b00;
}
</style>
