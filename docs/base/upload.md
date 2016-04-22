# 上传文件

暂未实现.....


## 表单上传

    POST /api/v1/utils/upload

**Request**

通过 **表单** 的方式进行上传，input 名称为 `file`:

```
<form enctype="multipart/form-data" method="post">
  <input type="file" name="file">
</form>
```


**Response**
```json
{
    "url": "/media/images/2016/04/22/dfefadafefefefeadfd.jpg",
    "filename": "dfefadafefefefeadfd.jpg"
}
```
