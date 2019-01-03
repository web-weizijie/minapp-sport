<template>
    <view class="user-list">
        <scroll-view class="scroll" :scroll-x="true">
            <view class="user-list-cont flex-row" :style="{width:width+'rpx'}">
                <view class="user-item" v-for="item in list" :key="item" @click="userClick(item)">
                    <image class="img" :src="item.avatarUrl" />
                    <image class="teacher" v-if="item.type == 1" src="/static/images/icon/vip-icon.png" mode="widthFix" />
                    <view>
                        <text>{{item.nickname}}</text>
                    </view>
                </view>
            </view>
        </scroll-view>
    </view>
</template>

<script>
export default {
    props: {
        list: {
            type: Array,
            default: []
        }
    },
    data() {
        return {};
    },
    mounted() {
        console.log(this.list);
    },
    components: {},
    computed: {
        width() {
            return this.list.length * 135;
        }
    },
    methods: {
        userClick(item) {
            this.$emit("hundleClick", item);
        }
    },

    created() {}
};
</script>

<style scoped>
.scroll {
    width: 750rpx;
    margin-bottom: 16rpx;
}
.user-list-cont {
    padding: 16rpx 30rpx;
    justify-content: flex-start;
}
.user-item {
    width: 110rpx;
    height: 150rpx;
    margin-right: 30rpx;
    border-radius: 50%;
    font-size: 22rpx;
    color: #332b00;
    text-align: center;
    position: relative;
}
.user-item .img {
    width: 110rpx;
    height: 110rpx;
    display: block;
    border-radius: 50%;
    box-shadow: 0 6rpx 14rpx #cccccc;
    margin-bottom: 10rpx;
}
.user-item .teacher {
    width: 28rpx;
    position: absolute;
    top: 84rpx;
    right: 0rpx;
}
</style>
