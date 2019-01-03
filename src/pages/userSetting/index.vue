<template>
    <view class="user-setting">
        <FixedTitle :back="true" :title="thememTitle"></FixedTitle>
        <view class="nav-item flex-row" @click="showPhone">
            <view class="nav-text">
                <text>手机绑定</text>
            </view>
            <view class="flex-row phone" v-if="phone != null">
                <image class="icon" mode="widthFix" src="/static/images/icon/clock.png" />
                <view>{{phone}}</view>
            </view>
            <view class="tishi" v-else></view>
            <image class="left-icon" mode="widthFix" src="/static/images/icon/left.png" />
        </view>
        <view class="phone-bg" @click="hidePhone" :class="{show:phoneState}">
            <view class="phone-poput" @click.stop="clickStop">
                <button open-type="getPhoneNumber" @getphonenumber="getphonenumber" class="default-btn" @click.stop="clickStop">一键绑定</button>
                <view class="phone-btn" @click.stop="navToPhoneModify">手动绑定</view>
            </view>
        </view>
        <Login ref="login"></Login>
    </view>
</template>
<script>
import FixedTitle from "../../components/FixedTitle/FixedTitle";
import Login from "../../components/Login/Login";
import { showToast } from "../../utils/index";
import store from "../../store/index";
import http from "../../utils/http.js";
import { hasLogin } from "../../store/getters";
export default {
    data() {
        return {
            thememTitle: "设置",
            phoneState: false
        };
    },
    components: {
        FixedTitle,
        Login
    },
    computed: {
        phone() {
            return store.getters.getUserPhone;
        },
        hasLogin() {
            return store.getters.hasLogin;
        },
        userInfo() {
            return store.getters.getUserInfo;
        }
    },
    methods: {
        clickStop() {},
        showPhone() {
            if (this.hasLogin) {
                this.phoneState = true;
            } else {
                this.$refs.login.show();
            }
        },
        hidePhone() {
            this.phoneState = false;
        },
        getphonenumber(e) {
            wx.showLoading({
                title: "获取中"
            });
            let encryptedData = e.mp.detail.encryptedData || false;
            if (encryptedData) {
                http.getPhone(e.mp.detail).then(res => {
                    if (res.status == 200 && res.data != null) {
                        let userId = this.userInfo.userId;
                        let phone = res.data.phoneNumber;

                        http.bindUserPhone(userId, phone);
                        this.hidePhone();
                    } else {
                        showToast("网络出小差了", "none", 800);
                    }
                });
            } else {
                showToast("需要您授权哦", "none", 800);
            }
        },
        navToPhoneModify() {
            let phone = this.phone == null ? "" : this.phone;
            this.hidePhone();
            wx.navigateTo({
                url: `/pages/phoneModify/main?phone=${phone}`
            });
        }
    }
};
</script>
<style scoped>
.phone-bg {
    position: fixed;
    width: 100%;
    top: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 99;
    transform: translateY(-100%);
    transition: all 0s ease 0.3s;
}
.phone-bg.show {
    transition: all 0s ease 0s;
    transform: translateY(0);
}
.phone-poput {
    position: absolute;
    text-align: center;
    left: 50%;
    top: 50%;
    background: #ffffff;
    width: 580rpx;
    height: 280rpx;
    margin-left: -275rpx;
    margin-top: -270rpx;
    border-radius: 20rpx;
    transform: scale(0);
    opacity: 0;
    transition: all 0.3s ease;
}
.phone-bg.show .phone-poput {
    transform: scale(1);
    opacity: 1;
}
.default-btn {
    margin: 70rpx auto 0 auto;
    width: 480rpx;
    font-size: 30rpx;
    border-radius: 60rpx;
}
.phone-btn {
    margin-top: 34rpx;
    font-size: 26rpx;
    color: #868686;
}
.user-setting {
    background: #f7f7f7;
    min-height: 100vh;
    box-sizing: border-box;
    padding-top: 150rpx;
}
.nav-item {
    padding: 0 40rpx 0 40rpx;
    height: 80rpx;
    border-top: 1rpx solid #eaeaea;
    border-bottom: 1rpx solid #eaeaea;
    background: #ffffff;
}
.nav-item .nav-text {
    flex-grow: 1;
    font-size: 29rpx;
    color: #332b00;
}
.nav-item .left-icon {
    width: 24rpx;
    flex-shrink: 0;
    display: block;
}
.tishi {
    width: 16rpx;
    height: 16rpx;
    border-radius: 50%;
    background: #f33d43;
    margin-right: 20rpx;
}
.phone {
    font-size: 28rpx;
    color: #868686;
    margin-right: 21rpx;
}
.phone .icon {
    width: 30rpx;
    margin-right: 8rpx;
}
</style>
