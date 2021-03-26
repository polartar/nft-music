import React, { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  withRouter,
  Redirect,
} from "react-router-dom";
import css from "./app.css";

const Sequencer = lazy(() => import("./Sequencer"));
const Settings = lazy(() => import("./components/Settings"));
const Directory = lazy(() => import("./components/Directory"));
const ArtistsDirectory = lazy(() => import("./components/ArtistsDirectory"));

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
          </Switch>
        </Suspense>
      </React.Fragment>
    </Router>
  );
}
