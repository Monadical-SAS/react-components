import {WarpedTime} from 'warped-time'
import {TimeControls} from './warped-time-controls.js'

// Test TimeControls class
class TestableTicker extends Ticker {
    tick() {
        this.subscribers.forEach((fn) => fn())
        if (this.running) {
            setTimeout(::this.tick, 2)
        }
    }
}

class TestableTimeControls extends TimeControls {
    tick() {
        this.state = this.computeState()
    }
}


const tick = new TestableTicker()
assert(Array.isArray(tick.subscribers), `expected an Array, got ${typeof(tick.subscribers)}`)
assert(tick.running === true, `expected true, got ${tick.running}`)

const controls_start = Date.now()
const props = {time: new WarpedTime(), tick: tick}
const controls = new TestableTimeControls(props)

let state = controls.computeState()
assert_fuzzy_equal_time(state.genesis_time, controls_start,
                        `expected ${controls_start}, got ${state.genesis_time}`)


controls.time.setWarpedTime(t)
assert_fuzzy_equal_time(controls.time.getWarpedTime(), t,
                        `expected ${t}, got ${controls.time.getWarpedTime()}`)


const testControlsAfterNDelays = (n, wt, t, delay, recursive_call) => {
    // babel-node is slow and the first iteration of this tests sometimes
    //  fails as a result
    if (recursive_call) {
        const warped_time = controls.state.warped_time
        assert_fuzzy_equal_time(warped_time, t + (delay * speed),
                                  'warped_time - t + (delay * speed) == '
                                  + (warped_time - (t + (delay * speed)))
                                  + ' but should be ~0.\n'
                                  + `warped_time: ${warped_time}`
                                  + `, t: ${t}, delay: ${delay}, speed: ${speed}`
                                  + `\nn is ${n}.`)
    }
    controls.time.setSpeed(speed)
    controls.time.setWarpedTime(t)
    if (n > 0){
        setTimeout(testControlsAfterNDelays, delay, n - 1, wt, t, delay, true)
    } else {
        tick.stop()
    }
}
testControlsAfterNDelays(20, controls, 10, 10, false)
