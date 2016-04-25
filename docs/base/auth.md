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
    "phonenumber": "13652430859",      // 手机
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
    "phonenumber": "13652430859",      // 手机
    "message": "1234",      // 四位验证码
}
```

**Response**
```json
{
    "detail": "Authentication successful"
}
```

