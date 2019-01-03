<template>
  <view class="follow">
    <view class="follow-item flex-row" v-for="item in list" :key="item">
      <image :src="item.avatarUrl" class="avator" @click="navToUserCenter(item.userId)" />
      <view class="user-info">
        <view class="user-name">{{item.nickname}}</view>
        <view class="flex-row user-follow">
          <view>{{item.focus}} 关注</view>
          <view class="line"></view>
          <view>{{item.fans}} 粉丝</view>
        </view>
      </view>
      <FollowBtn :ref="'followBtn' + index" :item="item" :index="index" @followClick="followClick"></FollowBtn>
    </view>
  </view>
</template>
<script>
import FollowBtn from "../FollowBtn/FollowBtn";
export default {
    props: {
        isFans: {
            type: Boolean,
            default: false
        },
        list: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            load: false,
            idx: null
        };
    },
    mounted() {},
    methods: {
        navToUserCenter(userId) {
            wx.navigateTo({
                url: `/pages/userCenter/main?userId=${userId}`
            });
        },
        hide() {
            this.load = false;
            this.$refs[`followBtn` + this.idx][0].hide();
        },
        followClick(item) {
            if (this.load) {
                return;
            }
            this.load = true;
            let params = {
                userId: item.userId,
                state: item.state
            };
            this.idx = this.getItemIndex(params.userId);
            this.$refs[`followBtn` + this.idx][0].show();
            this.$emit("followUser", params, this.isFans);
        },
        getItemIndex(userId) {
            let idx = null;
            this.list.forEach((ele, index) => {
                if (userId == ele.userId) {
                    idx = index;
                }
            });
            return idx;
        }
    },
    components: {
        FollowBtn
    }
};
</script>

<style scoped>
.follow-item {
    padding: 20rpx 25rpx;
    justify-content: flex-start;
    border-bottom: 1rpx solid #e7e7e7;
}
.follow-item .avator {
    width: 130rpx;
    height: 130rpx;
    border-radius: 50%;
    border: 1rpx solid #f2f2f1;
    display: block;
}
.user-info {
    flex-grow: 1;
    margin-left: 20rpx;
}
.user-info .user-name {
    font-size: 34rpx;
    color: #332b00;
}

.user-follow {
    line-height: 25rpx;
    font-size: 25rpx;
    color: #868686;
    justify-content: flex-start;
    margin-top: 24rpx;
}
.user-follow .line {
    width: 1rpx;
    height: 26rpx;
    background: #eaeaea;
    margin: 0 20rpx;
}
</style>
