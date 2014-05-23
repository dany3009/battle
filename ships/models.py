from django.contrib.auth.models import User
from django.db import models


class Game(models.Model):

    user1 = models.ForeignKey(User, related_name='g1')
    user2 = models.ForeignKey(User, related_name='g2', null=True, blank=True)
    start = models.DateTimeField(auto_now_add=True)
    end = models.DateTimeField(null=True, blank=True)
    game_id = models.CharField(max_length=255, null=True, blank=True)
    room_id = models.CharField(max_length=255, null=True, blank=True)

    def __unicode__(self):

        if not self.user2:
            user2_name = 'NoneUser'
        else:
            user2_name = self.user2.username

        return '{} vs {}'.format(self.user1.username, user2_name)


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
