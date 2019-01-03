import config from './config'
import store from '../store/index'
import {
  showToast
} from './index'

const httpPromise = (url, data, method, header = {}) => {
  return new Promise((resolve, reject) => {
    let timer = new Date().getTime()
    wx.request({
      data,
      url: config.host + url + `?t=${timer}`,
      header,
      method: method,
      dataType: 'json',
      success(res) {
        if (res.statusCode == 200) {
          resolve(res.data)
        } else {
          reject()
          showToast('网络出小差了', 'none', 800)
        }
      },
      fail(err) {
        reject(err)
        showToast('网络出小差了', 'none', 800)
      }
    })
  })
}

function jiemi(url, detail) {
  return new Promise((resolve, reject) => {
    wx.login({
      success: function (res) {
        if (res.code) {
          http.post(
              url, {
                'encryptedData': detail.encryptedData,
                'iv': detail.iv,
                'jsCode': res.code,
                'saleId': store.getters.getSaleId
              })
            .then((resource) => {
              resolve(resource)
            }).catch((error) => {
              reject(error)
            })
        } else {
          showToast('网络出小差了', 'none', 800)
        }
      },
      fail: function () {
        showToast('网络出小差了', 'none', 800)
      }
    });
  })
}
const login = (userInfo) => {
  return jiemi('user/getUser', userInfo)
}
const getPhone = (phoneDetail) => {
  return jiemi('user/getPhoneNumber', phoneDetail)
}
const bindUserPhone = (userId, phone, back, cb) => {
  store.dispatch("saveUserPhone", phone);
  http
    .post("user/bindUserPhone", {
      userId,
      phone
    })
    .then(res => {
      if (res.data != null) {
        store.commit('setType', res.data)
        store.dispatch("updateUserStorage");
      }
      if (res.status == 200 && res.data != -1) {
        showToast("绑定成功", "none", 800);
        if (cb != null) {
          cb()
        }
        if (back) {
          setTimeout(() => {
            wx.navigateBack();
          }, 800);
        }
      } else if (res.data == -1) {
        showToast("手机号已被绑定", "none", 800);
      } else {
        showToast("失败", "none", 800);
      }
    })
}
class http {
  static get(url, data = {}) {
    return httpPromise(url, data, 'GET')
  }
  static post(url, data = {}) {
    let header = {
      "content-type": "application/x-www-form-urlencoded"
    }
    return httpPromise(url, data, 'POST', header)
  }
  static uploadPicture(max, cb) {

  }
  static login(userInfo) {
    return login(userInfo)
  }
  static getPhone(phoneDetail) {
    return getPhone(phoneDetail)
  }
  static bindUserPhone(userId, phone, back = false, cb = null) {
    return bindUserPhone(userId, phone, back, cb)
  }

}

export default http
