from django import forms


class RegisterForm(forms.Form):
    username = forms.CharField(label='用户名')
    message = forms.CharField(label='验证码')
    password1 = forms.CharField(label='密码', widget=forms.PasswordInput)
    password2 = forms.CharField(label='密码确认', widget=forms.PasswordInput)

    def pwd_validate(self, p1, p2):
        return p1 == p2
