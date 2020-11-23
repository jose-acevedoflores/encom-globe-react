import React from 'react'
import styles from './styles.module.css'
import Globe from './encom/ReactGlobe';
import PropTypes from 'prop-types';
import grid from './encom/data/grid';
import pinLocations from './encom/data/pin-locations';

export const EncomGlobe = props => {

  return <Globe {...props} />
}

EncomGlobe.defaultProps = {
  globeConfig:{
    //NOTE: For an example of loading this font check the example/src/index.css  @font-face
    font: "Inconsolata",
    data: pinLocations,
    tiles: grid.tiles,
    baseColor: "blue",
    markerColor: "red",
    pinColor: "green",
    satelliteColor: "yellow",
    scale: 1.0, 
    dayLength: 1000 * 28,
    introLinesDuration: 2000,
    maxPins: 500,
    maxMarkers: 4,
    viewAngle: 0.1
  }
}

const satOpts = PropTypes.exact({
  numWaves: PropTypes.number,
  waveColor: PropTypes.string,
  coreColor: PropTypes.string,
  shieldColor: PropTypes.string,
  size: PropTypes.number
});

EncomGlobe.propTypes = {
  show: PropTypes.bool,
  width: PropTypes.number,
  height: PropTypes.number,
  globeReadyCb: PropTypes.func.isRequired,

  globeConfig: PropTypes.exact({
      font: PropTypes.string.isRequired,
      data: PropTypes.arrayOf(
        PropTypes.exact({
          lat: PropTypes.number,
          lng: PropTypes.number,
          label: PropTypes.string
        })
      ).isRequired,
      tiles: PropTypes.arrayOf(
        PropTypes.exact({
          lat: PropTypes.number,
          lon: PropTypes.number,
          b: PropTypes.arrayOf(
            PropTypes.exact({
              x: PropTypes.number,
              y: PropTypes.number,
              z: PropTypes.number,
            })
          )
        })
      ).isRequired,
      baseColor: PropTypes.string.isRequired,
      markerColor: PropTypes.string.isRequired,
      pinColor: PropTypes.string.isRequired,
      satelliteColor: PropTypes.string.isRequired,
      scale: PropTypes.number.isRequired,
      dayLength: PropTypes.number.isRequired,
      introLinesDuration: PropTypes.number.isRequired,
      maxPins: PropTypes.number.isRequired,
      maxMarkers: PropTypes.number.isRequired,
      viewAngle: PropTypes.number.isRequired,
  }),

  markers: PropTypes.arrayOf(
    PropTypes.exact({
      lat: PropTypes.number.isRequired,
      lon: PropTypes.number.isRequired,
      label: PropTypes.string,
      connected: PropTypes.bool,
    })
  ),

  satellites: PropTypes.arrayOf(
    PropTypes.exact({
      lat: PropTypes.number.isRequired,
      lon: PropTypes.number.isRequired,
      altitude: PropTypes.number.isRequired,
      opts: satOpts
    })
  ),

  constellations: PropTypes.arrayOf(
    PropTypes.exact({
      opts: satOpts,
      sats: PropTypes.arrayOf(
        PropTypes.exact({
          lat: PropTypes.number.isRequired,
          lon: PropTypes.number.isRequired,
          altitude: PropTypes.number.isRequired,
        })
      )
    })
  )
}
