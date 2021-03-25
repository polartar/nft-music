import React from 'react'

import { makeStyles } from '@material-ui/core/styles'

import '../css/footer.css'

export default function Footer(props) {
  return (
    <React.Fragment>
      <div
        className={
          props.white ? 'bottomNav scrollBar white' : 'bottomNav scrollBar'
        }
      >
        <div className="bottomItem">DASHBOARD</div>
        <div className="bottomItem">ARTISTS</div>
        <div className="bottomItem">MY BEATS</div>
        <div className="bottomItem">PROFILE</div>
      </div>
    </React.Fragment>
  )
}
