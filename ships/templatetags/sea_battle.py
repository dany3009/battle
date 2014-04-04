from django import template

register = template.Library()


def _get_id():
    for i in range(10):
        yield i

id_generator = _get_id()

@register.simple_tag
def draw_ship_line(deck_count):
    line_html = ''
    ship_id = 0
    for ship in range(5 - deck_count):
        try:
            ship_id = id_generator.next()
        except StopIteration as e:
            print e.message
        line_html += '<div class="ship_container ship_{0}">' \
                     '<div class="ship deck{0}" id="ship_{1}" ' \
                     'data-length="{0}" data-x="10" data-y="10" ' \
                                          'data-position="h"></div>' \
                                  '</div>\n\t\t'.format(deck_count, ship_id)
    return line_html