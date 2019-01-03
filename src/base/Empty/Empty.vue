<template>
    <view class="nologin">
        <view class="cont">
            <image class="img" v-if="empty" src="https://dootip.cn/xiudong/image/empty.png" mode="widthFix"/>
            <image class="img space" v-else src="https://dootip.cn/xiudong/image/space.png" mode="widthFix"/>
            <view class="title">
                <text>{{title}}</text>
            </view>
            <view class="text">
                <text>{{text}}</text>
            </view>
        </view>
    </view>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: ""
    },
    text: {
      type: String,
      default: ""
    },
    empty: {
      type: Boolean,
      default: false
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
  width: 380rpx;
  margin: 0 auto;
}
.cont .img.space{
  width: 329rpx;
  padding-right:10rpx;
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
