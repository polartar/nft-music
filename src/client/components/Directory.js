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
import '../css/directory.css'

class Sequencer extends Component {
  state = { expand: false }

  constructor(props) {
    super(props)
  }

  expandToggle = () => {
    this.setState({
      expand: !this.state.expand
    })
  }

  render() {
    return (
      <React.StrictMode>
        <div className="containerDirectory scrollBar">
          <Navbar white={true} />
          <div className="directoryBody">
            <div className="currentAuctionWrapper">
              <div className="currentAuctionTitle">CURRENT AUCTION</div>
              <div className="topPanelWrapper">
                <div className="currentAuctionInfo">
                  <img src={AlbumArt} className="currentAuctionPic" />
                  <div className="currentAuctionDetailsWrapper">
                    <div className="currentAuctionPack">COMMODITIES VOL. 2</div>
                    <div className="currentAuctionArtist">Crusty Cuts</div>
                    <div className="auctionExtraInfo">
                      <div className="currentAuctionInfoItem">
                        <div className="currentAuctionInfoItemTitle">
                          TIME LEFT
                        </div>
                        <div className="currentAuctionInfoItemText">
                          22hrs, 45 min, 32 sec
                        </div>
                      </div>
                      <div
                        className="currentAuctionInfoItem"
                        style={{ marginLeft: '40px' }}
                      >
                        <div className="currentAuctionInfoItemTitle">
                          EDITION
                        </div>
                        <div className="currentAuctionInfoItemText">4/5</div>
                      </div>
                    </div>

                    <div className="editionSection  scrollBar ">
                      <div className="currentAuctionEditionTitle">
                        EDITIONS (3/5 sold)
                      </div>
                      <div className="bidItemDirectory">
                        <div className="editionInfoDirectory scrollBar current">
                          <div className="editionNumber">1.</div>{' '}
                          <div className="editionOwner">
                            @kunalchaudharyfe3f2f32f2f
                          </div>
                        </div>
                        <div className="editionPriceDirectory">50.00 ETH</div>
                      </div>
                      <div className="bidItemDirectory">
                        <div className="editionInfoDirectory scrollBar current">
                          <div className="editionNumber">2.</div>{' '}
                          <div className="editionOwner">@Eric Gao</div>
                        </div>
                        <div className="editionPriceDirectory">53.00 ETH</div>
                      </div>
                      <div className="bidItemDirectory">
                        <div className="editionInfoDirectory scrollBar current">
                          <div className="editionNumber">3.</div>{' '}
                          <div className="editionOwner">Currently Bidding</div>
                        </div>
                        <div className="editionPriceDirectory">32:10:03s</div>
                      </div>
                      <div className="bidItemDirectory">
                        <div className="editionInfoDirectory scrollBar current">
                          <div className="editionNumber">3.</div>{' '}
                          <div className="editionOwner">Currently Bidding</div>
                        </div>
                        <div className="editionPriceDirectory">32:10:03s</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="artistSummary scrollBar">
                  Liam O’Neil a.k.a Crusty Cuts is one of the most talented
                  individuals living in Burlington, VT. With an effortless style
                  that weaves the worlds of skate, snowboard, and hip hop
                  cultures, Liam stands in stark contrast to most millennial
                  DJ’s. Harnessing the authenticity that comes from playing real
                  vinyl during his live sets and incorporating analog equipment
                  into his production work, the music he creates under the
                  Crusty Cuts moniker is an airy reprieve from the heavy digital
                  sounds coming from most modern speakers. Harnessing the
                  authenticity that comes from playing real vinyl during his
                  live sets and incorporating analog equipment into his
                  production work, the music he creates under the Crusty Cuts
                  moniker is an airy reprieve from the heavy digital sounds
                  coming from most modern speakers. Liam O’Neil a.k.a Crusty
                  Cuts is one of the most talented individuals Liam O’Neil a.k.a
                  Crusty Cuts is one of the most talented individuals Liam
                  O’Neil a.k.a Crusty Cuts is one of the most talented
                  individuals - Matt McGinnis via Hemetic Trading Co.
                </div>
              </div>
            </div>
            <div className="currentAuctionTitle">PAST AUCTIONS</div>
            <div className="beatPackItem">
              <img src={AlbumArt} className="directoryAlbum" />
              <div className="directoryItemName">COMMODITIES VOL. 2</div>
              <div className="directoryArtistName">Crusty Cuts</div>
              <div className="editionSold">
                <div className="editionSoldText">Editions solid: 5</div>
                <IconButton onClick={this.expandToggle}>
                  <img
                    src={ExpandMore}
                    className={
                      this.state.expand ? 'expandMore expandLess' : 'expandMore'
                    }
                  />
                </IconButton>
              </div>
              {this.state.expand && (
                <React.Fragment>
                  {' '}
                  <div className="bidItemDirectory">
                    <div className="editionInfoDirectory scrollBar">
                      <div className="editionNumber">1.</div>{' '}
                      <div className="editionOwner">
                        @kunalchaudharyfe3f2f32f2f
                      </div>
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
                </React.Fragment>
              )}
            </div>

            <div className="beatPackItem">
              <img src={AlbumArt} className="directoryAlbum" />
              <div className="directoryItemName">COMMODITIES VOL. 2</div>
              <div className="directoryArtistName">Crusty Cuts</div>
              <div className="editionSold">
                <div className="editionSoldText">Editions solid: 5</div>
                <IconButton onClick={this.expandToggle}>
                  <img
                    src={ExpandMore}
                    className={
                      this.state.expand ? 'expandMore expandLess' : 'expandMore'
                    }
                  />
                </IconButton>
              </div>
              {this.state.expand && (
                <React.Fragment>
                  {' '}
                  <div className="bidItemDirectory">
                    <div className="editionInfoDirectory scrollBar">
                      <div className="editionNumber">1.</div>{' '}
                      <div className="editionOwner">
                        @kunalchaudharyfe3f2f32f2f
                      </div>
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
                </React.Fragment>
              )}
            </div>

            <div className="beatPackItem">
              <img src={AlbumArt} className="directoryAlbum" />
              <div className="directoryItemName">COMMODITIES VOL. 2</div>
              <div className="directoryArtistName">Crusty Cuts</div>
              <div className="editionSold">
                <div className="editionSoldText">Editions solid: 5</div>
                <IconButton onClick={this.expandToggle}>
                  <img
                    src={ExpandMore}
                    className={
                      this.state.expand ? 'expandMore expandLess' : 'expandMore'
                    }
                  />
                </IconButton>
              </div>
              {this.state.expand && (
                <React.Fragment>
                  {' '}
                  <div className="bidItemDirectory">
                    <div className="editionInfoDirectory scrollBar">
                      <div className="editionNumber">1.</div>{' '}
                      <div className="editionOwner">
                        @kunalchaudharyfe3f2f32f2f
                      </div>
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
                </React.Fragment>
              )}
            </div>

            <div className="beatPackItem">
              <img src={AlbumArt} className="directoryAlbum" />
              <div className="directoryItemName">COMMODITIES VOL. 2</div>
              <div className="directoryArtistName">Crusty Cuts</div>
              <div className="editionSold">
                <div className="editionSoldText">Editions solid: 5</div>
                <IconButton onClick={this.expandToggle}>
                  <img
                    src={ExpandMore}
                    className={
                      this.state.expand ? 'expandMore expandLess' : 'expandMore'
                    }
                  />
                </IconButton>
              </div>
              {this.state.expand && (
                <React.Fragment>
                  {' '}
                  <div className="bidItemDirectory">
                    <div className="editionInfoDirectory scrollBar">
                      <div className="editionNumber">1.</div>{' '}
                      <div className="editionOwner">
                        @kunalchaudharyfe3f2f32f2f
                      </div>
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
                </React.Fragment>
              )}
            </div>

            <div className="beatPackItem">
              <img src={AlbumArt} className="directoryAlbum" />
              <div className="directoryItemName">COMMODITIES VOL. 2</div>
              <div className="directoryArtistName">Crusty Cuts</div>
              <div className="editionSold">
                <div className="editionSoldText">Editions solid: 5</div>
                <IconButton onClick={this.expandToggle}>
                  <img
                    src={ExpandMore}
                    className={
                      this.state.expand ? 'expandMore expandLess' : 'expandMore'
                    }
                  />
                </IconButton>
              </div>
              {this.state.expand && (
                <React.Fragment>
                  {' '}
                  <div className="bidItemDirectory">
                    <div className="editionInfoDirectory scrollBar">
                      <div className="editionNumber">1.</div>{' '}
                      <div className="editionOwner">
                        @kunalchaudharyfe3f2f32f2f
                      </div>
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
                </React.Fragment>
              )}
            </div>
          </div>

          <Footer white={true} />
        </div>
      </React.StrictMode>
    )
  }
}

export default Sequencer
