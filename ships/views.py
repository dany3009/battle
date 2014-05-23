import random
import string
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.views.generic import View
from ships.models import Game


def generate_game_id(length):
   return ''.join(random.choice(string.digits) for i in range(length))

class BattleView(View):

    def get(self, request, *args, **kwargs):
        game_id = generate_game_id(10)
        data = {
            'range': range(10),
            'pool_range': range(4, 0, -1),
            'game_id': game_id,
        }
        current_game_id = kwargs.get('game_id')
        if current_game_id:
            data.update({'current_game_id': current_game_id})
            game_with_friend, created = Game.objects.get_or_create(user1=request.user, game_id=current_game_id)
            # game_with_friend.save()


        return render_to_response('ships/battle.html', {'data': data},
                                  RequestContext(request))
