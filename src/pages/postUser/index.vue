<template>
    <view class="post-circle">
        <view>
            <view class="cancle" @click="navBack">取消</view>
            <textarea maxlength="100" :value="msg" class="textarea" placeholder="这一刻的想法..." @input="setMsg($event)"></textarea>
            <view class="img flex-row">
                <view class="img-box" v-for="item in previewImg" :key="item" @click="watchImg(item.url)">
                    <image :src="item.url" mode="aspectFill" v-if="previewImg.length > 0" />
                    <view class="bg" :style="{height:item.progress * 2 + 'px'}" v-if="item.progress < 100"></view>
                    <view class="text" v-if="item.progress < 100">{{item.progress}}%</view>
                    <image src="/static/images/icon/complate.png" mode="widthFix" class="complate" v-if="item.progress == 100" />
                    <view class="close flex-row" @click.stop="deleteImg(index,item.progress)">
                        <image src="/static/images/icon/close.png" mode="widthFix" />
                    </view>
                </view>
                <image class="upbtn" @click="upLoad" v-if="previewImg.length < 9" src="/static/images/icon/upload.jpg" mode="widthFix" />
            </view>
            <view class="btn-submit default-btn" @click="postCircle">发表</view>
        </view>
    </view>
</template>
<script>
import FixedTitle from "../../components/FixedTitle/FixedTitle";
import { showToast } from "../../utils/index";
import store from "../../store/index";
import config from "../../utils/config";
import http from "../../utils/http";
export default {
    data() {
        return {
            title: "发圈子",
            previewImg: [],
            msg: "",
            imgUrl: []
        };
    },
    components: {
        FixedTitle
    },
    computed: {
        userInfo() {
            return store.getters.getUserInfo;
        }
    },
    methods: {
        watchImg(current) {
            let urls = this.previewImg.map(item => {
                return item.url;
            });
            wx.previewImage({
                urls,
                current
            });
        },
        deleteImg(index, progress) {
            if (progress >= 100) {
                this.imgUrl.splice(index, 1);
            }
            this.previewImg.splice(index, 1);
        },
        setMsg(event) {
            this.msg = event.mp.detail.value;
        },
        postCircle() {
            if (this.msg == "") {
                wx.showModal({
                    content: "内容不能为空",
                    showCancel: false
                });
                return;
            }
            wx.showLoading({ title: "发表中" });
            let data = {
                info: this.msg,
                list: JSON.stringify(this.imgUrl),
                userid: this.userInfo.userId
            };
            http
                .post("circle/sendInfo", data)
                .then(res => {
                    wx.hideLoading();
                    if (res.status == 200) {
                        showToast("发表成功", "success", 800);
                        setTimeout(() => {
                            this.previewImg = [];
                            this.msg = "";
                            this.imgUrl = [];
                            store.commit("setPostTrue", true);
                            this.navBack();
                        }, 800);
                    } else {
                        showToast("发表失败", "none", 800);
                    }
                })
                .catch(() => {
                    showToast("网络出小差了", "none", 800);
                });
        },
        navBack() {
            wx.navigateBack();
        },
        upLoad() {
            let max = 9 - this.previewImg.length;
            this.selectImg(max);
        },
        uploadImg(filePath, index) {
            let that = this;
            const uploadTask = wx.uploadFile({
                url: config.host + "image/upload",
                filePath: filePath,
                name: "file",
                success: function(res) {
                    that.imgUrl[index] = JSON.parse(res.data).data;
                }
            });
            uploadTask.onProgressUpdate(res => {
                that.previewImg[index].progress = res.progress;
            });
        },
        selectImg(max) {
            let that = this;
            wx.chooseImage({
                count: max,
                success(res) {
                    let pro = [];
                    res.tempFilePaths.forEach(item => {
                        let len = that.previewImg.length;
                        that.previewImg.push({ url: item, progress: 0 });
                        that.uploadImg(item, len);
                    });
                }
            });
        }
    }
};
</script>
<style scoped>
.post-circle {
    height: 100vh;
    box-sizing: border-box;
    padding-top: 120rpx;
}
.textarea {
    margin: 0 auto;
    width: 680rpx;
    height: 230rpx;
    box-sizing: border-box;
    padding: 14rpx 18rpx;
    font-size: 30rpx;
    font-weight: 300;
}
.img-box {
    position: relative;
    /* border: 1rpx solid #cacaca; */
    width: 204rpx;
    height: 204rpx;
    overflow: hidden;
    margin: 6rpx;
}
.img-box .bg {
    font-size: 50rpx;
    width: 204rpx;
    background: rgba(0, 0, 0, 0.3);
    color: #ffffff;
    text-align: center;
    position: absolute;
    left: 1rpx;
    bottom: 1rpx;
    z-index: 3;
}
.img-box .text {
    width: 204rpx;
    height: 204rpx;
    text-align: center;
    line-height: 204rpx;
    position: absolute;
    color: #ffffff;
    left: 1rpx;
    bottom: 1rpx;
    z-index: 4;
}
.img-box .complate {
    width: 40rpx;
    position: absolute;
    left: 10rpx;
    bottom: 10rpx;
    background: #ffffff;
    border-radius: 50%;
}
.img {
    flex-wrap: wrap;
    justify-content: flex-start;
    width: 648rpx;
    margin: 0rpx auto;
}
.img image {
    display: block;
    width: 204rpx;
    height: 204rpx;
}
.img .upbtn {
    margin: 6rpx;
    width: 204rpx;
    height: 204rpx;
    border: 0;
}
.cancle {
    position: absolute;
    left: 28rpx;
    top: 60rpx;
    font-size: 30rpx;
    color: #332b00;
}
.img-box .close {
    position: absolute;
    right: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.3);
    text-align: center;
    width: 40rpx;
    height: 40rpx;
    border-radius: 0 0 0 6rpx;
    z-index: 999;
}
.img-box .close image {
    width: 20rpx;
}
</style>
