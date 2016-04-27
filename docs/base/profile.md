# 用户信息

## 获取用户资料以及创建、点赞、收藏的海报

    GET /api/v1/account/profile

**Response**

用户登录后返回此登录用户信息，否则返回所有用户信息。

```json
[
    ...
    {
        "id": 5,
        "username": "admin",
        "first_name": "",
        "last_name": "",
        "email": "admin@admin.com",
        "person": {
            "gender": "Male",
            "phonenumber": "",
            "avatar": "http://192.168.5.131/media/avatars/2015/11/09/86ecc17e58f4461fbcaee510e44cbc9f.png"
        },
        "poster_creator": [
            {
                "id": 6,
                "unique_name": "3551",
                "url": "http://www.yunye123.com",
                "logo_title": "3551光谷人才计划",
                "short_description": "“3551光谷人才计划” - 武汉东湖高新区启动之引才计划",
                "phone": "87280808",
                "mobile": "13800138000",
                "email": "abc@yunye123.com",
                "lifetime_type": "weekly",
                "lifetime_timezone": "Asia/Shanghai",
                "lifetime_value": "UTC",
                "created_at": "2016-04-11 07:55:50",
                "status": "Draft",
                "width": 800,
                "height": 1024,
                "data": null,
                "html": "http://192.168.5.131/media/html5/2016/04/13/7da62f47b96e4af3a6beacac7e2acbc9.json",
                "css": "http://192.168.5.131/media/html5/2016/04/12/96d55ee0b5ad43c2ad23fb89efb2c9a9.css",
                "script": null,
                "tags": "3551",
                "creator": 5,
                "logo_image": 15,
                "address": 3,
                "music": null,
                "main_category": 1,
                "sub_category": 5,
                "category_keyword": null
            }
        ],
        "poster_likes_creator": [
            {
                "liked": true,
                "poster": 6
            },
            {
                "liked": true,
                "poster": 1
            }
        ],
        "poster_subscriptions_follower": []
    }
    ...
]
```