/* eslint-disable react/no-unused-state, react/no-array-index-key */
import React, { Component, createRef } from 'react'
import cx from 'classnames'

// import Canvas from './Canvas';
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'

import { makeStyles } from '@material-ui/core/styles'
import LinearProgress from '@material-ui/core/LinearProgress'
import SecretGardenLogo from '../images/SecretGarden.png'
import AlbumArt from '../images/albumArt.png'
import InstaPic from '../images/instaPic.png'
import Wallet from '../images/wallet.png'
import Expand from '../images/expand.png'
import ExpandMore from '../images/expandMore.png'
import Navbar from './Navbar'
import Footer from './Footer'
import '../css/settings.css'

class Sequencer extends Component {
  state = { expand: false }

  constructor(props) {
    super(props)
  }


  render() {
    return (
      <React.StrictMode>
        <div className="containerSettings scrollBar">
          <Navbar white={false} />
          <div className="settingsBody">
              <div className="settingsTitle">
                  SETTINGS
              </div>
              <div className="settingsItem">
                  <div className="settingsItemTitle">
                      Username
                  </div>
                  <input className="settingsInput"/>
                    <Button className="updateButton">Update</Button>
              </div>
              <div className="settingsItem">
                  <div className="settingsItemTitle">
                      Email
                  </div>
                  <input className="settingsInput"/>
                    <Button className="updateButton">Update</Button>
              </div>
          </div>
          <Footer white={false} />
        </div>
      </React.StrictMode>
    )
  }
}

export default Sequencer
