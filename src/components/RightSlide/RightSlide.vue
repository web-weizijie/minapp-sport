<template>
    <view class="right-slide" @click="hideSlide" @touchmove.stop="clickStop" :class="{show:state}">
        <view class="right-cont" @click.stop="clickStop">
            <view class="right-title flex-row">
                <view class="right-text">
                    <text>Body Parts</text>
                </view>
                <image @click="hideSlide" class="close-img" src="/static/images/icon/close.jpg" mode="widthFix" />
            </view>
            <view class="nav-list">
                <view class="nav-item flex-row">
                    <image class="nav-img" mode="widthFix" src="/static/images/muscle/muscle.jpg" />
                    <view class="nav-text">
                        <text>胳膊</text>
                    </view>
                    <image class="left-icon" mode="widthFix" src="/static/images/icon/left.png" />
                </view>
                <view class="nav-item flex-row">
                    <image class="nav-img" mode="widthFix" src="/static/images/muscle/muscle-1.jpg" />
                    <view class="nav-text">
                        <text>肩膀</text>
                    </view>
                    <image class="left-icon" mode="widthFix" src="/static/images/icon/left.png" />
                </view>
                <view class="nav-item flex-row">
                    <image class="nav-img" mode="widthFix" src="/static/images/muscle/muscle-2.jpg" />
                    <view class="nav-text">
                        <text>背部</text>
                    </view>
                    <image class="left-icon" mode="widthFix" src="/static/images/icon/left.png" />
                </view>
                <view class="nav-item flex-row">
                    <image class="nav-img" mode="widthFix" src="/static/images/muscle/muscle-3.jpg" />
                    <view class="nav-text">
                        <text>腹部</text>
                    </view>
                    <image class="left-icon" mode="widthFix" src="/static/images/icon/left.png" />
                </view>
                <view class="nav-item flex-row">
                    <image class="nav-img" mode="widthFix" src="/static/images/muscle/muscle-4.jpg" />
                    <view class="nav-text">
                        <text>全身</text>
                    </view>
                    <image class="left-icon" mode="widthFix" src="/static/images/icon/left.png" />
                </view>
            </view>
        </view>

    </view>
</template>
<script>
export default {
    props: {
        state: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        clickStop(){

        },
        hideSlide() {
            this.$emit("hideSlide");
        }
    }
};
</script>
<style scoped>
.right-slide {
    position: fixed;
    top: 0;
    width: 750rpx;
    left: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 98;
    bottom: 0;
    transition: all 0s ease 0.3s;
    transform: translateX(100%);
}
.right-slide.show {
    transform: translateX(0);
    transition: all 0s ease 0s;
}
.right-cont {
    width: 540rpx;
    height: 100%;
    background: #ffffff;
    position: absolute;
    right: 0;
    transition: all 0.3s ease;
    transform: translateX(100%);
}
.right-slide.show .right-cont {
    transform: translateX(0);
}
.right-title {
    justify-content: space-between;
    padding: 160rpx 40rpx 0 50rpx;
}
.right-title .close-img {
    width: 44rpx;
    height: 44rpx;
}
.right-title .right-text {
    font-size: 34rpx;
    color: #332b00;
}
.nav-list {
    margin-top: 18rpx;
    padding: 0 24rpx;
}
.nav-item {
    padding: 0 20rpx;
    height: 126rpx;
    border-bottom: 1rpx solid #e9e9e9;
}
.nav-item .nav-img {
    width: 76rpx;
    flex-shrink: 0;
}
.nav-item .nav-text {
    flex-grow: 1;
    font-size: 29rpx;
    color: #332b00;
    padding-left: 24rpx;
}
.nav-item .left-icon {
    width: 30rpx;
    flex-shrink: 0;
    display: block;
}
</style>
