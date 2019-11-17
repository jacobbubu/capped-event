import { ReliableEvent, ScuttlebuttOptions, UpdateItems, Update } from '@jacobbubu/scuttlebutt-pull'

import { binarySearch } from './utils'

export interface TimeCappedEventOptions extends ScuttlebuttOptions {
  warningLine?: number
}

class CappedEvent extends ReliableEvent {
  private _warningLine: number

  constructor(opts?: TimeCappedEventOptions) {
    super(opts)

    this._warningLine = (opts && opts.warningLine) || Number.POSITIVE_INFINITY
  }

  push(...args: any[]) {
    const key = args[0]
    const res = super.push(...args)

    if (this.events[key].length >= this._warningLine) {
      this.emit('__overflow__', key, this.events[key].length)
    }

    return res
  }

  getLengthByEvent(key: string) {
    const eventsByKey = this.events[key]
    return eventsByKey ? eventsByKey.length : 0
  }

  getTotalLength() {
    const self = this
    return Object.keys(this.events).reduce((sum, key) => {
      return sum + self.getLengthByEvent(key)
    }, 0)
  }

  pruneBefore(before: number, key: string) {
    const arr = this.events[key] && this.events[key]
    if (arr) {
      const search = [['key'], +new Date() - before]

      const pos = binarySearch(arr, search, (e1: Update, e2: Update) => {
        const ts1 = e1[UpdateItems.Timestamp]
        const ts2 = e2[UpdateItems.Timestamp]
        if (ts1 > ts2) {
          return 1
        } else if (ts1 === ts2) {
          return 0
        } else {
          return -1
        }
      })
      if (pos >= 0 && pos <= arr.length) {
        arr.splice(0, pos)
      }
    }
    return arr.length
  }

  pruneTo(remain: number, key: string) {
    const arr = this.events[key] && this.events[key]
    if (arr) {
      arr.splice(0, arr.length - remain)
    }
    return arr.length
  }
}

export { CappedEvent }
