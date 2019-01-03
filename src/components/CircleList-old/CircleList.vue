<template>
  <view class="circle">
    <view class="circle-list flex-row">
      <view class="circle-item" :class="{active:index == showIndex}" v-for="(item, index) in list" :key="item" @click="clickCircle(item,$event,index)">
        <image class="circle-theme-img" :lazy-load="true" mode="aspectFill" :src="item.urls[0]" />
        <view class="circle-text">
          <text>{{item.info}}</text>
        </view>
        <view class="flex-row user-show">
          <view class="flex-row">
            <image :src="item.avatar_url" class="user-avator" />
            <view class="user-name">
              <text>{{item.nickname}}</text>
            </view>
          </view>
          <view class="flex-row like-cont" @click.stop="userLike(item)">
            <image :hidden="!item.bZan" mode="widthFix" src="/static/images/icon/like-active.png" class="user-avator like" />
            <image :hidden="item.bZan" mode="widthFix" src="/static/images/icon/like.jpg" class="user-avator like" />
            <view class="user-name">
              <text>{{item.zanNum}}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
    props: ["list"],
    data() {
        return {
            showIndex: null
        };
    },
    methods: {
        clickCircle(item, event, index) {
            this.showIndex = index;
            this.$emit("getCircleInfo", item, event);
        },
        userLike(item) {
            this.$emit("userCircleLike", item);
        }
    }
};
</script>
<style scoped>
.circle {
    padding: 0 38rpx;
}
.circle-list {
    flex-wrap: wrap;
    justify-content: flex-start;
}
.circle-item {
    width: 320rpx;
    height: 450rpx;
    font-size: 25rpx;
    color: #332b00;
    margin-bottom: 40rpx;
    box-shadow: 0 10rpx 20rpx #f2f2f2;
    overflow: hidden;
}
.circle-item:nth-child(odd) {
    margin-right: 30rpx;
}
.circle-theme-img {
    display: block;
    width: 320rpx;
    height: 300rpx;
}
.circle-text {
    padding: 14rpx 20rpx;
    height: 80rpx;
    box-sizing: border-box;
    font-style: oblique;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}
.user-show {
    padding: 0 0 0 20rpx;
    justify-content: space-between;
}
.like-cont {
    padding: 16rpx 20rpx 0 20rpx;
}
.user-avator {
    width: 40rpx;
    height: 40rpx;
    border-radius: 50%;
}
.user-avator.like {
    border-radius: 0;
}
.user-name {
    font-size: 21rpx;
    color: #868686;
    margin-left: 8rpx;
}
</style>
