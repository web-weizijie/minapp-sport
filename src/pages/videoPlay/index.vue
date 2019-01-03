<template>
    <view>
        <view class="load-cont" :class="{show:videoDetail!=null}">
            <block v-if="videoDetail != null">
                <video :class="{hide:state}" id="player" :show-center-play-btn="videoBtn" @fullscreenchange="screen" :src="videoDetail.url" class="video">
                    <cover-view class="back" @click="back" v-if="!fullScreen">
                        <cover-image mode="widthFix" src="/static/images/icon/white-back.png" />
                    </cover-view>
                    <cover-view class="video-play" @click="play" v-if="playBtn">
                        <cover-image class="image" mode="widthFix" src="/static/images/icon/video.png" />
                    </cover-view>
                </video>
                <scroll-view @scrolltolower="getCommentFloorList" :scroll-y="true" class="load-cont" :class="{show:load}">
                    <view class="content">
                        <!-- <view class="user flex-row">
                            <view class="avator">
                                <image src="http://47.104.18.114/sport/images/2_47.png" />
                            </view>
                            <view class="name">
                                Lucy Endery
                            </view>
                            <view class="button">
                                关注
                            </view>
                        </view> -->
                        <view class="video-info">
                            <view class="info-title">{{videoDetail.name}}</view>
                            <!-- <view class="info-text">37 min</view> -->
                            <view class="info-cont" :class="{show:msgState,hidebtn:!btnState}">
                                <text>{{videoDetail.courseInfo}}</text>
                                <view class="info-more flex-row" @click="showMsg" v-if="btnState">
                                    <view>{{msgState?"收起":"展开"}}</view>
                                    <image :class="{show:msgState}" src="/static/images/icon/back.png" mode="widthFix" />
                                </view>
                            </view>
                            <view class="tab flex-row">
                                <view class="tab-like flex-row">
                                    <image src="/static/images/icon/like.jpg" mode="widthFix" />
                                    <text>{{videoDetail.zanNumber}}</text>
                                </view>
                                <view class="tab-msg flex-row">
                                    <image src="/static/images/icon/msg.jpg" mode="widthFix" />
                                    <text>{{videoDetail.commentNumber}}</text>
                                </view>
                            </view>
                        </view>
                    </view>
                    <view class="card-space">
                        <Card-list :padding="42" title="其他训练" :list="cardData" v-if="cardData.length > 0" @getMoreEvent="getMoreEvent" @hundleVideo="hundleItem"></Card-list>
                    </view>
                    <view class="total-box">
                        <TotalList :totalComment="totalComment" :list="circleItem" @hundleUser="hundleUser" v-if="circleItem.length > 0"></TotalList>
                    </view>
                    <view class="card-sapce"></view>
                    <view class="load-more" v-show="loaded || loading">
                        <view v-show="!loaded" mode="widthFix">
                            <image src="/static/images/icon/loading.png" mode="widthFix" />
                        </view>
                        <view v-show="loaded">
                            <text>已到底</text>
                        </view>
                    </view>
                </scroll-view>
            </block>
            <Login ref="login" @loginSuccess="loginSuccess"></Login>
            <UserHandle :bZan="bZan" @userTotalEvent="showMessage" @userLikeEvent="userCircleLike"></UserHandle>
            <Message :state="state" ref="msg" @hidePage="hidePage" @msgInfo="msgInfo"></Message>
        </view>
        <VLoading :state="!load"></VLoading>
    </view>
</template>

