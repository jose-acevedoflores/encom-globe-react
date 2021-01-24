import React from 'react'

import { EncomGlobe } from 'encom-globe-react'
import 'encom-globe-react/dist/index.css'

const marker1 = {lat: 49.25, lon: -123.1, label: "Vancouver"};
const marker2 = {lat: 35.6895, lon: 129.69171, label: "Tokyo", connected: true};
const demoMarkers = [marker1, marker2];

const App = () => {

  const initialSize = Math.min(window.innerWidth, window.innerHeight);
  const [state, setState] = React.useState({width: initialSize, height: initialSize});
  React.useEffect(()=> {

      const cb = () => {
        const newSize = Math.min(window.innerWidth, window.innerHeight);
        setState({width: newSize, height: newSize})
      };
      window.addEventListener( 'resize', cb, false );

      return () => window.removeEventListener('resize', cb)
  }, []);

  const [markers, setMarkers] = React.useState([]);
  const [constellations, setConstellations] = React.useState([]);

  const demo = () => {
    console.log("Run demo");
    // ADD MARKERS
    setTimeout(() => setMarkers(demoMarkers), 4000);

    //ADD SATELLITES
    setTimeout(()=>{
        const constellation = [];
        const opts = {
            waveColor: "#FFF",
            coreColor: "#FF0000",
            shieldColor: "#fff",
            numWaves: 8
        };
        const alt =  1.3;

        for(let i = 0; i< 2; i++){
            for(let j = 0; j< 3; j++){
                 constellation.push({
                    lat: 50 * i - 30 + 15 * Math.random(), 
                     lon: 120 * j - 120 + 30 * i, 
                     altitude: alt
                     });
            }
        }

        setConstellations([{
          opts,
          sats: constellation
        }])
    }, 6000)
  }
  
  return <EncomGlobe 
    width={state.width} 
    height={state.height} 
    markers={markers}
    // satellites={satellites}
    constellations={constellations}
    globeReadyCb={demo}
  />
}

export default App
