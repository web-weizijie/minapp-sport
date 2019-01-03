<template>
    <view @touchmove.stop="stopClick" class="teacher-video" v-show="boxHide" :class="{show:hide}" @click="hideVideo">
        <video autoplay class="video" @touchmove.stop="stopClick" :src="url" v-if="hide" @click.stop="stopClick"></video>
    </view>
</template>
<script>
export default {
    props: {
        url: {
            type: String,
            default: ""
        }
    },
    data() {
        return {
            hide: false,
            boxHide: false
        };
    },
    watch: {
        hide(val) {
            if (!val) {
                setTimeout(() => {
                    this.boxHide = false;
                }, 400);
            }else{
                this.boxHide = true;
            }
        }
    },
    methods: {
        stopClick() {},
        hideVideo() {
            this.hide = false;
        },
        showVideo() {
            this.hide = true;
        }
    }
};
</script>
<style scoped>
.teacher-video {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    width: 750rpx;
    background: rgba(0, 0, 0, 0.4);
    z-index: 999;
    opacity: 0;
    transition: all 0.3s ease 0.1s;
}
.teacher-video.show {
    opacity: 1;
}
.teacher-video .video {
    width: 750rpx;
    height: 494rpx;
    position: absolute;
    top: 50%;
    transform: translateY(-60%);
}
</style>
