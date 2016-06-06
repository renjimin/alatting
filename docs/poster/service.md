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
        "id": 1,
        "poster": {
            "id": 50,
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
                "id": 5,
                "data_status": 1,
                "created_at": "2016-05-30 07:13:00",
                "updated_at": "2016-05-30 07:13:11",
                "type": "Activity",
                "name": "Marriage Invitation",
                "description": "Marriage Invitation",
                "tags": "",
                "audit_status": 2,
                "parent": 1
            },
            "logo_image": {
                "id": 182,
                "uuid": "f46341c3c9224031a1597824af14195c",
                "created_at": "2016-05-31 18:11:51",
                "file": "http://0.0.0.0:8020/media/images/2016/05/31/5715a6fcca24465db87eaee208f701ca.jpg",
                "width": 108,
                "height": 108,
                "format": "jpg",
                "creator": null
            },
            "address": {
                "id": 52,
                "address1": "fdfadfa",
                "address2": "",
                "city": "",
                "province": "",
                "state": "",
                "country": "",
                "post_code": "",
                "created_at": "2016-05-31 18:11:51",
                "updated_at": "2016-05-31 18:11:51"
            },
            "unique_name": "AD发ad",
            "url": "",
            "logo_title": "",
            "short_description": "dfsdf",
            "phone": "010-1234567",
            "mobile": "13800138000",
            "email": "123123@fdsf.com",
            "lifetime_type": "weekly",
            "lifetime_timezone": "Asia/Shanghai",
            "lifetime_value": "{\"Tuesday\": {\"enabled\": 1, \"time_end\": \"18:00:00\", \"time_start\": \"09:00:00\"}, \"Monday\": {\"enabled\": 1, \"time_end\": \"18:00:00\", \"time_start\": \"09:00:00\"}, \"Wednesday\": {\"enabled\": 1, \"time_end\": \"18:00:00\", \"time_start\": \"09:00:00\"}, \"Saturday\": {\"disabled\": 1, \"time_end\": \"18:00:00\", \"time_start\": \"09:00:00\"}, \"Friday\": {\"enabled\": 1, \"time_end\": \"18:00:00\", \"time_start\": \"09:00:00\"}, \"Sunday\": {\"disabled\": 1, \"time_end\": \"18:00:00\", \"time_start\": \"09:00:00\"}, \"Thursday\": {\"enabled\": 1, \"time_end\": \"18:00:00\", \"time_start\": \"09:00:00\"}}",
            "music": null,
            "created_at": "2016-05-31 18:11:51",
            "updated_at": "2016-05-31 18:11:51",
            "status": "Draft",
            "width": 800,
            "height": 1024,
            "tags": "",
            "snapshot": null,
            "creator": 5
        },
        "data_status": 1,
        "created_at": "2016-06-03 14:48:52",
        "updated_at": "2016-06-03 14:48:52",
        "price": 20,                            //价格
        "accepted": false,                      //是否接受
        "refused": false,                       //是否拒绝
        "note": "aaa",                          //备注留言
        "server": 5,                            //服务者ID
        "consumer": 12                          //需求者ID
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


## 交流记录列表API

    GET /api/v1/poster/{:poster_id}/chats
    

**Request**

数据过滤：

?receiver_id=XXX    XXX是需求者ID, 过滤出服务者与需求者的交流记录, 需求者请求时，不需要添加此过滤


**Response**
```json
[
    {
        "id": 4,
        "data_status": 1,
        "created_at": "2016-06-03 18:04:03",
        "updated_at": "2016-06-03 18:04:03",
        "content": "多少钱服务33",
        "poster": 50,
        "sender": 12,
        "receiver": 5
    },
    ...
]
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
    
**Response**
```json
{
    "content": "adfasdfasdf",                   //评价内容
    "rating": 100                               //评分
}
```
