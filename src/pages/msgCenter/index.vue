<template>
    <view class="taste">
        <FixedTitle :back="true" :title="thememTitle"></FixedTitle>
        <view class="empty-box" v-if="!hasLogin">
            <NoLogin @loginSuccess="loginSuccess"></NoLogin>
        </view>
        <block v-else>
            <view class="load-cont" :class="{show:load}">
                <block v-if="msgData.length > 0">
                    <view class="msg-cont">
                        <MsgList :list="msgData" @select="select" @hundleUser="hundleUser"></MsgList>
                    </view>
                    <view class="load-more" v-if="loading || loaded">
                        <image src="/static/images/icon/loading.png" v-if="!loaded" mode="widthFix" />
                        <text v-else>已到底</text>
                    </view>
                </block>
                <view class="empty-box" v-if="msgData.length <= 0 && load">
                    <Empty title="暂无数据" text="这片地方啥都没有..."></Empty>
                </view>
            </view>
            <VLoading :state="!load"></VLoading>
        </block>
    </view>
</template>

<script>
import http from "../../utils/http";
import store from "../../store/index";
import VLoading from "../../components/Loading/Loading";
import FixedTitle from "../../components/FixedTitle/FixedTitle";
import NoLogin from "../../base/NoLogin/NoLogin";
import MsgList from "../../components/MsgList/MsgList";
import Empty from "../../base/Empty/Empty";
export default {
    data() {
        return {
            thememTitle: "消息中心",
            page: 1,
            load: false,
            msgData: [],
            loaded: false,
            loading: false
        };
    },
    computed: {
        userId() {
            return store.getters.getUserInfo == null
                ? null
                : store.getters.getUserInfo.userId;
        },
        hasLogin() {
            return store.getters.hasLogin;
        }
    },
    mounted() {
        if (this.hasLogin) {
            this.getMsg();
        }
    },
    onUnload() {
        this.initData();
        this.msgData = [];
        this.load = false;
    },
    onPullDownRefresh() {
        this.initData();
        this.getMsg(true);
    },
    components: {
        Empty,
        MsgList,
        FixedTitle,
        VLoading,
        NoLogin
    },
    methods: {
        loginSuccess() {
            this.getMsg();
        },
        hundleUser(item) {
            if (item.type == 3) {
                this.navToUserCenter(item);
            } else {
                this.navToCircleDetail(item);
            }
        },
        select(item) {
            this.navToUserCenter(item);
        },
        navToUserCenter(item) {
            wx.navigateTo({
                url: `/pages/userCenter/main?userId=${item.userId}`
            });
        },
        navToCircleDetail(item) {
            wx.navigateTo({
                url: `/pages/circleDetail/main?id=${item.circleId}`
            });
        },
        initData() {
            this.page = 1;
            this.loaded = false;
            this.loading = false;
        },
        getMsg(init = false) {
            if ((this.loaded || this.loading) && !init) {
                return;
            }
            this.loading = true;
            http.get("user/getUserMsgList", {
                userId: this.userId,
                pageSize: 12,
                page: this.page
            })
                .then(res => {
                    if (res.data != null) {
                        let rows = res.data.rows;
                        this.msgData = init
                            ? this.initMsg(rows)
                            : this.msgData.concat(this.initMsg(rows));

                        if (this.msgData.length >= res.data.records) {
                            this.loaded = true;
                        }
                        if (rows != null && rows.length > 0) {
                            store.dispatch("saveNewMsgTime", rows[0].createTime);
                        }
                        this.page++;
                    }
                    wx.stopPullDownRefresh();
                    this.loading = false;
                    this.load = true;
                })
                .catch(() => {
                    this.load = true;
                });
        },
        initMsg(msgs) {
            msgs.forEach(item => {
                if (item.type == 2) {
                    item.content = item.content.replace(/^@.+?\s+/, el => {
                        return `<span style="color:#ff7d42">${el}&nbsp;&nbsp;</span>`;
                    });
                } else {
                    item.content = "点击查看TA";
                }
            });

            return msgs;
        }
    }
};
</script>

<style scoped>
.taste {
    padding-top: 120rpx;
    padding-bottom: 60rpx;
    min-height: 100vh;
    box-sizing: border-box;
    background: #f7f7f7;
}
.msg-cont {
    background: #ffffff;
    border-bottom: 1rpx solid #f7f7f7;
    margin-bottom: 30rpx;
}
</style>
