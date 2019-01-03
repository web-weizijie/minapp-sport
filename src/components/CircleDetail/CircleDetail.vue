<template>
    <view class="clrcle-detail">
        <view v-if="followInfo != null">
            <view class="scroll-box">
                <view class="user flex-row" @click="hundleItem(item)">
                    <image class="avator" :src="item.avatar_url" />
                    <image class="teacher" v-if="item.type == 1" src="/static/images/icon/vip-icon.png" mode="widthFix" />
                    <view class="user-info">
                        <view class="user-name">{{item.nickname}}</view>
                        <view class="user-time">{{item.createTime}}</view>
                    </view>
                    <FollowBtn ref="followBtn" :item="followInfo" @followClick="followClick" v-if="userId != item.userId"></FollowBtn>
                </view>
                <view class="circle-cont">
                    <view class="circle-text">
                        {{item.info}}
                    </view>
                    <ImageCard :imgList="item.urls" v-if="item.urls.length > 0"></ImageCard>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
import ImageCard from "../ImageCard/ImageCard";
import FollowBtn from "../FollowBtn/FollowBtn";
import store from "../../store/index";
export default {
    props: {
        followInfo: {
            type: Object,
            default: null
        },
        item: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            scrollState: false,
            load: false
        };
    },
    computed: {
        userId() {
            return store.getters.getUserInfo == null
                ? null
                : store.getters.getUserInfo.userId;
        }
    },
    components: {
        ImageCard,
        FollowBtn
    },
    filter: {
        initTimer(val) {}
    },
    mounted() {
        console.log(this.item);
    },
    methods: {
        followShow() {
            this.$refs.followBtn.show();
        },
        followHide() {
            this.$refs.followBtn.hide();
        },
        hundleItem(item) {
            this.$emit("selectUser", item.userId);
        },
        followClick(item) {
            this.$emit("follow", item);
        }
    }
};
</script>
<style scoped>
.clrcle-detail {
    background: #ffffff;
    width: 750rpx;
}
.scroll-box {
    padding: 148rpx 25rpx 40rpx 25rpx;
}
.user {
    position: relative;
}
.user .teacher {
    position: absolute;
    width: 24rpx;
    left: 56rpx;
    top: 53rpx;
}
.user .avator {
    flex-shrink: 0;
    width: 76rpx;
    height: 76rpx;
    border-radius: 50%;
    margin-right: 25rpx;
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
.user-info .user-time {
    font-size: 22rpx;
    line-height: 22rpx;
    color: #868686;
}
.circle-text {
    font-size: 28rpx;
    color: #332b00;
    margin-top: 25rpx;
    margin-bottom: 18rpx;
    word-wrap: break-word;
}
.circle-talk {
    font-size: 28rpx;
    color: #332b00;
}
.user .button {
    width: 140rpx;
    height: 50rpx;
    border: 1rpx solid #332b00;
    color: #332b00;
    font-size: 26rpx;
    border-radius: 20rpx;
    text-align: center;
    line-height: 50rpx;
    margin-right: 4rpx;
}
</style>
