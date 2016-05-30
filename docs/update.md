# 线上测试服务器更新/维护

## 系统服务

* apache2: `service apache2 start`
* mysql: `service mysql start`


## 项目相关

* 项目部署目录: /home/alatting 
* 项目依赖python虚拟环境主目录: /home/venv
* apache2 配置文件: /etc/apache2/sites-available/dev-site.conf


## 更新步骤

* cd /home/alatting 
* source ../venv/bin/activate
* git pull origin dev
* pip3 install -r requirements.txt
* make cs
* make mkmigrate 
* make migrate 
* sudo service apache2 restart
