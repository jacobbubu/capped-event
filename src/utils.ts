function binarySearch(arr: any[], el: any, compareFn: (el1: any, el2: any) => number) {
  let m = 0
  let n = arr.length - 1
  while (m <= n) {
    const k = (n + m) >> 1
    const cmp = compareFn(el, arr[k])
    if (cmp > 0) {
      m = k + 1
    } else if (cmp < 0) {
      n = k - 1
    } else {
      return k
    }
  }
  return m
}

export { binarySearch }
