<template>
    <view class="circle-btm flex-row">
        <button class="tab flex-row" open-type="share">
            <image src="/static/images/icon/share.png" mode="widthFix" />
            <view>分享</view>
        </button>
        <view class="tab flex-row" @click="userTotal">
            <image src="/static/images/icon/msg.jpg" mode="widthFix" />
            <view>评论</view>
        </view>
        <view class="tab flex-row" @click="userLike">
            <view v-show="!bZan">
                <image src="/static/images/icon/like.jpg" mode="widthFix" />
            </view>
            <view v-show="bZan">
                <image src="/static/images/icon/like-active.png" mode="widthFix" />
            </view>
            <view>{{bZan?"已赞":"点赞"}}</view>
        </view>
    </view>
</template>
<script>
export default {
    props: {
        bZan: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        userTotal() {
            this.$emit("userTotalEvent");
        },
        userLike() {
            this.$emit("userLikeEvent");
        }
    }
};
</script>
<style scoped>
.circle-btm {
    position: fixed;
    bottom: 0;
    width: 750rpx;
    left: 0;
    height: 86rpx;
    font-size: 26rpx;
    background: #ffffff;
    border-top: 1rpx solid #eaeaea;
    color: #332b00;
    justify-content: center;
}
.circle-btm .tab {
    line-height: 30rpx;
    width: 32%;
    text-align: center;
    padding: 3rpx 0rpx;
    border-right: 1rpx solid #cacaca;
}
.circle-btm .tab:last-child {
    border: 0;
}
.circle-btm .tab image {
    display: block;
    width: 36rpx;
    margin-right: 13rpx;
}
</style>
