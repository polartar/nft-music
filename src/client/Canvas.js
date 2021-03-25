/* eslint-disable react/no-unused-state, react/no-array-index-key */
import React, { Component } from 'react'
import cx from 'classnames'
import Synth from './Synth'
import Canvas from './Canvas'

import { makeStyles } from '@material-ui/core/styles'

import NOTES from './notes'
import * as Tone from 'tone'

class Sequencer extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return <Canvas />
  }
}

export default Canvas
