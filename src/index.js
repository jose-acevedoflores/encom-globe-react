import React from 'react'
import styles from './styles.module.css'
import Globe from './encom/ReactGlobe';
import PropTypes from 'prop-types';

export const EncomGlobe = ({ width, height, demo }) => {
  return <Globe
      width={width}
      height={height}
      demo
  />
}

EncomGlobe.propTypes = {
  show: PropTypes.bool,
  demo: PropTypes.bool,
  width: PropTypes.number,
  height: PropTypes.number,
}
