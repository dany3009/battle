# -*- coding: utf-8 -*-
from tornadio2 import SocketConnection, event


class Connection(SocketConnection):

    @event('get_user')
    def get_user(self, username):
        self.username = username

    def on_open(self, info):
        print 'Client connected'

    def on_message(self, msg):
        print '{} from: {}'.format(msg, self.username)
        self.send(msg)

    def on_close(self):
        print 'Client disconnected'
