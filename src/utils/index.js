import http from './http'
import store from '../store';

function formatNumber(n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

function formatTime(date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  // const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('-')
  const t2 = [hour, minute].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

function showToast(title, icon, time) {
  wx.showToast({
    icon,
    title
  });
  setTimeout(() => {
    wx.hideLoading();
  }, time);
}

function getWeChat(saleId, cb = null) {
  http.get("user/querySaleById", {
    saleId
  }).then(
    res => {
      if (res.status == 200 && res.data != null) {
        store.dispatch("saveWeChatData", res.data);
        cb != null ? cb() : false
      }
    }
  );
}

function firstRegistier(saleId, cb = null) {
  let interimUserId = store.getters.getInterimUserId

  if (interimUserId == null || saleId != null) {
    wx.login({
      success(res) {
        if (res.code != null) {
          http.post('user/registUser', {
            jsCode: res.code,
            saleId
          }).then((res) => {
            if (res.status == 200 && res.data != null) {
              let saleId = res.data.saleId
              let userId = res.data.userId
              let mobile = res.data.mobile

              if (saleId != "null" && saleId != null) {
                store.dispatch('saveSaleId', saleId)
              }
              if (interimUserId == null && userId != null) {
                store.dispatch('saveInterimUserId', userId)
              }
              if (store.getters.getWeChatData == null) {
                getWeChat(saleId, () => {
                  cb != null ? cb() : false
                })
              }
              if (store.getters.getUserPhone == null && mobile != null) {
                store.dispatch("saveUserPhone", mobile);
              }

            }
          })
        }
      }
    })
  } else {
    getWeChat(store.getters.getSaleId, () => {
      cb != null ? cb() : false
    })
  }

}
export {
  formatNumber,
  formatTime,
  showToast,
  firstRegistier
}
