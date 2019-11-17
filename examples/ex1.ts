import { link } from '@jacobbubu/scuttlebutt-pull'
import { CappedEvent } from '../src'

const a = new CappedEvent({ id: 'A', warningLine: 1 })
const b = new CappedEvent({ id: 'B' })

// in a <-> b relationship, a is read-only and b is write-only
const s1 = a.createStream({ name: 'a->b' })
const s2 = b.createStream({ name: 'b->a' })

link(s1, s2)

b.on('ota', event => {
  console.log(`Received@${b.id} (ota): ${event}`)
  console.log(`got ${b.getLengthByEvent('ota')} items for event('ota')`)
})

a.on('__overflow__', (key, len) => {
  console.log(`events in ${key}@${a.id} is over it's storage limit(1), now is: ${len}`)
  console.log(`cache cleaned to ${a.pruneTo(1, key)} items`)
})

a.push('signal', 'New Value')
a.push('ota', 'ota has started')
a.push('ota', 'progress 10%')
