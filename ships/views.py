from django import http
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.views.generic import View


class BattleView(View):

    def get(self, request, *args, **kwargs):
        data = {
            'range': range(10),
            'pool_range': range(4, 0, -1),
        }
        return render_to_response('ships/battle.html', {'data': data},
                                  RequestContext(request))