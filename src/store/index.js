import Vuex from 'vuex'
import Vue from 'vue'
import * as getters from './getters'
import * as mutations from './mutations'
import * as actions from './action'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    hasLogin: false,
    userInfo: null,
    isTeacher: false,
    weChatData: null,
    saleId: null,
    interimUserId: null,
    userPhone: null,
    newMsgTime: null,
    newClassId: null,
    postTrue: false
  },
  getters,
  mutations,
  actions,

})
