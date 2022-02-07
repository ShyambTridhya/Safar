import './App.css'
import {Route, Switch} from 'react-router-dom'

// components

import LoginSignUp from './components/user/LoginSignUp'
import ForgotPassword from './components/user/ForgotPassword'
import ResetPassword from './components/user/ResetPassword'
import Profile from './components/user/Profile'

const App = () => {
  return (
    <Switch>
      <Route exact path="/" component={LoginSignUp} />
      <Route exact path="/password/forgot" component={ForgotPassword} />
      <Route
        exact
        path="/Password/UserResetPassword/:token"
        component={ResetPassword}
      />
      <Route exact path="/profile" component={Profile} />
    </Switch>
  )
}

export default App
