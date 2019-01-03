<template>
    <view class="fixed-title" :style="{opacity: opacity}">
        <image v-if="back" class="back-icon" src="/static/images/icon/back.png" @click="navBack" mode="widthFix" />
        <text>{{title}}</text>
    </view>
</template>
<script>
export default {
    props: {
        title: {
            type: String,
            default: ""
        },
        scrollTop: {
            type: Number,
            default: 0
        },
        back: {
            type: Boolean,
            default: false
        },
        isShare: {
            type: Number,
            default: 0
        }
    },
    methods: {
        navBack() {
            if (this.isShare == 0) {
                wx.navigateBack();
            } else {
                wx.switchTab({
                    url: "/pages/index/main"
                });
            }
        }
    },
    computed: {
        opacity: function() {
            let n = (this.scrollTop / 100).toFixed(2);
            if (n > 0.95 || this.back) {
                n = 0.95;
            }
            return n;
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
    opacity: 1;
}
.back-icon {
    padding: 10rpx;
    width: 34rpx;
    position: absolute;
    left: 16rpx;
    top: 52rpx;
}
</style>
