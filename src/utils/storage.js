export function setStorage(key, value) {
  wx.setStorage({
    key: key,
    data: value,
    success() {
      console.log('缓存成功', key, value)
    },
    fail(err) {
      console.log('缓存失败', key, value, err)
    }
  })
}

export function getStorageSync(key) {
  try {
    let value = wx.getStorageSync(key)
    return value != undefined && value != '' ? value : null
  } catch (e) {
    return null
  }

}
