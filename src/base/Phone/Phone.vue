<template>
    <view class="phone" v-if="wechat != null" @click="makePhoneCall">
        <image class="img" src="/static/images/icon/icon-phone.png" mode="widthFix" />
    </view>
</template>
<script>
import store from "../../store/index";
export default {
    props: {
        phone: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {};
    },
    methods: {
        makePhoneCall() {
            wx.makePhoneCall({
                phoneNumber: this.wechat.phone
            });
        }
    },
    computed: {
        wechat() {
            return store.getters.getWeChatData;
        }
    }
};
</script>
<style scoped>
.phone {
    position: fixed;
    bottom: 50rpx;
    right: 40rpx;
}
.phone .img {
    width: 90rpx;
}
</style>
