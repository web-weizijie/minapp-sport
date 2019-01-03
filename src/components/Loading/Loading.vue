<template>
    <view class="loading-box" :class="{show:state}" v-if="hide">
        <view class="v-loading">
            <image src="/static/images/icon/newloading.png" mode="widthFix" />
        </view>
    </view>
</template>
<script>
export default {
    props: ["state"],
    data() {
        return {
            hide: true
        };
    },
    mounted() {},
    watch: {
        state(val) {
            if (!val) {
                setTimeout(() => {
                    this.hide = false;
                }, 400);
            } else {
                this.hide = true;
            }
        }
    }
};
</script>
<style scoped>
.loading-box {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    width: 750rpx;
    z-index: 98;
}
.loading-box.show {
}
.v-loading {
    position: absolute;
    top: 30vh;
    left: 50%;
    transform: translateX(-50%);
    width: 50rpx;
    border-radius: 50%;
    height: 50rpx;
    padding: 28rpx;
}
.v-loading image {
    width: 50rpx;
    display: block;
    animation: load 0.9s linear infinite;
}
@keyframes load {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>
