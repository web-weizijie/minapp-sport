<template>
    <view class="circle">
        <UserFiexHead :isShare="isShare" :scrollTop="scrollTop" :item="detail" :followState="titleFollow"></UserFiexHead>
        <view class="load-cont" :class="{show:detail != '' && followInfo != null}">
            <CircleDetail ref="circleDetail" :item="detail" :followInfo="followInfo" v-if="detail != '' && followInfo != null" @follow="userfollow" @selectUser="selectUser"></CircleDetail>
            <TotalList :totalComment="totalComment" :list="circleItem" @hundleUser="hundleUser" @select="selectUser" v-if="circleItem.length > 0"></TotalList>
            <view class="load-more" v-if="totalLoad || !totalDataMore">
                <image src="/static/images/icon/loading.png" v-if="totalDataMore" mode="widthFix" />
                <text v-else>已到底</text>
            </view>
            <view class="circle-space"></view>
            <UserHandle :bZan="detail.bZan" @userTotalEvent="showMsg" @userLikeEvent="userCircleLike"></UserHandle>
            <Message :state="state" ref="msg" @hidePage="hidePage" @msgInfo="msgInfo"></Message>
        </view>
        <Login ref="login"></Login>
        <VLoading :state="!firstLoad"></VLoading>
    </view>
</template>

