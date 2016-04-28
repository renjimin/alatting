# 用户信息

## 获取用户账户基本信息

    GET /api/v1/account/profile

**Response**

用户登录后返回此登录用户信息，否则返回空。

```json
[
    {
        "id": 5,
        "username": "admin",
        "first_name": "",
        "last_name": "",
        "email": "admin@admin.com",
        "person": {
            "gender": "Male",
            "phonenumber": "",
            "avatar": "http://127.0.0.1:8000/media/avatars/2015/11/09/86ecc17e58f4461fbcaee510e44cbc9f.png"
        }
    }
]
```

## 获取用户好友列表

    GET /api/v1/account/friends

**Response**

用户登录后返回此登录用户好友列表，否则返回空。

```json
[
    {
        "user1": 5,
        "user2": {
            "id": 6,
            "username": "direction",
            "first_name": "direction",
            "last_name": "wang",
            "email": "direction.wfx@gmail.com",
            "person": null
        }
    },
    {
        "user1": 5,
        "user2": {
            "id": 2,
            "username": "alatting",
            "first_name": "baohua",
            "last_name": "cao",
            "email": "info@alatting.com",
            "person": null
        }
    }
]
```