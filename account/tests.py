import json
from django.utils.encoding import smart_text
from rest_framework import status
from rest_framework.test import APITestCase
from django.test.client import Client
__author__ = 'charlie'


class AccountViewsTests(APITestCase):

    def setUp(self):
        self.username = '13652430859'
        self.password = '123456'
        self.message = ''

        self.data = {
            'username': self.username,
            'password': self.password
        }
        self.client = Client()

    def test_login(self):
        """正常的发验证码、注册、登陆流程（注意这个数据库是测试的，
           测试期间生成的数据最后会删掉）"""
        data = {'username': self.username}

        # 发送验证码
        response = self.client.post(
            '/api/v1/account/send_message',
            json.dumps(data),
            content_type='application/json'
        )
        response_content = json.loads(smart_text(response.content))
        self.message = response_content['message']
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # 注册帐号
        data = {'username': self.username, 'password2': self.password,
                'password1': self.password, 'message': self.message}
        response = self.client.post(
            '/api/v1/account/register',
            json.dumps(data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # 登陆帐号
        response = self.client.post(
            '/api/v1/account/login',
            json.dumps(self.data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)