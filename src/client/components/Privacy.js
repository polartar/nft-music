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
          <span class="s1">
            <strong>KYBER CORP. (SECRETGARDEN)</strong>
          </span>
        </p>
        <p class="p2">
          <span class="s1">
            <strong>PRIVACY POLICY</strong>
          </span>
        </p>
        <p class="p3">
          <br />
        </p>
        <p class="p4">
          <span class="s1">Last Updated 4/14/2021</span>
        </p>
        <p class="p5">
          <br />
        </p>
        <p class="p6">
          <span class="s1">
            Welcome to the SecretGarden website (the &ldquo;
            <strong>Site</strong>&rdquo;) of Kyber Corp. (&ldquo;
            <strong>SecretGarden</strong>,&rdquo; &ldquo;<strong>we</strong>
            ,&rdquo; &ldquo;<strong>us</strong>,&rdquo; or &ldquo;
            <strong>our</strong>&rdquo;). SecretGarden provides an NFT
            marketplace for musicians and artists (collectively, including the
            Site, the &ldquo;<strong>Service</strong>&rdquo;).
          </span>
        </p>
        <p class="p5">
          <br />
        </p>
        <p class="p7">
          <span class="s1">
            This Privacy Policy explains what Personal Information (defined
            below) we collect, how we use and share that information, and your
            choices concerning our information practices. This Privacy Policy is
            incorporated into and forms part of our Terms of Service
            (https://secretgarden.fm/tos).
          </span>
        </p>
        <p class="p8">
          <br />
        </p>
        <p class="p7">
          <span class="s1">
            Before using the Service or submitting any Personal Information to
            SecretGarden, please review this Privacy Policy carefully and
            contact us at privacy@secretgarden.fm if you have any questions. By
            using the Service, you agree to the practices described in this
            Privacy Policy. If you do not agree to this Privacy Policy, please
            do not access the Site or otherwise use the Service.
          </span>
        </p>
        <p class="p8">
          <br />
        </p>
        <ol class="ol1">
          <li class="li9">
            <span class="s2">
              <strong>PERSONAL INFORMATION WE COLLECT</strong>
            </span>
          </li>
        </ol>
        <p class="p10">
          <span class="s1">
            We collect information that alone or in combination with other
            information in our possession could be used to identify you (&ldquo;
            <strong>Personal Information</strong>&rdquo;) as follows:
          </span>
        </p>
        <p class="p10">
          <span class="s1">
            <strong>Personal Information You Provide:</strong> We collect the
            following categories of Personal Information from you when you
            participate as an NFT artist or an NFT buyer:
            <span class="Apple-converted-space">&nbsp;</span>
          </span>
        </p>
        <ul class="ul1">
          <li class="li4">
            <span class="s2">
              <strong>Identification Information:</strong> We collect your name,
              email address, phone number, mailing/billing addresses, and
              government identification documents (i.e., your driver&rsquo;s
              license, passport, or state identification card).
            </span>
          </li>
          <li class="li4">
            <span class="s2">
              <strong>Wallet Information:</strong> Our payment processor(s) will
              collect the cryptocurrency public address information necessary to
              process your cryptocurrency paymentss.
            </span>
          </li>
          <li class="li4">
            <span class="s2">
              <strong>Communication Information:&nbsp;</strong>We may collect
              information when you contact us with questions or concerns and
              when you voluntarily respond to questionnaires, surveys or
              requests for market research seeking your opinion and feedback.
              &nbsp;Providing communication information is optional to you.
            </span>
          </li>
          <li class="li11">
            <span class="s2">
              <strong>Social Media Information:</strong> We have pages on social
              media sites like Instagram, Twitter, and Discord (&ldquo;
              <strong>Social Media Pages</strong>&rdquo;). When you interact
              with our Social Media Pages, we will collect Personal Information
              that you elect to provide to us, such as your contact details. In
              addition, the companies that host our Social Media Pages may
              provide us with aggregate information and analytics regarding the
              use of our Social Media Pages.
            </span>
          </li>
        </ul>
        <p class="p10">
          <span class="s1">
            <strong>Internet Activity Information:</strong> When you visit, use,
            and interact with the Service, we may receive certain information
            about your visit, use, or interactions. For example, we may monitor
            the number of people that visit the Service, peak hours of visits,
            which page(s) are visited, the domains our visitors come from (e.g.,
            google.com, yahoo.com, etc.), and which browsers people use to
            access the Service (e.g., Chrome, Firefox, Microsoft Internet
            Explorer, etc.), broad geographical information, and navigation
            pattern. In particular, the following information is created and
            automatically logged in our systems:
            <span class="Apple-converted-space">&nbsp;</span>
          </span>
        </p>
        <ul class="ul1">
          <li class="li4">
            <span class="s1">
              <strong>Log Information</strong>: Information that your browser
              automatically sends whenever you visit the Site. Log Information
              includes your Internet Protocol address, browser type and
              settings, the date and time of your request, and how you
              interacted with the Site.
              <span class="Apple-converted-space">&nbsp;</span>
            </span>
          </li>
          <li class="li4">
            <span class="s1">
              <strong>Cookies Information:</strong> Please see the &ldquo;
            </span>
            <span class="s4">Cookies</span>
            <span class="s1">
              &rdquo; section below to learn more about how we use cookies.
            </span>
          </li>
          <li class="li4">
            <span class="s1">
              <strong>Device Information</strong>: Includes name of the device,
              operating system, and browser you are using. Information collected
              may depend on the type of device you use and its settings.
              <span class="Apple-converted-space">&nbsp;</span>
            </span>
          </li>
          <li class="li4">
            <span class="s1">
              <strong>Usage Information</strong>: We collect information about
              how you use our Service, such as the types of content that you
              view or engage with, the features you use, the actions you take,
              <span class="Apple-converted-space">&nbsp;</span>
            </span>
          </li>
        </ul>
        <p class="p3">
          <br />
        </p>
        <p class="p4">
          <span class="s1">
            <strong>Cookies:</strong> We use cookies to operate and administer
            our Site, gather usage data on our Site, and improve your experience
            on it. A &ldquo;cookie&rdquo; is a piece of information sent to your
            browser by a website you visit. Cookies can be stored on your
            computer for different periods of time. Some cookies expire after a
            certain amount of time, or upon logging out (session cookies),
            others survive after your browser is closed until a defined
            expiration date set in the cookie (as determined by the third party
            placing it), and help recognize your computer when you open your
            browser and browse the Internet again (persistent cookies). For more
            details on cookies please visit{" "}
            <a href="http://www.allaboutcookies.org/">
              <span class="s5">All About Cookies</span>
            </a>
          </span>
          <span class="s2">.</span>
        </p>
        <p class="p5">
          <br />
        </p>
        <p class="p4">
          <span class="s1">
            On most web browsers, you will find a &ldquo;help&rdquo; section on
            the toolbar. Please refer to this section for information on how to
            receive a notification when you are receiving a new cookie and how
            to turn cookies off.
            <span class="Apple-converted-space">&nbsp;</span>
          </span>
        </p>
        <p class="p3">
          <br />
        </p>
        <p class="p4">
          <span class="s1">
            Please note that if you limit the ability of websites to set
            cookies, you may be unable to access certain parts of the Site and
            you may not be able to benefit from the full functionality of the
            Site.
          </span>
        </p>
        <p class="p3">
          <br />
        </p>
        <p class="p12">
          <span class="s1">
            Advertising networks may use cookies to collect Personal
            Information. Most advertising networks offer you a way to opt out of
            targeted advertising. If you would like to find out more
            information, please visit the Network Advertising Initiative&rsquo;s{" "}
            <a href="http://www.networkadvertising.org">
              <span class="s4">online resources</span>
            </a>{" "}
            and follow the opt-out instructions there.
          </span>
        </p>
        <p class="p13">
          <span class="s1">
            If you access the Site on your mobile device, you may not be able to
            control tracking technologies through the settings.
            <span class="Apple-converted-space">&nbsp;</span>
          </span>
        </p>
        <ol class="ol1">
          <li class="li9">
            <span class="s2">
              <strong>HOW WE USE PERSONAL INFORMATION</strong>
            </span>
          </li>
        </ol>
        <p class="p4">
          <span class="s1">
            We may use Personal Information for the following purposes:
          </span>
        </p>
        <p class="p3">
          <br />
        </p>
        <ul class="ul1">
          <li class="li4">
            <span class="s1">To provide the Service;</span>
          </li>
          <li class="li4">
            <span class="s1">
              To enable minting NFTs and the auction and sale of NFTs;
            </span>
          </li>
          <li class="li4">
            <span class="s1">
              To respond to your inquiries, comments, feedback, or questions;
            </span>
          </li>
          <li class="li4">
            <span class="s1">
              To send administrative information to you, for example,
              information regarding the Service and changes to our terms,
              conditions, and policies;
            </span>
          </li>
          <li class="li4">
            <span class="s1">
              To analyze how you interact with our Service;
            </span>
          </li>
          <li class="li4">
            <span class="s1">To maintain and improve the Service;</span>
          </li>
          <li class="li4">
            <span class="s1">To develop new products and services;</span>
          </li>
          <li class="li4">
            <span class="s1">
              To prevent fraud, criminal activity, or misuses of our Service,
              and to ensure the security of our IT systems, architecture, and
              networks; and
            </span>
          </li>
          <li class="li4">
            <span class="s1">
              To comply with legal obligations and legal process and to protect
              our rights, privacy, safety, or property, and/or that of our
              affiliates, you, or other third parties.
            </span>
          </li>
        </ul>
        <p class="p3">
          <br />
        </p>
        <p class="p14">
          <span class="s1">
            <strong>Aggregated Information.</strong> We may aggregate Personal
            Information and use the aggregated information to analyze the
            effectiveness of our Service, to improve and add features to our
            Service, and for other similar purposes. In addition, from time to
            time, we may analyze the general behavior and characteristics of
            users of our Service and share aggregated information like general
            user statistics with prospective business partners. We may collect
            aggregated information through the Service, through cookies, and
            through other means described in this Privacy Policy.
          </span>
        </p>
        <p class="p4">
          <span class="s1">
            <strong>Marketing.&nbsp;</strong>We may use your Personal
            Information to contact you to tell you about products or services we
            believe may be of interest to you. For instance, if you elect to
            provide your email[ or telephone number], we may use that
            information to send you special offers. You may opt out of receiving
            emails by following the instructions contained in each promotional
            email we send you. You can also control the marketing emails you
            receive by updating your settings through your account. In addition,
            if at any time you do not wish to receive future marketing
            communications, you may&nbsp;
          </span>
          <span class="s4">contact us</span>
          <span class="s1">
            . If you unsubscribe from our marketing lists, you will no longer
            receive marketing communications but we will continue to contact you
            regarding management of your account, other administrative matters,
            and to respond to your requests.
          </span>
        </p>
        <p class="p3">
          <br />
        </p>
        <ol class="ol1">
          <li class="li9">
            <span class="s2">
              <strong>SHARING AND DISCLOSURE OF PERSONAL INFORMATION</strong>
            </span>
          </li>
        </ol>
        <p class="p4">
          <span class="s1">
            SecretGarden does not sell your Personal Information. In certain
            circumstances we may share the categories of Personal Information
            described above without further notice to you, unless required by
            the law, with the following categories of third parties:
          </span>
        </p>
        <p class="p3">
          <br />
        </p>
        <ul class="ul1">
          <li class="li4">
            <span class="s1">
              <strong>Vendors and Service Providers:&nbsp;</strong>To assist us
              in meeting business operations needs and to perform certain
              services and functions, we may share Personal Information with
              vendors and service providers, including providers of hosting
              services, cloud services, and other information technology
              services providers, email communication software and email
              newsletter services, advertising and marketing services, payment
              processors, customer relationship management and customer support
              services, and analytics services. Pursuant to our instructions,
              these parties will access, process, or store Personal Information
              in the course of performing their duties to us.
              <span class="Apple-converted-space">&nbsp;</span>
            </span>
          </li>
          <li class="li4">
            <span class="s2">
              <strong>Business Transfers:</strong> If we are involved in a
              merger, acquisition, financing due diligence, reorganization,
              bankruptcy, receivership, dissolution, sale of all or a portion of
              our assets, or transition of service to another provider
              (collectively a &ldquo;Transaction&rdquo;), your Personal
              Information and other information may be shared in the diligence
              process with counterparties and others assisting with the
              Transaction and transferred to a successor or affiliate as part of
              or following that Transaction along with other assets.
            </span>
          </li>
          <li class="li4">
            <span class="s1">
              <strong>Legal Requirements:</strong> If required to do so by law
              or in the good faith belief that such action is necessary to (i)
              comply with a legal obligation, including to meet national
              security or law enforcement requirements, (ii) protect and defend
              our rights or property, (iii) prevent fraud, (iv) act in urgent
              circumstances to protect the personal safety of users of the
              Service, or the public, or (v) protect against legal liability.
            </span>
          </li>
        </ul>
        <p class="p3">
          <br />
        </p>
        <ol class="ol1">
          <li class="li9">
            <span class="s2">
              <strong>CHILDREN</strong>
            </span>
          </li>
        </ol>
        <p class="p4">
          <span class="s1">
            Our Service is not directed to children who are under the age of 16.
            SecretGarden does not knowingly collect Personal Information from
            children under the age of 16. If you have reason to believe that a
            child under the age of 16 has provided Personal Information to
            SecretGarden through the Service please&nbsp;
          </span>
          <span class="s4">contact us</span>
          <span class="s1">
            &nbsp;and we will endeavor to delete that information from our
            databases.
          </span>
        </p>
        <p class="p3">
          <br />
        </p>
        <ol class="ol1">
          <li class="li9">
            <span class="s2">
              <strong>LINKS TO OTHER WEBSITES</strong>
            </span>
          </li>
        </ol>
        <p class="p4">
          <span class="s1">
            The Service may contain links to other websites not operated or
            controlled by SecretGarden, including social media services (&ldquo;
            <strong>Third Party Sites</strong>&rdquo;). The information that you
            share with Third Party Sites will be governed by the specific
            privacy policies and terms of service of the Third Party Sites and
            not by this Privacy Policy. By providing these links we do not imply
            that we endorse or have reviewed these sites. Please contact the
            Third Party Sites directly for information on their privacy
            practices and policies.
            <span class="Apple-converted-space">&nbsp;</span>
          </span>
        </p>
        <p class="p3">
          <br />
        </p>
        <ol class="ol1">
          <li class="li15">
            <span class="s2">
              <strong>SECURITY</strong>
            </span>
          </li>
        </ol>
        <p class="p13">
          <span class="s1">
            You use the Service at your own risk. We implement commercially
            reasonable technical, administrative, and organizational measures to
            protect Personal Information both online and offline from loss,
            misuse, and unauthorized access, disclosure, alteration, or
            destruction. However, no Internet or e-mail transmission is ever
            fully secure or error free. In particular, e-mail sent to or from us
            may not be secure. Therefore, you should take special care in
            deciding what information you send to us via the Service or e-mail.
            Please keep this in mind when disclosing any Personal Information to
            SecretGarden via the Internet. In addition, we are not responsible
            for circumvention of any privacy settings or security measures
            contained on the Service, or third party websites.
          </span>
        </p>
        <ol class="ol1">
          <li class="li9">
            <span class="s2">
              <strong>INTERNATIONAL USERS</strong>
            </span>
          </li>
        </ol>
        <p class="p16">
          <span class="s1">
            The Service is not intended for use outside the United States. By
            using our Service, you understand and acknowledge that your Personal
            Data will be transferred from your location to our facilities and
            servers in the United States, where data protection laws may differ
            from those in your jurisdiction.
          </span>
        </p>
        <ol class="ol1">
          <li class="li15">
            <span class="s2">
              <strong>YOUR CHOICES</strong>
            </span>
          </li>
        </ol>
        <p class="p15">
          <span class="s1">
            In certain circumstances providing Personal Information is optional.
            However, if you choose not to provide Personal Information that is
            needed to use some features of our Service, you may be unable to use
            those features. You can also&nbsp;
          </span>
          <span class="s4">contact us</span>
          <span class="s1">
            &nbsp;to request updates or corrections to your Personal
            Information.
          </span>
        </p>
        <ol class="ol1">
          <li class="li9">
            <span class="s2">
              <strong>CHANGES TO THE PRIVACY POLICY</strong>
            </span>
          </li>
        </ol>
        <p class="p4">
          <span class="s1">
            The Service and our business may change from time to time. As a
            result we may change this Privacy Policy at any time. When we do we
            will post an updated version on this page, unless another type of
            notice is required by the applicable law. By continuing to use our
            Service or providing us with Personal Information after we have
            posted an updated Privacy Policy, or notified you by other means if
            applicable, you consent to the revised Privacy Policy and practices
            described in it.
          </span>
        </p>
        <p class="p3">
          <br />
        </p>
        <ol class="ol1">
          <li class="li15">
            <span class="s2">
              <strong>CONTACT US</strong>
            </span>
          </li>
        </ol>
        <p class="p7">
          <span class="s1">
            If you have any questions about our Privacy Policy or information
            practices, please feel free to contact us at our designated request
            address: privacy@secretgarden.fm
          </span>
        </p>
        <p class="p3">
          <br />
        </p>
      </div>
      <Footer white={false} />
    </React.StrictMode>
  );
}

export default Tos;
