from django.conf.urls import patterns, url
from ships.views import BattleView

urlpatterns = patterns('',

    url( r'^battle/$', BattleView.as_view(), name='battle'),
    url( r'^battle/(?P<game_id>\w+)', BattleView.as_view(), name='game'),

)