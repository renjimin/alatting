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


## 用户海报列表(服务提供者)

    GET /api/v1/account/posters/server

**Response**


```json
[
    {
        "id": 49,
        "main_category": {
            "id": 1,
            "data_status": 1,
            "created_at": "2016-05-30 07:13:00",
            "updated_at": "2016-05-30 07:13:11",
            "type": "Activity",
            "name": "Activity Invitation",
            "description": "Activity / Party Invitation",
            "tags": "",
            "audit_status": 2,
            "parent": null
        },
        "sub_category": {
            "id": 13,
            "data_status": 1,
            "created_at": "2016-05-30 07:13:00",
            "updated_at": "2016-05-30 07:13:11",
            "type": "Activity",
            "name": "Birthday Invitation",
            "description": "Birthday Invitation",
            "tags": "",
            "audit_status": 2,
            "parent": 1
        },
        "logo_image": {
            "id": 180,
            "uuid": "cf194ece5c1a4aaaa79b5f98ea35064b",
            "created_at": "2016-05-31 15:31:20",
            "file": "http://0.0.0.0:8020/media/images/2016/05/31/76f10b0c48244c4eb5dd83720b3e9b0d.jpg",
            "width": 108,
            "height": 108,
            "format": "jpg"
        },
        "address": {
            "id": 51,
            "address1": "fadfadfasdfasf",
            "address2": "",
            "city": "",
            "province": "",
            "state": "",
            "country": "",
            "post_code": "",
            "created_at": "2016-05-31 15:31:20",
            "updated_at": "2016-05-31 15:31:20"
        },
        "unique_name": "fadfd",
        "url": "",
        "logo_title": "",
        "short_description": "dfsdfa",
        "phone": "010-1234567",
        "mobile": "13800138000",
        "email": "123123@fdsf.com",
        "lifetime_type": "weekly",
        "lifetime_timezone": "Asia/Shanghai",
        "lifetime_value": "{\"Friday\": {\"enabled\": 1, \"end\": \"17:00\", \"start\": \"09:00\"}, \"Saturday\": {\"enabled\": 0, \"end\": \"17:00\", \"start\": \"09:00\"}, \"Wednesday\": {\"enabled\": 1, \"end\": \"17:00\", \"start\": \"09:00\"}, \"Monday\": {\"enabled\": 1, \"end\": \"17:00\", \"start\": \"09:00\"}, \"Tuesday\": {\"enabled\": 1, \"end\": \"17:00\", \"start\": \"09:00\"}, \"Thursday\": {\"enabled\": 1, \"end\": \"17:00\", \"start\": \"09:00\"}, \"Sunday\": {\"enabled\": 0, \"end\": \"17:00\", \"start\": \"09:00\"}}",
        "music": null,
        "created_at": "2016-05-31 15:31:20",
        "updated_at": "2016-05-31 15:31:43",
        "status": "Published",
        "width": 800,
        "height": 1024,
        "tags": "",
        "snapshot": null,
        "creator": 12
    },
    ...
]
```


## 用户海报列表(服务需求者)

    GET /api/v1/account/posters/consumer

**Response**


```json
[
    {
        "id": 49,
        "main_category": {
            "id": 1,
            "data_status": 1,
            "created_at": "2016-05-30 07:13:00",
            "updated_at": "2016-05-30 07:13:11",
            "type": "Activity",
            "name": "Activity Invitation",
            "description": "Activity / Party Invitation",
            "tags": "",
            "audit_status": 2,
            "parent": null
        },
        "sub_category": {
            "id": 13,
            "data_status": 1,
            "created_at": "2016-05-30 07:13:00",
            "updated_at": "2016-05-30 07:13:11",
            "type": "Activity",
            "name": "Birthday Invitation",
            "description": "Birthday Invitation",
            "tags": "",
            "audit_status": 2,
            "parent": 1
        },
        "logo_image": {
            "id": 180,
            "uuid": "cf194ece5c1a4aaaa79b5f98ea35064b",
            "created_at": "2016-05-31 15:31:20",
            "file": "http://0.0.0.0:8020/media/images/2016/05/31/76f10b0c48244c4eb5dd83720b3e9b0d.jpg",
            "width": 108,
            "height": 108,
            "format": "jpg"
        },
        "address": {
            "id": 51,
            "address1": "fadfadfasdfasf",
            "address2": "",
            "city": "",
            "province": "",
            "state": "",
            "country": "",
            "post_code": "",
            "created_at": "2016-05-31 15:31:20",
            "updated_at": "2016-05-31 15:31:20"
        },
        "unique_name": "fadfd",
        "url": "",
        "logo_title": "",
        "short_description": "dfsdfa",
        "phone": "010-1234567",
        "mobile": "13800138000",
        "email": "123123@fdsf.com",
        "lifetime_type": "weekly",
        "lifetime_timezone": "Asia/Shanghai",
        "lifetime_value": "{\"Friday\": {\"enabled\": 1, \"end\": \"17:00\", \"start\": \"09:00\"}, \"Saturday\": {\"enabled\": 0, \"end\": \"17:00\", \"start\": \"09:00\"}, \"Wednesday\": {\"enabled\": 1, \"end\": \"17:00\", \"start\": \"09:00\"}, \"Monday\": {\"enabled\": 1, \"end\": \"17:00\", \"start\": \"09:00\"}, \"Tuesday\": {\"enabled\": 1, \"end\": \"17:00\", \"start\": \"09:00\"}, \"Thursday\": {\"enabled\": 1, \"end\": \"17:00\", \"start\": \"09:00\"}, \"Sunday\": {\"enabled\": 0, \"end\": \"17:00\", \"start\": \"09:00\"}}",
        "music": null,
        "created_at": "2016-05-31 15:31:20",
        "updated_at": "2016-05-31 15:31:43",
        "status": "Published",
        "width": 800,
        "height": 1024,
        "tags": "",
        "snapshot": null,
        "creator": 12
    },
    ...
]
```


## 用户上传资源列表(图片)

    GET /api/v1/account/files?q=image

**Response**

* 返回图片数据格式：

```json
[
    {
        "id": 181,
        "uuid": "1be683365bd44867ae52e72c4c15e4cd",
        "created_at": "2016-05-31 17:43:42",
        "file": "http://0.0.0.0:8020/media/images/2016/05/31/aa55b3a5e68d46ab81559965057c703f.jpg",
        "width": 108,
        "height": 108,
        "format": "jpg",
        "creator": 5
    },
    ...
]

```


## 用户上传资源列表(音频)

    GET /api/v1/account/files?q=audio

* 返回音频数据格式：

```json
[
    {
        "id": 1,
        "uuid": "e00f5c389f1b46948530079e368fa8d9",
        "created_at": "2015-09-23 21:59:22",
        "file": "http://0.0.0.0:8020/media/music/2015/09/23/745f07fbc5014e54b9835bf5d985b5b8.mp3",
        "format": "mp3",
        "creator": 5
    },
    ...
]
```

## 用户上传资源列表(视频)

    GET /api/v1/account/files?q=video

* 返回视频数据格式：

```json
[
    {
        "id": 32,
        "uuid": "f16d86bb09444b40965036766d485459",
        "created_at": "2016-05-26 08:15:16",
        "preview": "/media/videos/2016/05/26/398bc4e3f5bf47c9a2b314381d42aecd.jpg",
        "file": "http://0.0.0.0:8020/media/videos/2016/05/26/398bc4e3f5bf47c9a2b314381d42aecd.mp4",
        "format": "mp4",
        "creator": 5
    },
    ...
]
```