import "./App.css";
import { Route, Switch } from "react-router-dom";

// components

import LoginSignUp from "./components/user/LoginSignUp";
import ForgotPassword from "./components/user/ForgotPassword";
import ResetPassword from "./components/user/ResetPassword";

const App = () => {
  return (
    <Switch>
      <Route exact path="/login" component={LoginSignUp} />
      <Route exact path="/password/forgot" component={ForgotPassword} />

      <Route exact path="/password/reset/:token" component={ResetPassword} />
    </Switch>
  );
};

export default App;
