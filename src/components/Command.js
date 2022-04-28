import React, { useState } from 'react'
import { getTime } from '../utils/time'

const Command = ({dispatch, now, ipRef, workingDirectory}) => {
  const [cmd, setCmd] = useState('')

  const sub = e => {
    dispatch({cmd: cmd, time: now, workingDirectory: workingDirectory})
    e.preventDefault()
    e.target.reset()
  }
  
  now = getTime(now)

  return (
    <div className='command'>
      <p className='prompt'>┌─[<span className='time'>{now}</span>]─[<span className='workingDir'>{workingDirectory}</span>]</p>
      <form className='input-form' onSubmit={sub}>
          <label className='prompt'>└──{'>'}</label>
          <input className='stdin' type='text' spellCheck="false" ref={ipRef} onChange={e=>setCmd(e.target.value)}/>
          <input className='enter' type='submit'/>
      </form>
    </div>
  )
}

export default Command