
$(document).ready(function() {

//    generate_pool();

    $('#constructor').click(function(){
        $(this).hide();
        $('#constructor_close').show();
        open_construcror();
    });

    $('#constructor_close').click(function(){
        if (is_ships_placed()){
            $(this).hide();
            $('#constructor').show();
            close_construcror();
        } else {
            $('#notifications').html('<span class="text-error">Not all ships placed!</span>');
            $('.text-error').fadeOut(2000);
        }
    });

    $('#random').click(function(){
        random_ships();
    });

    $('.ship').draggable({
        cursor: "all-scroll",
        revertDuration: 100,
        snap: '.battle_cell',
        snapMode: "both",
        snapTolerance: 15,
//        containment: ".battle_field",
        cursorAt: {left: 15, top: 15},
        start: function(event, ui){
            var x = parseInt($(this).attr('data-x')),
                y = parseInt($(this).attr('data-y')),
                length = parseInt($(this).attr('data-length')),
                position = $(this).attr('data-position');

            $(this).draggable({
                revert: "invalid"
            });
            if (x <= 9 && y <= 9){
                clear_old_place(x, y, length, position);
            }
        },
        stop: function(event, ui){
            var x = parseInt($(this).attr('data-x')),
                y = parseInt($(this).attr('data-y')),
                length = parseInt($(this).attr('data-length')),
                position = $(this).attr('data-position');
            if (check_place(x, y, length, position)){
                make_drop(this, x, y, length, position);
            }
        }
    }).click(function(){
        var x = parseInt($(this).attr('data-x')),
            y = parseInt($(this).attr('data-y')),
            length = parseInt($(this).attr('data-length')),
            position = $(this).attr('data-position');

        if (x <= 10 - length && y <= 10 - length){
            if (position == 'h'){
                clear_old_place(x, y, length, position);
                if (check_place(x, y, length, 'v')){
                    $(this).attr('data-position', 'v');
                    make_drop(this, x, y, length, 'v');
                } else {
                    make_drop(this, x, y, length, 'h');
                }
            } else {
                clear_old_place(x, y, length, position);
                if (check_place(x, y, length, 'h')){
                    $(this).attr('data-position', 'h');
                    make_drop(this, x, y, length, 'h');
                } else {
                    make_drop(this, x, y, length, 'v');
                }
            }
        }
    });

    $('.cell').droppable({
        tolerance: "pointer",
        drop: function(event, ui){
            var ship = ui.draggable[0],
                x = parseInt($(this).attr('data-x')),
                y = parseInt($(this).attr('data-y')),
                length = parseInt($(ship).attr('data-length')),
                position = $(ship).attr('data-position');

            if (((position == 'h' && x <= 10 - length) || (position == 'v' && y <= 10 - length)) && (check_place(x, y, length, position))){
                make_drop(ship, x, y, length, position);
            } else {
                $(ship).draggable({revert: "valid"});
            }
        }
    });

});

function open_construcror(){
    $('.enemy_field').hide();
    $('.your_field').attr('class', 'your_field span12');
    $('.ships_pool').show();
}

function close_construcror(){
    $('.ships_pool').hide();
    $('.your_field').attr('class', 'your_field span6');
    $('.enemy_field').show()
}

//TODO REWRITE TO TEMPLATE
function generate_pool(){
    var pool_html = ''
    for (i=4; i>0; i--){
        pool_html += '<div class="span12 pool_line">\n'
        for (j=0; j<5-i; j++){
            pool_html += '<div class="ship_container ship_'+i+'"><div class="ship deck'+i+'" data-length="'+i+'" data-x="10" data-y="10" data-position="h"></div></div>\n'
        }
        pool_html += '</div>\n'
    }
    $('.ships_pool').append(pool_html);
}

function random_ships(){

}

