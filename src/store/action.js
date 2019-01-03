import {
  setStorage,
  getStorageSync
} from '../utils/storage'

export function userLogin({
  commit
}, pyload) {
  commit('setUserInfo', pyload)
  commit('setHasLogin', true)
  setStorage('userStorage', pyload)
}

export function getStorageUserInfo({
  commit
}) {
  const pyload = getStorageSync('userStorage')
  if (pyload != null && pyload != '') {
    commit('setHasLogin', true)
  }
  commit('setUserInfo', pyload)
}

export function getStorageSaleId({
  commit
}) {
  const pyload = getStorageSync('saleId')
  commit('setSaleId', pyload)
}

export function getStorageUserPhone({
  commit
}) {
  const pyload = getStorageSync('userPhone')
  commit('setUserPhone', pyload)
}

export function getStorageInterimUserId({
  commit
}) {
  const pyload = getStorageSync('interimUserId')
  commit('setInterimUserId', pyload)
}

export function getStorageNewClassId({
  commit
}) {
  const pyload = getStorageSync('newClassId')
  commit('setNewClassId', pyload)
}

export function getStorageNewMsgTime({
  commit
}) {
  const pyload = getStorageSync('newMsgTime')
  commit('setNewMsgTime', pyload)
}

export function updateUserStorage({
  state
}) {
  setStorage('userStorage', state.userInfo)
}

export function saveSaleId({
  commit
}, pyload) {
  commit('setSaleId', pyload)
  setStorage('saleId', pyload)
}
export function saveWeChatData({
  commit
}, pyload) {
  commit('setWeChatData', pyload)
}

export function saveInterimUserId({
  commit
}, pyload) {
  commit('setInterimUserId', pyload)
  setStorage('interimUserId', pyload)
}

export function saveUserPhone({
  commit
}, pyload) {
  commit('setUserPhone', pyload)
  setStorage('userPhone', pyload)
}

export function saveNewClassId({
  commit
}, pyload) {
  commit('setNewClassId', pyload)
  setStorage('newClassId', pyload)
}

export function saveNewMsgTime({
  commit
}, pyload) {
  commit('setNewMsgTime', pyload)
  setStorage('newMsgTime', pyload)
}
