# @jacobbubu/capped-event

[![Build Status](https://travis-ci.org/jacobbubu/capped-event.svg)](https://travis-ci.org/jacobbubu/capped-event)
[![Coverage Status](https://coveralls.io/repos/github/username/capped-event/badge.svg)](https://coveralls.io/github/jacobbubu/capped-event)
[![npm](https://img.shields.io/npm/v/@jacobbubu/capped-event.svg)](https://www.npmjs.com/package/@jacobbubu/capped-event/)

> A derived class from ReliableEvent in [scuttlebutt-pull](https://github.com/jacobbubu/scuttlebutt-pull) that provides basic cache management capabilities.

## Intro.

The `ReliableEvent` in [scuttlebutt-pull](https://github.com/jacobbubu/scuttlebutt-pull) has not provided cache mechanism.

You can only push events into the instance of `ReliableEvent`, but there is no way to remove them.

In `CappedEvent`, we fire a notification when the items count for some event reached a `warningLine` that is setting by the `options` you passed through the construction.

For removing items from cache, we provide to methods:

- `pruneBefore(before: number, key: string)`: prune the items before xxx milliseconds.
- `pruneTo(remain: number, key: string)`: just keep `remain` items in cache.

Please the test case for the detail.