<script>
import UserHandle from "../../base/UserHandle/UserHandle";
import Message from "../../components/Message/Message";
import TotalList from "../../components/TotalList/TotalList";
import FixedTitle from "../../components/FixedTitle/FixedTitle";
import CardList from "../../components/CardList/CardList";
import VLoading from "../../components/Loading/Loading";
import Login from "../../components/Login/Login";
import { showToast, formatTime, firstRegistier } from "../../utils/index.js";
import store from "../../store/index";
import http from "../../utils/http";
import { hasLogin } from "../../store/getters";
export default {
    data() {
        return {
            thememTitle: "视频",
            cardData: [],
            msgState: false,
            videoBtn: false,
            videoContext: null,
            playBtn: true,
            fullScreen: false,
            id: null,
            videoDetail: null,
            load: false,
            state: false,
            circleItem: [],
            loaded: false,
            loading: false,
            page: 1,
            totalComment: 0,
            bZan: false,
            likeState: false,
            isShare:0
        };
    },
    mounted() {
        this.getVideoDetail();
        this.getVideoList();
        this.getCommentFloorList();
        if (this.hasLogin) {
            this.getCommunityInfo();
        }
    },
    computed: {
        getUserInfo() {
            return store.getters.getUserInfo;
        },
        hasLogin() {
            return store.getters.hasLogin;
        },
        userId() {
            return store.getters.getUserInfo == null
                ? null
                : store.getters.getUserInfo.userId;
        },
        btnState() {
            if (this.videoDetail != null) {
                return this.videoDetail.courseInfo.length > 70;
            }
        },
        saleId() {
            return store.getters.getSaleId;
        }
    },
    components: {
        CardList,
        VLoading,
        TotalList,
        Message,
        UserHandle,
        Login
    },
    onLoad(options) {
        this.isShare = options.isShare || 0;
        this.id = options.id;

        let saleId = options.saleId || null;
        firstRegistier(saleId);
    },
    onUnload() {
        this.initData();
        this.videoDetail = null;
        this.load = true;
        this.cardData = [];
        this.load = false;
    },
    onShareAppMessage() {
        let path = `/pages/videoPlay/main?id=${this.id}&isShare=1&saleId=${
            this.saleId
        }`;
        return {
            title: this.videoDetail.name,
            imageUrl: this.videoDetail.cover,
            path
        };
    },
    methods: {
        hundleUser(item) {
            this.showMessage(item.userName);
        },
        showMessage(name = null) {
            if (!this.hasLogin) {
                this.$refs.login.show();
                return;
            }
            if (name != null && typeof name == "string") {
                this.$refs.msg.selectUser(name);
            }
            this.state = true;
        },
        loginSuccess() {
            this.getCommunityInfo();
        },
        getCommunityInfo() {
            http.get("circle/getCircleZanState", {
                circleid: this.id,
                userid: this.userId
            }).then(res => {
                if (res.status == 200) {
                    this.bZan = res.data;
                } else {
                    showToast("网络出小差了", "none", 600);
                }
            });
        },
        userCircleLike() {
            if (!this.hasLogin) {
                this.$refs.login.show();
                return;
            }
            if (this.likeState) {
                return;
            }

            let data = {
                userid: this.userId,
                type: this.bZan ? 1 : 0,
                circleid: this.id
            };
            this.likeState = true;
            this.bZan = !this.bZan;
            this.bZan
                ? showToast("点赞成功", "none", 600)
                : showToast("取消点赞", "none", 600);
            this.videoDetail.zanNumber += this.bZan ? 1 : -1;
            http.get("/circle/controlCircleZan", data).then(res => {
                if (res.status == 200) {
                    this.likeState = false;
                } else {
                    showToast("网络出小差了", "none", 600);
                }
            });
        },
        getCommentFloorList() {
            if (this.loaded || this.loading) {
                return;
            }
            this.loading = true;
            http.get("comment/getCommentFloorList", {
                circleId: this.id,
                page: this.page,
                pageSize: 8
            }).then(res => {
                if (res.status == 200) {
                    let rows = res.data.rows.map(item => {
                        return {
                            ...item,
                            content: item.content.replace(/^@.+?\s+/, el => {
                                return `<span style="color:#ff7d42">${el}&nbsp;&nbsp;</span>`;
                            })
                        };
                    });
                    this.circleItem = this.circleItem.concat(rows);
                    this.totalComment = res.data.records;
                    if (this.circleItem.length >= this.totalComment) {
                        this.loaded = true;
                    }
                    this.page++;
                    this.loading = false;
                } else {
                    showToast("网络出小差了", "none", 600);
                }
            });
        },
        publicComment(info) {
            http.post("comment/circle_comment", {
                userid: this.userId,
                info: info,
                askid: "",
                circleId: this.id
            }).then(res => {
                if (res.status == 200) {
                    this.hidePage();
                    this.circleItem.unshift({
                        avator: this.getUserInfo.avatarUrl,
                        content: info.replace(/^@.+?\s+/, el => {
                            return `<span style="color:#ff7d42">${el}&nbsp;&nbsp;</span>`;
                        }),
                        createtime: formatTime(new Date()),
                        id: "",
                        userName: this.getUserInfo.nickname,
                        userid: this.getUserInfo.userId
                    });
                    this.totalComment++;
                    this.videoDetail.commentNumber++;
                    showToast("发表成功", "none", 800);
                } else {
                    showToast("发表失败", "none", 800);
                }
            });
        },
        msgInfo(val) {
            wx.showLoading({
                title: "发表中"
            });
            this.publicComment(val);
        },
        hidePage() {
            this.$refs.msg.close();
            setTimeout(() => {
                this.state = false;
            }, 200);
        },
        getMoreEvent() {
            wx.switchTab({
                url: "/pages/discovery/main"
            });
        },
        initData() {
            this.msgState = false;
            this.videoBtn = false;
            this.videoContext = null;
            this.playBtn = true;
            this.fullScreen = false;
            this.id = null;
            this.circleItem = [];
            this.state = false;
            this.loaded = false;
            this.loading = false;
            this.page = 0;
            this.totalComment = 0;
            this.bZan = false;
            this.likeState = false;
            this.isShare = 0;
        },
        hundleItem(item) {
            wx.showLoading({
                title: "切换中"
            });
            this.initData();
            this.id = item.id;
            this.getVideoDetail();
            this.getCommentFloorList();
            if (this.hasLogin) {
                this.getCommunityInfo();
            }
        },
        getVideoDetail() {
            http.post("courseOrigin/getCourseInfoById", { id: this.id }).then(
                res => {
                    if (res.status == 200) {
                        setTimeout(() => {
                            this.videoDetail = res.data;
                            this.videoContext = wx.createVideoContext("player");
                        }, 200);
                        wx.hideLoading();
                        this.load = true;
                    } else {
                        showToast("网络出小差了", "none", 600);
                    }
                }
            );
        },
        getVideoList() {
            http.post("courseOrigin/list", { page: 1, pageSize: 6 }).then(
                res => {
                    if (res.status == 200) {
                        res.data.rows.forEach(item => {
                            this.cardData.push({
                                imgUrl: item.cover,
                                id: item.id,
                                text: item.name
                            });
                        });
                    } else {
                        showToast("网络出小差了", "none", 600);
                    }
                }
            );
        },
        showMsg() {
            this.msgState = !this.msgState;
        },
        back() {
            if (this.isShare == 1) {
                wx.switchTab({
                    url: "/pages/index/main"
                });
            } else {
                wx.navigateBack();
            }
        },
        play() {
            if (this.videoContext == null) {
                wx.showLoading({
                    title: "正在缓冲"
                });
                setTimeout(() => {
                    wx.hideLoading();
                }, 500);
            }
            this.playBtn = false;
            this.videoContext.play();
        },
        screen(e) {
            this.fullScreen = e.target.fullScreen;
        }
    },
    onReady: function(res) {},
    created() {}
};
</script>

