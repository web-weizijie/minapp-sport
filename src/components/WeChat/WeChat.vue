<template>
    <view class="wechat" @touchmove.stop="stopClick" v-if="wechat!=null && interimUserId != null">
        <view class="wechat-btn" @click="showPop">
            <image src="/static/images/icon/gift.png" mode="widthFix" />
        </view>
        <view class="wechat-box" :class="{show:state}" @click="hidePop">
            <view class="animate-box">
                <view class="wechat-cont" @click.stop="stopClick">
                    <view class="top">
                        新人免费健身体验卡
                    </view>
                    <view class="wechat-text-cont">
                        <view class="text first">
                            <text>*</text>
                            两种领取方式
                        </view>
                        <button v-if="phone==null" class="wechat-number" open-type="getPhoneNumber" @getphonenumber="getphonenumber">
                            一键领取
                        </button>
                        <view v-else class="wechat-number" @click="getphonenumber">
                            已领取
                        </view>
                        <view class="title flex-row">
                            <view class="circle"></view>
                            <text>为方便使用，需要获取您手机号</text>
                        </view>
                        <view class="line">
                            <view class="text-cont">
                                <text>或</text>
                            </view>
                        </view>
                        <view class="wechat-img">
                            <image class="img" :src="wechat.urlWechat" mode="widthFix" />
                        </view>
                        <view class="title flex-row">
                            <view class="circle"></view>
                            <text>保存二维码到手机，添加好友领取</text>
                        </view>
                    </view>
                </view>
                <view class="flex-row tab">
                    <view class="tab-item" @click="savePhoto">
                        <image src="/static/images/icon/download.png" mode="widthFix" />
                        <text>保存</text>
                    </view>
                    <button class="tab-item" open-type="share" @click.stop="stopClick">
                        <image src="/static/images/icon/quan.png" mode="widthFix" />
                        <text>分享</text>
                    </button>
                    <button class="tab-item" open-type="share" @click.stop="stopClick">
                        <image src="/static/images/icon/share-wechat.png" mode="widthFix" />
                        <text>微信</text>
                    </button>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
