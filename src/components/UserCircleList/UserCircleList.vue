<template>
  <view>
    <view class="user-circle" v-for="item in circleList" :key="item" @click="hundleItem(item)">
      <view class="user-circle-cont">
        <view class="circle-title">{{item.info}}</view>
        <view class="circle-time">{{item.createTime}}</view>
        <ImageCard :small="true" :imgList="item.urls" v-if="item.urls.length > 0"></ImageCard>
        <view class="tab flex-row">
          <view class="tab-like flex-row" @click.stop="userLike(item)">
            <view v-show="item.bZan">
              <image src="/static/images/icon/like-active.png" mode="widthFix" />
            </view>
            <view v-show="!item.bZan">
              <image src="/static/images/icon/like.jpg" mode="widthFix" />
            </view>
            <text>{{item.zanNum}}</text>
          </view>
          <view class="tab-msg flex-row">
            <image src="/static/images/icon/msg.jpg" mode="widthFix" />
            <text>{{item.commentNum}}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import ImageCard from "../ImageCard/ImageCard";
export default {
    props: ["circleList"],
    components: {
        ImageCard
    },
    methods: {
        hundleItem(item) {
            this.$emit("select", item);
        },
        userLike(item) {
            this.$emit("userCircleLike", item);
        }
    }
};
</script>
<style scoped>
.user-circle {
    padding-bottom: 34rpx;
}
.user-circle-cont {
    margin: 0 34rpx;
    border-radius: 15rpx;
    padding: 36rpx 34rpx 6rpx 34rpx;
    background: #ffffff;
    box-shadow: 0 10rpx 20rpx #f2f2f2;
}
.circle-title {
    font-size: 28rpx;
    color: #332b00;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    word-wrap: break-word;
}
.circle-time {
    font-size: 24rpx;
    color: #868686;
    line-height: 24rpx;
    margin-top: 10rpx;
    margin-bottom: 28rpx;
}
.tab {
    margin-right: 14rpx;
    margin-top: 28rpx;
    justify-content: flex-end;
    font-size: 23rpx;
    color: #332b00;
}
.tab .tab-like {
    margin-right: 30rpx;
    padding: 20rpx;
}
.tab image {
    width: 38rpx;
    margin-right: 8rpx;
}
</style>
