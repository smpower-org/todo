import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Register from './register';
import { regist, clearStore } from '../actions';
import {
  actions as checkUsernameActions,
  status as checkUsernameStatus
} from '../../components/checkUsername/';
import {
  actions as checkEmailActions,
  status as checkEmailStatus
} from '../../components/checkEmail/';
import { Validator } from '../../components/formCheck/';

import './style.css';

class RegisterContainer extends Component {
  constructor() {
    super(...arguments);

    this.getOwnState = this.getOwnState.bind(this);
    this.onChange = this.onChange.bind(this);
    this.setErrorMsg = this.setErrorMsg.bind(this);
    this.onNameInputChange = this.onNameInputChange.bind(this);
    this.onEmailInputChange = this.onEmailInputChange.bind(this);
    this.onPasswordInputChange = this.onPasswordInputChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = Object.assign({}, {
      // default params
      nameInputValue: '',
      emailInputValue: '',
      passwordInputValue: '',
      nameInputErrorMsg: '',
      emailInputErrorMsg: '',
      passwordInputErrorMsg: '',
      errorMsg: null
    }, this.getOwnState());
  }

  getOwnState() {
    return {
      register: this.context.store.getState().register
    };
  }

  onChange() {
    this.setState(this.getOwnState());

    if (this.state.register.status === 'success') {
      this.props.history.push('/login');
    }
  }

  setErrorMsg(key, errorMsg) {  // 设置错误信息
    if (errorMsg) {
      this.setState({
        [key]: errorMsg
      });
    } else {
      this.setState({
        [key]: ''
      });
    }
    return;
  }

  onNameInputChange(event) {  // 用户名
    this.setState({
      nameInputValue: event.target.value.trim()
    });

    const validator = new Validator();
    validator.add(event.target.value.trim(), [{
      strategy: 'isNonEmpty',
      errorMsg: '请输入用户名'
    }, {
      strategy: 'minLength: 2',
      errorMsg: '用户名应大于 2 位'
    }, {
      strategy: 'maxLength: 20',
      errorMsg: '用户名应小于 20 位'
    }, {
      strategy: 'isUsernameExisted',  // 判断用户是否已注册
      errorMsg: (value) => {
	this.context.store.dispatch(checkUsernameActions.checkUsername(value));

	const getStatus = () => {
	  const checkUsername = this.context.store.getState().checkUsername;
	  if (checkUsername.status === checkUsernameStatus.SUCCESS) {
	    window.clearInterval(timer);
	    if (checkUsername.isUsernameExisted) {
	      this.setErrorMsg('nameInputErrorMsg', '该用户已被注册');
	    } else this.setErrorMsg('nameInputErrorMsg', '');
	  }
	};

	const timer = window.setInterval(getStatus, 30);
      }
    }]);

    const errorMsg = validator.start();
    this.setErrorMsg('nameInputErrorMsg', errorMsg);
    return;
  }

  onEmailInputChange(event) {  // 邮箱
    this.setState({
      emailInputValue: event.target.value.trim()
    });

    const validator = new Validator();
    validator.add(event.target.value.trim(), [{
      strategy: 'isNonEmpty',
      errorMsg:  '请输入邮箱'
    }, {
      strategy: 'isEmail',
      errorMsg: '请输入正确的邮箱'
    }, {
      strategy: 'isEmailExisted',
      errorMsg: (value) => {
	this.context.store.dispatch(checkEmailActions.checkEmail(value));

	const getStatus = () => {
	  const checkEmail = this.context.store.getState().checkEmail;
	  if (checkEmail.status === checkEmailStatus.SUCCESS) {
	    window.clearInterval(emailTimer);
	    if (checkEmail.isEmailExisted) {
	      this.setErrorMsg('emailInputErrorMsg', '该邮箱已被注册');
	    } else this.setErrorMsg('emailInputErrorMsg', '');
	  }
	};

	const emailTimer = window.setInterval(getStatus, 30);
      }
    }]);

    const errorMsg = validator.start();
    this.setErrorMsg('emailInputErrorMsg', errorMsg);
    return;
  }

  onPasswordInputChange(event) {  // 密码
    this.setState({
      passwordInputValue: event.target.value.trim()
    });

    const validator = new Validator();
    validator.add(event.target.value.trim(), [{
      strategy: 'isNonEmpty',
      errorMsg: '请输入密码'
    }, {
      strategy: 'minLength: 8',
      errorMsg: '密码长度应不小于 8 位'
    }, {
      strategy: 'maxLength: 16',
      errorMsg: '密码长度应不大于 16 位'
    }]);

    const errorMsg = validator.start();
    this.setErrorMsg('passwordInputErrorMsg', errorMsg);
    return;
  }

  onSubmit() {  // 提交
    const {
      nameInputValue, emailInputValue, passwordInputValue,
      nameInputErrorMsg, emailInputErrorMsg, passwordInputErrorMsg
    } = this.state;

    const isNameInputPassed = (nameInputErrorMsg === '' && nameInputValue !== '') ? true : false;
    const isEmailInputPassed = (emailInputErrorMsg === '' && emailInputValue !== '') ? true : false;
    const isPasswordInputPassed = (passwordInputErrorMsg === '' && passwordInputValue !== '') ? true : false;

    if (isNameInputPassed && isEmailInputPassed && isPasswordInputPassed) {
      this.context.store.dispatch(regist(
        this.state.nameInputValue,
	this.state.emailInputValue,
	this.state.passwordInputValue
      ));
    } else {
      alert('请检查注册信息');
    }
  }

  componentDidMount() {
    this.setState({
      unsubscribe: this.context.store.subscribe(this.onChange)
    });
  }

  componentWillUnmount() {
    this.state.unsubscribe(this.onChange);
    this.context.store.dispatch(clearStore());
  }

  render() {
    return (
      <Register 
        onNameInputChange={this.onNameInputChange}
	onEmailInputChange={this.onEmailInputChange}
	onPasswordInputChange={this.onPasswordInputChange}
	nameInputValue={this.state.nameInputValue}
	emailInputValue={this.state.emailInputValue}
	passwordInputValue={this.state.passwordInputValue}
	nameInputErrorMsg={this.state.nameInputErrorMsg}
	emailInputErrorMsg={this.state.emailInputErrorMsg}
	passwordInputErrorMsg={this.state.passwordInputErrorMsg}
	onSubmit={this.onSubmit}
      />
    );
  }
}

RegisterContainer.contextTypes = {
  store: PropTypes.object
};

export default RegisterContainer;
