import React, { lazy, Suspense } from "react";
import css from "./app.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  withRouter,
  Redirect
} from "react-router-dom";
import { MoralisProvider } from "react-moralis";

const Landing = lazy(() => import("./Landing"));
const Sequencer = lazy(() => import("./Sequencer"));
const SequencerNFT = lazy(() => import("./SequencerNFT"));
const SequencerIFrame = lazy(() => import("./SequencerIFrame"));
const Settings = lazy(() => import("./components/Settings"));
const Directory = lazy(() => import("./components/Directory"));
const ArtistsDirectory = lazy(() => import("./components/ArtistsDirectory"));
const MyBeats = lazy(() => import("./components/MyBeats"));
const Loading = lazy(() => import("./components/Loading"));
const Tos = lazy(() => import("./components/Tos"));
const Privacy = lazy(() => import("./components/Privacy"));

export default function App(props) {
  return (
    <MoralisProvider
      appId="ybcmRWIz6DQOVXEgyh4a8Jf7ENBZtX5lISlD320c"
      serverUrl="https://7gfgogavdhta.usemoralis.com:2053/server"
    >
      <Router>
        <React.Fragment>
          <Suspense fallback={<div />}>
            <Switch>
              <Route exact path="/">
                <Landing />
              </Route>
              <Route
                render={props => <Sequencer {...props} />}
                exact
                path="/:artistName/:nftName/:edition"
              />
              {/* <Route exact path="/featured/">
                <Sequencer />
              </Route> */}
              <Route exact path="/sequencer/">
                <SequencerNFT />
              </Route>
              <Route exact path="/sequenceriframe/">
                <SequencerIFrame />
              </Route>
              {/* <Route exact path="/directory">
                <Directory />
              </Route> */}
              {/* <Route exact path="/profile">
                <Settings />
              </Route>
              <Route exact path="/artists">
                <ArtistsDirectory />
              </Route> */}
              <Route exact path="/loading">
                <Loading />
              </Route>
              <Route exact path="/tos">
                <Tos />
              </Route>
              <Route exact path="/privacy">
                <Privacy />
              </Route>
              <Route
                render={props => <MyBeats {...props} />}
                exact
                path="/collection/:address"
              />
            </Switch>
          </Suspense>
        </React.Fragment>
      </Router>
    </MoralisProvider>
  );
}
