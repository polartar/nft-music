import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import AlbumArt from '../images/albumArt.png'
import InstaPic from '../images/instaPic.png'
import Wallet from '../images/wallet.png'
import WalletBlack from '../images/walletBlack.png'
import SecretGardenLogo from '../images/SecretGarden.png'
import SecretGardenBlack from '../images/SecretGardenBlack.png'
import '../css/navBar.css'
import IconButton from '@material-ui/core/IconButton'

import { ethers, utils } from 'ethers'

export default function Navbar(props) {
  const { white } = props

  const [address, setAddress] = useState()
  const [provider, setProvider] = useState()
  const [balance, setBalance] = useState(0)
  const [isLoggedIntoMetamask, setIsLoggedIntoMetamask] = useState(false)

  useEffect(() => {
    initWallet()
  }, [window.ethereum])

  const initWallet = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)

    const accounts = await provider.listAccounts()

    if (accounts.length > 0) {
      setIsLoggedIntoMetamask(true)
      setProvider(provider)

      const address = await provider.getSigner().getAddress()
      setAddress(address)
      setBalance(await provider.getBalance(address))
    }
  }

  const connectWallet = async () => {
    await window.ethereum.enable()

    const newProvider = new ethers.providers.Web3Provider(window.ethereum)
    const address = await newProvider.getSigner().getAddress()

    setIsLoggedIntoMetamask(true)
    setProvider(newProvider)
    setAddress(address)
  }

  return (
    <React.Fragment>
      <div className={white ? 'timerWrapper white' : 'timerWrapper'}>
        <div className="timer">
          <div className="time">22:45:32</div>
          <div className="nextText">until next auction</div>
        </div>
      </div>
      <div className={white ? 'navBar scrollBar white' : 'navBar scrollBar'}>
        <img
          src={white ? SecretGardenBlack : SecretGardenLogo}
          className="logo"
        />

        {!isLoggedIntoMetamask && (
          <div onClick={connectWallet} className="walletText">
            CONNECT WALLET
          </div>
        )}
        {isLoggedIntoMetamask && (
          <div className="signedInWrapper">
            <div className="walletOuter">
              <img src={white ? WalletBlack : Wallet} className="wallet" />
              <span className="walletAmount">{`${utils.formatEther(
                balance
              )} ETH`}</span>
            </div>
            <div className="userName">{address}</div>
          </div>
        )}
      </div>
    </React.Fragment>
  )
}
