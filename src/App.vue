<script>
import store from "./store/index";
import http from "./utils/http";
export default {
    mounted() {
        store.dispatch("getStorageUserInfo");
        store.dispatch("getStorageSaleId");
        store.dispatch("getStorageInterimUserId");
        store.dispatch("getStorageUserPhone");
        store.dispatch("getStorageNewClassId");
        store.dispatch("getStorageNewMsgTime")
    }
};
</script>

<style>
.load-cont {
    opacity: 0;
    transition: all 0.2s linear 0s;
}
.load-cont.show {
    opacity: 1;
}
view,
text,
textarea {
    word-wrap: break-word;
    font-weight: 300;
    font-family: Helvetica Neue, Hiragino Sans GB, Microsoft Yahei,
        WenQuanYi Micro Hei, sans-serif;
}
button {
    border: 0;
    font-size: inherit;
    background: transparent;
    border-radius: inherit;
    color: inherit;
}
button::after {
    border: 0;
}
.container {
    width: 750rpx;
    min-height: 100vh;
    background: url("https://dootip.cn/xiudong/image/new-container-bg.png")
        no-repeat left top;
    background-size: 750rpx 440rpx;
}
.top-title {
    height: 160rpx;
    box-sizing: border-box;
    color: #261a04;
    font-weight: 600;
    padding: 75rpx 0rpx 0rpx 50rpx;
    font-size: 46rpx;
}
.card-space {
    padding-top: 52rpx;
}
.flex-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}
.h2 {
    color: #292001;
    font-size: 35rpx;
}
.load-more {
    padding-bottom: 30rpx;
    text-align: center;
    font-size: 24rpx;
    color: #868686;
    opacity: 0.8;
}
.load-more image {
    animation: loading 1.2s linear infinite;
    width: 32rpx;
    display: block;
    margin: 0rpx auto;
}
@keyframes loading {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
.default-btn {
    width: 640rpx;
    height: 90rpx;
    line-height: 90rpx;
    margin: 100rpx auto 0 auto;
    border-radius: 18rpx;
    color: #332b00;
    font-size: 34rpx;
    text-align: center;
    background: #ffdf3f;
}
.empty-box {
    width: 750rpx;
    position: fixed;
    top: 0;
    bottom: 0;
}
.filter {
    filter: blur(26rpx);
}
</style>
