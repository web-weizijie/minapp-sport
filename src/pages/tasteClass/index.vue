<template>
    <view class="taste">
        <FixedTitle :back="true" :title="thememTitle"></FixedTitle>
        <view class="load-cont" :class="{show:load}">
            <ClassList @submitEvent="submitEvent" :list="couponList" v-if="couponList.length > 0"></ClassList>
            <Login ref="login" @loginSuccess="loginSuccess"></Login>
        </view>
        <Vloading :state="!load"></Vloading>
        <view class="empty-box" v-if="couponList.length <= 0 && load">
            <Empty title="暂无数据" text="这片地方啥都没有..."></Empty>
        </view>
    </view>
</template>
<script>
import FixedTitle from "../../components/FixedTitle/FixedTitle";
import ClassList from "../../components/ClassList/ClassList";
import Login from "../../components/Login/Login";
import { showToast } from "../../utils/index";
import Empty from "../../base/Empty/Empty";
import Vloading from "../../components/Loading/Loading";
import store from "../../store/index";
import http from "../../utils/http";
export default {
    data() {
        return {
            thememTitle: "体验课",
            couponList: [],
            load: false
        };
    },
    components: {
        FixedTitle,
        ClassList,
        Login,
        Vloading,
        Empty
    },
    computed: {
        hasLogin() {
            return store.getters.hasLogin;
        },
        userId() {
            return store.getters.getInterimUserId;
        }
    },
    onUnload() {
        this.couponList = [];
        this.load = false;
    },
    mounted() {
        this.getCoupon();
    },
    onPullDownRefresh() {
        this.getCoupon();
    },
    methods: {
        loginSuccess() {
            this.getCoupon();
        },
        submitEvent(item) {
            if (item.isEnd) {
                showToast("活动已结束", "none", 800);
                return;
            }
            if (item.state == 1) {
                showToast("您已经报过名了", "none", 800);
                return;
            }
            http.get("coupon/signUp", {
                userId: this.userId,
                couponId: item.id
            }).then(res => {
                if (res.status == 200) {
                    this.getCoupon();
                    wx.showModal({
                        title:'报名成功',
                        content:'请您尽快到店体验哦',
                        showCancel:false,
                        confirmText:"知道了"
                    });
                }
            });
        },
        countDay(val) {
            let day = new Date(val).getTime();
            let today = new Date().getTime();
            let countDay = parseInt((day - today) / 1000 / 60 / 60 / 24) + 1;

            return countDay < 0 ? 0 : countDay;
        },
        getCoupon() {
            http.get("coupon/queryCouponList", {
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
                }
                wx.stopPullDownRefresh();
                this.load = true;
            });
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
</style>
