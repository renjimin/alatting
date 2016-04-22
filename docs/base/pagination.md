# 分页

GET 请求 url 分页相关参数:

* `page`: 第几页
* `per_page`: 每页多少条目

分页信息包含在 Response Header 的 `Link` 中:

```
<http://www.yunye123.com:8000/api/v1/users?page=1&per_page=2>; rel="first", <http://www.yunye123.com:8000/api/v1/users?per_page=2>; rel="prev", <http://www.yunye123.com:8000/api/v1/users?page=3&per_page=2>; rel="next", <http://www.yunye123.com:8000/api/v1/users?page=231&per_page=2>; rel="last"
```

示例:

```
GET /api/v1/users?page=2&per_page=2 HTTP/1.1
Accept: */*
Accept-Encoding: gzip, deflate
Connection: keep-alive
Host: www.yunye123.com:8000
User-Agent: HTTPie/0.8.0


HTTP/1.1 200 OK
Allow: GET, HEAD, OPTIONS
Connection: keep-alive
Content-Encoding: gzip
Content-Type: application/json
Date: Wed, 02 Sep 2015 07:07:03 GMT
Link: <http://www.yunye123.com:8000/api/v1/users?page=1&per_page=2>; rel="first", <http://www.yunye123.com:8000/api/v1/users?per_page=2>; rel="prev", <http://www.yunye123.com:8000/api/v1/users?page=3&per_page=2>; rel="next", <http://www.yunye123.com:8000/api/v1/users?page=231&per_page=2>; rel="last"
Server: nginx
Transfer-Encoding: chunked
Vary: Accept-Encoding
Vary: Cookie
X-Frame-Options: SAMEORIGIN

[
    {
        "id": 3,
        "parent": 1,
        "type": "DISTRICT",
        "value": "西城区"
    },
    {
        "id": 4,
        "parent": 1,
        "type": "DISTRICT",
        "value": "海淀区"
    }
]
```
