<template>
  <view class="circle-img flex-row" :class="flexImg">
    <view class="img-cont" :class="{small:small,xsmall:xsmall}" v-for="img in imgList" :key="img">
      <image :src="img" mode="aspectFill" @click.stop="previewImg(img,imgList)" />
    </view>
  </view>
</template>
<script>
export default {
    props: {
        imgList: {
            type: Array,
            default: []
        },
        small: {
            type: Boolean,
            default: false
        },
        xsmall: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        previewImg(item, list) {
            wx.previewImage({
                current: item,
                urls: list
            });
        }
    },
    mounted() {},
    computed: {
        flexImg() {
            if (this.imgList == null) {
                return null;
            }
            let flex = "";
            let len = this.imgList.length;

            if (len == 1) {
                flex = "flex1";
            }
            if (len > 1) {
                flex = "flex2";
            }
            if (len > 4) {
                flex = "flex3";
            }

            return flex;
        }
    }
};
</script>
<style scoped>
.img-cont {
    box-sizing: border-box;
}
.circle-img {
    flex-wrap: wrap;
    justify-content: flex-start;
}
.circle-img.flex1 .img-cont {
    height: 700rpx;
    width: 100%;
}
.circle-img.flex1 .img-cont.small {
    height: 600rpx;
    width: 100%;
}
.circle-img.flex1 .img-cont.xsmall {
    height: 690rpx;
    width: 100%;
}
.circle-img.flex2 .img-cont {
    width: 50%;
    height: 350rpx;
    padding: 0 8rpx 8rpx 0rpx;
}
.circle-img.flex2 .img-cont.small {
    width: 50%;
    height: 300rpx;
    padding: 0 8rpx 8rpx 0rpx;
}
.circle-img.flex2 .img-cont.xsmall {
    width: 50%;
    height: 340rpx;
    padding: 0 8rpx 8rpx 0rpx;
}
.circle-img.flex2 .img-cont:nth-child(event) {
    padding-right: 0;
}
.circle-img.flex3 .img-cont {
    width: 33%;
    height: 233rpx;
    padding: 4rpx;
}
.circle-img.flex3 .img-cont.small {
    width: 33%;
    height: 186rpx;
    padding: 4rpx;
}
.circle-img.flex3 .img-cont.xsmall {
    width: 33%;
    height: 220rpx;
    padding: 4rpx;
}
.circle-img image {
    width: 100%;
    height: 100%;
    display: block;
}
</style>