function make_drop(ship, cell_x, cell_y, length, position){
    var x_coord = 0, y_coord = 0;

    if ((position == 'h') && (cell_x >= 0 && cell_x <= 10 - length)){
        for (i=0; i<length; i++){
            x_coord = i + cell_x;
            $("div.cell[data-x='"+x_coord+"'][data-y='"+cell_y+"']").attr('data-value', 1).css('background', '#BAD');
        }
//        disable_cells(cell_x, cell_y, length, position);
        $(ship).attr('data-x', cell_x).attr('data-y', cell_y);

    } else if ((position == 'v') && (cell_y >= 0 && cell_y <= 10 - length)){
        for (i=0; i<length; i++){
            y_coord = i + cell_y;
            $("div.cell[data-x='"+cell_x+"'][data-y='"+y_coord+"']").attr('data-value', 1).css('background', '#BAD');
        }
//        disable_cells(cell_x, cell_y, length, position);
        $(ship).attr('data-x', cell_x).attr('data-y', cell_y);

    }
}

function clear_old_place(ship_x, ship_y, length, position){
    var old_x = 0, old_y = 0;
    var clear_x = 0, clear_y = 0;
    if (position == "h"){
        for (i=0; i<length; i++){
            old_x = i + ship_x;
            $("div.cell[data-x='"+old_x+"'][data-y='"+ship_y+"']").attr('data-value', 0).css('background', '#FFF');
        }
//        for (i=0; i<3; i++){
//            clear_y = i - 1 + ship_y;
//            for (j=0; j<2 + length; j++){
//                clear_x = j - 1 + ship_x;
//                $("div.cell[data-x='"+clear_x+"'][data-y='"+clear_y+"']").droppable("enable").css('background', '#FFF');
//            }
//        }
    } else {
        for (i=0; i<length; i++){
            old_y = i + ship_y;
            $("div.cell[data-x='"+ship_x+"'][data-y='"+old_y+"']").css('background', '#FFF').attr('data-value', 0);
        }
//        for (i=0; i<3; i++){
//            clear_x = i - 1 + ship_x;
//            for (j=0; j<2 + length; j++){
//                clear_y = j - 1 + ship_y;
//                $("div.cell[data-x='"+clear_x+"'][data-y='"+clear_y+"']").droppable("enable").css('background', '#FFF');
//            }
//        }
    }

}

function disable_cells(x, y, length, position){
    var disable_x = 0, disable_y = 0;
    if (position == "h"){
        for (i=0; i<3; i++){
            disable_y = i - 1 + y;
            for (j=0; j<2 + length; j++){
                disable_x = j - 1 + x;
                $("div.cell[data-x='"+disable_x+"'][data-y='"+disable_y+"']").droppable("disable").css('background', '#BBB');
            }
        }
    } else {
        for (i=0; i<3; i++){
            disable_x = i - 1 + x;
            for (j=0; j<2 + length; j++){
                disable_y = j - 1 + y;
                $("div.cell[data-x='"+disable_x+"'][data-y='"+disable_y+"']").droppable("disable").css('background', '#BBB');
            }
        }
    }
}

function check_place(x, y, length, position){
    var check_x = 0, check_y = 0;
    var valid = true;

    if (position == 'h'){
        for (i=0; i<3; i++){
            check_y = i - 1 + y;
            for (j=0; j<2 + length; j++){
                check_x = j - 1 + x;
                if ($("div.cell[data-x='"+check_x+"'][data-y='"+check_y+"']").attr('data-value') == 1){
                    valid = false;
                }
            }
        }
    } else {
        for (i=0; i<3; i++){
            check_x = i - 1 + x;
            for (j=0; j<2 + length; j++){
                check_y = j - 1 + y;
                if ($("div.cell[data-x='"+check_x+"'][data-y='"+check_y+"']").attr('data-value') == 1){
                    valid = false;
                }
            }
        }
    }
    return valid;
}

function is_ships_placed(){
    var ship, x, y, placed = true;

    for (i=0; i<10; i++){
        ship = $('#ship_'+i);
        x = ship.attr('data-x');
        y = ship.attr('data-y');
        console.log(ship, x, y);
        if ((x == 10) && (y == 10)){
            placed = false
        }
    }
//    console.log(placed);
    return placed;
}
