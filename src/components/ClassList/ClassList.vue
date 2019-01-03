<template>
    <view class="class-list">
        <view class="class" v-for="item in list" :key="item">
            <image class="img" :src="item.url" mode="aspectFill" />
            <view class="title">{{item.info}}</view>
            <!-- <view class="info">
                <text>瑜伽一天体验瑜伽一天体验瑜伽一天体验瑜伽一天体验瑜伽一天体验瑜伽一天体验瑜伽一天体验</text>
            </view> -->
            <view class="class-btm flex-row" v-if="!isUser">
                <view class="user flex-row" v-if="item.tUserList">
                    <block v-for="(user,idx) in item.tUserList" :key="idx">
                        <image v-if="idx <= 3" class="user-img" :src="user.avatarUrl" />
                    </block>
                </view>
            </view>
            <view class="class-bm" v-if="!isUser">
                <view class="class-time">
                    距离活动结束还剩
                    <text>{{item.countDay}}</text>天
                </view>
                <view class="class-time">
                    已有
                    <text>{{item.userSinUpNumber}}</text>人报名
                </view>
            </view>
            <block v-if="!isUser">
                <view class="btn end" @click="submit(item)" v-if="item.state == 1 || item.isEnd">{{item.isEnd?"已过期":"已报名"}}</view>
                <block v-else>
                    <button @click="setItem(item)" v-if="phone == null" class="btn" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">报名</button>
                    <view v-else class="btn" @click="submit(item)">报名</view>
                </block>
            </block>
            <block v-else>
                <view class="btn end"  v-if="item.status == 1 || item.isEnd">{{item.status!=1?"已过期":"已使用"}}</view>
                <view v-else class="btn">未使用</view>
            </block>
        </view>
    </view>
</template>
<script>
import store from "../../store/index";
import http from "../../utils/http";
import { showToast } from "../../utils/index";
export default {
    props: {
        list: {
            type: Array,
            default: []
        },
        isUser: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        hasLogin() {
            return store.getters.hasLogin;
        },
        phone() {
            return store.getters.getUserPhone;
        },
        userInfo() {
            return store.getters.getUserInfo;
        },
        interimUserId() {
            return store.getters.getInterimUserId;
        }
    },
    mounted() {
        console.log(this.phone);
    },
    methods: {
        setItem(item) {
            this.item = item;
        },
        getPhoneNumber(e) {
            let encryptedData = e.mp.detail.encryptedData || false;
            if (encryptedData) {
                http.getPhone(e.mp.detail)
                    .then(res => {
                        if (res.data != null) {
                            let userId = this.interimUserId;
                            let phone = res.data.phoneNumber;

                            http.bindUserPhone(userId, phone, false, () => {
                                this.$emit("submitEvent", this.item);
                            });
                        } else {
                            showToast("网络出小差了", "none", 800);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            } else {
                showToast("需要您授权哦", "none", 800);
            }
        },
        submit(item) {
            this.$emit("submitEvent", item);
        }
    }
};
</script>
<style scoped>
.class {
    background: #ffffff;
    width: 690rpx;
    border-radius: 10rpx;
    box-shadow: 0 10rpx 20rpx #f0f0f0;
    margin: 58rpx auto;
    overflow: hidden;
    position: relative;
}
.class .img {
    width: 690rpx;
    height: 420rpx;
    border-radius: 10rpx 10rpx 0 0;
    display: block;
}
.class .title {
    margin: 26rpx 30rpx 20rpx 30rpx;
    font-size: 32rpx;
    color: #332b00;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
}
.class .info {
    padding: 0rpx 30rpx;
    font-size: 25rpx;
    color: #868686;
}
.class-btm {
    padding: 32rpx 30rpx 12rpx 30rpx;
    justify-content: space-between;
}
.class .btn {
    margin-top: 36rpx;
    background: #ffdf3f;
    width: 690rpx;
    height: 96rpx;
    line-height: 96rpx;
    text-align: center;
    font-size: 32rpx;
    color: #332b00;
    border-radius: 0;
}
.class .btn.end {
    background: #cccccc;
    color: #ffffff;
}
.user {
    justify-content: flex-start;
    height: 76rpx;
}
.user .user-img:first-child {
    transform: translateX(0);
}
.user .user-img {
    border-radius: 50%;
    border: 5rpx solid #ffffff;
    width: 68rpx;
    height: 68rpx;
    box-shadow: 0 5rpx 8rpx #dddddd;
    margin-right: 4rpx;
}
.class-bm {
    text-align: right;
    position: absolute;
    right: 28rpx;
    bottom: 142rpx;
    font-size: 25rpx;
    color: #332b00;
}
.class-time text {
    font-weight: 400;
    font-size: 34rpx;
    color: #ff7d42;
    padding: 0 4rpx;
}
</style>