<script>
import CircleDetail from "../../components/CircleDetail/CircleDetail";
import UserFiexHead from "../../components/UserFiexHead/UserFiexHead";
import TotalList from "../../components/TotalList/TotalList";
import UserHandle from "../../base/UserHandle/UserHandle";
import Message from "../../components/Message/Message";
import VLoading from "../../components/Loading/Loading";
import http from "../../utils/http.js";
import store from "../../store/index";
import Login from "../../components/Login/Login";
import {
    showToast,
    formatTime,
    totalTime,
    firstRegistier
} from "../../utils/index.js";
import { getUserInfo } from "../../store/getters";
const dataArr = [];
export default {
    data() {
        return {
            detail: "",
            circleItem: [],
            scrollTop: 0,
            state: false,
            load: false,
            totalComment: 0,
            followInfo: null,
            page: 0,
            totalDataMore: true,
            totalLoad: false,
            likeState: false,
            circleId: null,
            isShare: 0,
            firstLoad: false
        };
    },
    onLoad(options) {
        this.initData();
        this.isShare = options.isShare || 0;
        let saleId = options.saleId || null;
        firstRegistier(saleId);

        Object.assign(this.$data, { circleId: options.id });
    },
    onUnload() {
        this.initData();
        const dataNum = dataArr.length;
        if (!dataNum) return;
        Object.assign(this.$data, dataArr[dataNum - 1]);
    },
    mounted() {
        this.getCommunityInfo();
        this.getCommentFloorList();
    },
    onShow() {},
    onReachBottom() {
        this.getCommentFloorList();
    },
    components: {
        CircleDetail,
        Message,
        VLoading,
        UserFiexHead,
        TotalList,
        Login,
        UserHandle
    },
    onPageScroll(e) {
        this.scrollTop = e.scrollTop;
    },

    computed: {
        hasLogin() {
            return store.getters.hasLogin;
        },
        userId() {
            return store.getters.getUserInfo == null
                ? null
                : store.getters.getUserInfo.userId;
        },
        getUserInfo() {
            return store.getters.getUserInfo;
        },
        titleFollow() {
            return this.followInfo == null ? 0 : this.followInfo.state;
        },
        interimUserId() {
            return store.getters.getInterimUserId;
        },
        saleId() {
            return store.getters.getSaleId;
        }
    },
    onShareAppMessage() {
        let path = `/pages/circleDetail/main?id=${
            this.circleId
        }&isShare=1&saleId=${this.saleId}`;

        console.log(path, "sharePath");
        return {
            title: "一条健身圈子",
            path
        };
    },
    methods: {
        initData() {
            this.detail = "";
            this.circleItem = [];
            this.scrollTop = 0;
            this.state = false;
            this.load = false;
            this.totalComment = 0;
            this.followInfo = null;
            this.page = 0;
            this.totalDataMore = true;
            this.totalLoad = false;
            this.likeState = false;
            this.circleId = null;
            this.isShare = 0;
            this.firstLoad = false;
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
                type: this.detail.bZan ? 1 : 0,
                circleid: this.detail.id,
                masterId: this.detail.userId
            };
            this.likeState = true;
            this.detail.bZan = !this.detail.bZan;
            this.detail.bZan
                ? showToast("点赞成功", "none", 600)
                : showToast("取消点赞", "none", 600);
            http.get("/circle/controlCircleZan", data).then(res => {
                this.likeState = false;
            });
        },
        hundleUser(item) {
            this.showMsg(item.userName);
        },
        userFollowState(userFollowId) {
            http.get("circle/userFollowState", {
                userId: this.userId,
                userFollowId: userFollowId
            }).then(res => {
                this.followInfo = res.data;
            });
        },
        publicComment(info) {
            http.post("comment/circle_comment", {
                userid: this.userId,
                info: info,
                askid: "",
                circleId: this.circleId,
                masterId: this.detail.userId
            }).then(res => {
                if (res.status == 200) {
                    this.hidePage();
                    this.circleItem.unshift({
                        avator: this.getUserInfo.avatarUrl,
                        content: info.replace(/^@.+?\s+/, el => {
                            return `<span style="color:#ff7d42">${el}&nbsp;&nbsp;</span>`;
                        }),
                        createtime: `刚刚`,
                        id: "",
                        userName: this.getUserInfo.nickname,
                        userid: this.getUserInfo.userId
                    });
                    this.totalComment++;
                    showToast("发表成功", "none", 800);
                } else {
                    showToast("发表失败", "none", 800);
                }
            });
        },
        getCommunityInfo() {
            http.get("circle/getCommunityInfo", {
                circleid: this.circleId,
                userid: this.userId
            }).then(res => {
                if (res.data != null) {
                    this.detail = res.data;
                    this.detail.createTime = this.detail.timeAgoStr;
                    this.userFollowState(this.detail.userId);
                }
                setTimeout(() => {
                    this.firstLoad = true;
                }, 200);
            });
        },
        getCommentFloorList() {
            if (!this.totalDataMore || this.totalLoad) {
                return;
            }
            this.totalLoad = true;
            http.get("comment/getCommentFloorList", {
                circleId: this.circleId,
                page: this.page++,
                pageSize: 8
            }).then(res => {
                let rows = res.data.rows.map(item => {
                    return {
                        ...item,
                        content: item.content.replace(/^@.+?\s+/, el => {
                            console.log(el, "el");
                            return `<span style="color:#ff7d42">${el}&nbsp;&nbsp;</span>`;
                        })
                    };
                });
                this.circleItem = this.circleItem.concat(rows);
                this.totalComment = res.data.records;
                if (this.totalComment - this.circleItem.length <= 0) {
                    this.totalDataMore = false;
                }
                this.totalLoad = false;
            });
        },
        userfollow(item) {
            if (!this.hasLogin) {
                this.$refs.login.show();
                return;
            }
            if (this.load) {
                return;
            }
            this.$refs.circleDetail.followShow();
            this.load = true;
            if (item.state == 0) {
                this.follow(item);
            } else {
                this.unFollow(item);
            }
        },
        follow(item) {
            let data = {
                userId: this.userId,
                userFollowId: item.userFollowId
            };
            http.get("circle/followUser", data).then(res => {
                this.followInfo.state = 1;
                this.load = false;
                this.$refs.circleDetail.followHide();
            });
        },
        unFollow: function(item) {
            let data = {
                userId: this.userId,
                userFollowId: item.userFollowId
            };
            http.get("circle/unFollowUser", data).then(res => {
                this.followInfo.state = 0;
                this.load = false;
                this.$refs.circleDetail.followHide();
            });
        },
        showMsg(name = null) {
            if (!this.hasLogin) {
                this.$refs.login.show();
                return;
            }
            if (name != null && typeof name == "string") {
                this.$refs.msg.selectUser(name);
            }
            this.state = true;
        },
        hidePage() {
            this.$refs.msg.close();
            setTimeout(() => {
                this.state = false;
            }, 200);
        },
        msgInfo(val) {
            wx.showLoading({
                title: "发表中"
            });

            this.publicComment(val);
        },
        selectUser(userId) {
            dataArr.push({ ...this.$data });
            wx.navigateTo({
                url: `/pages/userCenter/main?userId=${userId}`
            });
        }
    }
};
</script>

<style scoped>
.circle-space {
    height: 86rpx;
}
.load-more {
    padding-top: 20rpx;
}
</style>
