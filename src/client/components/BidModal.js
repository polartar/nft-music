import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import X from '../images/x.png'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import AlbumArt from '../images/albumArt.png'
import InstaPic from '../images/instaPic.png'
import '../css/bidModal.css'
import IconButton from '@material-ui/core/IconButton'

import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles({
  dialog: {
    width: '494px',
    maxWidth: '100%',
    background: '#1f1f1f',
    border: '1px solid #FFFFFF',
    boxShadow: '0 0 40px 20px rgba(255,255,255,0.12)'
  },
  backButton: {
    border: 'solid 1px white',
    borderRadius: '0px',
    height: '41px',
    paddingLeft: '24px',
    paddingRight: '24px',
    color: 'white',
    fontSize: '16px',
    backgroundColor: '#1f1f1f',
    textTransform: 'none',
    fontWeight: '400'
  },
  continueButton: {
    border: 'solid 1px white',
    borderRadius: '0px',
    height: '41px',
    paddingLeft: '24px',
    paddingRight: '24px',
    color: '#1f1f1f',
    fontSize: '16px',
    backgroundColor: 'white',
    textTransform: 'none',
    fontWeight: '400'
  }
})

export default function SimpleDialog(props) {
  const classes = useStyles()
  const { onClose, open } = props

  return (
    <Dialog
      onClose={onClose}
      classes={{ paper: classes.dialog }}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <div className="modalHeader">
        <div className="modalTitle">Make an Offer</div>
        <IconButton>
          <img src={X} className="x" onClick={onClose} />
        </IconButton>
      </div>
      <div className="modalBody">
        <div className="beatWrapper">
          <img src={AlbumArt} className="checkoutArt" />
          <div className="beatInfoCheckout">
            <div className="beatCheckoutName">COMMODITIES VOL. 2</div>
            <div className="beatArtist">Crusty Cuts</div>
          </div>
        </div>
        <div className="checkoutForm">
          <div className="yourBid">
            <div className="yourBid">YOUR BID</div>
            <div className="totalWallet">Balance: 25.6984</div>
          </div>
          <input className="ethInput" placeHolder="0.00" />
          <div className="ethLabel">ETH</div>
        </div>
        {/* <div className="congratsBidSection">
          <div className="congratsMessage">Congrats on placing your bid!</div>
          <div className="congratsAmount">Bid: 10.2543 WETH</div>
        </div> */}
        <div className="modalFooter">
          <Button
            variant="outlined"
            classes={{ root: classes.backButton }}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="outlined"
            classes={{ root: classes.continueButton }}
            className="continueButton"
          >
            Transfer to WETH
          </Button>
        </div>
      </div>
    </Dialog>
  )
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
}
