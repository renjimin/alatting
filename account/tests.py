import json
from django.utils.encoding import smart_text
from rest_framework import status
from django.test.client import Client
from django.test import TestCase
__author__ = 'charlie'


class AccountViewsTests(TestCase):

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
            '/account/send_message',
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
            '/account/register',
            json.dumps(data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # 登陆帐号
        response = self.client.post(
            '/account/login/',
            json.dumps(self.data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # 重置密码
        password1 = password2 = '654321'
        data = {'username': self.username, 'password1': password1, 'password2': password2}
        response = self.client.post(
            '/account/reset_password',
            json.dumps(data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = {'username': self.username, 'password': password1}
        response = self.client.post(
            '/account/login/',
            json.dumps(data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)