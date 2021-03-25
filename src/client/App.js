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

export default function App(props) {
  return (
    <Router>
      <React.Fragment>
        <Suspense fallback={<div />}>
          <Switch>
            <Route exact path="/">
              <Sequencer />
            </Route>
          </Switch>
        </Suspense>
      </React.Fragment>
    </Router>
  );
}
