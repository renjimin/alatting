# 用户信息

## 获取用户账户基本信息

    GET /api/v1/account/profile

**Response**

用户登录后返回此登录用户信息，否则返回空。

```json
[
    {
        "id": 9,
        "username": "422613961@qq.com_ab4271c2",
        "first_name": "",
        "last_name": "",
        "email": "422613961@qq.com",
        "person": {
            "gender": "Male",
            "phonenumber": "",
            "avatar": "http://192.168.5.131/media/avatars/2015/11/09/86ecc17e58f4461fbcaee510e44cbc9f.png"
        },
        "poster_count": 1,
        "poster_creator": [
            {
                "id": 1,
                "home_page": "/poster/1/",
                "thumb": "/media/images/2016/04/15/15588b5bb19f4518abb21269eccc9ba7.png",
                "views_count": 947,
                "created_at": "2015-09-23 22:01:33"
            }
        ],
        "poster_likes_count": 1,
        "poster_likes_creator": [
            {
                "liked": true,
                "poster": 1
            }
        ],
        "poster_subscriptions_count": 1,
        "poster_subscriptions_follower": [
            {
                "subscribed": true,
                "poster": 1
            }
        ]
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