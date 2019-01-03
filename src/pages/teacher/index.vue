<template>
    <view class="container">
        <view class="teacher">
            <FixedTitle :back="true" :title="thememTitle"></FixedTitle>
            <view class="load-cont" :class="{show:!state}">
                <swiper v-if="coachList.length > 0" class="teacher-list" previous-margin="48rpx" next-margin="48rpx" :circular="true" @change="swiperChange">
                    <swiper-item class=" flex-row" v-for="(coach,idx) in coachList" :key="idx">
                        <view class="teacher-item" @click="navToUserCenter(coach)">
                            <image class="avator" :src="coach.head" mode="aspectFill" />
                            <view class="name">
                                {{coach.name}}
                            </view>
                            <view class="info">
                                {{coach.great}}
                            </view>
                            <view class="teacher-student flex-row">
                                <view class="student" v-for="item in coach.userHeads" :key="item">
                                    <image :src="item.avatarUrl" mode="widthFix" />
                                </view>
                                <view class="num" v-if="coach.userZanNumber | filterUserLength > 0">+{{coach.userZanNumber | filterUserLength}}</view>
                            </view>
                        </view>
                    </swiper-item>
                </swiper>
                <view class="progress" v-if="coachList.length > 0">
                    <view class="inline" :style="{width:width + '%'}"></view>
                </view>
            </view>
            <view class="empty-box" v-if="coachList.length <= 0 && !state">
                <Empty title="暂无数据" text="这片地方啥都没有..."></Empty>
            </view>
            <VLoading :state="state"></VLoading>
        </view>
    </view>
</template>
<script>
import FixedTitle from "../../components/FixedTitle/FixedTitle";
import VLoading from "../../components/Loading/Loading";
import { showToast } from "../../utils/index";
import http from "../../utils/http.js";
import Empty from "../../base/Empty/Empty";
export default {
    data() {
        return {
            thememTitle: "教练",
            scrollY: 0,
            startX: 0,
            touchScrollY: 0,
            coachList: [],
            current: 0,
            state: true
        };
    },
    onload() {
        this.current = 0;
    },
    onUnload() {
        this.thememTitle = "教练";
        this.scrollY = 0;
        this.startX = 0;
        this.touchScrollY = 0;
        this.coachList = [];
        this.current = 0;
        this.state = true;
    },
    mounted() {
        this.getCoachList();
    },
    components: {
        FixedTitle,
        VLoading,
        Empty
    },
    computed: {
        width() {
            return parseInt((this.current / (this.coachList.length - 1)) * 100);
        }
    },
    filter: {
        filterUserLength(val) {
            return val - 6;
        }
    },
    methods: {
        navToUserCenter(item) {
            if (item.userId) {
                wx.navigateTo({
                    url: `/pages/userCenter/main?userId=${item.userId}`
                });
            } else {
                showToast("该教练未绑定", "none", 800);
            }
        },
        getCoachList() {
            http.post("coach/list", { page: 1, pageSize: 200 }).then(res => {
                if (res.data != null && res.status == 200) {
                    this.coachList = res.data.rows;
                    this.state = false;
                }
            });
        },

        swiperChange(event) {
            this.current = event.mp.detail.current;
        }
    }
};
</script>
<style scoped>
.cont {
    opacity: 0;
    transition: all 0.3s ease;
}
.cont.show {
    opacity: 1;
}
.teacher {
    padding-top: 160rpx;
    min-height: 100vh;
    background: #fcfcfc;
    box-sizing: border-box;
}
.teacher-list {
    width: 750rpx;
    height: 954rpx;
    margin-top: 30rpx;
}
.teacher-item {
    width: 620rpx;
    height: 900rpx;
    border-radius: 15rpx;
    box-shadow: 0 10rpx 26rpx #e7e7e7;
}
.teacher-item:last-child {
    margin-right: 0;
}
.teacher-item .avator {
    border-radius: 15rpx 15rpx 0 0;
    width: 100%;
    height: 510rpx;
}
.teacher-item .name {
    padding: 28rpx 30rpx 24rpx 30rpx;
    font-size: 34rpx;
    line-height: 34rpx;
    color: #332b00;
}
.teacher-item .info {
    padding: 0 30rpx;
    font-size: 25rpx;
    color: #868686;
    height: 100rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    margin-bottom: 50rpx;
}
.teacher-student {
    justify-content: flex-start;
    margin: 0 30rpx;
    padding: 40rpx 0rpx;
    border-top: 1rpx solid #eaeaea;
}
.student {
    width: 66rpx;
    height: 66rpx;
    border-radius: 50%;
    margin-right: 14rpx;
    flex-shrink: 0;
}
.student image {
    border-radius: 50%;
    width: 100%;
    height: 100%;
}
.progress {
    width: 620rpx;
    height: 6rpx;
    background: #e7e7e7;
    margin: 60rpx auto;
    position: relative;
}
.progress .inline {
    position: absolute;
    left: 0;
    height: 6rpx;
    top: 0;
    background: #332b00;
    transition: all 0.3s ease;
}
.num {
    width: 66rpx;
    height: 66rpx;
    line-height: 66rpx;
    text-align: center;
    background: linear-gradient(70deg, #fee193, #ffcb1d);
    border-radius: 50%;
    font-size: 26rpx;
    color: #332b00;
}
</style>
