<template>
    <view>
        <swiper class="banner" :autoplay="true" next-margin="28rpx" previous-margin="48rpx" circular="true">
            <swiper-item v-for="item in list" :key="item">
                <image :src='item.imgUrl' mode="aspectFill" alt="" />
            </swiper-item>
        </swiper>
    </view>
</template>
<script>
export default {
    props: ["list"]
};
</script>
<style scoped>
.banner {
    width: 750rpx;
    height: 420rpx;
}
.banner image {
    width: 650rpx;
    height: 420rpx;
    border-radius: 22rpx;
    display: block;
}
</style>