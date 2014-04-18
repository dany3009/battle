from django.contrib.auth.models import User
from django.db import models


class Game(models.Model):

    user1 = models.ForeignKey(User, related_name='g1')
    user2 = models.ForeignKey(User, related_name='g2', null=True, blank=True)
    start = models.DateTimeField(auto_now_add=True)
    end = models.DateTimeField(null=True, blank=True)
    game_id = models.CharField(max_length=255, null=True, blank=True)

    def __unicode__(self):
        try:
            user1 = self.user1.username
        except:
            user1 = 'NoneUser'

        try:
            user2 = self.user2.username
        except:
            user2 = 'NoneUser'

        return '{} vs {}'.format(user1, user2)


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
