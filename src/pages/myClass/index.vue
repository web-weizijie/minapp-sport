<template>
    <view class="taste">
        <FixedTitle :back="true" :title="thememTitle"></FixedTitle>
        <view class="empty-box" v-if="!hasLogin">
            <NoLogin @loginSuccess="loginSuccess"></NoLogin>
        </view>
        <block v-else>
            <view class="load-cont" :class="{show:load}">
                <ClassList :isUser="true" :list="couponList" v-if="couponList.length > 0"></ClassList>
                <view class="load-more" v-if="couponList.length > 0">
                    <text>已到底</text>
                </view>
            </view>
            <Vloading :state="!load"></Vloading>
            <view class="empty-box" v-if="couponList.length <= 0 && load">
                <Empty title="暂无数据" text="这片地方啥都没有..."></Empty>
            </view>
        </block>
    </view>
</template>

<script>
import http from "../../utils/http";
import store from "../../store/index";
import Empty from "../../base/Empty/Empty";
import NoLogin from "../../base/NoLogin/NoLogin";
import Vloading from "../../components/Loading/Loading";
import FixedTitle from "../../components/FixedTitle/FixedTitle";
import ClassList from "../../components/ClassList/ClassList";
export default {
    data() {
        return {
            thememTitle: "我的体验课",
            couponList: [],
            load: false
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
            this.getCoupon();
        }
    },
    onUnload() {
        this.couponList = [];
        this.load = false;
    },
    components: {
        ClassList,
        FixedTitle,
        Vloading,
        Empty,
        NoLogin
    },
    methods: {
        loginSuccess() {
            this.getCoupon();
        },
        countDay(val) {
            let day = new Date(val).getTime();
            let today = new Date().getTime();
            let countDay = parseInt((day - today) / 1000 / 60 / 60 / 24) + 1;

            return countDay < 0 ? 0 : countDay;
        },
        getCoupon() {
            http.get("coupon/myCoupon", {
                userId: this.userId
            }).then(res => {
                if (res.status == 200) {
                    this.couponList = res.data.map(ele => {
                        let countDay = this.countDay(ele.endTime);
                        return {
                            ...ele,
                            countDay,
                            isEnd: countDay <= 0
                        };
                    });
                    if (this.couponList.length > 0) {
                        store.dispatch("saveNewClassId", this.couponList[0].id);
                    }
                }
                this.load = true;
            });
        }
    }
};
</script>

<style scoped>
.taste {
    padding-top: 120rpx;
    min-height: 100vh;
    box-sizing: border-box;
    background: #f7f7f7;
}
</style>
