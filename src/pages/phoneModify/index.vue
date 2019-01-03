<template>
    <view class="user-setting">
        <FixedTitle :back="true" :title="thememTitle"></FixedTitle>
        <input maxlength="11" :value="phoneNum" class="input" type="text" placeholder="请输入手机号" @blur="setPhone($event)">
        <view class="default-btn" @click="modifyPhone">确认修改</view>
    </view>
</template>
<script>
import FixedTitle from "../../components/FixedTitle/FixedTitle";
import http from "../../utils/http";
import store from "../../store/index";
import { showToast } from "../../utils/index";
export default {
    data() {
        return {
            thememTitle: "手机绑定",
            phoneNum: ""
        };
    },
    onLoad(options) {
        if (options.phone != null && options.phone != "") {
            this.phoneNum = options.phone;
        }
    },
    computed: {
        userInfo() {
            return store.getters.getUserInfo;
        }
    },
    methods: {
        modifyPhone() {
            let reg = /^[1][3,4,5,7,8][0-9]{9}$/;
            if (!reg.test(this.phoneNum)) {
                showToast("手机号码格式错误", "none", 800);
                return;
            }
            http.bindUserPhone(this.userInfo.userId, this.phoneNum, true);
        },
        setPhone(e) {
            let num = e.mp.detail.value;
            let reg = /^[1][3,4,5,7,8][0-9]{9}$/;
            if (!reg.test(num)) {
                showToast("手机号码格式错误", "none", 800);
            }
            this.phoneNum = num;
        }
    },
    components: {
        FixedTitle
    }
};
</script>
<style scoped>
.user-setting {
    background: #f7f7f7;
    min-height: 100vh;
    box-sizing: border-box;
    padding-top: 160rpx;
}
.input {
    color: #332b00;
    height: 90rpx;
    line-height: 90rpx;
    background: #ffffff;
    font-size: 28rpx;
    box-sizing: border-box;
    padding: 0 36rpx;
    border-top: 1rpx solid #eaeaea;
    border-bottom: 1rpx solid #eaeaea;
}
.default-btn {
    width: 678rpx;
    border-radius: 60rpx;
}
</style>
