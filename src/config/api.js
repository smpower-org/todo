export const login = {
  path: '/todo/login',
  params: ['username', 'password'],
  des: '用户登录'
};

export const regist = {
  path: '/todo/regist',
  params: ['username', 'email', 'password'],
  des: '用户注册'
};

export const checkUsername = {
  path: '/todo/isUsernameExisted',
  params: ['username'],
  des: '验证用户名是否已注册(存在)'
};

export const checkEmail = {
  path: '/todo/isEmailExisted',
  params: ['email'],
  des: '验证用户邮箱是否已注册(存在)'
};
