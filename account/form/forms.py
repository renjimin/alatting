from django import forms


def pwd_validate(p1, p2):
    return p1 == p2


OPEN_CELLPHONE = False

if OPEN_CELLPHONE:
    TIPS_TEXT = u'邮箱/手机号'
else:
    TIPS_TEXT = u'邮箱'


class RegisterForm(forms.Form):
    username = forms.CharField(
        label=u'用户名',
        widget=forms.TextInput(
            attrs={'placeholder': TIPS_TEXT, 'class': 'list-input-on'}
        )
    )
    message = forms.CharField(
        label=u'验证码',
        max_length=4,
        widget=forms.TextInput(
            attrs={'placeholder': u'验证码', 'class': 'codeinput'}
        )
    )
    password1 = forms.CharField(label=u'密码', widget=forms.PasswordInput)
    password2 = forms.CharField(label=u'密码确认', widget=forms.PasswordInput)


class ResetPasswordForm(forms.Form):
    username = forms.CharField(label='用户名')
    password1 = forms.CharField(label='密码', widget=forms.PasswordInput)
    password2 = forms.CharField(label='密码确认', widget=forms.PasswordInput)


class LoginForm(forms.Form):
    username = forms.CharField(label='用户名')
    password = forms.CharField(label='密码', widget=forms.PasswordInput)

