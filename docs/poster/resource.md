# 海报基础资源接口说明

## 获取分类数据

**注意：目前只支持到二级分类**


    GET /api/v1/poster/categorys

**Request过滤**

GET请求带以下参数可以进行数据过滤 (XX表示一级分类的ID)

* 全部数据: ?parent=-1
* 取一级分类: ?parent=0
* 取某个一级分类下的二级分类: ?parent=XXX


**Response**
```json
[
    {
        "id": 1,
        "type": "Activity",                             //类型，前端目前不需要取此值
        "name": "Activity Invitation",                  //分类名称
        "description": "Activity / Party Invitation",   //分类描述
        "tags": "",                                     //分类标签
        "parent": null                                  //父类ID
    },
    {
        "id": 2,
        "type": "Business",
        "name": "Business Marketing",
        "description": "Business Marketing",
        "tags": "",
        "parent": null
    },
    {
        "id": 5,
        "type": "Activity",
        "name": "Marriage Invitation",
        "description": "Marriage Invitation",
        "tags": "",
        "parent": 1
    },
    {
        "id": 6,
        "type": "Activity",
        "name": "Dating Invitation",
        "description": "Dating Invitation",
        "tags": "",
        "parent": 1
    },
    {
        "id": 7,
        "type": "Business",
        "name": "Education Marketing",
        "description": "Education Marketing",
        "tags": "",
        "parent": 2
    }
]
```


## 海报缩略图列表

首页显示海报缩略图列表，点击图片后，可以进入海报主页


    GET /api/v1/poster/posters/simple
    
**Request过滤**

GET请求带以下参数可以进行数据过滤, 

数据排序：

* 热门数据倒序: ?sort=hot
* 最新数据倒序: ?sort=new

按数据类别过滤 (XX代表类别ID，等于-1时取全部类别)：

* 过滤一级类别数据: ?main_category=XX   
* 过滤二级类别数据: ?sub_category=XX 


也可以两种方式同时使用: ?sort=hot&main_category=XX&sub_category=XX


**Response**
```json
[
    {
        "id": 123,          //海报主键
        "thumb": "/media/2016/04/03/abcdefj.jpg",        //海报主页小图片
        "home_page": "http://www.yunye123.com/poster/123",   //海报主页网址
        "views_count": "345",                           //海报浏览统计
        "created_at": "2016-04-22 15:00:00"             //海报创建时间
    },
    ...
]
```


## 获取二级分类下的关键词列表

    GET /api/v1/poster/category/{:id}/keywords　　　　// {:id} 表示二级分类ID
    
**Response**
```json
[
    {
        "id": 34,                           //关键词ID
        "category": {                               //二级分类主体信息
            "id": 7,
            "type": "Business",
            "name": "Education Marketing",
            "description": "Education Marketing",
            "tags": "",
            "parent": 2
        },          
        "verb": "招募",                            //动词
        "noun": "创业精英",                          //名词
        "created_at": "2016-04-26 03:49:10",        //创建时间
        "updated_at": "2016-04-26 03:51:14"         //更新时间
    },
    ...
]
```


## 保存自定义关键词

    POST /api/v1/poster/category/{:id}/keywords　　　　// {:id} 表示二级分类ID
    
**Request**
```json
{
    "verb": "测试",             //动词
    "noun": "创业合伙人"        //名词
}
```

**Response**

返回状态码400时，说明新增失败

返回状态码201时，说明新增成功，并返回如下格式的数据：
```json
{
    "id": 5,                        //关键词ID
    "category":{                        //二级分类主体信息
        "id": 14,
        "type": "Business",
        "name": "Enterprise Marketing",
        "description": "Enterprise Marketing",
        "tags": "",
        "parent": 2
    },
    "verb": "测试",                       //动词
    "noun": "创业合伙人",                    //名词
    "created_at": "2016-04-26 07:11:17",
    "updated_at": "2016-04-26 07:11:17"
}
```

返回 200 时，说明数据已经存在，将返回如下格式的数据
```json
{   
    "id": 12,           已经存在关键词ID
    "exists": true,     已经存在标识
    "keyword":{             //详细信息
        "id": 12,
        "category":{"id": 6, …},
        "verb": "ee",
        "noun": "dd",
        "created_at": "2016-05-05 06:18:26",
        "updated_at": "2016-05-05 06:18:26"
    }
}
```

## 删除自定义关键词
    
    DELETE /api/v1/poster/keywords/{:id}/
    

**Response**

返回状态码204时，说明操作成功

## 获取模板信息

    POST /api/v1/poster/templates　　　　// 获取模板信息列表

**Request**

**Response**

返回状态码400时，说明获取失败

返回状态码200时，说明获取成功，并返回如下格式的数据：

```json
[
  {
    "id": 1,
    "name": "first",
    "image_url": "/media/images/2015/09/23/c1ef0a0998b24b42bfbead5151e1148b.PNG"
  },
  {
    "id": 2,
    "name": "yunye",
    "image_url": "/media/images/2015/09/23/4c795e20ec2f489d862a79a5a428826b.PNG"
  }
]
```


## 常见问题列表

    GET /api/v1/poster/qa　　　

**Response**

返回状态码400时，说明获取失败

返回状态码200时，说明获取成功，并返回如下格式的数据：

```json
[
    {
        "id": 1,
        "data_status": 1,
        "created_at": "2016-06-16 11:38:08",
        "updated_at": "2016-06-16 11:38:08",
        "question": "问题",
        "answer": "答案"
    },
    ...
]
```