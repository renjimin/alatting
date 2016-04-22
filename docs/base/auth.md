# 用户认证

## 登录

    POST  /api/v1/account/login

**Request**
```json
{
    "cellphone": "13800138000",      // 手机 or 邮箱
    "password": "123456",     // 密码
}
```

**Response**
```json
{
    "detail": "login successful.",
    "token": "xx.yy.zz"
}
```

## 退出

    DELETE  /api/v1/account/login

