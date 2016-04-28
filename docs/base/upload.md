# 上传文件接口


## Ajax上传文件

    POST /api/v1/poster/upload/{:page_key}
    
**注意：** URL中的 {:page_key} 参数表示所在上传页面的关键字，用于后端区分上传路径。

目前支持的{:page_key}有：

* logo
* avatar


支持上传的文件格式如下，请前端人员添加格式检查：

* 图片：jpg, jpeg, png
* 视频：mp4, ogv, webm
* 音频：mp3


**Request**

* 上传文件的文件域名称为 "file"


**Response**

上传成功，状态码返回200

```json
{
	"id": 27,                                   //文件ID
	"format": "jpg",                            //文件格式                     
	"file": "/media/images/2016/04/28/e88a8573601740039f42b24d40f3350c.jpg", //文件路径 
	"uuid": "c4cc94b4a98c401489aa047d7657dffa", 
	"created_at": "2016-04-28 07:44:05", 
	"width": 108,                       //图片或视频才会有宽高属性     
	"height": 108
}
```

上传失败，状态码返回400

```json
{
    "detail": "上传失败的具体原因,比如格式不正确等"
}
```

