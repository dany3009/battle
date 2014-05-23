# -*- coding: utf-8 -*-
from tornadio2 import SocketConnection, event
from django.contrib.sessions.models import Session
from django.contrib.auth.models import User


class Connection(SocketConnection):

    @event('get_user')
    def get_user(self, username):
        self.username = username

    def on_open(self, info):
        self.get_username(info)
        print 'Client connected'

    def on_message(self, msg):
        self.send(msg)
        print '{} from: {}'.format(msg, self.username)


    def on_close(self):
        print 'Client disconnected'


    def get_username(self, info):
        session_key =  info.get_cookie('sessionid').OutputString().split('=')[1]
        session = Session.objects.get(session_key=session_key)
        # uid = session.get_decoded().get('_auth_user_id')
        # user = User.objects.get(pk=uid)
        # print user
        # print Session.objects.all().values_list('session_key', flat=True)
