from django.contrib import auth
from django.contrib.auth.models import User
from django.db.models import Sum
from django.http import HttpResponseRedirect
from django.shortcuts import render_to_response, get_object_or_404
from django.template import RequestContext
from accounts.forms import UserCreationForm
from ships.models import BattleLog


def register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            user = auth.authenticate(username=form.cleaned_data['username'],
                                     password=form.cleaned_data['password1'])
            auth.login(request, user)
            return HttpResponseRedirect('/')
    else:
        form = UserCreationForm()
    return render_to_response('accounts/register.html', {'form': form},
                              RequestContext(request))


def profile(request, username):
    user = get_object_or_404(User, username=username)
    logs = BattleLog.objects.filter(user=user)
    games_played = len(logs)
    wins = len(logs.filter(victory=True))
    looses = games_played - wins
    total_shots = logs.aggregate(Sum('shots'))['shots__sum'] or 0
    ships_destroyed = logs.aggregate(Sum('destroyed_ships'))['destroyed_ships__sum'] or 0
    data = {
        'user': user.username,
        'games_played': games_played,
        'wins': wins,
        'looses': looses,
        'total_shots': total_shots,
        'ships_destroyed': ships_destroyed
    }
    return render_to_response('accounts/profile.html', {'data': data},
                              RequestContext(request))