import store from "../../store/index";
import { showToast } from "../../utils/index";
import http from "../../utils/http";
export default {
    data() {
        return {
            state: false
        };
    },
    computed: {
        wechat() {
            return store.getters.getWeChatData;
        },
        interimUserId() {
            return store.getters.getInterimUserId;
        },
        phone() {
            return store.getters.getUserPhone;
        }
    },
    methods: {
        savePhoto() {
            wx.getImageInfo({
                src: this.wechat.urlWechat,
                success(res) {
                    wx.saveImageToPhotosAlbum({
                        filePath: res.path,
                        success() {
                            showToast(`二维码已保存到相册`, "none", 800);
                        },
                        fail() {
                            showToast(`保存失败`, "none", 800);
                        }
                    });
                },
                fail() {
                    showToast(`保存失败`, "none", 800);
                }
            });
        },
        stopClick() {},
        getphonenumber(e) {
            if (this.phone != null) {
                showToast(`已领取，可在我的体验课查看`, "none", 2000);
                return;
            }
            wx.showLoading({
                title: "获取中"
            });
            let encryptedData = e.mp.detail.encryptedData || false;
            if (encryptedData) {
                http
                    .getPhone(e.mp.detail)
                    .then(res => {
                        if (res.status == 200 && res.data != null) {
                            let userId = this.interimUserId;
                            let phone = res.data.phoneNumber;
                            http.bindUserPhone(userId, phone, false, () => {
                                wx.showModal({
                                    title: "领取成功",
                                    content:
                                        "已放入您的体验课，请您尽快到店体验",
                                    showCancel: false,
                                    confirmText: "知道了"
                                });
                            });
                        } else {
                            showToast("网络出小差了", "none", 800);
                        }
                        wx.hideLoading();
                    })
                    .catch(() => {
                        wx.hideLoading();
                    });
            } else {
                showToast("需要您授权哦", "none", 800);
            }
        },
        copyWeChatCode() {
            wx.setClipboardData({
                data: this.wechat.wechat
            });
        },
        hidePop() {
            this.state = false;
            this.$emit("hide");
        },
        showPop() {
            this.state = true;
            this.$emit("show");
        },
        stopClick() {}
    }
};
</script>
<style scoped>
.wechat {
}
.wechat-box {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 750rpx;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    transition: all 0s ease;
    transform: scale(0);
    opacity: 0;
}
.wechat-box.show {
    transform: scale(1);
    opacity: 1;
}
.wechat-btn {
    position: fixed;
    bottom: 174rpx;
    right: 36rpx;
    width: 105rpx;
    height: 105rpx;
}
.wechat-btn image {
    width: 105rpx;
}
.animate-box {
    margin-left: -275rpx;
    margin-top: -450rpx;
    transform: scale(0);
    transition: all 0.3s ease;
    position: absolute;
    left: 50%;
    top: 50%;
    opacity: 0;
}
.wechat-cont {
    width: 550rpx;
    padding-bottom: 80rpx;
    background: #ffffff;
    border-radius: 18rpx;
    overflow: hidden;
    margin-bottom: 40rpx;
}
.wechat-box.show .animate-box {
    opacity: 1;
    transform: scale(1);
}
.wechat-cont .top {
    background: linear-gradient(270deg, #f0d02d, #ffbd2b);
    height: 110rpx;
    text-align: center;
    line-height: 110rpx;
    font-size: 34rpx;
}
.wechat-cont .text {
    font-size: 26rpx;
    color: #868686;
}
.wechat-cont .text.first {
    padding-top: 36rpx;
}
.wechat-cont .text text {
    color: red;
}
.wechat-cont .title {
    justify-content: flex-start;
    font-size: 26rpx;
    color: #332b00;
    margin-top: 22rpx;
}
.wechat-cont .line {
    margin-top: 12rpx;
    border-bottom: 2rpx dashed #eaeaea;
    color: #cccccc;
    font-size: 26rpx;
    text-align: center;
}
.wechat-cont .text-cont {
    line-height: 26rpx;
    display: inline-block;
    background: #ffffff;
    padding: 0rpx 12rpx;
    position: relative;
    bottom: -16rpx;
}
.wechat-text-cont {
    padding: 0 57rpx;
}
.wechat-number {
    margin-top: 36rpx;
    height: 76rpx;
    line-height: 76rpx;
    text-align: center;
    background: #eeeeee;
    font-size: 30rpx;
    color: #332b00;
}
.wechat-cont .btn {
    width: 475rpx;
    height: 80rpx;
    border-radius: 80rpx;
    background: linear-gradient(70deg, #ffde3a, #ffde36);
    text-align: center;
    line-height: 80rpx;
    font-size: 30rpx;
    margin: 20rpx auto;
}
.wechat-cont .circle {
    width: 8rpx;
    height: 8rpx;
    border-radius: 50%;
    background: #5780c9;
    margin-right: 8rpx;
}
.wechat-img {
    margin: 40rpx auto 0 auto;
    width: 190rpx;
}
.wechat-img image {
    width: 190rpx;
}
.share-btn {
    width: 550rpx;
    margin: 0;
    font-size: 30rpx;
    height: 82rpx;
    line-height: 82rpx;
    color: #ffffff;
    border: 2rpx solid #ffffff;
    border-radius: 82rpx;
    font-size: 32rpx;
}
.tab {
    text-align: center;
    color: #fff;
    font-size: 26rpx;
    font-weight: 400;
}
.tab-item {
    width: 33%;
    line-height: inherit;
}
.tab-item image {
    display: block;
    width: 88rpx;
    margin: 0 auto 16rpx auto;
}
</style>
