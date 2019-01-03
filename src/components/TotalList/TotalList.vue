<template>
    <view class="talk-box">
        <view class="talk-num" v-if="!isMsg">
            评论 {{totalComment}}
        </view>
        <view class="user flex-row talk" v-for="item in list" :key="item">
            <image class="teacher" v-if="item.type == 1" src="/static/images/icon/vip-icon.png" mode="widthFix" />
            <image class="avator" :src="item.avator" @click="selectUser(item)" />
            <view class="user-info" @click="userTotal(item)">
                <view class="user-name flex-row">
                    <view :class="{msg:isMsg}">{{item.userName}}</view>
                </view>
                <rich-text class="circle-talk" :nodes="item.content"></rich-text>
                <view class="time">
                    <text>{{item.timeAgoStr}}</text>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
export default {
    props: {
        totalComment: {
            type: Number,
            default: 0
        },
        list: {
            type: Object,
            default: null
        },
        isMsg: {
            type: Boolean,
            default: false
        }
    },
    mounted() {
    },
    methods: {
        selectUser(item) {
            this.$emit("select", item.userid);
        },
        userTotal(item) {
            this.$emit("hundleUser", item);
        }
    }
};
</script>
<style scoped>
.circle-talk {
    color: #332b00;
}
.talk-box {
    padding: 0rpx 25rpx;
}
.talk {
    justify-content: flex-start;
    font-size: 28rpx;
    align-items: flex-start;
}
.talk .user-info .user-name {
    font-size: 26rpx;
    color: #868686;
    margin-bottom: 10rpx;
    justify-content: flex-start;
}
.talk-num {
    font-size: 29rpx;
    color: #332b00;
    border-bottom: 1rpx solid #eaeaea;
    height: 50rpx;
    line-height: 50rpx;
    padding-bottom: 10rpx;
}
.talk .time {
    border-bottom: 1rpx solid #eaeaea;
    font-size: 24rpx;
    color: #868686;
    padding: 22rpx 0;
}
.talk:last-child .time {
    border: 0;
}
.user {
    padding-top: 30rpx;
    position: relative;
}
.user .avator {
    flex-shrink: 0;
    width: 76rpx;
    height: 76rpx;
    border-radius: 50%;
    margin-right: 25rpx;
}
.user .teacher {
    position: absolute;
    width: 24rpx;
    left: 56rpx;
    top: 83rpx;
}
.user .user-info {
    flex-grow: 1;
}
.user-info .user-name {
    font-size: 28rpx;
    line-height: 28rpx;
    color: #332b00;
    margin-bottom: 12rpx;
}
.user-info .user-name .msg {
    color: #ff7d42;
    margin-right: 10rpx;
}
.user-info .user-time {
    font-size: 22rpx;
    line-height: 22rpx;
    color: #868686;
}
</style>
