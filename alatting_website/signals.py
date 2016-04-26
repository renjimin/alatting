from django.db.models.signals import post_save
from django.dispatch import receiver
from alatting_website.models import Poster, PosterSubscribe
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.conf import settings
######################### EMAIL settings in settings.py ###################################
##邮件配置
#EMAIL_HOST = 'smtp.gmail.com'                   #SMTP地址
#EMAIL_PORT = 25                                 #SMTP端口
#EMAIL_HOST_USER = ''       #我自己的邮箱
#EMAIL_HOST_PASSWORD = ''                  #我的邮箱密码
#EMAIL_SUBJECT_PREFIX = u'[alatting]'            #为邮件Subject-line前缀,默认是'[django]'
#EMAIL_USE_TLS = True                             #与SMTP服务器通信时，是否启动TLS链接(安全链接)。默认是false
##管理员站点
#SERVER_EMAIL = ''            #The email address that error messages come from, such as those sent to ADMINS and MANAGERS.
############################################################################################


@receiver(post_save, sender=Poster)
def poster_save_publish(sender, instance, **kwargs):
	if instance.status == 'Published':
		posterSubscriptions = PosterSubscribe.objects.filter(poster_id=instance.id)
		for subscription in posterSubscriptions:
			follower = User.objects.get(id=subscription.follower_id)
			follower_email = follower.email
			send_mail('poster update7', 'poster/'+str(instance.id)+' is updated', settings.EMAIL_HOST_USER,
		    [follower_email], fail_silently=False)
	
