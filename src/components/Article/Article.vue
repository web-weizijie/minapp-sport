<template>
  <view class="article">
    <view class="article-cont">
      <view class="article-title">
        {{article.title}}
      </view>
      <view class="article-info">
        <view class="text">{{article.info}}</view>
        <view class="info">{{article.createTime}}</view>
      </view>
      <view class="content">
        <rich-text :nodes="article.content"></rich-text>
      </view>
      <view class="read-end">
        <image class="read-end-image" src="/static/images/icon/read_end.png" mode="widthFix" />
        <view class="read-end-text">你已经读完了这篇文章</view>
      </view>
      <view class="readed-num">
        {{article.readNumber}} 人已读
      </view>
    </view>
    <button class="share-btn" open-type="share">分享给好友</button>
  </view>
</template>
<script>
export default {
    props: {
        article: {
            type: Object,
            default: function() {
                return {};
            }
        }
    },
    mounted() {
        console.log(this.article);
    }
};
</script>
<style scoped>
page {
    background: #f7f7f7;
}
.article {
    padding: 0rpx 0rpx 160rpx 0rpx;
    background: #f7f7f7;
}
.article-cont {
    padding: 150rpx 60rpx 36rpx 60rpx;
    background: #ffffff;
}
.article-title {
    font-weight: 600;
    color: #332b00;
    font-size: 48rpx;
    padding-bottom: 60rpx;
}
.article-info .text {
    font-size: 30rpx;
    color: #332b00;
    margin-bottom: 10rpx;
}
.article-info {
    font-size: 22rpx;
    color: #868686;
    border-bottom: 1rpx solid #eeeeee;
    padding-bottom: 22rpx;
    margin-bottom: -14rpx;
}
.read-end-image {
    display: block;
    width: 180rpx;
    margin: 60rpx auto 0 auto;
}
.read-end {
    font-size: 24rpx;
    color: #868686;
    text-align: center;
}
.read-end-text {
    line-height: 24rpx;
    margin-top: 33rpx;
}
.readed-num {
    text-align: right;
    padding-top: 78rpx;
    font-size: 26rpx;
    color: #868686;
}
.share-btn {
    background: #000000;
    width: 230rpx;
    height: 90rpx;
    line-height: 90rpx;
    font-size: 28rpx;
    color: #ffffff;
    position: fixed;
    bottom: 40rpx;
    left: 50%;
    margin-left: -115rpx;
    border-radius: 90rpx;
}
</style>
