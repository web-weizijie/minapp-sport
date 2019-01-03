<template>
    <view class="mylike">
        <FixedTitle :back="true" :title="themeTitle"></FixedTitle>
        <view class="scroll-box load-cont" :class="{show:load}">
            <block v-if="circleFocusList.length > 0">
                <CircleList :list="circleFocusList" @getCircleInfo="getCircleInfo"></CircleList>
                <view class="load-more" v-if="(followLoading || followLoaded) ">
                    <image src="/static/images/icon/loading.png" v-if="!followLoaded" mode="widthFix" />
                    <text v-else>已到底</text>
                </view>
            </block>
            <view v-else class="empty-box">
                <Empty title="暂无关注的人" text="快去关注其他小伙伴吧..." v-if="!followEmpty"></Empty>
                <Empty title="暂无动态" text="关注用户近期暂无动态" v-else></Empty>
            </view>
        </view>
        <VLoading :state="!load"></VLoading>
    </view>
</template>
<script>
import http from "../../utils/http.js";
import store from "../../store/index";
import VLoading from "../../components/Loading/Loading";
import FixedTitle from "../../components/FixedTitle/FixedTitle";
import CircleList from "../../components/CircleList/CircleList";
import NoLogin from "../../base/NoLogin/NoLogin";
import Empty from "../../base/Empty/Empty";
import {formatTime} from "../../utils/index"
export default {
    data() {
        return {
            themeTitle: "我的关注",
            circleFocusList: [],
            followPage: 0,
            followLoaded: false,
            followLoading: false,
            followAllNum: 0,
            followEmpty: false,
            load: false
        };
    },
    computed: {
        userId() {
            return store.getters.getUserInfo == null
                ? null
                : store.getters.getUserInfo.userId;
        }
    },
    mounted() {
        this.getFollowInfoList();
        this.getUserFollowNum(this.userId);
    },
    onUnload() {
        this.circleFocusList = [];
        this.followPage = 0;
        this.followLoaded = false;
        this.followLoading = false;
        this.followAllNum = 0;
        this.followEmpty = false;
        this.load = false;
    },
    components: {
        CircleList,
        NoLogin,
        Empty,
        FixedTitle,
        VLoading
    },
    methods: {
        loginSuccess() {
            this.getUserFollowNum(this.userId);
            this.getFollowInfoList();
        },
        getUserFollowNum(userId) {
            http.get("user/getUserById", { userId: userId }).then(res => {
                if (res.status == 200) {
                    this.followEmpty = res.data.focus > 0 ? true : false;
                }
            });
        },
        getFollowInfoList() {
            let followPageSize = 4;
            if (this.followLoaded) {
                return;
            }

            this.followLoading = true;
            http.get("circle/getFollowCirclesByUserId", {
                userId: this.userId,
                page: this.followPage,
                pageSize: followPageSize
            })
                .then(res => {
                    if (res.status == 200) {
                        res.data.rows.forEach(ele => {
                            ele.createTime = formatTime(
                                new Date(ele.createTime)
                            );
                        });
                        this.circleFocusList = this.circleFocusList.concat(
                            res.data.rows
                        );

                        this.followAllNum = res.data.records;
                        if (this.circleFocusList.length >= this.followAllNum) {
                            this.followLoaded = true;
                        }
                    } else {
                        showToast("网络出小差了", "none", 800);
                    }
                    this.followLoading = false;
                    this.load = true;
                })
                .catch(() => {
                    this.followLoading = false;
                });
        }
    }
};
</script>
<style scoped>
.mylike{
    padding-top: 120rpx;
    background: #f7f7f7;
    min-height: 100vh;
}
.empty-box {
    height: 100vh;
}
</style>
