<template>
    <view class="map">
        <FixedTitle :back="true" :title="themeTitle"></FixedTitle>
        <video class="video" :src="detail.url" v-if="detail != null"></video>
        <view class="load-cont" :class="{show:firstLoad}">
            <block v-if="detail != null">
                <scroll-view class="scroll-box" :scroll-y="true">
                    <view class="content">
                        <view class="info">
                            <view class="info-title">{{detail.name}}</view>
                            <view class="info-text">{{detail.gymInfo}}</view>
                        </view>
                        <view class="info">
                            <view class="flex-row title">
                                <view class="text">健康有效</view>
                                <view class="text">面积1000㎡</view>
                                <view class="text">可容纳300人</view>
                            </view>
                            <view class="flex-row timer">
                                <image class="time" src="/static/images/icon/timer.jpg" mode="widthFix" />
                                <view>
                                    <text>12:30至凌晨02:00营业</text>
                                </view>
                            </view>
                        </view>
                        <view class="info flex-row noborder">
                            <view class="address-icon" @click="openMap">
                                <image class="address" src="/static/images/icon/localtion.png" mode="widthFix" />
                            </view>
                            <view class="address-text" @click="openMap">{{detail.position}}</view>
                            <view class="phone" @click="makePhoneCall">
                                <image class="img" src="/static/images/icon/phone.png" mode="widthFix" />
                            </view>
                        </view>
                    </view>
                    <view class="img-cont">
                        <view class="card-title flex-row">
                            <view class="left-icon"></view>
                            <view class="text">
                                <text>店内环境</text>
                            </view>
                            <view class="more" @click="openMap" v-if="!hideMore">
                                <image class="more-img" src="/static/images/icon/more.png" mode="widthFix" />
                            </view>
                        </view>
                        <view class="img-list flex-row">
                            <image v-for="item in detail.images" :src="item" :key="item" @click="previewImg(item)" mode="aspectFill" />
                        </view>
                    </view>
                </scroll-view>
                <view class="fixed-icon" @click="openMap">
                    <image class="more-img" src="/static/images/icon/map.png" mode="widthFix" />
                </view>
            </block>
        </view>

        <Vloading :state="!firstLoad"></Vloading>
    </view>
</template>

<script>
import FixedTitle from "../../components/FixedTitle/FixedTitle";
import Vloading from "../../components/Loading/Loading";
import Swiper from "../../components/Swiper/Swiper";
import http from "../../utils/http";
import store from '../../store/index'
export default {
    data() {
        return {
            themeTitle: "秀动健身",
            bannerData: [],
            detail: null,
            location: null,
            firstLoad: false
        };
    },
    onLoad() {},
    mounted() {
        this.getLocation();
    },
    components: {
        FixedTitle,
        Swiper,
        Vloading
    },
    computed:{
        wechat() {
            return store.getters.getWeChatData;
        }
    },
    methods: {
        previewImg(current) {
            wx.previewImage({
                current,
                urls: this.detail.images
            });
        },
        makePhoneCall() {
            wx.makePhoneCall({
                phoneNumber: this.wechat.phone
            });
        },
        openMap() {
            if (this.location != null) {
                wx.openLocation(this.location);
            } else {
                showToast("请重试", "none", 800);
            }
        },
        getLocation() {
            http.post("gym/queryGym").then(res => {
                if (res.status == 200 && res.data != null) {
                    res.data.images = res.data.images.map(item => {
                        return item.url;
                    });
                    this.location = {
                        latitude: new Number(res.data.latitude),
                        longitude: new Number(res.data.longitude),
                        name: res.data.name,
                        address: res.data.position
                    };
                    this.detail = res.data;
                    this.firstLoad = true
                }
            });
        }
    }
};
</script>

<style scoped>
.map {
    padding-top: 120rpx;
}
.content {
    padding: 0 40rpx 0 40rpx;
    background: #ffffff;
}
.img-cont {
    padding: 0 40rpx;
    margin-top: 30rpx;
    background: #ffffff;
    padding-bottom: 30rpx;
}
.info {
    padding: 30rpx 0rpx;
    border-bottom: 1rpx solid #eaeaea;
}
.info.noborder {
    border: 0;
}
.info .info-title {
    font-size: 34rpx;
    line-height: 34rpx;
    color: #332b00;
}
.info .info-text {
    font-size: 24rpx;
    margin-top: 16rpx;
    color: #868686;
}
.video {
    position: fixed;
    top: 120rpx;
    width: 750rpx;
    left: 0;
    height: 494rpx;
}
.title {
    justify-content: flex-start;
}
.title .text {
    font-size: 27rpx;
    color: #332b00;
    padding: 0 22rpx;
    line-height: 27rpx;
    border-right: 1rpx solid #cacaca;
}
.title .text:first-child {
    padding-left: 0;
}
.title .text:last-child {
    border: 0;
}
.timer {
    justify-content: flex-start;
    font-size: 24rpx;
    color: #868686;
    margin-top: 18rpx;
}
.time {
    width: 34rpx;
    margin-right: 6rpx;
}
.address-icon {
    width: 46rpx;
    padding-right: 10rpx;
}
.address-icon .address {
    width: 46rpx;
    display: block;
}
.address-text {
    flex-grow: 1;
    color: #332b00;
    font-size: 28rpx;
    border-right: 1rpx solid #eaeaea;
}
.phone {
    width: 120rpx;
    text-align: center;
}
.phone .img {
    width: 38rpx;
}
.img-list {
    flex-wrap: wrap;
}
.img-list image {
    width: 330rpx;
    height: 240rpx;
    display: block;
    margin-bottom: 10rpx;
}
.img-list image:nth-child(odd) {
    margin-right: 10rpx;
}
.card-title {
    padding: 24rpx 0;
    font-size: 30rpx;
    color: #362b00;
    position: relative;
    line-height: 30rpx;
    justify-content: flex-start;
}
.card-title .text {
    flex-grow: 1;
}
.left-icon {
    width: 4rpx;
    background: #ffd500;
    height: 33rpx;
    margin-right: 14rpx;
}
.more {
    padding: 8rpx 0rpx 8rpx 8rpx;
}
.more-img {
    width: 32rpx;
}
.scroll-box {
    position: fixed;
    top: 614rpx;
    bottom: 0rpx;
    width: 750rpx;
    background: #f7f7f7;
}
.fixed-icon {
    width: 90rpx;
    padding: 10rpx;
    position: fixed;
    bottom: 60rpx;
    right: 30rpx;
}
.fixed-icon image {
    width: 90rpx;
}
</style>