<style scoped>
.total-box {
    padding: 0 15rpx;
    margin-top: 42rpx;
}
.video.hide {
    transform: translateY(-100%);
}
.load-cont {
    padding-top: 494rpx;
    position: fixed;
    top: 0;
    bottom: 88rpx;
    left: 0;
    box-sizing: border-box;
    width: 750rpx;
}
.card-space {
    padding-top: 38rpx;
}
.video {
    width: 750rpx;
    height: 494rpx;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
}
.content {
    padding: 0 40rpx;
}
.video-info {
    position: relative;
}
.user {
    justify-content: flex-start;
    height: 132rpx;
    border-bottom: 1rpx solid #e7e7e7;
}
.user .avator {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
}
.user .avator image {
    width: 100%;
    height: 100%;
    border-radius: 50%;
}
.user .name {
    flex-grow: 1;
    font-size: 26rpx;
    margin-left: 20rpx;
}
.info-title {
    color: #000000;
    padding-top: 38rpx;
    padding-bottom: 22rpx;
    font-size: 35rpx;
    line-height: 35rpx;
}
.info-text {
    font-size: 20rpx;
    color: #868686;
    line-height: 20rpx;
}
.info-cont {
    margin-top: 32rpx;
    font-size: 28rpx;
    color: #332b00;
    position: relative;
    overflow: hidden;
    transition: all 0.4s linear;
    max-height: 185rpx;
}
.info-cont.hidebtn {
    padding-bottom: 38rpx;
    border-bottom: 1rpx solid #e7e7e7;
}
.info-cont.show {
    max-height: initial;
    height: auto;
    overflow: initial;
    padding-bottom: 100rpx;
}
.info-more {
    font-size: 24rpx;
    color: #494949;
    height: 100rpx;
    padding-top: 15rpx;
    box-sizing: border-box;
    width: 100%;
    bottom: 0;
    background: linear-gradient(
        rgba(255, 255, 255, 0.7),
        rgba(255, 255, 255, 1) 30%
    );
    position: absolute;
    border-bottom: 1rpx solid #e7e7e7;
}
.info-more image {
    margin-left: 10rpx;
    transform: rotate(-90deg);
    width: 18rpx;
}
.info-more image.show {
    transform: rotate(90deg);
}
.tab {
    position: absolute;
    right: 0;
    top: 38rpx;
    font-size: 23rpx;
    color: #868686;
}
.tab .tab-like {
    margin-right: 46rpx;
}
.tab image {
    width: 44rpx;
    margin-right: 6rpx;
}
.user .button {
    width: 140rpx;
    height: 51rpx;
    border: 1rpx solid #332b00;
    color: #332b00;
    font-size: 26rpx;
    border-radius: 20rpx;
    text-align: center;
    line-height: 50rpx;
}
.back {
    width: 28rpx;
    position: absolute;
    left: 26rpx;
    top: 62rpx;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 50%;
    padding: 14rpx;
}
.back image {
    width: 28rpx;
}
.video-play {
    width: 38rpx;
    height: 38rpx;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    position: absolute;
    right: 50rpx;
    bottom: 50rpx;
    padding: 20rpx;
    border: 1rpx solid rgba(255, 255, 255, 0.4);
    text-align: center;
}
.video-play .image {
    width: 28rpx;
    height: 38rpx;
    display: inline-block;
    margin-right: 6rpx;
}
</style>
