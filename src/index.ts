import {
  ReliableEvent,
  ScuttlebuttOptions,
  UpdateItems,
  Update,
  ReliableEventValueItems
} from '@jacobbubu/scuttlebutt-pull'

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
    return super.push(...args)
  }

  applyUpdate(update: Update) {
    const res = super.applyUpdate(update)
    const key = update[UpdateItems.Data][ReliableEventValueItems.Key]
    if (this.events.get(key)!.length >= this._warningLine) {
      this.emit('__overflow__', key, this.events.get(key)!.length)
    }
    return res
  }

  getLatestValueByEvent(key: string, withClock = false) {
    const eventsByKey = this.events.get(key)!
    if (!(eventsByKey && eventsByKey.length !== 0)) {
      return undefined
    }

    const update = eventsByKey[eventsByKey.length - 1]
    return withClock ? update : update[UpdateItems.Data][ReliableEventValueItems.Arg1]
  }

  getLengthByEvent(key: string) {
    const eventsByKey = this.events.get(key)!
    return eventsByKey ? eventsByKey.length : 0
  }

  getTotalLength() {
    const self = this
    return Array.from(this.events.keys()).reduce((sum, key) => {
      return sum + self.getLengthByEvent(key)
    }, 0)
  }

  pruneBefore(before: number, key: string) {
    const arr = this.events.get(key)! && this.events.get(key)!
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
    const arr = this.events.get(key)! && this.events.get(key)!
    if (arr) {
      arr.splice(0, arr.length - remain)
    }
    return arr.length
  }
}

export { CappedEvent }
