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
```json
{
    "token": "xx.yy.zz"  // 返回token说明验证成功
}
```

## 退出

    DELETE  /api/v1/account/login

