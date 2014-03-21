from django.conf.urls import patterns, url
from accounts.views import profile

urlpatterns = patterns('',

    url( r'^login/$', 'django.contrib.auth.views.login',
         {"template_name": "accounts/login.html"}, name='login'),
    url( r'^logout/$', 'django.contrib.auth.views.logout',
         {'next_page': '/'}, name='logout'),
    url( r'^register/$', 'accounts.views.register', name='register'),
    url(r'^profile/(?P<username>\w+)', profile, name='profile'),

)