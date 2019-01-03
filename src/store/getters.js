export function getUserInfo(state) {
  return state.userInfo
}
export function hasLogin(state) {
  return state.hasLogin
}
export function isTeacher(state) {
  return state.isTeacher
}
export function type(state) {
  return state.hasLogin ? state.userInfo.type : 0
}
export function getWeChatData(state) {
  return state.weChatData
}
export function getSaleId(state) {
  return state.saleId
}
export function getInterimUserId(state) {
  return state.interimUserId
}
export function getUserPhone(state) {
  return state.userPhone
}
export function getNewMsgTime(state) {
  return state.newMsgTime
}
export function getNewClassId(state) {
  return state.newClassId
}
export function getPostTrue(state){
  return state.postTrue
}
