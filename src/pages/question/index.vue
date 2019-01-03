<template>
    <view class="taste">
        <FixedTitle :back="true" :title="thememTitle"></FixedTitle>
        <textarea maxlength="180" :value="msg" placeholder="请输入您的问题..." class="textarea" @input="setMsg($event)"></textarea>
        <view class="btn-submit default-btn" @click="postQuestion">提交</view>
    </view>
</template>
<script>
import FixedTitle from "../../components/FixedTitle/FixedTitle";
import store from "../../store/index";
import { showToast } from "../../utils/index";
import http from "../../utils/http";
export default {
    data() {
        return {
            thememTitle: "问题反馈",
            msg: ""
        };
    },
    computed: {
        interimUserId() {
            return store.getters.getInterimUserId;
        }
    },
    methods: {
        setMsg(event) {
            this.msg = event.mp.detail.value;
        },
        postQuestion() {
            if (this.msg == "") {
                showToast("内容不能为空", "none", 800);
                return;
            }
            http.post("suggest/addSuggest", {
                content: this.msg,
                userId: this.interimUserId
            })
                .then(res => {
                    if (res.status == 200) {
                        showToast("感谢您的反馈", "none", 800);
                    } else {
                        showToast("提交失败,请重试", "none", 800);
                    }
                })
                .catch(() => {
                    showToast("提交失败,请重试", "none", 800);
                });
        }
    },
    components: {
        FixedTitle
    }
};
</script>
<style scoped>
.taste {
    padding-top: 120rpx;
    min-height: 100vh;
    box-sizing: border-box;
    background: #f7f7f7;
}
.textarea {
    margin: 50rpx auto 0 auto;
    width: 690rpx;
    height: 340rpx;
    box-sizing: border-box;
    padding: 10rpx 18rpx;
    font-size: 30rpx;
    font-weight: 300;
    background: #ffffff;
    border-radius: 10rpx;
}
.btn-submit {
    width: 690rpx;
}
</style>
