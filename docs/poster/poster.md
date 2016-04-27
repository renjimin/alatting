# 海报接口说明

## 获取已经发表的海报列表

只返回‘发布’状态的海报数据

    GET /api/v1/poster/posters

**Request过滤**

暂无

**Response**
```json
[
    {
        "id": 6,
        "main_category": {
            "id": 2,
            "type": "Business",
            "name": "Business Marketing",
            "description": "Business Marketing",
            "tags": "",
            "parent": null
        },
        "sub_category": {
            "id": 14,
            "type": "Business",
            "name": "Enterprise Marketing",
            "description": "Enterprise Marketing",
            "tags": "",
            "parent": 2
        },
        "logo_image": {
            "id": 15,
            "uuid": "abc6a4ce7b464951b52a71fe50833417",
            "created_at": "2016-04-12 03:14:52",
            "file": "http://127.0.0.1:8020/media/images/2016/04/12/3d4601961f894c2883e83241dec83223.png",
            "width": 562,
            "height": 248,
            "format": "png"
        },
        "address": {
            "id": 3,
            "address1": "武汉光谷国际广场",
            "address2": "",
            "city": "武汉",
            "state": "湖北",
            "country": "中国",
            "post_code": "430070",
            "created_at": "2016-04-11 07:44:41",
            "updated_at": "2016-04-11 07:44:41"
        },
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
        "status": "Published",
        "width": 800,
        "height": 1024,
        "tags": "3551",
        "creator": 5,
        "music": null,                       // 背景音乐链接，没有值是为null
        "category_keyword_id": 2                // 分类关键词ID
    },
    ...
]
```


## 创建海报

    POST /api/v1/poster/posters
    
**Request**
```json
{
    "category_keyword_id": 3,               //关键词ID
    "main_category_id": 2,                  //一级分类ID
    "sub_category_id": 14,                  //二级分类ID
    "logo_image_id": 15,                    //logo图片ID
    "unique_name": "测试API接口创建海报",     //海报名称，全站唯一
    "logo_title": "测试API接口创建海报的标题",             //海报标题
    "short_description": "测试API接口创建海报动之引才计划",   //海报简述
    "phone": "87998799",                                //电话
    "mobile": "13822138222",                            //手机
    "email": "lyh@yunye123.com",                        //邮箱
    "address": "武汉江汉区汉正街"                         //地址
}
```

**Response**

创建海报成功后，将返回创建的海报的完整json格式数据， 前端只需分拣所需数据进行展示。

```json
{
    "id": 8,
    "main_category": {
        "id": 2,
        "type": "Business",
        "name": "Business Marketing",
        "description": "Business Marketing",
        "tags": "",
        "parent": null
    },
    "sub_category": {
        "id": 14,
        "type": "Business",
        "name": "Enterprise Marketing",
        "description": "Enterprise Marketing",
        "tags": "",
        "parent": 2
    },
    "logo_image": {
        "id": 15,
        "uuid": "abc6a4ce7b464951b52a71fe50833417",
        "created_at": "2016-04-12 03:14:52",
        "file": "http://127.0.0.1:8020/media/images/2016/04/12/3d4601961f894c2883e83241dec83223.png",
        "width": 562,
        "height": 248,
        "format": "png"
    },
    "address": null,
    "unique_name": "测试API接口创建海报",
    "url": "http://www.mytest.com",
    "logo_title": "测试API接口创建海报的标题",
    "short_description": "测试API接口创建海报动之引才计划",
    "phone": "87998799",
    "mobile": "13822138222",
    "email": "lyh@yunye123.com",
    "lifetime_type": "weekly",
    "lifetime_timezone": "America/Los_Angeles",
    "lifetime_value": "",
    "created_at": "2016-04-27 09:26:03",
    "status": "Draft",
    "width": 800,
    "height": 1024,
    "tags": "test tag",
    "creator": 5,
    "music": null,
    "category_keyword": 3               //关键词ID
}
```
