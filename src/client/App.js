import React, { lazy, Suspense } from "react";
import css from "./app.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  withRouter,
  Redirect,
} from "react-router-dom";

import mixpanel from "mixpanel-browser";

const Sequencer = lazy(() => import("./Sequencer"));
const Settings = lazy(() => import("./components/Settings"));
const Directory = lazy(() => import("./components/Directory"));
const ArtistsDirectory = lazy(() => import("./components/ArtistsDirectory"));
const MyBeats = lazy(() => import("./components/MyBeats"));
const Loading = lazy(() => import("./components/Loading"));
const Tos = lazy(() => import("./components/Tos"));

mixpanel.init("f54426da70deebfa5eb9d8c75dc5c829");

export default function App(props) {
  return (
    <Router>
      <React.Fragment>
        <Suspense fallback={<div />}>
          <Switch>
            <Route exact path="/">
              <Sequencer />
            </Route>
            <Route
              render={(props) => <Sequencer {...props} />}
              exact
              path="/:artistName/:nftName/:edition"
            />
            <Route exact path="/profile">
              <Settings />
            </Route>
            <Route exact path="/directory">
              <Directory />
            </Route>
            <Route exact path="/artists">
              <ArtistsDirectory />
            </Route>
            <Route exact path="/loading">
              <Loading />
            </Route>
            <Route exact path="/tos">
              <Tos />
            </Route>
            <Route
              render={(props) => <MyBeats {...props} />}
              exact
              path="/collection/:address"
            />
          </Switch>
        </Suspense>
      </React.Fragment>
    </Router>
  );
}
