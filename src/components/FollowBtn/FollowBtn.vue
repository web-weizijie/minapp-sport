<template>
    <view class="button flex-row" @click.stop="follow">
        <image class="add" v-if="!loading && !item.state" mode="widthFix" src="/static/images/icon/add.png" />
        <text v-if="!loading && !item.state">关注</text>
        <image class="load-gif" mode="widthFix" src="/static/images/icon/loading.png" v-if="loading" />
        <image class="add" v-if="!loading && item.state" mode="widthFix" src="/static/images/icon/follow.png" />
        <text v-if="!loading && item.state">已关注</text>
    </view>
</template>
<script>
export default {
    props: {
        item: {
            type: Object,
            default: () => {
                return {};
            }
        },
        index: {
            type: Number
        }
    },
    data() {
        return {
            loading: false
        };
    },
    mounted() {},
    methods: {
        follow() {
            this.$emit("followClick", this.item);
        },
        show() {
            this.loading = true;
        },
        hide() {
            this.loading = false;
        }
    }
};
</script>

<style scoped>
.button {
    width: 130rpx;
    height: 49rpx;
    border: 1rpx solid #332b00;
    color: #332b00;
    font-size: 26rpx;
    border-radius: 20rpx;
    text-align: center;
    line-height: 49rpx;
    margin-right: 4rpx;
}
.button .load-gif {
    animation: loading 1.2s linear infinite;
    width: 26rpx;
    display: block;
}
.button .add {
    width: 30rpx;
    margin-right: 4rpx;
}
@keyframes loading {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>
