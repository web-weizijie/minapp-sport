<template>
    <view>
        <view class="user-circle" v-for="item in list" :key="item">
            <view class="user-circle-cont" @click="clickCircle(item)">
                <view class="circle-top flex-row">
                    <view class="circle-user">
                        <image class="avatar" :src="item.avatar_url" />
                        <image class="teacher" v-if="item.type == 1" src="/static/images/icon/vip-icon.png" mode="widthFix" />
                    </view>
                    <view class="circle-user-info">
                        <view class="circle-title">{{item.nickname}}</view>
                        <view class="circle-time">{{item.createTime}}</view>
                    </view>
                    <view class="follow">
                        <FollowBtn :item="item" :ref="'followBtn' + index" @followClick="followClick" v-if="userId != item.userId"></FollowBtn>
                    </view>
                </view>
                <view class="circle-info">{{item.info}}</view>
                <ImageCard :xsmall="true" :imgList="item.urls" v-if="item.urls.length > 0"></ImageCard>
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
import FollowBtn from "../FollowBtn/FollowBtn";
import store from "../../store/index";
export default {
    props: ["list"],
    data() {
        return {
            showIndex: null,
            idx: 0
        };
    },
    mounted() {
        console.log(this.list);
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
    methods: {
        followHide() {
            this.$refs[this.idx][0].hide();
        },
        followShow() {
            this.$refs[this.idx][0].show();
        },
        followClick(item) {
            this.list.forEach((ele, index) => {
                if (ele.id == item.id) {
                    console.log(index, "index");
                    this.idx = "followBtn" + index;
                }
            });
            this.$emit("userfollow", item);
        },
        clickCircle(item, event, index) {
            this.showIndex = index;
            this.$emit("getCircleInfo", item);
        },
        userLike(item) {
            console.log(item);
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
    align-items: flex-start;
    padding: 30rpx 30rpx 10rpx 30rpx;
    background: #ffffff;
    border-bottom: 1rpx solid #eaeaea;
    border-top: 1rpx solid #eaeaea;
}
.circle-title {
    font-size: 28rpx;
    color: #332b00;
    line-height: 28rpx;
    margin-top: -14rpx;
}
.circle-info {
    font-size: 28rpx;
    color: #332b00;
    margin-top: 12rpx;
    margin-bottom: 12rpx;
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
}
.circle-time {
    line-height: 22rpx;
    font-size: 22rpx;
    color: #868686;
    margin-top: 14rpx;
    word-break: break-all;
}
.tab {
    margin-right: 14rpx;
    margin-top: 28rpx;
    justify-content: flex-end;
    font-size: 23rpx;
    color: #332b00;
}
.tab .tab-like {
    margin-right: 50rpx;
    padding: 20rpx;
}
.tab image {
    width: 38rpx;
    margin-right: 8rpx;
    display: block;
}
.circle-user {
    padding-right: 22rpx;
    flex-shrink: 0;
    position: relative;
}
.circle-user .teacher {
    position: absolute;
    width: 24rpx;
    right: 22rpx;
    bottom: 8rpx;
}
.circle-user .avatar {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
}
.user-circle-cont .circle-user-info {
    box-sizing: border-box;
    flex-grow: 1;
}
</style>
