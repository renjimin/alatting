# 海报服务接口说明


## 取得某海报询价记录列表

    GET /api/v1/poster/{:poster_id}/bargains

**Request**

数据过滤：

?consumer_id=XXX    XXX是需求者ID，过滤出此需求者针对当前海报的所有报价记录


**Response**
```json
[
    {
        "id": 7,
        "consumer": {
            "id": 12,
            "username": "cnpython@163.com_8795f878",
            "first_name": "",
            "last_name": "",
            "email": "cnpython@163.com",
            "person": {
                "gender": "Unknown",
                "phonenumber": "cnpython@163",
                "avatar": "http://0.0.0.0:8020/media/avatars/avatar.png",
                "user_type": "consumer"
            }
        },
        "creator": {
            "id": 5,
            "username": "admin",
            "first_name": "",
            "last_name": "",
            "email": "admin@admin.com",
            "person": {
                "gender": "Male",
                "phonenumber": "13800138000",
                "avatar": "http://0.0.0.0:8020/media/avatars/2016/05/30/b2365b2b586449d184e7475371268ba7.jpg",
                "user_type": "server"
            }
        },
        "price": 29,                            //价格
        "accepted": false,                      //是否接受
        "refused": false,                       //是否拒绝
        "note": "服务者报价备注，可为空",                    
        "poster": 50,
        "data_status": 1,
        "created_at": "2016-06-06 15:52:52",
        "updated_at": "2016-06-06 15:52:52"
    },
    ....
]
```


## 服务者提交服务报价

    POST /api/v1/poster/{:poster_id}/bargains


**Response**
```json
{
    "consumer_id": 123,     //接收者ID（需求者）
    "price": "45.9",        //价格
    "note": "留言备注，可为空"
}
```


## 需求者提交服务报价

    POST /api/v1/poster/{:poster_id}/bargains

无需指定报价接收人，接口内部根据海报ID自动处理接收人

**Response**
```json
[
    "price": "45.9",        //价格
    "note": "留言备注，可为空"
]
```


## 接受某一个报价

    PATCH /api/v1/poster/{:poster_id}/bargains/{:bargain_id}


**Response**
```json
[
    "accepted": true,
    "refused": false
]
```

## 拒绝某一个报价

    PATCH /api/v1/poster/{:poster_id}/bargains/{:bargain_id}


**Response**
```json
[
    "refused": true,
    "accepted": false
]
```


## 留言记录列表API

    GET /api/v1/poster/{:poster_id}/chats
    

**Request**

数据过滤：

?receiver_id=XXX    XXX是需求者ID, 过滤出服务者与需求者的交流记录, 需求者请求时，不需要添加此过滤


**Response**
```json
[
    {
        "id": 6,
        "sender": {
            "id": 5,
            "username": "admin",
            "first_name": "",
            "last_name": "",
            "email": "admin@admin.com",
            "person": {
                "gender": "Male",
                "phonenumber": "13800138000",
                "avatar": "http://0.0.0.0:8020/media/avatars/2016/05/30/b2365b2b586449d184e7475371268ba7.jpg",
                "user_type": "consumer"
            }
        },
        "receiver": {
            "id": 14,
            "username": "cnpython@163.com_eb075ae2",
            "first_name": "",
            "last_name": "",
            "email": "cnpython@163.com",
            "person": {
                "gender": "unknown",
                "phonenumber": "cnpython@163",
                "avatar": "http://0.0.0.0:8020/media/avatars/avatar.png",
                "user_type": "consumer"
            }
        },
        "data_status": 1,
        "created_at": "2016-06-08 17:45:53",
        "updated_at": "2016-06-08 17:45:53",
        "content": "多少钱服务2222",
        "poster": 46
    },
    ...
]
```


## 服务者提交留言

    POST /api/v1/poster/{:poster_id}/chats


**Request**
```json
{
    "receiver_id": 123,     //接收者ID（需求者）
    "content": "留言的内容"
}
```

**Response**
```json
{
    "id": 6,
    "sender": {
        "id": 5,
        "username": "admin",
        "first_name": "",
        "last_name": "",
        "email": "admin@admin.com",
        "person": {
            "gender": "Male",
            "phonenumber": "13800138000",
            "avatar": "http://0.0.0.0:8020/media/avatars/2016/05/30/b2365b2b586449d184e7475371268ba7.jpg",
            "user_type": "consumer"
        }
    },
    "receiver": {
        "id": 14,
        "username": "cnpython@163.com_eb075ae2",
        "first_name": "",
        "last_name": "",
        "email": "cnpython@163.com",
        "person": {
            "gender": "unknown",
            "phonenumber": "cnpython@163",
            "avatar": "http://0.0.0.0:8020/media/avatars/avatar.png",
            "user_type": "consumer"
        }
    },
    "data_status": 1,
    "created_at": "2016-06-08 17:45:53",
    "updated_at": "2016-06-08 17:45:53",
    "content": "多少钱服务2222",
    "poster": 46
}
```


## 需求者提交留言

    POST /api/v1/poster/{:poster_id}/chats


**Request**
```json
{
    "content": "需求者留言的内容"
}
```

**Response**
```json
{
    "id": 6,
    "sender": {
        "id": 5,
        "username": "admin",
        "first_name": "",
        "last_name": "",
        "email": "admin@admin.com",
        "person": {
            "gender": "Male",
            "phonenumber": "13800138000",
            "avatar": "http://0.0.0.0:8020/media/avatars/2016/05/30/b2365b2b586449d184e7475371268ba7.jpg",
            "user_type": "consumer"
        }
    },
    "receiver": {
        "id": 14,
        "username": "cnpython@163.com_eb075ae2",
        "first_name": "",
        "last_name": "",
        "email": "cnpython@163.com",
        "person": {
            "gender": "unknown",
            "phonenumber": "cnpython@163",
            "avatar": "http://0.0.0.0:8020/media/avatars/avatar.png",
            "user_type": "consumer"
        }
    },
    "data_status": 1,
    "created_at": "2016-06-08 17:45:53",
    "updated_at": "2016-06-08 17:45:53",
    "content": "多少钱服务2222",
    "poster": 46
}
```


## 海报服务评价记录列表API

    GET /api/v1/poster/{:poster_id}/servicecomments
    
**Response**
```json
[
    {
        "id": 1,
        "creator": {                                    //评价用户信息
            "id": 12,
            "username": "cnpython@163.com_8795f878",
            "first_name": "",
            "last_name": "",
            "email": "cnpython@163.com",
            "person": {
                "gender": "Unknown",
                "phonenumber": "cnpython@163",
                "avatar": "http://0.0.0.0:8020/media/avatars/avatar.png",
                "user_type": "consumer"
            }
        },
        "content": "adfasdfasdf",                   //评价内容
        "rating": 100,                              //评分
        "poster": 50，                              //海报ID
        "data_status": 1,
        "created_at": "2016-06-06 15:31:02",
        "updated_at": "2016-06-06 15:31:02"
    },
    ...
]
```


## 提交海报服务评价记录列表API

    POST /api/v1/poster/{:poster_id}/servicecomments
    
注意：海报创建人不允许对自己创建的海报进行评价
    
**Request**
```json
{
    "content": "adfasdfasdf",                   //评价内容
    "rating": 5                               //评分, 1-5颗星
}
```
