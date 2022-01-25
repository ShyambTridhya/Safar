import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

import {
  allUsersReducer,
  forgotPasswordReducer,
  profileReducer,
  userDetailsReducer,
  userReducer,
} from "./reducers/userreducer.js";

const reducer = combineReducers({
  user: userReducer,
  forgotPassword: forgotPasswordReducer,
  profile: profileReducer,

  allUsers: allUsersReducer,
  userDetails: userDetailsReducer,
});

const middleware = [thunk]

const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
