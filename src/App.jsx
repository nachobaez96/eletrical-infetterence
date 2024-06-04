import React, { useState } from 'react'
import { el } from '@elemaudio/core'
import WebRenderer from '@elemaudio/web-renderer'

function App() {
  const [core, setCore] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)

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
      const bpm = 60 // Desired BPM
      const division = 1 // Control how fast it mutes/unmutes
      const interval = (60 / bpm) / division // Interval in seconds
      const sineWave = el.sin(el.phasor(440)) // Generate a 440Hz sine wave
      const gate = el.metro({ interval: interval * 1000 }) // Generate a gate signal using el.metro for timing

      const mutedSineWave = el.mul(sineWave, el.sm(gate)) // Apply the gate to the sine wave

      core.render(mutedSineWave)
      setIsPlaying(true)
    }
  }

  return (
    <div>
      <h1>Elementary Audio Plugin</h1>
      <button onClick={handleClick}>
        {isPlaying ? 'Stop Audio' : 'Start Audio'}
      </button>
    </div>
  )
}

export default App