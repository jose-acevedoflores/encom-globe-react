import React from 'react'

import { EncomGlobe } from 'encom-globe-react'
import 'encom-globe-react/dist/index.css'

const App = () => {

  const [state, setState] = React.useState({width: window.innerWidth, height: window.innerHeight})
  React.useEffect(()=> {

      const cb = () => setState({width: window.innerWidth, height: window.innerHeight});

      window.addEventListener( 'resize', cb, false );

      return () => window.removeEventListener('resize', cb)
  });
  
  return <EncomGlobe width={state.width} height={state.height} demo/>
}

export default App
