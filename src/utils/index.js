export const traverseFlatObject = (result, obj, keyStr) => {
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
