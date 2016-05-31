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
        max_length=100,
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
    password1 = forms.CharField(
        label=u'密码',
        max_length=15,
        widget=forms.PasswordInput(
            attrs={'placeholder': u'请输入密码', 'class': 'list-input'}
        )
    )
    password2 = forms.CharField(
        label=u'密码确认',
        max_length=15,
        widget=forms.PasswordInput(
            attrs={'placeholder': u'请再次输入密码', 'class': 'list-input'}
        )
    )
    user_type = forms.CharField(
        max_length=10,
        widget=forms.HiddenInput
    )
    main_category_id = forms.CharField(
        max_length=10,
        widget=forms.HiddenInput
    )
    sub_category_ids = forms.CharField(
        max_length=10,
        widget=forms.HiddenInput,
        required=False
    )
    input_category = forms.CharField(
        max_length=10,
        widget=forms.HiddenInput,
        required=False
    )


class ResetPasswordForm(forms.Form):
    username = forms.CharField(label='用户名')
    password1 = forms.CharField(label='密码', widget=forms.PasswordInput)
    password2 = forms.CharField(label='密码确认', widget=forms.PasswordInput)


class LoginForm(forms.Form):
    username = forms.CharField(label='用户名')
    password = forms.CharField(label='密码', widget=forms.PasswordInput)

