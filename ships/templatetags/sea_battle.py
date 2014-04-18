from django import template

register = template.Library()


def _get_id():
    for i in range(10):
        yield i

id_generator = _get_id()

@register.simple_tag
def draw_ship_line(deck_count):
    line_html = ''
    global id_generator
    for ship in range(5 - deck_count):
        try:
            ship_id = id_generator.next()
        except StopIteration as e:
            id_generator = _get_id()
            ship_id = id_generator.next()
        line_html += '<div class="ship_container ship_%(count)s">' \
                     '<div class="ship deck%(count)s" id="ship_%(id)s" ' \
                     'data-length="%(count)s" data-x="10" data-y="10" ' \
                                          'data-position="h"></div>' \
                                  '</div>'%{'count': deck_count, 'id': ship_id}
    return line_html