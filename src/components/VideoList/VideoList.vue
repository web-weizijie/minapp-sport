<template>
  <view class="video-list">
    <view class="video-item flex-row" v-for="item in list" :key="item" @click="hundleItem(item)">
      <view class="video-img">
        <image :src="item.imgUrl" />
      </view>
      <view class="video-info">
        <view class="video-title">
          <text>{{item.title}}</text>
        </view>
        <view class="video-text" v-if="item.info">
          <text>{{item.info}}</text>
        </view>
        <view class="video-time flex-row" v-if="item.createTime">
          <image src="/static/images/icon/timer.jpg" mode="widthFix" />
          <text>{{item.createTime}}</text>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
    props: {
        list: {
            type: Array,
            default: []
        }
    },
    data() {
        return {};
    },
    methods: {
        hundleItem(item) {
            this.$emit("hundleVideo", item);
        }
    }
};
</script>
<style scoped>
.video-item:first-child {
    padding-top: 0rpx;
}
.video-item {
    height: 240rpx;
    margin: 0 auto;
    /* background: #ffffff; */
    /* box-shadow: 0 10rpx 20rpx #f2f2f2; */
    font-weight: 200;
    padding: 14rpx 0rpx;
    border-bottom: 1rpx solid #eaeaea;
}
.video-item:last-child {
    border: 0;
}
.video-item .video-img {
    width: 280rpx;
    height: 200rpx;
    flex-shrink: 0;
}
.video-item .video-info {
    flex-grow: 1;
    height: 200rpx;
    padding: 0 0 0 32rpx;
    position: relative;
}
.video-item .video-info .video-title {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    font-size: 30rpx;
    color: #332b00;
}
.video-item .video-info .video-text {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    font-size: 25rpx;
    color: #868686;
    margin-top: 10rpx;
}
.video-item .video-img image {
    width: 100%;
    height: 100%;
    border-radius: 15rpx;
}
.video-time {
    position: absolute;
    bottom: 2rpx;
    left: 32rpx;
}
.video-time image {
    width: 38rpx;
    display: block;
    margin-right: 12rpx;
}
.video-time {
    justify-content: flex-start;
    font-size: 23rpx;
    color: #868686;
}
</style>

