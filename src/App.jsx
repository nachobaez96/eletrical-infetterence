import React, { useState } from 'react'
import { el } from '@elemaudio/core'
import WebRenderer from '@elemaudio/web-renderer'

function App() {
  const [core, setCore] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [bpm, setBpm] = useState(60)
  const [division, setDivision] = useState(1)

  const handleChangeBpm = (event) => {
    setBpm(Number(event.target.value))
  }

  const handleChangeDivision = (event) => {
    setDivision(Number(event.target.value))
  }

  const handleClick = async () => {
    if (!core) {
      const ctx = new AudioContext()
      const core = new WebRenderer()
      const node = await core.initialize(ctx, {
        numberOfInputs: 0,
        numberOfOutputs: 1,
        outputChannelCount: [1]
      })

      node.connect(ctx.destination)
      setCore(core)
    }

    if (core && isPlaying) {
      core.render(el.const({ key: 'mute', value: 0 }))
      setIsPlaying(false)
    } else if (core) {
      const interval = (60 / bpm) / division
      const sineWave = el.sin(el.phasor(440))
      const gate = el.metro({ interval: interval * 1000 })

      const mutedSineWave = el.mul(sineWave, el.sm(gate))

      core.render(mutedSineWave)
      setIsPlaying(true)
    }
  }

  return (
    <div>
      <h1>Elementary Audio Plugin</h1>
      <div>
        <label>
          BPM:
          <input type="number" value={bpm} onChange={handleChangeBpm} />
        </label>
      </div>
      <div>
        <label>
          Division:
          <input type="number" value={division} onChange={handleChangeDivision} />
        </label>
      </div>
      <button onClick={handleClick}>
        {isPlaying ? 'Stop Audio' : 'Start Audio'}
      </button>
    </div>
  )
}

export default App
