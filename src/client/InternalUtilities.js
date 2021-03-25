/* eslint-disable react/no-unused-state, react/no-array-index-key */
import React, { Component } from "react";
import Sequencer from "./Sequencer";
import Directory from "./components/Directory";
import cx from "classnames";

import { ethers } from "ethers";
import * as Web3 from "web3";
import axios from "axios";
import { OpenSeaPort, Network } from "opensea-js";
import { WyvernSchemaName } from "opensea-js/lib/types";

const DEV = true;
const subgraphURL = DEV
  ? "https://api.thegraph.com/subgraphs/name/ourzora/zora-v1-rinkeby"
  : "https://api.thegraph.com/subgraphs/name/ourzora/zora-v1";

class InternalUtilities extends Component {
  state = {};

  constructor(props) {
    super(props);
    // this.mint()
  }

  seaport = null;
  signer = null;
  address = null;

  async mint() {
    await window.ethereum.enable();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    this.signer = provider.getSigner();
    this.address = await this.signer.getAddress();
    this.seaport = new OpenSeaPort(window.ethereum, {
      networkName: DEV ? Network.Rinkeby : Network.Main,
    });
    console.log(this.seaport);

    // await this.convertETH()
    await this.bid(
      "98528311032549299881367091319550837448714744926528402074661256243545450217473"
    );
  }

  async convertETH() {
    const weth = DEV
      ? "0xc778417e063141139fce010982780140aa0cd5ab"
      : "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";

    const wrapTx = await this.seaport.wrapEth({
      amountInEth: 0.001,
      accountAddress: this.address,
    });
  }

  async bid(tokenId) {
    // REPLACE THIS WITH THE PROD ADDRESS
    const tokenAddress = DEV
      ? "0xee45b41d1ac24e9a620169994deb22739f64f231"
      : "0xee45b41d1ac24e9a620169994deb22739f64f231";
    const asset = await this.seaport.api.getAsset({
      tokenAddress,
      tokenId,
    });

    const accountAddress = this.address;

    console.log({
      asset: {
        tokenId,
        tokenAddress,
        schemaName: WyvernSchemaName.ERC1155,
      },
      accountAddress,
      // Value of the offer, in units of the payment token (or wrapped ETH if none is specified):
      startAmount: 0.001,
    });

    const offer = await this.seaport.createBuyOrder({
      asset: {
        tokenId,
        tokenAddress,
        schemaName: WyvernSchemaName.ERC1155,
      },
      accountAddress,
      // Value of the offer, in units of the payment token (or wrapped ETH if none is specified):
      startAmount: 0.002,
    });
  }

  render() {
    return <Sequencer />;
    // return <Directory />
  }
}

export default InternalUtilities;
