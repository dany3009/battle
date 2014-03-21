from django.contrib.auth.models import User
from django.db import models


class Game(models.Model):

    user1 = models.ForeignKey(User, related_name='g1')
    user2 = models.ForeignKey(User, related_name='g2', null=True, blank=True)
    start = models.DateTimeField(auto_now_add=True)
    end = models.DateTimeField(null=True, blank=True)

    def __unicode__(self):
        return '{} vs {}'.format(self.user1.username, self.user2.username)


class BattleLog(models.Model):

    user = models.ForeignKey(User, related_name='battlelog')
    game = models.ForeignKey(Game, related_name='battlelog')
    user_field = models.TextField()
    enemy_field = models.TextField()
    victory = models.BooleanField(default=False)
    shots = models.IntegerField(default=0)
    destroyed_ships = models.IntegerField(default=0)

    def __unicode__(self):
        return 'Log for {}'.format(self.user.username)
