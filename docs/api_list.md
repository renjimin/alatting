# 所有可用API


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

返回状态码400时，说明保存失败

返回状态码201时，说明保存成功，并返回如下格式的数据：

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