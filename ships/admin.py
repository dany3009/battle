from django.contrib import admin
from ships.models import BattleLog, Game


admin.site.register([BattleLog, Game])
