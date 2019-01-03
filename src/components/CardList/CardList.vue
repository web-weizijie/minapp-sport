<template>
    <view class="card-box">
        <view class="card-title flex-row" :style="{paddingLeft:padding+'rpx',paddingRight:padding + 'rpx'}">
            <view class="left-icon"></view>
            <view class="text">
                <text>{{title}}</text>
            </view>
            <view class="more" @click="getMore" v-if="!hideMore">
                <image class="more-img" src="/static/images/icon/more.png" mode="widthFix" />
            </view>
        </view>
        <scroll-view :scroll-x="true" class="card-scroll">
            <view class="card-cont" :style="{width:cardWidth + 'rpx',padding:'0rpx ' + padding + 'rpx'}">
                <view class="card-item" v-for="item in list" :key="item" @click="hundleItem(item)">
                    <image class="bg" :src="item.imgUrl" />
                    <view class="card-text" v-if="hidePlayBtn">
                        <text>{{item.text}}</text>
                    </view>
                    <view class="video-play flex-row" v-if="!hidePlayBtn">
                        <image class="image" mode="widthFix" src="/static/images/icon/video.png" />
                    </view>
                </view>
            </view>
        </scroll-view>
    </view>
</template>
<script>
export default {
    props: {
        title: {
            type: String,
            default: null
        },
        list: {
            type: Array,
            default: []
        },
        padding: {
            type: Number,
            default: 56
        },
        hideMore: {
            type: Boolean,
            default: false
        },
        hidePlayBtn: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        cardWidth() {
            return this.list.length * 320;
        }
    },
    methods: {
        hundleItem(item) {
            this.$emit("hundleVideo", item);
        },
        getMore() {
            this.$emit("getMoreEvent");
        }
    }
};
</script>
<style scoped>
.card-box {
    width: 750rpx;
    height: 270rpx;
}
.card-box .card-cont {
    width: 1270rpx;
    display: flex;
    flex-flow: row nowrap;
}
.card-box .card-title {
    padding: 0rpx 0rpx 24rpx 0rpx;
    font-size: 33rpx;
    color: #362b00;
    position: relative;
    line-height: 33rpx;
    justify-content: flex-start;
}
.card-title .text {
    flex-grow: 1;
}
.card-box .left-icon {
    width: 4rpx;
    background: #ffd500;
    height: 33rpx;
    margin-right: 14rpx;
}
.card-box .card-item {
    margin-right: 22rpx;
    position: relative;
    height: 200rpx;
    overflow: hidden;
    border-radius: 15rpx;
}
.card-box .card-item .bg {
    width: 300rpx;
    height: 200rpx;
    border-radius: 15rpx;
    position: relative;
}
.card-text {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    text-align: center;
    font-size: 25rpx;
    font-weight: 300;
    color: #ffffff;
    height: 50rpx;
    line-height: 50rpx;
    font-style: oblique;
    background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(20, 20, 20, 1));
}
.more {
    padding: 8rpx;
    margin-right: 10rpx;
}
.more-img {
    width: 32rpx;
}
.video-play {
    width: 28rpx;
    height: 28rpx;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 50%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate3d(-50%, -50%, 0);
    padding: 20rpx;
    border: 2rpx solid rgba(255, 255, 255, 0.8);
    text-align: center;
}
.video-play .image {
    transform: rotate(180deg);
    width: 19rpx;
    height: 30rpx;
    margin-left: 6rpx;
}
</style>
