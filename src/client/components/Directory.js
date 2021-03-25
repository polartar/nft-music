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
import Navbar from './Navbar'
import Footer from './Footer'
import '../css/directory.css'

class Sequencer extends Component {
  state = {}

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <React.StrictMode>
        <div className="containerDirectory scrollBar">
          <Navbar white={true} />
          <div className="directoryBody">
            <div className="beatPackItem">
              <img src={AlbumArt} className="directoryAlbum" />
              <div className="directoryItemName">COMMODITIES VOL. 2</div>
              <div className="directoryArtistName">Crusty Cuts</div>
              <div className="bidItemDirectory">
                <div className="editionInfoDirectory scrollBar">
                  <div className="editionNumber">1.</div>{' '}
                  <div className="editionOwner">@kunalchaudharyfe3f2f32f2f</div>
                </div>
                <div className="editionPriceDirectory">50.00 ETH</div>
              </div>
              <div className="bidItemDirectory">
                <div className="editionInfoDirectory scrollBar">
                  <div className="editionNumber">2.</div>{' '}
                  <div className="editionOwner">@Eric Gao</div>
                </div>
                <div className="editionPriceDirectory">53.00 ETH</div>
              </div>
              <div className="bidItemDirectory">
                <div className="editionInfoDirectory scrollBar">
                  <div className="editionNumber">3.</div>{' '}
                  <div className="editionOwner">Currently Bidding</div>
                </div>
                <div className="editionPriceDirectory">32:10:03s</div>
              </div>
            </div>
            <div className="beatPackItem">
              <img src={AlbumArt} className="directoryAlbum" />
              <div className="directoryItemName">COMMODITIES VOL. 2</div>
              <div className="directoryArtistName">OKSAMI</div>
              <div className="bidItemDirectory">
                <div className="editionInfoDirectory scrollBar">
                  <div className="editionNumber">1.</div>{' '}
                  <div className="editionOwner">@MarkMurphy</div>
                </div>
                <div className="editionPriceDirectory">50.00 ETH</div>
              </div>
            </div>
            <div className="beatPackItem">
              <img src={AlbumArt} className="directoryAlbum" />
              <div className="directoryItemName">COMMODITIES VOL. 2</div>
              <div className="directoryArtistName">OKSAMI</div>
              <div className="bidItemDirectory">
                <div className="editionInfoDirectory scrollBar">
                  <div className="editionNumber">1.</div>{' '}
                  <div className="editionOwner">@MarkMurphy</div>
                </div>
                <div className="editionPriceDirectory">50.00 ETH</div>
              </div>
            </div>
            <div className="beatPackItem">
              <img src={AlbumArt} className="directoryAlbum" />
              <div className="directoryItemName">COMMODITIES VOL. 2</div>
              <div className="directoryArtistName">OKSAMI</div>
              <div className="bidItemDirectory">
                <div className="editionInfoDirectory scrollBar">
                  <div className="editionNumber">1.</div>{' '}
                  <div className="editionOwner">@MarkMurphy</div>
                </div>
                <div className="editionPriceDirectory">50.00 ETH</div>
              </div>
            </div>
            <div className="beatPackItem">
              <img src={AlbumArt} className="directoryAlbum" />
              <div className="directoryItemName">COMMODITIES VOL. 2</div>
              <div className="directoryArtistName">OKSAMI</div>
              <div className="bidItemDirectory">
                <div className="editionInfoDirectory scrollBar">
                  <div className="editionNumber">1.</div>{' '}
                  <div className="editionOwner">@MarkMurphy</div>
                </div>
                <div className="editionPriceDirectory">50.00 ETH</div>
              </div>
            </div>
          </div>
          <Footer white={true} />
        </div>
      </React.StrictMode>
    )
  }
}

export default Sequencer
