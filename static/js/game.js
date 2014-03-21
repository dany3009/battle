
$(document).ready(function() {

    draw_grid('.battle_grid');
    generate_pool();
    $('#constructor').click(function(){
        open_construcror();
    });

    $('.ship').draggable({cursor: "all-scroll", revert: "invalid", revertDuration: 100, snap: ".cell", snapMode: "both", snapTolerance: 15, stop: function(event, ui) {
        console.log('elment dropped at ' + ui.position.left + ':' + ui.position.top);

    }});

    $('.battle_field').droppable({tolerance: "intersect"});
});

function draw_grid(grid_class){
    var table = '<table class="battle_field" cellpadding="0">\n'

    for (i=0; i<10; i++){
        table += '<tr>\n'
        for (j=0; j<10; j++){
            table += '<td><div class="cell" data-x="'+j+'" data-y="'+i+'">&nbsp;</div></td>\n'
        }
        table += '</tr>\n'
    }
    table += '</table>\n'
    $(grid_class).append(table);
}

function open_construcror(){
    $('.enemy_field').hide();
    $('.your_field').attr('class', 'your_field span12');
    generate_pool();
//    $('.ship').draggable({cursor: "all-scroll", revert: true, revertDuration: 100, snap: ".cell"});
//    $('.battle_field').droppable({tolerance: "intersect"});
}

function generate_pool(){
    var pool_html = ''
    for (i=4; i>0; i--){
        pool_html += '<div class="span12 pool_line">\n'
        for (j=0; j<5-i; j++){
            pool_html += '<div class="ship deck'+i+'"></div>\n'
        }
        pool_html += '</div>\n'
    }
    $('.ships_pool').append(pool_html);
}