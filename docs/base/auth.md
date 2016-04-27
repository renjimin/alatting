# 用户认证

## 登录

    POST  /api/v1/account/login

**Request**
```json
{
    "username": "charlie",      // 手机 or 邮箱 or 用户名
    "password": "123456",     // 密码
}
```

**Response**
```json
{
    "detail": "Login successful"
}
```

## 退出

    DELETE  /api/v1/account/login

## 发送验证码

    POST  /api/v1/account/send_message

**Request**
```json
{
    "username": "13652430859",      // 手机 or email
}
```

**Response**
```json
{
    "phonenumber": "13652430859",      // 手机
    "message": "1234",      // 四位验证码
}
```

## 校验验证码

    POST  /api/v1/account/auth_message

**Request**
```json
{
    "username": "13652430859",      // 手机 or email
    "message": "1234",      // 四位验证码
}
```

**Response**
```json
{
    "detail": "Authentication successful"
}
```

## 注册

    POST  /api/v1/account/register

**Request**
```json
{
    "username": "13652430859",      // 用户名，手机号，邮箱任意一种
    "password": "1234",      // 用户的密码
}
```

**Response**
```json
{
    "detail": "register successful",  // 如参数错误会报400, 403的错误
    "active_url": ""                  // 只有邮箱注册有这个激活地址（手机注册之前已经验证验证码，不需要激活地址）
}
```

## 重设密码

    POST  /api/v1/account/reset_password

**Request**
```json
{
    "username": "13652430859",      // 用户名，手机号，邮箱任意一种
    "password": "1234",      // 用户的密码
}
```

**Response**
```json
{
    "detail": "Reset successful",  // 如参数错误会报400, 403的错误
}
```

