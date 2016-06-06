# 海报接口说明


## 检查海报名称是否已经存在

    GET /api/v1/poster/check/unique/?name=XXXXX
    
    
**Response**
```json
{
    "exists": false             //true or false,  true表示存在， false表示不存在
}
```


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


## 单个海报详情

    GET /api/v1/poster/posters/{:id}

**Response**

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

# 编辑海报接口说明


## 创建海报与模板的关联

    POST /api/v1/poster/posterpages
    
**Request**
```json
{
    "poster_id": 12,
    "template_id: 33
}
```

**Response**

提交成功后，返回完整的 海报模板对象 信息

```json
{
    "id": 1,
    "poster": {
        "id": 12,
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
            "id": 1,
            "uuid": "a14f859435c34577acd1abaa609698a0",
            "created_at": "2015-09-23 21:56:48",
            "file": "http://127.0.0.1:8020/media/images/2015/09/23/92180490f431414e9b160002d91f15db.png",
            "width": 594,
            "height": 128,
            "format": "png"
        },
        "address": {
            "id": 2,
            "address1": "2181 E Foothill Blvd",
            "address2": "",
            "city": "Pasadena",
            "state": "CA",
            "country": "USA",
            "post_code": "91007",
            "created_at": "2015-09-23 21:58:43",
            "updated_at": "2015-09-23 21:58:43"
        },
        "category_keyword": null,
        "unique_name": "alatting",
        "url": "www.alatting.com",
        "logo_title": "阿拉鼎高科国际股份有限公司",
        "short_description": "阿拉鼎总部位于美国洛杉矶,专注智能海报营销",
        "phone": "3234444444",
        "mobile": "2134006368",
        "email": "info@alatting.com",
        "lifetime_type": "specific_days",
        "lifetime_timezone": "America/Los_Angeles",
        "lifetime_value": "{\"2015-11-23\": {\"time_start\": \"08:00 am\", \"enabled\": 1,\"time_end\": \"09:00 pm\", \"message\": \"Funding opening day and project demonstration\"}}",
        "created_at": "2015-09-23 22:01:33",
        "status": "Published",
        "width": 800,
        "height": 1024,
        "tags": "",
        "creator": 4,
        "music": 1
    },
    "template": {
        "id": 33,
        "name": "alatting",
        "image_url": ""
    },
    "index": 0,
    "name": "COMPANY"
}
```

## 保存海报



## 发布海报



## 删除海报

    DELETE /api/v1/poster/posters/{:id}
    
注意：此操作将删除海报关联的所有页面、统计数据等，目前是硬删除，无法恢复

**Response**

成功则返回 204 状态码, 删除他人创建的海报时报403错误



## 单个海报统计数据信息

    GET /api/v1/poster/{:id}/statistics
    
**Response**
```json
{
    "poster_statistics": {                  //实时统计数据
        "poster_id": 1,
        "ratings_average": "2.8",           //星级评分
        "five_percent": 30,                 
        "four_percent": 65,
        "three_percent": 100,
        "two_percent": 30,
        "one_percent": 65,
        "fun_score": "0.0",                 //趣评
        "popular_score": 125,               //人气
        "credit_score": "0.4",              //信用
        "overall_score": "42",               //当前分数  
        "medal_next_score": 1000,               //下个等级分
        "created_at": "2015-11-21 03:15:48",
        "updated_at": null,
        "ratings_count": 4,                 //打分数量
        "ratings_total": 11,                
        "five_count": 0,
        "four_count": 1,
        "three_count": 2,
        "two_count": 0,
        "one_count": 1,
        "scans_count": 0,               //扫码数
        "views_count": 741,             //查看数
        "likes_count": 1,               //喜欢
        "favorites_count": 0,           //收藏
        "fun_count": 1,                 //fun
        "complains_count": 0,
        "fun_survey_score": 0,
        "fun_review_score": 0,
        "phone_contacted_count": 0,
        "email_contacted_count": 0,
        "map_contacted_count": 0,
        "facebook_shared_count": 3,
        "pinterest_shared_count": 0,
        "twitter_shared_count": 0,
        "linkedin_shared_count": 0,
        "google_shared_count": 0,
        "email_shared_count": 3,
        "wechat_shared_count": 0,
        "qq_shared_count": 0,
        "qzone_shared_count": 0,
        "weibo_shared_count": 0
    },
    "history_statistics": {             //历史统计数据
        "favortes_count_change": 0,
        "views_count_change": 741,
        "likes_count_change": 1,
        "shares_count_change": 6,
        "fun_count_change": 1,
        "ratings_average_change": "2.8",
        "score_total_change": "42",
        "fun_change_percent": 100,
        "popular_change_percent": 100,
        "credit_change_percent": 100,
        "score_change_percent": 100
    }
}
```