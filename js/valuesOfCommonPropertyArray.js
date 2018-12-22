function valuesOfCommonPropertyArray(array, ...property) {
  let outArray = [];
  array.forEach(function(element) {
    for (let i = 0; i < property.length; i++){
      element = element[property[i]]
    }
    outArray.push(element)
  })
  return outArray
}
