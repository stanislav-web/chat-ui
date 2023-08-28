import React, { useState, useEffect } from 'react'
import { Console, Hook, Unhook } from 'console-feed'

const LogsContainer = (): React.JSX.Element => {
  const [logs, setLogs] = useState([])

  // run once!
  useEffect((): any => {
    const hookedConsole = Hook(
      window?.console,
      (log) => { setLogs((currLogs): any => [...currLogs, log] as any); },
      false
    )
    return () => Unhook(hookedConsole)
  }, [])

  return <Console logs={logs} variant="dark" />
}

export { LogsContainer }
