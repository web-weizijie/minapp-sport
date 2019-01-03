<template>
    <view class="message-cont" @touchmove.stop="clickStop" :class="{show:state}" @click="cancel">
        <view class="message" @touchmove.stop="clickStop" @click.stop="clickStop">
            <textarea maxlength="100" :value="val" @confirm="postMsg($event)" @blur="textVal($event)" name="" id="" placeholder="写评论" cursor-spacing="20" :focus="focus" :fixed="true" :adjust-position="true"></textarea>
            <view class="btn flex-row">
                <view class="send" @click.stop="postMsg">发表</view>
                <view class="cancle" @click="cancel">取消</view>
            </view>
        </view>
    </view>

</template>
<script>
import { showToast } from "../../utils/index";
export default {
    props: ["state"],
    data() {
        return {
            focus: false,
            val: ""
        };
    },
    methods: {
        clickStop() {},
        selectUser(name) {
            this.val = `@${name} `;
        },
        cancel() {
            this.$emit("hidePage");
        },
        close() {
            this.focus = false;
            setTimeout(() => {
                this.val = "";
            }, 100);
        },
        postMsg(event = null) {
            this.focus = false;
            setTimeout(() => {
                if (this.val == "") {
                    showToast("内容不能为空", "none", 800);
                    return;
                }
                this.$emit("msgInfo", this.val);
            }, 100);
        },
        textVal(event) {
            let val = event.mp.detail.value;
            if (this.val != val) {
                this.val = val;
            }
        }
    },
    watch: {
        state(val) {
            if (val) {
                setTimeout(() => {
                    this.focus = true;
                }, 350);
            }
        }
    }
};
</script>
<style scoped>
.message-cont {
    position: fixed;
    top: 0;
    width: 750rpx;
    left: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 999;
    transition: all 0s ease 0.3s;
    transform: translateX(100%);
}
.message-cont.show {
    transform: translateX(0);
    transition: all 0s ease 0s;
}
.message {
    position: absolute;
    width: 660rpx;
    height: 360rpx;
    border-radius: 14rpx;
    left: 50%;
    margin-left: -330rpx;
    background: #f9f9f9;
    padding: 25rpx;
    box-sizing: border-box;
    top: 0;
    transform: translateY(-100%);
    transition: all 0.3s ease;
}
.message-cont.show .message {
    top: 20vh;
    transform: translateY(0);
}
.message textarea {
    padding: 10rpx 15rpx;
    box-sizing: border-box;
    font-size: 28rpx;
    color: #332b00;
    background: #ffffff;
    border-radius: 8rpx;
    height: 240rpx;
    width: 610rpx;
    border: 1rpx solid #e5e5e5;
}
.btn {
    font-size: 32rpx;
    justify-content: flex-end;
    margin-top: 20rpx;
}
.btn .send {
    color: #332b00;
    margin-right: 40rpx;
}
.btn .cancle {
    color: #cccccc;
    margin-right: 20rpx;
}
</style>
