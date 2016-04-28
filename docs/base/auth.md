# 用户认证

## 登录

    POST  /api/v1/account/login

**Request**
```json
{
    "username": "charlie",      // 手机 or 邮箱
    "password": "123456",     // 密码
}
```

**Response**

返回状态码400时，说明参数错误

返回状态码401时，说明密码验证未通过

返回状态码200时，说明保存成功，并返回如下格式的数据：

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

返回状态码400时，说明参数错误

返回状态码200时，说明保存成功，并返回如下格式的数据：

```json
{
    "username": "13652430859",      // 手机 or email
    "message": "1234",      // 四位验证码（邮箱的无此选项，由于目前无短信网关，手机号发验证码才返回验证码）
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

返回状态码400时，说明参数错误

返回状态码200时，说明保存成功，并返回如下格式的数据：

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
    "password1": "1234",      // 用户的密码1
    "password2": "1234",      // 用户的密码2
    "message": "1234",      // 用户收到的验证码
}
```

**Response**

返回状态码400时，说明参数错误

返回状态码401时，说明验证码已过期

返回状态码403时，验证码验证未通过，或者重复注册

返回状态码200时，说明保存成功，并返回如下格式的数据：

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
    "password1": "1234",      // 用户的密码1
    "password2": "1234",      // 用户的密码2
}
```

**Response**

返回状态码400时，说明参数错误

返回状态码404时，未找到该帐号

返回状态码200时，说明保存成功，并返回如下格式的数据：

```json
{
    "detail": "Reset successful",  // 如参数错误会报400, 403的错误
}
```

