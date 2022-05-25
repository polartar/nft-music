/* eslint-disable react/no-unused-state, react/no-array-index-key */
import React, { Component, createRef, useState, useEffect } from "react";

function Tutorial(props) {
  const {
    tutorialStep,
    soundCount
  } = props

  return (
    <>
    {tutorialStep === 0 && (
      <React.Fragment>
        <div className="body-small white-text">
          To begin, press one of the highlighted squares
          on the left. These are the drum loops. <br />
          <br />
          Only one will play at a time.
        </div>
      </React.Fragment>
    )}
    {tutorialStep === 1 && (
      <div className="body-small white-text">
        Now, press one of the highlighted squares on the
        right. These are the bass loops. <br />
        <br />
        When the pad is flashing, the sound will wait to
        play until the next bar.
        <br />
        <br /> Only one will play at a time.
      </div>
    )}
    {tutorialStep === 2 && (
      <div className="body-small white-text">
        {`Lastly, press one of grey squares in the middle. These are
    chords and melodies. Up to ${soundCount} can play at at time.`}
      </div>
    )}
    {tutorialStep === 3 && (
      <div className="body-small white-text">
        You're ready to make some music! <br />
        <br />
        Try out different combinations and share them with
        friends below. <br />
        <br />
        If you'd like to learn more about Secret Garden,
        scroll down.
      </div>
    )}
    </>
  );
}

export default Tutorial;
