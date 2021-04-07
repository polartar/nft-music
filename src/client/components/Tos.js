/* eslint-disable react/no-unused-state, react/no-array-index-key */
import React, { Component, createRef, useState, useEffect } from "react";
import cx from "classnames";

// import Canvas from './Canvas';
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";

import { makeStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
import SecretGardenLogo from "../images/SecretGarden.png";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Loading from "../images/loading.gif";
import "../css/settings.css";

import axios from "axios";
import { ethers, utils } from "ethers";

function Tos(props) {
  return (
    <React.StrictMode>
      <div className="tosContainer scrollBar">
        {/* <Navbar white={false} didConnectWallet={refreshData} /> */}

        <p class="p1">
          <span class="s1">SecretGarden - Terms of Platform</span>
        </p>
        <p class="p1">
          <span class="s1">Last Updated:&nbsp;</span>
          <span class="s2">April 5, 202</span>
          <span class="s1">1</span>
        </p>
        <p class="p2">
          <br />
        </p>
        <p class="p2">
          <br />
        </p>
        <p class="p3">
          <span class="s1">
            <strong>Welcome</strong>
          </span>
        </p>
        <p class="p2">
          <br />
        </p>
        <p class="p3">
          <span class="s1">
            SecretGarden (&ldquo;SecretGarden,&rdquo; &ldquo;we,&rdquo;
            &ldquo;us,&rdquo; &ldquo;our&rdquo;) provides its marketplace and
            services (described below) to you (&ldquo;you&rdquo; or
            &ldquo;User&quot;) through its website, platform, and marketplace
            located at www.SecretGarden.app (the &ldquo;Platform&rdquo;),
            subject to the following Terms of Service (as amended from time to
            time, the &ldquo;Terms&rdquo;).
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>By signing up
            for an account on the Platform or otherwise using or accessing the
            Platform, you acknowledge that you have read and agree to these
            Terms.
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>The&nbsp;
          </span>
          <span class="s2">Privacy Policy</span>
          <span class="s1">
            , and all such additional terms, guidelines, and rules are hereby
            incorporated by reference into these Terms and expressly agreed to
            and acknowledged by the User.
          </span>
        </p>
        <p class="p2">
          <br />
        </p>
        <p class="p4">
          <span class="s1">
            <strong>
              <em>
                PLEASE READ THESE TERMS OF PLATFORM CAREFULLY, AS THEY CONTAIN
                AN AGREEMENT TO ARBITRATE AND OTHER IMPORTANT INFORMATION
                REGARDING YOUR LEGAL RIGHTS, REMEDIES, AND OBLIGATIONS.
                <span class="Apple-converted-space">&nbsp;&nbsp;</span>THE
                AGREEMENT TO ARBITRATE REQUIRES (WITH LIMITED EXCEPTION) THAT
                YOU SUBMIT CLAIMS YOU HAVE AGAINST US TO BINDING AND FINAL
                ARBITRATION, AND FURTHER (1) YOU WILL ONLY BE PERMITTED TO
                PURSUE CLAIMS AGAINST SECRETGARDEN ON AN INDIVIDUAL BASIS, NOT
                AS A PLAINTIFF OR CLASS MEMBER IN ANY CLASS OR REPRESENTATIVE
                ACTION OR PROCEEDING, (2) YOU WILL ONLY BE PERMITTED TO SEEK
                RELIEF (INCLUDING MONETARY, INJUNCTIVE, AND DECLARATORY RELIEF)
                ON AN INDIVIDUAL BASIS, AND (3) YOU MAY NOT BE ABLE TO HAVE ANY
                CLAIMS YOU HAVE AGAINST US RESOLVED BY A JURY OR IN A COURT OF
                LAW.
              </em>
            </strong>
          </span>
        </p>
        <p class="p2">
          <br />
        </p>
        <p class="p3">
          <span class="s1">
            We reserve the right, at our sole discretion, to change or modify
            portions of these Terms of Service at any time.
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>If we do
            this, we will post the changes on this page and will indicate at the
            top of this page the date these terms were last revised.
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>We will also
            notify you, either through the Platform user interface, in an email
            notification or through other reasonable means.
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>Any such
            changes will become effective no earlier than fourteen (14) days
            after they are posted, except that changes addressing new functions
            of the Platform will be effective immediately.
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>Your
            continued use of the Platform and after the date any such changes
            become effective constitutes your acceptance of the new Terms of
            Service.
          </span>
        </p>
        <p class="p2">
          <br />
        </p>
        <p class="p3">
          <span class="s1">
            <strong>What is SecretGarden?</strong>
          </span>
        </p>
        <p class="p2">
          <br />
        </p>
        <p class="p3">
          <span class="s1">
            SecretGarden is a platform for artists (&ldquo;Creators&rdquo;) and
            collectors (&ldquo;Collectors&rdquo;) to sell, purchase, list for
            auction, make offers, and bid (each a &ldquo;Transaction&rdquo;) on
            digital music, audiovisual, or other art represented on a
            non-fungible Ethereum-based tokens (&ldquo;Digital Artwork&rdquo;).{" "}
            <span class="Apple-converted-space">&nbsp;</span>
          </span>
        </p>
        <p class="p2">
          <br />
        </p>
        <p class="p5">
          <span class="s1">
            <strong>Smart-Contract Enabled.</strong>
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>The Digital
            Artwork on SecretGarden is represented on smart contracts on the
            Ethereum blockchain that provides an immutable ledger of all
            transactions that occur on SecretGarden (&ldquo;Smart
            Contracts&rdquo;).
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>This means
            that all Digital Artwork is outside of the control of any one party,
            including SecretGarden, and is subject to many risks and
            uncertainties.
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>We neither
            own nor control MetaMask, Coinbase, the Ethereum network, your
            browser, or any other third party site, product, or service that you
            might access, visit, or use for the purpose of enabling you to use
            the various features of the Platform. We will not be liable for the
            acts or omissions of any such third parties, nor will we be liable
            for any damage that you may suffer as a result of your transactions
            or any other interaction with any such third parties.
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>The User
            understands that your Ethereum public address will be made publicly
            visible whenever you engage in a transaction on the Platform.&nbsp;
          </span>
        </p>
        <p class="p2">
          <br />
        </p>
        <p class="p3">
          <span class="s1">
            &nbsp; &nbsp; <strong>Curated Digital Artwork</strong>.
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>
            SecretGarden offers a marketplace for Digital Artwork in which
            SecretGarden enables Creators to sell and Collectors to buy Digital
            Artwork. The User understands and acknowledges that the Smart
            Contracts give SecretGarden custody, possession, or control of any
            Digital Artwork or cryptocurrency for the purpose of facilitating
            Digital Artwork transactions. &nbsp;You affirm that you are aware
            and acknowledge that SecretGarden takes custody of the Digital
            Artwork during the period after SecretGarden reviews and accepts a
            Creator&rsquo;s Digital Artwork submission and such Digital Artwork
            is sold to a Collector or the Creator requests to take custody of
            the Digital Artwork prior to a sale.
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>As a
            marketplace, SecretGarden cannot make any representation or
            guarantee that Creators will achieve any particular outcome as the
            result of listing their Digital Artwork on SecretGarden.
            <span class="Apple-converted-space">&nbsp;</span>
          </span>
        </p>
        <p class="p2">
          <br />
        </p>
        <p class="p3">
          <span class="s1">
            <strong>How do I use SecretGarden?</strong>
          </span>
        </p>
        <p class="p2">
          <br />
        </p>
        <p class="p5">
          <span class="s1">
            <strong>Your Registration Obligations</strong>:
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>Anyone can
            browse SecretGarden without registering for an account. You may be
            required to register with SecretGarden in order to access and use
            certain features on the Platform, such as participating as a Creator
            or Collector.
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>If you choose
            to register for the Platform, you agree to provide and maintain
            true, accurate, current, and complete information about yourself as
            prompted by our registration form.
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>
            Registration data and certain other information about you are
            governed by our Privacy Policy.
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>You must be
            at least 13 years old to register for an account as a Creator, and
            at least 18 years old to place a bid on any Digital Artwork. If you
            are between 13 and 18 years old, you must have the expressed
            permission of a parent or legal guardian who can accept these Terms
            on your behalf. You are responsible for anything that occurs when
            anyone is signed in to your account, as well as the security of the
            account.
          </span>
        </p>
        <p class="p2">
          <br />
        </p>
        <p class="p3">
          <span class="s1">
            <strong>
              &nbsp; &nbsp; Member Account, Password, and Security:&nbsp;
            </strong>
            You are responsible for maintaining the confidentiality of your
            account and password, if any, and are fully responsible for any and
            all activities that occur under your password or account.
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>You agree to
            (a) immediately notify SecretGarden of any unauthorized use of your
            password or account or any other breach of security, and (b) ensure
            that you exit from your account at the end of each session when
            accessing SecretGarden.
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>
            SecretGarden will not be liable for any loss or damage arising from
            your failure to comply with this Section.
          </span>
        </p>
        <p class="p2">
          <br />
        </p>
        <p class="p5">
          <span class="s1">
            <strong>Connecting your Wallet:</strong>
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>In order to
            participate as a Collector in the marketplace, you must connect to a
            browser extension called MetaMask. MetaMask is an electronic wallet
            which allows you to purchase , store, and engage in transactions
            using the native Ethereum cryptocurrency, ETH.
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>All
            transactions on SecretGarden are in the native Ethereum
            cryptocurrency, ETH.
            <span class="Apple-converted-space">&nbsp;</span>
          </span>
        </p>
        <p class="p2">
          <br />
        </p>
        <p class="p3">
          <span class="s1">
            <strong>&nbsp; &nbsp; Modifications to the Platform:&nbsp;</strong>
            SecretGarden reserves the right to modify or discontinue,
            temporarily or permanently, the Platform (or any part thereof) with
            or without notice.
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>You agree
            that SecretGarden will not be liable to you or to any third party
            for any modification, suspension, or discontinuance of the Platform.
          </span>
        </p>
        <p class="p2">
          <br />
        </p>
        <p class="p3">
          <span class="s1">
            <strong>What are the rules for using SecretGarden?</strong>
          </span>
        </p>
        <p class="p2">
          <br />
        </p>
        <p class="p3">
          <span class="s1">
            When using SecretGarden, no User is allowed to:
          </span>
        </p>
        <p class="p2">
          <br />
        </p>
        <ul class="ul1">
          <li class="li3">
            <span class="s1">
              manipulate the price of a Digital Artwork in any way, including
              bidding on your own items, preventing bidding, or using
              SecretGarden to conceal economic activity.
            </span>
          </li>
          <li class="li3">
            <span class="s1">
              email or otherwise upload any content that (i) infringes any
              intellectual property or other proprietary rights of any party;
              (ii) you do not have a right to upload under any law or under
              contractual or fiduciary relationships; (iii) contains software
              viruses or any other computer code, files or programs designed to
              interrupt, destroy or limit the functionality of any computer
              software or hardware or telecommunications equipment; (iv) poses
              or creates a privacy or security risk to any person; (v)
              constitutes unsolicited or unauthorized advertising, promotional
              materials, commercial activities and/or sales, &ldquo;junk
              mail,&rdquo; &ldquo;spam,&rdquo; &ldquo;chain letters,&rdquo;
              &ldquo;pyramid schemes,&rdquo; &ldquo;contests,&rdquo;
              &ldquo;sweepstakes,&rdquo; or any other form of solicitation; (vi)
              is unlawful, harmful, threatening, abusive, harassing, tortious,
              excessively violent, defamatory, vulgar, obscene, pornographic,
              libelous, invasive of another&rsquo;s privacy, hateful racially,
              ethnically or otherwise objectionable; or (vii) in the sole
              judgment of SecretGarden, is objectionable or which restricts or
              inhibits any other person from using or enjoying the Platform, or
              which may expose SecretGarden or its users to any harm or
              liability of any type;
            </span>
          </li>
          <li class="li3">
            <span class="s1">
              interfere with or disrupt the Platform or servers or networks
              connected to the Platform, or disobey any requirements,
              procedures, policies or regulations of networks connected to the
              Platform ; or
              <span class="Apple-converted-space">&nbsp;</span>
            </span>
          </li>
          <li class="li3">
            <span class="s1">
              violate any applicable local, state, national or international
              law, or any regulations having the force of law, including but not
              limited to the U.S. Department of Treasury&rsquo;s Office of
              Foreign Assets Control (&ldquo;OFAC&rdquo;), or which would
              involve proceeds of any unlawful activity;
              <span class="Apple-converted-space">&nbsp;</span>
            </span>
          </li>
          <li class="li3">
            <span class="s1">
              impersonate any person or entity, or falsely state or otherwise
              misrepresent your affiliation with a person or entity;
            </span>
          </li>
          <li class="li3">
            <span class="s1">
              solicit personal information from anyone under the age of 18;
            </span>
          </li>
          <li class="li3">
            <span class="s1">
              harvest or collect email addresses or other contact information of
              other Users from the Platform by electronic or other means for the
              purposes of sending unsolicited emails or other unsolicited
              communications;
            </span>
          </li>
          <li class="li3">
            <span class="s1">
              advertise or offer to sell or buy any goods or services for any
              business purpose that is not specifically authorized;
            </span>
          </li>
          <li class="li3">
            <span class="s1">
              further or promote any criminal activity or enterprise or provide
              instructional information about illegal activities, including for
              the purpose of concealing economic activity, laundering money, or
              financing terrorism;
              <span class="Apple-converted-space">&nbsp;</span>
            </span>
          </li>
          <li class="li3">
            <span class="s1">
              obtain or attempt to access or otherwise obtain any materials or
              information through any means not intentionally made available or
              provided for through the Platform;
              <span class="Apple-converted-space">&nbsp;</span>
            </span>
          </li>
          <li class="li3">
            <span class="s1">
              &nbsp;use any robot, spider, site search/retrieval application, or
              other device to retrieve or index any portion of the Platform or
              the content posted on the Platform, or to collect information
              about its Users for any unauthorized purpose;
            </span>
          </li>
          <li class="li3">
            <span class="s1">
              create user accounts by automated means or under false or
              fraudulent pretenses;
              <span class="Apple-converted-space">&nbsp;</span>
            </span>
          </li>
          <li class="li3">
            <span class="s1">
              access or use the Platform for the purpose of creating a product
              or service that is competitive with any of our products or
              services.
            </span>
          </li>
        </ul>
        <p class="p6">
          <br />
        </p>
        <p class="p3">
          <span class="s1">
            <strong>How do I become a creator?</strong>
          </span>
        </p>
        <p class="p2">
          <br />
        </p>
        <p class="p5">
          <span class="s1">
            SecretGarden is currently invite only, and Artists need an
            invitation in order to become a Creator on SecretGarden.
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>Selling
            invitations is strictly prohibited.
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>If
            SecretGarden become aware that any invitation is being sold to a
            third party, SecretGarden may suspend or otherwise terminate your
            access to SecretGarden.
          </span>
        </p>
        <p class="p2">
          <br />
        </p>
        <p class="p5">
          <span class="s1">
            SecretGarden maintains complete discretion in selecting the artists
            in its marketplace, and makes no guarantees or promises that any
            artists will be approved as Creators even if SecretGarden solicited
            the request.
          </span>
        </p>
        <p class="p2">
          <br />
        </p>
        <p class="p3">
          <span class="s1">
            <strong>
              What are the intellectual property rights on the Platform?
            </strong>
          </span>
        </p>
        <p class="p2">
          <br />
        </p>
        <p class="p5">
          <span class="s1">
            <strong>Creator Rights</strong>
          </span>
        </p>
        <p class="p7">
          <br />
        </p>
        <p class="p5">
          <span class="s1">
            The Creator owns all legal right, title, and interest in all
            intellectual property rights underlying the Digital Artwork minted
            by the Creator on the Platform, including but not limited to
            copyrights and trademarks. As the copyright owner, the Creator has
            the right to reproduce, prepare derivative Digital Artwork,
            distribute, and display or perform the Digital Artwork.
            <span class="Apple-converted-space">&nbsp;</span>
          </span>
        </p>
        <p class="p7">
          <br />
        </p>
        <p class="p5">
          <span class="s1">
            Creators hereby acknowledges, understands, and agrees that selling a
            Digital Artwork on SecretGarden constitutes an express
            representation, warranty, and covenant that the Creator has not,
            will not, and will not cause another to sell, tokenize, or create
            another cryptographic token representing a digital collectible for
            the same Digital Artwork, excepting, without limitation, the
            Creator&rsquo;s ability to sell, tokenize, or create a cryptographic
            token or other digital asset representing a legal, economic, or
            other interest relating to any of the exclusive rights belonging to
            the Creator under copyright law.
          </span>
        </p>
        <p class="p7">
          <br />
        </p>
        <p class="p5">
          <span class="s1">
            The Creator hereby acknowledges, understands, and agrees that
            launching a Digital Artwork on SecretGarden constitutes an express
            and affirmative grant to SecretGarden, its affiliates and successors
            a non-exclusive, world-wide, assignable, sublicensable, perpetual,
            and royalty-free license to make copies of, display, perform,
            reproduce, and distribute the Digital Artwork on any media whether
            now known or later discovered for the broad purpose of operating,
            promoting, sharing, developing, marketing, and advertising the
            Platform, or any other purpose related to SecretGarden, including
            without limitation, the express right to: (i) display or perform the
            Digital Artwork on the Platform, a third party platform, social
            media posts, blogs, editorials, advertising, market reports, virtual
            galleries, museums, virtual environments, editorials, or to the
            public; (ii) create and distribute digital or physical derivative
            Digital Artwork based on the Digital Artwork; (iii) indexing the
            Digital Artwork in electronic databases, indexes, catalogues; and
            (iv) hosting, storing, distributing, and reproducing one or more
            copies of the Digital Artwork within a distributed file keeping
            system, node cluster, or other database (e.g., IPFS) or causing,
            directing, or soliciting others to do so.
          </span>
        </p>
        <p class="p7">
          <br />
        </p>
        <p class="p5">
          <span class="s1">
            Creators expressly represent and warrant that their Digital Artwork
            listed on SecretGarden contains only original content otherwise
            authorized for use by the Creator, and does not contain unlicensed
            or unauthorized copyrighted content, including any imagery, design,
            audio, video, human likeness, or other unoriginal content not
            created by the Creator, not authorized for use by the Creator, not
            in the public domain, or otherwise without a valid claim of fair
            use, the Creator further represents and warrants that it has
            permission to incorporate the unoriginal content.
            <span class="Apple-converted-space">&nbsp;</span>
          </span>
        </p>
        <p class="p7">
          <br />
        </p>
        <p class="p5">
          <span class="s1">
            <strong>Collectors Rights</strong>
          </span>
        </p>
        <p class="p7">
          <br />
        </p>
        <p class="p5">
          <span class="s1">
            Collectors receive a cryptographic token representing the
            Creator&rsquo;s Digital Artwork as a piece of property, but do not
            own the creative work itself. Collectors may display and share the
            Digital Artwork, but Collectors do not have any legal ownership,
            right, or title to any copyrights, trademarks, or other intellectual
            property rights to the Digital Artwork, excepting the limited
            license to the Digital Artwork granted by these Terms.
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>Upon
            collecting a Digital Artwork, Collectors receive a limited,
            worldwide, non-assignable, non-sublicensable, royalty-free license
            to display the Digital Artwork legally owned and properly obtained
            by the Collector.
          </span>
        </p>
        <p class="p7">
          <br />
        </p>
        <p class="p5">
          <span class="s1">
            The Collector&rsquo;s limited license to display the Digital
            Artwork, includes, but is not limited to, the right to display the
            Digital Artwork privately or publicly: (i) for the purpose of
            promoting or sharing the Collector&rsquo;s purchase, ownership, or
            interest, (ii) for the purpose of sharing, promoting, discussing, or
            commenting on the Digital Artwork; (iii) on third party
            marketplaces, exchanges, platforms, or applications in association
            with an offer to sell, or trade, the Digital Artwork; and (iv)
            within decentralized virtual environments, virtual worlds, virtual
            galleries, virtual museums, or other navigable and perceivable
            virtual environments.{" "}
            <span class="Apple-converted-space">&nbsp;</span>
          </span>
        </p>
        <p class="p7">
          <br />
        </p>
        <p class="p5">
          <span class="s1">
            Collectors have the right to sell, trade, transfer, or use their
            Digital Artwork, but Collectors may not make &ldquo;commercial
            use&rdquo; of the Digital Artwork.{" "}
            <span class="Apple-converted-space">&nbsp;</span>
          </span>
        </p>
        <p class="p7">
          <br />
        </p>
        <p class="p5">
          <span class="s1">
            The Collector agrees that it may not, nor permit any third party, to
            do or attempt to do any of the foregoing without the Creator&rsquo;s
            express prior written consent in each case: (i) modify, distort,
            mutilate, or perform any other modification to the Work which would
            be prejudicial to the Creator&rsquo;s honor or reputation; (ii) use
            the Digital Artwork to advertise, market, or sell any third party
            product or service; (iii) use the Digital Artwork in connection with
            images, videos, or other forms of media that depict hatred,
            intolerance, violence, cruelty, or anything else that could
            reasonably be found to constitute hate speech or otherwise infringe
            upon the rights of others; (iv) incorporate the Digital Artwork in
            movies, videos, video games, or any other forms of media for a
            commercial purpose, except to the limited extent that such use is
            expressly permitted by these Terms or solely for your
            Collector&rsquo;s personal, non-commercial use; (v) sell, distribute
            for commercial gain, or otherwise commercialize merchandise that
            includes, contains, or consists of the Digital Artwork; (vi) attempt
            to trademark, copyright, or otherwise acquire additional
            intellectual property rights in or to the Digital Artwork; (vii)
            attempt to mint, tokenize, or create an additional cryptographic
            token representing the same Digital Artwork, whether on or off of
            the SecretGarden Platform; (viii) falsify, misrepresent, or conceal
            the authorship of the Digital Artwork; or (ix) otherwise utilize the
            Digital Artwork for the Collector&rsquo;s or any third party&rsquo;s
            commercial benefit.
          </span>
        </p>
        <p class="p7">
          <br />
        </p>
        <p class="p5">
          <span class="s1">
            Collectors irrevocably release, acquit, and forever discharge
            SecretGarden and its subsidiaries, affiliates, officers, and
            successors of any liability for direct or indirect copyright or
            trademark infringement for SecretGarden use of a Digital Artwork in
            accordance with these Terms.
          </span>
        </p>
        <p class="p7">
          <br />
        </p>
        <p class="p5">
          <span class="s1">
            <strong>Platform Content, Software and Trademarks:&nbsp;</strong>
            You acknowledge and agree that the Platform may contain content or
            features (&ldquo;Platform Content&rdquo;) that are protected by
            copyright, patent, trademark, trade secret or other proprietary
            rights and laws.
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>Except as
            expressly authorized by SecretGarden, you agree not to modify, copy,
            frame, scrape, rent, lease, loan, sell, distribute or create
            derivative works based on the Platform or the Platform Content, in
            whole or in part.
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>In connection
            with your use of the Platform you will not engage in or use any data
            mining, robots, scraping or similar data gathering or extraction
            methods.
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>If you are
            blocked by SecretGarden from accessing the Platform (including by
            blocking your IP address), you agree not to implement any measures
            to circumvent such blocking (e.g., by masking your IP address or
            using a proxy IP address).
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>Any use of
            the Platform or the Platform Content other than as specifically
            authorized herein is strictly prohibited.
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>The
            technology and software underlying the Platform or distributed in
            connection therewith are the property of SecretGarden, our
            affiliates and our partners (the &ldquo;Software&rdquo;).
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>You agree not
            to copy, modify, create a derivative work of, reverse engineer,
            reverse assemble or otherwise attempt to discover any source code,
            sell, assign, sublicense, or otherwise transfer any right in the
            Software.
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>Any rights
            not expressly granted herein are reserved by SecretGarden.
          </span>
        </p>
        <p class="p2">
          <br />
        </p>
        <p class="p5">
          <span class="s1">
            The SecretGarden name and logos are trademarks and service marks of
            SecretGarden (collectively the &ldquo;SecretGarden
            Trademarks&rdquo;). Other company, product, and service names and
            logos used and displayed via the Platform may be trademarks or
            service marks of their respective owners who may or may not endorse
            or be affiliated with or connected to SecretGarden. Nothing in this
            Terms of Service or the Platform should be construed as granting, by
            implication, estoppel, or otherwise, any license or right to use any
            of SecretGarden Trademarks displayed on the Platform, without our
            prior written permission in each instance. All goodwill generated
            from the use of SecretGarden Trademarks will inure to our exclusive
            benefit.
          </span>
        </p>
        <p class="p2">
          <br />
        </p>
        <p class="p3">
          <span class="s1">
            &nbsp; &nbsp;{" "}
            <strong>
              Third Party Material:
              <span class="Apple-converted-space">&nbsp;&nbsp;</span>
            </strong>
            Under no circumstances will SecretGarden be liable in any way for
            any content or materials of any third parties (including users),
            including, but not limited to, for any errors or omissions in any
            content, or for any loss or damage of any kind incurred as a result
            of the use of any such content.
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>You
            acknowledge that SecretGarden does not pre-screen content, but that
            SecretGarden and its designees will have the right (but not the
            obligation) in their sole discretion to refuse or remove any content
            that is available via the Platform . Without limiting the foregoing,
            SecretGarden and its designees will have the right to remove any
            content that violates these Terms of Service or is deemed by
            Platform, in its sole discretion, to be otherwise objectionable. You
            agree that you must evaluate, and bear all risks associated with,
            the use of any content, including any reliance on the accuracy,
            completeness, or usefulness of such content.
            <span class="Apple-converted-space">&nbsp;</span>
          </span>
        </p>
        <p class="p2">
          <br />
        </p>
        <p class="p3">
          <span class="s1">
            &nbsp; &nbsp;{" "}
            <strong>
              User Content Transmitted Through the Platform:
              <span class="Apple-converted-space">&nbsp;&nbsp;</span>
            </strong>
            With respect to the content, Digital Artwork, or other materials you
            upload through the Platform or share with other users or recipients
            (collectively, &ldquo;User Content&rdquo;), you represent and
            warrant that you own all right, title and interest in and to such
            User Content, including, without limitation, all copyrights and
            rights of publicity contained therein.
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>By uploading
            any User Content you hereby grant and will grant SecretGarden and
            its affiliated companies a nonexclusive, worldwide, royalty free,
            fully paid up, transferable, sublicensable, perpetual, irrevocable
            license to copy, display, upload, perform, distribute, store, modify
            and otherwise use your User Content in connection with the operation
            of the Platform or the promotion, advertising or marketing thereof
            in any form, medium or technology now known or later developed.{" "}
            <span class="Apple-converted-space">&nbsp;</span>
          </span>
        </p>
        <p class="p2">
          <br />
        </p>
        <p class="p3">
          <span class="s1">
            Any questions, comments, suggestions, ideas, feedback or other
            information about the Platform (&ldquo;Submissions&rdquo;), provided
            by you to SecretGarden are non-confidential and SecretGarden will be
            entitled to the unrestricted use and dissemination of these
            Submissions for any purpose, commercial or otherwise, without
            acknowledgment or compensation to you.{" "}
            <span class="Apple-converted-space">&nbsp;</span>
          </span>
        </p>
        <p class="p2">
          <br />
        </p>
        <p class="p3">
          <span class="s1">
            SecretGarden may preserve content and may also disclose content if
            required to do so by law or in the good faith belief that such
            preservation or disclosure is reasonably necessary to: (a) comply
            with legal process, applicable laws or government requests; (b)
            enforce these Terms of Service; (c) respond to claims that any
            content violates the rights of third parties; or (d) protect the
            rights, property, or personal safety of SecretGarden, its users and
            the public. You understand that the technical processing and
            transmission of the Platform, including your content, may involve
            (a) transmissions over various networks; and (b) changes to conform
            and adapt to technical requirements of connecting networks or
            devices.
          </span>
        </p>
        <p class="p2">
          <br />
        </p>
        <p class="p3">
          <span class="s1">
            <strong>&nbsp; &nbsp; Copyright Complaints:&nbsp;</strong>
            SecretGarden respects the intellectual property of others, and we
            ask our users to do the same.
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>If you
            believe that your work has been copied in a way that constitutes
            copyright infringement, or that your intellectual property rights
            have been otherwise violated, you should notify SecretGarden of your
            infringement claim in accordance with the procedure set forth below.
          </span>
        </p>
        <p class="p2">
          <br />
        </p>
        <p class="p3">
          <span class="s1">
            SecretGarden will process and investigate notices of alleged
            infringement and will take appropriate actions under the Digital
            Millennium Copyright Act (&ldquo;DMCA&rdquo;) and other applicable
            intellectual property laws with respect to any alleged or actual
            infringement.
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>A
            notification of claimed copyright infringement should be emailed to
            SecretGarden&rsquo;s Copyright Agent (Subject line:
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>
            &ldquo;DMCA Takedown Request&rdquo;).{" "}
            <span class="Apple-converted-space">&nbsp;</span>
          </span>
        </p>
        <p class="p2">
          <br />
        </p>
        <p class="p3">
          <span class="s1">
            To be effective, the notification must be in writing and contain the
            following information:
            <span class="Apple-converted-space">&nbsp;</span>
          </span>
        </p>
        <p class="p2">
          <br />
        </p>
        <ul class="ul1">
          <li class="li3">
            <span class="s1">
              an electronic or physical signature of the person authorized to
              act on behalf of the owner of the copyright or other intellectual
              property interest;
              <span class="Apple-converted-space">&nbsp;</span>
            </span>
          </li>
          <li class="li3">
            <span class="s1">
              a description of the copyrighted work or other intellectual
              property that you claim has been infringed;
              <span class="Apple-converted-space">&nbsp;</span>
            </span>
          </li>
          <li class="li3">
            <span class="s1">
              a description of where the material that you claim is infringing
              is located on the Platform, with enough detail that we may find it
              on the Platform;
              <span class="Apple-converted-space">&nbsp;</span>
            </span>
          </li>
          <li class="li3">
            <span class="s1">
              your address, telephone number, and email address;
              <span class="Apple-converted-space">&nbsp;</span>
            </span>
          </li>
          <li class="li3">
            <span class="s1">
              a statement by you that you have a good faith belief that the
              disputed use is not authorized by the copyright or intellectual
              property owner, its agent, or the law;
              <span class="Apple-converted-space">&nbsp;</span>
            </span>
          </li>
          <li class="li3">
            <span class="s1">
              a statement by you, made under penalty of perjury, that the above
              information in your Notice is accurate and that you are the
              copyright or intellectual property owner or authorized to act on
              the copyright or intellectual property owner&rsquo;s behalf.
              <span class="Apple-converted-space">&nbsp;</span>
            </span>
          </li>
        </ul>
        <p class="p2">
          <br />
        </p>
        <p class="p3">
          <span class="s1">
            <strong>Counter-Notice</strong>: If you believe your User Content
            that was removed (or to which access was disabled) is not
            infringing, or that you have the authorization from the copyright
            owner, the copyright owner&rsquo;s agent, or pursuant to the law, to
            upload and use the content in your User Content, you may send a
            written counter-notice containing the following information to the
            Copyright Agent:
            <span class="Apple-converted-space">&nbsp;</span>
          </span>
        </p>
        <ul class="ul1">
          <li class="li3">
            <span class="s1">
              your physical or electronic signature;
              <span class="Apple-converted-space">&nbsp;</span>
            </span>
          </li>
          <li class="li3">
            <span class="s1">
              identification of the content that has been removed or to which
              access has been disabled and the location at which the content
              appeared before it was removed or disabled;
              <span class="Apple-converted-space">&nbsp;</span>
            </span>
          </li>
          <li class="li3">
            <span class="s1">
              a statement that you have a good faith belief that the content was
              removed or disabled as a result of mistake or a misidentification
              of the content; and
              <span class="Apple-converted-space">&nbsp;</span>
            </span>
          </li>
          <li class="li3">
            <span class="s1">
              your name, address, telephone number, and email address, a
              statement that you consent to the jurisdiction of the federal
              court located within Northern District of California and a
              statement that you will accept service of process from the person
              who provided notification of the alleged infringement.
              <span class="Apple-converted-space">&nbsp;</span>
            </span>
          </li>
        </ul>
        <p class="p3">
          <span class="s1">
            If a counter-notice is received by the Copyright Agent, SecretGarden
            will send a copy of the counter-notice to the original complaining
            party informing that person that it may replace the removed content
            or cease disabling it in 10 business days. Unless the copyright
            owner files an action seeking a court order against the content
            provider, member or user, the removed content may be replaced, or
            access to it restored, in 10 to 14 business days or more after
            receipt of the counter-notice, at our sole discretion.
          </span>
        </p>
        <p class="p2">
          <br />
        </p>
        <p class="p3">
          <span class="s1">
            <strong>&nbsp; &nbsp; Repeat Infringer Policy</strong>:
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>In accordance
            with the DMCA and other applicable law, SecretGarden has adopted a
            policy of terminating, in appropriate circumstances and at
            SecretGarden&apos;s sole discretion, Users who are deemed to be
            repeat infringers.
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>
            SecretGarden may also at its sole discretion limit access to the
            Platform and/or terminate the memberships of any users who infringe
            any intellectual property rights of others, whether or not there is
            any repeat infringement.
          </span>
        </p>
        <p class="p2">
          <br />
        </p>
        <p class="p3">
          <span class="s1">
            <strong>
              &nbsp; &nbsp; User Agree to Cooperate with SecretGarden
            </strong>
          </span>
        </p>
        <p class="p2">
          <br />
        </p>
        <p class="p5">
          <span class="s1">
            Creators expressly agree to refund to the Collector and/or
            SecretGarden the entire portion of Fees received from the sale of a
            Digital Artwork that was subsequently removed from the Site pursuant
            to an effective DMCA request to which the Creator failed to timely
            submit an effective DMCA Counternotification. SecretGarden not be
            held liable to any User for removing allegedly infringing works from
            the Platform or otherwise fulfilling its legal obligations under the
            DMCA.
          </span>
        </p>
        <p class="p2">
          <br />
        </p>
        <p class="p5">
          <span class="s1">
            Creators, Collectors, and all Users expressly agree to cooperate and
            timely respond to SecretGarden&rsquo;s investigations, requests, and
            inquiries related to DMCA disputes or allegations of infringement.
            Users agree to initiate a &ldquo;burn&rdquo; transaction upon
            SecretGarden&rsquo;s request for Digital Artwork that have been
            permanently removed from the SecretGarden marketplace pursuant to a
            valid DMCA Take-Down Notice, or that are otherwise alleged to be
            infringing.
          </span>
        </p>
        <p class="p6">
          <br />
        </p>
        <p class="p3">
          <span class="s1">
            <strong>What fees does SecretGarden charge?</strong>
          </span>
        </p>
        <p class="p2">
          <br />
        </p>
        <p class="p3">
          <span class="s1">
            &nbsp; &nbsp; <strong>Auction and Fees</strong>.
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>The terms of
            the auction and Fees for the sale of Digital Artwork are set forth
            in writing between the Creator and SecretGarden and such terms are
            incorporated into these Terms.{" "}
            <span class="Apple-converted-space">&nbsp;</span>
          </span>
        </p>
        <p class="p6">
          <br />
        </p>
        <p class="p5">
          <span class="s1">
            SecretGarden does not generally collect any fees, commissions, or
            royalties for transactions occurring outside of SecretGarden. Users
            irrevocably releases, acquits, and forever discharges SecretGarden
            and its subsidiaries, affiliates, officers, and successors of any
            liability for royalties, fines, or fees not received from any
            off-market transaction.
          </span>
        </p>
        <p class="p2">
          <br />
        </p>
        <p class="p5">
          <span class="s1">
            All transactions on SecretGarden, including without limitation
            minting, tokenizing, bidding, listing, offering, purchasing, or
            confirming, are facilitated by smart contracts existing on the
            Ethereum network. The Ethereum network requires the payment of a
            transaction fee (a &ldquo;Gas fee&rdquo;) for every transaction that
            occurs on the Ethereum network, and thus every transaction occurring
            on SecretGarden. The value of the Gas Fee changes, often
            unpredictably, and is entirely outside of the control of
            SecretGarden. The User acknowledges that under no circumstances will
            a contract, agreement, offer, sale, bid, or other transaction on
            SecretGarden be invalidated, revocable, retractable, or otherwise
            unenforceable on the basis that the Gas Fee for the given
            transaction was unknown, too high, or otherwise unacceptable.
          </span>
        </p>
        <p class="p2">
          <br />
        </p>
        <p class="p5">
          <span class="s1">
            <strong>Taxes</strong>.
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>Users are
            responsible to pay any and all sales, use, value-added and other
            taxes, duties, and assessments now or hereafter claimed or imposed
            by any governmental authority, &ldquo;associated with your use of
            SecretGarden (including, without limitation, any taxes that may
            become payable as the result of your ownership, transfer, purchase,
            sale, or creation of any artworks).
          </span>
        </p>
        <p class="p2">
          <br />
        </p>
        <p class="p3">
          <span class="s1">
            &nbsp; &nbsp; <strong>Beta Platforms</strong>.
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>Certain
            features on SecretGarden may be offered while still in
            &ldquo;beta&rdquo; form (&ldquo;Beta Platforms&rdquo;). SecretGarden
            will utilize best efforts to identify the Beta Platforms by labeling
            on its Platform. By accepting these Terms or using the Beta
            Platforms, you understand and acknowledge that the Beta Platforms
            are being provided as a &ldquo;Beta&rdquo; version and made
            available on an &ldquo;As Is&rdquo; or &ldquo;As Available&rdquo;
            basis. The Beta Platforms may contain bugs, errors, and other
            problems. YOU ASSUME ALL RISKS AND ALL COSTS ASSOCIATED WITH YOUR
            USE OF THE BETA PLATFORMS, INCLUDING, WITHOUT LIMITATION, ANY
            INTERNET ACCESS FEES, BACK-UP EXPENSES, COSTS INCURRED FOR THE USE
            OF YOUR DEVICE AND PERIPHERALS, AND ANY DAMAGE TO ANY EQUIPMENT,
            SOFTWARE, INFORMATION OR DATA. In addition, we are not obligated to
            provide any maintenance, technical, or other support for the Beta
            Platforms.
          </span>
        </p>
        <p class="p6">
          <br />
        </p>
        <p class="p3">
          <span class="s1">
            <strong>What about my privacy?</strong>
          </span>
        </p>
        <p class="p2">
          <br />
        </p>
        <p class="p3">
          <span class="s1">
            Our privacy policy is a part of these Terms. Please review the
            SecretGarden Privacy Policy, which also governs the Platform and
            informs Users of our data collection practices.
            <span class="Apple-converted-space">&nbsp;</span>
          </span>
        </p>
        <p class="p2">
          <br />
        </p>
        <p class="p3">
          <span class="s1">
            <strong>Other Legal Terms</strong>
          </span>
        </p>
        <p class="p5">
          <span class="s1">
            <strong>Indemnity and Release</strong>:
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>You agree to
            release, indemnify and hold SecretGarden and its affiliates and
            their officers, employees, directors and agents (collectively,
            &ldquo;Indemnitees&rdquo;) harmless from any from any and all
            losses, damages, expenses, including reasonable attorneys&rsquo;
            fees, rights, claims, actions of any kind and injury (including
            death) arising out of or relating to your use of the Platform, any
            User Content, your connection to the Platform, your violation of
            these Terms of Service or your violation of any rights of another.
            Notwithstanding the foregoing, you will have no obligation to
            indemnify or hold harmless any Indemnitee from or against any
            liability, losses, damages or expenses incurred as a result of any
            action or inaction of such Indemnitee. If you are a California
            resident, you waive California Civil Code Section 1542, which says:
            &ldquo;A general release does not extend to claims that the creditor
            or releasing party does not know or suspect to exist in his or her
            favor at the time of executing the release and that, if known by him
            or her, would have materially affected his or her settlement with
            the debtor or released party.&rdquo; If you are a resident of
            another jurisdiction, you waive any comparable statute or doctrine.
          </span>
        </p>
        <p class="p2">
          <br />
        </p>
        <p class="p5">
          <span class="s1">
            <strong>Disclaimer of Warranties</strong>: Platform transactions,
            including but not limited to primary sales, secondary market sales,
            listings, offers, bids, acceptances, and other operations utilize
            experimental smart contract and blockchain technology, including
            non-fungible tokens, cryptocurrencies, consensus algorithms, and
            decentralized or peer-to-peer networks and systems. Users
            acknowledge and agree that such technologies are experimental,
            speculative, and inherently risky and may be subject to bugs,
            malfunctions, timing errors, hacking and theft, or changes to the
            protocol rules of the Ethereum blockchain (i.e., &quot;forks&quot;),
            which can adversely affect the smart contracts and may expose you to
            a risk of total loss, forfeiture of your digital currency or Digital
            Artwork, or lost opportunities to buy or sell Digital Artwork.
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>YOUR USE OF
            THE PLATFORM IS AT YOUR SOLE RISK. THE PLATFORM IS PROVIDED ON AN
            &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; BASIS.
            SECRETGARDEN EXPRESSLY DISCLAIMS ALL WARRANTIES OF ANY KIND, WHETHER
            EXPRESS, IMPLIED OR STATUTORY, INCLUDING, BUT NOT LIMITED TO THE
            IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
            PURPOSE, TITLE AND NON-INFRINGEMENT.
          </span>
        </p>
        <p class="p2">
          <br />
        </p>
        <p class="p5">
          <span class="s1">
            SECRETGARDEN MAKES NO WARRANTY THAT (I) THE PLATFORM WILL MEET YOUR
            REQUIREMENTS, (II) THE PLATFORM WILL BE UNINTERRUPTED, TIMELY,
            SECURE, OR ERROR-FREE, (III) THE RESULTS THAT MAY BE OBTAINED FROM
            THE USE OF THE PLATFORM WILL BE ACCURATE OR RELIABLE, OR (IV) THE
            QUALITY OF ANY PRODUCTS, PLATFORMS, INFORMATION, OR OTHER MATERIAL
            PURCHASED OR OBTAINED BY YOU THROUGH THE PLATFORM WILL MEET YOUR
            EXPECTATIONS.
          </span>
        </p>
        <p class="p2">
          <br />
        </p>
        <p class="p5">
          <span class="s1">
            <strong>
              Limitation of Liability:
              <span class="Apple-converted-space">&nbsp;&nbsp;</span>
            </strong>
            YOU EXPRESSLY UNDERSTAND AND AGREE THAT SECRETGARDEN WILL NOT BE
            LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL,
            EXEMPLARY DAMAGES, OR DAMAGES FOR LOSS OF PROFITS INCLUDING BUT NOT
            LIMITED TO, LOSS IN VALUE OF ANY DIGITAL ARTWORK, DAMAGES FOR LOSS
            OF GOODWILL, USE, DATA OR OTHER INTANGIBLE LOSSES (EVEN IF
            SECRETGARDEN HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES),
            WHETHER BASED ON CONTRACT, TORT, NEGLIGENCE, STRICT LIABILITY OR
            OTHERWISE, RESULTING FROM: (I) THE USE OR THE INABILITY TO USE THE
            PLATFORM; (II) THE COST OF PROCUREMENT OF SUBSTITUTE GOODS AND
            PLATFORMS RESULTING FROM ANY DIGITAL ARTWORK, GOODS, DATA,
            INFORMATION OR PLATFORMS PURCHASED OR OBTAINED OR MESSAGES RECEIVED
            OR TRANSACTIONS ENTERED INTO THROUGH OR FROM THE PLATFORM; (III)
            UNAUTHORIZED ACCESS TO OR ALTERATION OF YOUR TRANSMISSIONS OR DATA;
            (IV) STATEMENTS OR CONDUCT OF ANY THIRD PARTY ON THE PLATFORM; OR
            (V) ANY OTHER MATTER RELATING TO THE PLATFORM. IN NO EVENT WILL
            SECRETGARDEN&rsquo;S TOTAL LIABILITY TO YOU FOR ALL DAMAGES, LOSSES
            OR CAUSES OF ACTION EXCEED THE AMOUNT YOU HAVE PAID SECRETGARDEN IN
            THE LAST SIX (6) MONTHS, OR, IF GREATER, ONE HUNDRED DOLLARS ($100).
            <span class="Apple-converted-space">&nbsp;</span>
          </span>
        </p>
        <p class="p2">
          <br />
        </p>
        <p class="p5">
          <span class="s1">
            SOME JURISDICTIONS DO NOT ALLOW THE DISCLAIMER OR EXCLUSION OF
            CERTAIN WARRANTIES OR THE LIMITATION OR EXCLUSION OF LIABILITY FOR
            INCIDENTAL OR CONSEQUENTIAL DAMAGES. ACCORDINGLY, SOME OF THE ABOVE
            LIMITATIONS SET FORTH ABOVE MAY NOT APPLY TO YOU OR BE ENFORCEABLE
            WITH RESPECT TO YOU. IF YOU ARE DISSATISFIED WITH ANY PORTION OF THE
            PLATFORM OR WITH THESE TERMS OF PLATFORM, YOUR SOLE AND EXCLUSIVE
            REMEDY IS TO DISCONTINUE USE OF THE PLATFORM.
            <span class="Apple-converted-space">&nbsp;</span>
          </span>
        </p>
        <p class="p2">
          <br />
        </p>
        <p class="p5">
          <span class="s1">
            IF YOU ARE A USER FROM NEW JERSEY, THE FOREGOING SECTIONS TITLED
            &ldquo;DISCLAIMER OF WARRANTIES&rdquo; AND &ldquo;LIMITATION OF
            LIABILITY&rdquo; ARE INTENDED TO BE ONLY AS BROAD AS IS PERMITTED
            UNDER THE LAWS OF THE STATE OF NEW JERSEY.
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>IF ANY
            PORTION OF THESE SECTIONS IS HELD TO BE INVALID UNDER THE LAWS OF
            THE STATE OF NEW JERSEY, THE INVALIDITY OF SUCH PORTION SHALL NOT
            AFFECT THE VALIDITY OF THE REMAINING PORTIONS OF THE APPLICABLE
            SECTIONS.
          </span>
        </p>
        <p class="p2">
          <br />
        </p>
        <p class="p3">
          <span class="s1">
            <strong>
              Here are our termination rights.{" "}
              <span class="Apple-converted-space">&nbsp;</span>
            </strong>
          </span>
        </p>
        <p class="p2">
          <br />
        </p>
        <p class="p5">
          <span class="s1">
            You agree that SecretGarden, in its sole discretion, may suspend or
            terminate your account (or any part thereof) or use of the Platform
            and remove and discard any content within the Platform, for any
            reason, including, without limitation, for lack of use or if
            SecretGarden believes that you have violated or acted inconsistently
            with the letter or spirit of these Terms of Service. Any suspected
            fraudulent, abusive or illegal activity that may be grounds for
            termination of your use of Platform, may be referred to appropriate
            law enforcement authorities. SecretGarden may also in its sole
            discretion and at any time discontinue providing the Platform, or
            any part thereof, with or without notice. You agree that any
            termination of your access to the Platform under any provision of
            this Terms of Service may be effected without prior notice, and
            acknowledge and agree that SecretGarden may immediately deactivate
            or delete your account and all related information and files in your
            account and/or bar any further access to such files or the Platform.
            Further, you agree that SecretGarden will not be liable to you or
            any third party for any termination of your access to the Platform.
          </span>
        </p>
        <p class="p2">
          <br />
        </p>
        <p class="p3">
          <span class="s1">
            <strong>
              We do not get involved with User disputes.{" "}
              <span class="Apple-converted-space">&nbsp;</span>
            </strong>
          </span>
        </p>
        <p class="p2">
          <br />
        </p>
        <p class="p5">
          <span class="s1">
            You agree that you are solely responsible for your interactions with
            any other Users in connection with the Platform and SecretGarden
            will have no liability or responsibility with respect thereto.
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>
            SecretGarden reserves the right, but has no obligation, to become
            involved in any way with disputes between you and any other user of
            the Platform.
          </span>
        </p>
        <p class="p2">
          <br />
        </p>
        <p class="p3">
          <span class="s1">
            <strong>General Legal Terms</strong>
          </span>
        </p>
        <p class="p7">
          <br />
        </p>
        <p class="p5">
          <span class="s1">
            These Terms of Service constitute the entire agreement between you
            and SecretGarden and govern your use of the Platform, superseding
            any prior agreements between you and SecretGarden with respect to
            the Platform. You also may be subject to additional terms and
            conditions that may apply when you use affiliate or third party
            services, third party content or third party software. These Terms
            of Service will be governed by the laws of the State of California
            without regard to its conflict of law provisions. With respect to
            any disputes or claims not subject to arbitration, as set forth
            above, you and SecretGarden agree to submit to the personal and
            exclusive jurisdiction of the state and federal courts located
            within San Francisco County, California. The failure of SecretGarden
            to exercise or enforce any right or provision of these Terms of
            Service will not constitute a waiver of such right or provision. If
            any provision of these Terms of Service is found by a court of
            competent jurisdiction to be invalid, the parties nevertheless agree
            that the court should endeavor to give effect to the parties&rsquo;
            intentions as reflected in the provision, and the other provisions
            of these Terms of Service remain in full force and effect. You agree
            that regardless of any statute or law to the contrary, any claim or
            cause of action arising out of or related to use of the Platform or
            these Terms of Service must be filed within one (1) year after such
            claim or cause of action arose or be forever barred. A printed
            version of this agreement and of any notice given in electronic form
            will be admissible in judicial or administrative proceedings based
            upon or relating to this agreement to the same extent and subject to
            the same conditions as other business documents and records
            originally generated and maintained in printed form. You may not
            assign this Terms of Service without the prior written consent of
            SecretGarden, but SecretGarden may assign or transfer this Terms of
            Service, in whole or in part, without restriction. The section
            titles in these Terms of Service are for convenience only and have
            no legal or contractual effect. Notices to you may be made via
            either email or regular mail. The Platform may also provide notices
            to you of changes to these Terms of Service or other matters by
            displaying notices or links to notices generally on the Platform.
          </span>
        </p>
        <p class="p2">
          <br />
        </p>
        <p class="p3">
          <span class="s1">
            <strong>Your Privacy</strong>
            <span class="Apple-converted-space">&nbsp;</span>
          </span>
        </p>
        <p class="p2">
          <br />
        </p>
        <p class="p3">
          <span class="s1">
            At SecretGarden, we respect the privacy of our users. For details
            please see our Privacy Policy.
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>By using the
            Platform, you consent to our collection and use of personal data as
            outlined therein.
          </span>
        </p>
        <p class="p2">
          <br />
        </p>
        <p class="p3">
          <span class="s1">
            <strong>Notice for California Users</strong>
          </span>
        </p>
        <p class="p2">
          <br />
        </p>
        <p class="p3">
          <span class="s1">
            Under California Civil Code Section 1789.3, users of the Platform
            from California are entitled to the following specific consumer
            rights notice: The Complaint Assistance Unit of the Division of
            Consumer Platforms of the California Department of Consumer Affairs
            may be contacted in writing at 1625 North Market Blvd., Suite N 112,
            Sacramento, CA 95834, or by telephone at (916) 445-1254 or (800)
            952-5210. You may contact us at SecretGarden, Inc.,&nbsp;
          </span>
          <span class="s2">
            <strong>
              <em>[]</em>
            </strong>
          </span>
        </p>
        <p class="p2">
          <br />
        </p>
        <p class="p5">
          <span class="s1">
            <strong>
              Dispute Resolution By Binding Arbitration: PLEASE READ THIS
              SECTION CAREFULLY AS IT AFFECTS YOUR RIGHTS.
            </strong>
          </span>
        </p>
        <p class="p2">
          <br />
        </p>
        <ol class="ol1">
          <li class="li3">
            <span class="s1">
              <strong>Agreement to Arbitrate</strong>
            </span>
          </li>
        </ol>
        <p class="p2">
          <br />
        </p>
        <p class="p3">
          <span class="s1">
            This Dispute Resolution by Binding Arbitration section is referred
            to in this Terms of Service as the &ldquo;Arbitration
            Agreement.&rdquo;
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>You agree
            that any and all disputes or claims that have arisen or may arise
            between you and SecretGarden, whether arising out of or relating to
            this Terms of Service (including any alleged breach thereof), the
            Platforms, any advertising, any aspect of the relationship or
            transactions between us, shall be resolved exclusively through final
            and binding arbitration, rather than a court, in accordance with the
            terms of this Arbitration Agreement, except that you may assert
            individual claims in small claims court, if your claims qualify.
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>
            Further, this Arbitration Agreement does not preclude you from
            bringing issues to the attention of federal, state, or local
            agencies, and such agencies can, if the law allows, seek relief
            against us on your behalf.
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>You agree
            that, by entering into this Terms of Service, you and SecretGarden
            are each waiving the right to a trial by jury or to participate in a
            class action.
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>Your rights
            will be determined by a neutral arbitrator, not a judge or jury.
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>The Federal
            Arbitration Act governs the interpretation and enforcement of this
            Arbitration Agreement.
          </span>
        </p>
        <p class="p2">
          <br />
        </p>
        <ol class="ol1">
          <li class="li3">
            <span class="s1">
              <strong>
                Prohibition of Class and Representative Actions and
                Non-Individualized Relief
              </strong>
            </span>
          </li>
        </ol>
        <p class="p2">
          <br />
        </p>
        <p class="p3">
          <span class="s1">
            <strong>
              <em>
                YOU AND SECRETGARDEN AGREE THAT EACH OF US MAY BRING CLAIMS
                AGAINST THE OTHER ONLY ON AN INDIVIDUAL BASIS AND NOT AS A
                PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR
                REPRESENTATIVE ACTION OR PROCEEDING.
                <span class="Apple-converted-space">&nbsp;&nbsp;</span>
                UNLESS BOTH YOU AND SECRETGARDEN AGREE OTHERWISE, THE ARBITRATOR
                MAY NOT CONSOLIDATE OR JOIN MORE THAN ONE PERSON&rsquo;S OR
                PARTY&rsquo;S CLAIMS AND MAY NOT OTHERWISE PRESIDE OVER ANY FORM
                OF A CONSOLIDATED, REPRESENTATIVE, OR CLASS PROCEEDING.
                <span class="Apple-converted-space">&nbsp;&nbsp;</span>ALSO, THE
                ARBITRATOR MAY AWARD RELIEF (INCLUDING MONETARY, INJUNCTIVE, AND
                DECLARATORY RELIEF) ONLY IN FAVOR OF THE INDIVIDUAL PARTY
                SEEKING RELIEF AND ONLY TO THE EXTENT NECESSARY TO PROVIDE
                RELIEF NECESSITATED BY THAT PARTY&rsquo;S INDIVIDUAL CLAIM(S),
                EXCEPT THAT YOU MAY PURSUE A CLAIM FOR AND THE ARBITRATOR MAY
                AWARD PUBLIC INJUNCTIVE RELIEF UNDER APPLICABLE LAW TO THE
                EXTENT REQUIRED FOR THE ENFORCEABILITY OF THIS PROVISION.{" "}
                <span class="Apple-converted-space">&nbsp;</span>
              </em>
            </strong>
          </span>
        </p>
        <p class="p2">
          <br />
        </p>
        <ol class="ol1">
          <li class="li3">
            <span class="s1">
              <strong>Pre-Arbitration Dispute Resolution</strong>
            </span>
          </li>
        </ol>
        <p class="p2">
          <br />
        </p>
        <p class="p3">
          <span class="s1">
            SecretGarden is always interested in resolving disputes amicably and
            efficiently, and most customer concerns can be resolved quickly and
            to the customer&rsquo;s satisfaction by emailing customer support at
            [______________].
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>If such
            efforts prove unsuccessful, a party who intends to seek arbitration
            must first send to the other, by certified mail, a written Notice of
            Dispute (&ldquo;Notice&rdquo;).
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>The Notice to
            SecretGarden should be sent to [__________________] (&ldquo;Notice
            Address&rdquo;).
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>The Notice
            must (i) describe the nature and basis of the claim or dispute and
            (ii) set forth the specific relief sought.
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>If
            SecretGarden and you do not resolve the claim within sixty (60)
            calendar days after the Notice is received, you or SecretGarden may
            commence an arbitration proceeding.
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>During the
            arbitration, the amount of any settlement offer made by SecretGarden
            or you shall not be disclosed to the arbitrator until after the
            arbitrator determines the amount, if any, to which you or
            SecretGarden is entitled.
          </span>
        </p>
        <p class="p2">
          <br />
        </p>
        <ol class="ol1">
          <li class="li3">
            <span class="s1">
              <strong>Arbitration Procedures</strong>
            </span>
          </li>
        </ol>
        <p class="p2">
          <br />
        </p>
        <p class="p3">
          <span class="s1">
            Arbitration will be conducted by a neutral arbitrator in accordance
            with the American Arbitration Association&rsquo;s
            (&ldquo;AAA&rdquo;) rules and procedures, including the AAA&rsquo;s
            Consumer Arbitration Rules (collectively, the &ldquo;AAA
            Rules&rdquo;), as modified by this Arbitration Agreement.
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>
            For information on the AAA, please visit its website,
            http://www.adr.org.
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>
            Information about the AAA Rules and fees for consumer disputes can
            be found at the AAA&rsquo;s consumer arbitration page,{" "}
            <a href="http://www.adr.org/">
              <span class="s5">http://www.adr.org/</span>
            </a>{" "}
            as may be updated from time to time.
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>If there is
            any inconsistency between any term of the AAA Rules and any term of
            this Arbitration Agreement, the applicable terms of this Arbitration
            Agreement will control unless the arbitrator determines that the
            application of the inconsistent Arbitration Agreement terms would
            not result in a fundamentally fair arbitration.
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>The
            arbitrator must also follow the provisions of these Terms of Service
            as a court would.
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>All issues
            are for the arbitrator to decide, including, but not limited to,
            issues relating to the scope, enforceability, and arbitrability of
            this Arbitration Agreement.
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>Although
            arbitration proceedings are usually simpler and more streamlined
            than trials and other judicial proceedings, the arbitrator can award
            the same damages and relief on an individual basis that a court can
            award to an individual under the Terms of Service and applicable
            law.
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>Decisions by
            the arbitrator are enforceable in court and may be overturned by a
            court only for very limited reasons.
          </span>
        </p>
        <p class="p2">
          <br />
        </p>
        <p class="p3">
          <span class="s1">
            Unless SecretGarden and you agree otherwise, any arbitration
            hearings will take place in a reasonably convenient location for
            both parties with due consideration of their ability to travel and
            other pertinent circumstances.
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>If the
            parties are unable to agree on a location, the determination shall
            be made by AAA.
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>If your claim
            is for $10,000 or less, SecretGarden agrees that you may choose
            whether the arbitration will be conducted solely on the basis of
            documents submitted to the arbitrator, through a telephonic hearing,
            or by an in-person hearing as established by the AAA Rules.
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>If your claim
            exceeds $10,000, the right to a hearing will be determined by the
            AAA Rules.
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>
            Regardless of the manner in which the arbitration is conducted, the
            arbitrator shall issue a reasoned written decision sufficient to
            explain the essential findings and conclusions on which the award is
            based.
          </span>
        </p>
        <p class="p2">
          <br />
        </p>
        <ol class="ol1">
          <li class="li3">
            <span class="s1">
              <strong>Costs of Arbitration</strong>
            </span>
          </li>
        </ol>
        <p class="p2">
          <br />
        </p>
        <p class="p3">
          <span class="s1">
            Payment of all filing, administration, and arbitrator fees
            (collectively, the &ldquo;Arbitration Fees&rdquo;) will be governed
            by the AAA Rules, unless otherwise provided in this Arbitration
            Agreement.
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>If the value
            of the relief sought is $75,000 or less, at your request,
            SecretGarden will pay all Arbitration Fees.
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>If the value
            of relief sought is more than $75,000 and you are able to
            demonstrate to the arbitrator that you are economically unable to
            pay your portion of the Arbitration Fees or if the arbitrator
            otherwise determines for any reason that you should not be required
            to pay your portion of the Arbitration Fees, SecretGarden will pay
            your portion of such fees.
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>In addition,
            if you demonstrate to the arbitrator that the costs of arbitration
            will be prohibitive as compared to the costs of litigation,
            SecretGarden will pay as much of the Arbitration Fees as the
            arbitrator deems necessary to prevent the arbitration from being
            cost-prohibitive.
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>Any payment
            of attorneys&rsquo; fees will be governed by the AAA Rules.
          </span>
        </p>
        <p class="p2">
          <br />
        </p>
        <ol class="ol1">
          <li class="li3">
            <span class="s1">
              <strong>Confidentiality</strong>
            </span>
          </li>
        </ol>
        <p class="p2">
          <br />
        </p>
        <p class="p3">
          <span class="s1">
            All aspects of the arbitration proceeding, and any ruling, decision,
            or award by the arbitrator, will be strictly confidential for the
            benefit of all parties.
          </span>
        </p>
        <p class="p2">
          <br />
        </p>
        <ol class="ol1">
          <li class="li3">
            <span class="s1">
              <strong>Severability</strong>
            </span>
          </li>
        </ol>
        <p class="p2">
          <br />
        </p>
        <p class="p3">
          <span class="s1">
            If a court or the arbitrator decides that any term or provision of
            this Arbitration Agreement (other than the subsection (b) titled
            &ldquo;Prohibition of Class and Representative Actions and
            Non-Individualized Relief&rdquo; above) is invalid or unenforceable,
            the parties agree to replace such term or provision with a term or
            provision that is valid and enforceable and that comes closest to
            expressing the intention of the invalid or unenforceable term or
            provision, and this Arbitration Agreement shall be enforceable as so
            modified.
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>If a court or
            the arbitrator decides that any of the provisions of subsection (b)
            above titled &ldquo;Prohibition of Class and Representative Actions
            and Non-Individualized Relief&rdquo; are invalid or unenforceable,
            then the entirety of this Arbitration Agreement shall be null and
            void, unless such provisions are deemed to be invalid or
            unenforceable solely with respect to claims for public injunctive
            relief.
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>The remainder
            of the Terms of Service will continue to apply.
          </span>
        </p>
        <p class="p2">
          <br />
        </p>
        <ol class="ol1">
          <li class="li3">
            <span class="s1">
              <strong>Future Changes to Arbitration Agreement</strong>
            </span>
          </li>
        </ol>
        <p class="p2">
          <br />
        </p>
        <p class="p3">
          <span class="s1">
            Notwithstanding any provision in this Terms of Service to the
            contrary, SecretGarden agrees that if it makes any future change to
            this Arbitration Agreement (other than a change to the Notice
            Address) while you are a user of the Platforms, you may reject any
            such change by sending SecretGarden written notice within thirty
            (30) calendar days of the change to the Notice Address provided
            above.
            <span class="Apple-converted-space">&nbsp;&nbsp;</span>By rejecting
            any future change, you are agreeing that you will arbitrate any
            dispute between us in accordance with the language of this
            Arbitration Agreement as of the date you first accepted these Terms
            of Service (or accepted any subsequent changes to these Terms of
            Service).
          </span>
        </p>
        <p class="p2">
          <br />
        </p>
      </div>
      <Footer white={false} />
    </React.StrictMode>
  );
}

export default Tos;
