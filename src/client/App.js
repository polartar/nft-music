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

const Sequencer = lazy(() => import("./Sequencer"));
const Settings = lazy(() => import("./components/Settings"));
const Directory = lazy(() => import("./components/Directory"));
const ArtistsDirectory = lazy(() => import("./components/ArtistsDirectory"));
const MyBeats = lazy(() => import("./components/MyBeats"));

export default function App(props) {
  return (
    <Router>
      <React.Fragment>
        <Suspense fallback={<div />}>
          <Switch>
            <Route exact path="/">
              <Sequencer />
            </Route>
            <Route exact path="/profile">
              <Settings />
            </Route>
            <Route exact path="/directory">
              <Directory />
            </Route>
            <Route exact path="/artists">
              <ArtistsDirectory />
            </Route>
            <Route exact path="/mybeats">
              <MyBeats />
            </Route>
          </Switch>
        </Suspense>
      </React.Fragment>
    </Router>
  );
}
