<template>
    <view class="fixed-title">
        <image class="back-icon" :class="{home:isShare == 1}" :src="imgUrl" @click=" pageBack" mode="widthFix" />
        <text class="fixed-text" :style="{opacity: 1 - opacity * 5}">{{title}}</text>
        <view class="user-fixed flex-row" :style="{opacity:opacity}" v-if="item != '' && item != null">
            <image class="avator" :src="item.avatar_url" />
            <view class="user-name">{{item.nickname}}</view>
            <view class="button" v-if="userId != item.userId">
                {{followState == 0?"未关注":"已关注"}}
            </view>
        </view>
    </view>
</template>
<script>
import store from "../../store/index";
export default {
    props: {
        scrollTop: {
            type: Number,
            default: 0
        },
        item: {
            type: Object,
            default: null
        },
        title: {
            type: String,
            default: "详情"
        },
        followState: {
            type: Number,
            default: 0
        },
        isShare: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {};
    },
    methods: {
        pageBack() {
            if (this.isShare == 0) {
                this.$emit("pageBack");
                wx.navigateBack();
            } else {
                wx.switchTab({
                    url: "/pages/index/main"
                });
            }
        }
    },
    computed: {
        imgUrl() {
            let img = this.isShare == 0 ? "back" : "home";
            let url = `/static/images/icon/${img}.png`;
            return url;
        },
        opacity: function() {
            let n = (this.scrollTop / 120).toFixed(2);
            if (n > 0.95) {
                n = 0.95;
            }
            return n;
        },
        userId() {
            return store.getters.getUserInfo == null
                ? null
                : store.getters.getUserInfo.userId;
        }
    }
};
</script>
<style scoped>
.fixed-title {
    position: fixed;
    top: 0;
    height: 120rpx;
    line-height: 154rpx;
    background: #fec803;
    left: 0;
    width: 750rpx;
    text-align: center;
    z-index: 99;
    color: #332b00;
    font-size: 34rpx;
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
.back-icon.home{
    top: 50rpx;
    width: 39rpx;
}
.user-fixed {
    padding-top: 30rpx;
    box-sizing: border-box;
    width: 600rpx;
    margin-left: 75rpx;
    height: 100%;
}
.user-fixed .avator {
    width: 45rpx;
    height: 45rpx;
    border-radius: 50%;
}
.user-fixed .user-name {
    font-size: 26rpx;
    color: #332b00;
    margin-left: 10rpx;
}
.user-fixed .button {
    width: 77rpx;
    height: 34rpx;
    border: 1rpx solid #332b00;
    color: #332b00;
    font-size: 20rpx;
    border-radius: 8rpx;
    text-align: center;
    line-height: 34rpx;
    margin-left: 26rpx;
}
.fixed-text {
    position: absolute;
    left: 50%;
    top: 0rpx;
    display: block;
    width: 200rpx;
    text-align: center;
    transform: translate3d(-50%, 0, 0);
}
</style>
