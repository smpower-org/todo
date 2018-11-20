import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {reducer as registerReducer} from './register/';
import {reducer as loginReducer} from './login/';
import {reducer as checkUsernameReducer} from './checkUsername/';
import {reducer as checkEmailReducer} from './checkEmail/';
import {reducer as navigationReducer} from './navigation/';

const reducer = combineReducers({
  register: registerReducer,
  login: loginReducer,
  checkUsername: checkUsernameReducer,
  checkEmail: checkEmailReducer,
  navigation: navigationReducer
});

export default createStore(reducer, applyMiddleware(thunkMiddleware));
