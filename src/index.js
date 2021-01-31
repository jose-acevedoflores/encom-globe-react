import React from 'react'
import './styles.module.css'
import Globe from './encom/ReactGlobe';
import PropTypes from 'prop-types';
import grid from './encom/data/grid';
import pinLocations from './encom/data/pin-locations';
import "./load-font.js";

/**
 * Entrypoint for the Encom Globe.
 */
export const EncomGlobe = props => {

  return <Globe {...props} />
}

EncomGlobe.defaultProps = {
  globeConfig:{
    //NOTE: For an example of loading this font check the example/src/index.css  @font-face
    font: "Inconsolata",
    pinsData: pinLocations,
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
  /**
   * Number of dashes visible for the animated diffused signal emitted by the satellites.
   */
  numWaves: PropTypes.number,
  /**
   * color for the individual wave lines
   */
  waveColor: PropTypes.string,
  /**
   * Color for the center circle of the satellite
   */
  coreColor: PropTypes.string,
  /**
   * Color for the outer shell of the satellite
   */
  shieldColor: PropTypes.string,
  /**
   * Size for the satellite
   */
  size: PropTypes.number
});

EncomGlobe.propTypes = {

  /**
   * Width of the div/canvas element that will contain the globe
   */
  width: PropTypes.number.isRequired,

  /**
   * Height of the div/canvas element that will contain the globe
   */
  height: PropTypes.number.isRequired,

  /**
   * Callback notified when the globe is fully mounted
   */
  globeReadyCb: PropTypes.func.isRequired,

  /**
   * Parameters for drawing the globe
   */
  globeConfig: PropTypes.exact({
      /**
       * Font used for the labels on the top of the Pins and the Markers
       */
      font: PropTypes.string.isRequired,

      /**
       * Data for the pins that will be placed on the globe
       */
      pinsData: PropTypes.arrayOf(
        PropTypes.exact({
          /**
           * Lattitude for the pin
           */
          lat: PropTypes.number,
          /**
           * Longitude for the pin
           */
          lng: PropTypes.number,
          /**
           * Label that shows up at the top of the pin
           */
          label: PropTypes.string,
        })
      ).isRequired,

      /**
       * Data for the hexagons that outline the continents
       */
      tiles: PropTypes.arrayOf(
        PropTypes.exact({
          lat: PropTypes.number,
          lon: PropTypes.number,
          /**
           * Triangles that make up a tile
           */
          b: PropTypes.arrayOf(
            PropTypes.exact({
              x: PropTypes.number,
              y: PropTypes.number,
              z: PropTypes.number,
            })
          )
        })
      ).isRequired,
      /**
       * Base color that will be used by pusher.color to generate a set of hues
       * for the tiles
       */
      baseColor: PropTypes.string.isRequired,
      /**
       * Color for the markers
       */
      markerColor: PropTypes.string.isRequired,
      /**
       * Color for the pins
       */
      pinColor: PropTypes.string.isRequired,
      /**
       * Color for the satellites
       */
      satelliteColor: PropTypes.string.isRequired,
      /**
       * Scale of the globe relative to the canvas.
       * 1.0: take full advantage of the canvas
       * 0.5: draw the globe in half the size of the canvas
       */
      scale: PropTypes.number.isRequired,
      /**
       * Time in milliseconds that will take the globe to complete a rotation
       */
      dayLength: PropTypes.number.isRequired,
      /**
       * Time in milliseconds for the duration of the intro animation
       */
      introLinesDuration: PropTypes.number.isRequired,
      /**
       * Maximum number of pins to allow
       * Note: the more pins present, the slower the animation runs
       */
      maxPins: PropTypes.number.isRequired,
      /**
       * Maximum number of markers to allow
       */
      maxMarkers: PropTypes.number.isRequired,
      /**
       * Camera angle framing the globe.
       * 1.0: camera towards the north pole
       * 0.0: camera at equator ecuator
       * -1.0: camera towards the south pole
       */
      viewAngle: PropTypes.number.isRequired,
  }),

  /**
   * Markers to be displayed in the globe
   */
  markers: PropTypes.arrayOf(
    PropTypes.exact({
      lat: PropTypes.number.isRequired,
      lon: PropTypes.number.isRequired,
      /**
       * Label shown alongside the marker
       */
      label: PropTypes.string,
      /**
       * Flag for showing a connecting line between the markers
       */
      connected: PropTypes.bool,
    })
  ),

  /**
   * List of individual satellites (as opposed to a constellation of stas) to be drawn on the globe
   */
  satellites: PropTypes.arrayOf(
    PropTypes.exact({
      lat: PropTypes.number.isRequired,
      lon: PropTypes.number.isRequired,
      altitude: PropTypes.number.isRequired,
      /**
       * Data to configure the style of the satellite
       */
      opts: satOpts
    })
  ),

  /**
   * List of satellites drawn as a unit.
   */
  constellations: PropTypes.arrayOf(
    PropTypes.exact({
      /**
       * Data to configure the style of the satellite
       */
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
