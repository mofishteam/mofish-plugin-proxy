export const traverseFlatObject = (result, obj, keyStr) => {
  // 用来把一个Object拍扁
  if (obj instanceof Object && !(obj instanceof Array) && !(obj instanceof Function)) {
    const objKeys = Object.keys(obj)
    for (const k of objKeys) {
      traverseFlatObject(result, obj[k], (keyStr ? keyStr + '.' : '') + k)
    }
  } else {
    result[keyStr] = obj
  }
  return result
}
