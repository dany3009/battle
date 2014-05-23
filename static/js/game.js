
var BATTLE_FIELD = [];
var socket, sock;

$(document).ready(function() {

    $.cookie('battle_field', BATTLE_FIELD.toString(), { expires: 365, path: '/' });
    if ($.cookie('battle_field')){
        build_from_cookie($.cookie('battle_field'));
    } else {
        random_ships();
    }

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
            $('#placed_error').show().fadeOut(2000);
        }
    });

    $('#random').click(function(){
        random_ships();
    });

    $('#ready').click(function(){
        connect();
    });

    $('.ship').draggable({
        cursor: "all-scroll",
        revertDuration: 100,
        snap: '.battle_cell',
        snapMode: "both",
        snapTolerance: 15,
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
    $('.enemy_cell').click(function(){
        make_shoot(this);
    });

});

function init(){
    $('.ship').attr({'data-x': 10, 'data-y': 10}).css({'top': 0, 'left': 0});
    $('.cell').attr('data-value', 0);
    for (i=0; i<10; i++){
        BATTLE_FIELD[i] = [];
        for (j=0; j<10; j++){
            BATTLE_FIELD[i][j] = 0;
        }
    }
}

function open_construcror(){
    init();
    $('.enemy_field').hide();
    $('.your_field').attr('class', 'your_field span12');
    $('.ships_pool').show();
}

function close_construcror(){
    $('.ships_pool').hide();
    $('.your_field').attr('class', 'your_field span6');
    $('.enemy_field').show()
}

function build_from_cookie(field){
    var index = 0, BATTLE_FIELD = [], cookie_fild = field.split(',');

    for (i=0; i<10; i++){
        BATTLE_FIELD[i] = [];
        for (j=0; j<10; j++){
            BATTLE_FIELD[i][j] = cookie_fild[index];
            $("div.cell[data-x='"+j+"'][data-y='"+i+"']").attr('data-value', parseInt(cookie_fild[index]));
            index += 1;
        }
    }
}

function random_ships(){
    var x, y, x_coord, y_coord, length, position, position_array = ['h', 'v'], success;
    init();
    $('#constructor_close').hide();
    $('#constructor').show();
    close_construcror();
    for (a=4; a>0; a--){
        for (b=0; b<5-a; b++){
            do {
                success = false;
                x = getRandomInt(0, 10 - a);
                y = getRandomInt(0, 10 - a);
                length = a;
                position = position_array[Math.floor(Math.random() * position_array.length)];
                if ((check_place(x, y, length, position))){
                    success = true;
                    if (position == 'h'){
                        for (k=0; k<length; k++){
                            x_coord = k + x;
                            $("div.cell[data-x='"+x_coord+"'][data-y='"+y+"']").attr('data-value', 1);
                        }
                    } else {
                        for (k=0; k<length; k++){
                            y_coord = k + y;
                            $("div.cell[data-x='"+x+"'][data-y='"+y_coord+"']").attr('data-value', 1);
                        }
                    }
                }
            } while (!success);
        }
    }
    update_matrix();
}

function getRandomInt(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function make_drop(ship, cell_x, cell_y, length, position){
    var x_coord = 0, y_coord = 0;

    if ((position == 'h') && (cell_x >= 0 && cell_x <= 10 - length)){
        for (i=0; i<length; i++){
            x_coord = i + cell_x;
            $("div.cell[data-x='"+x_coord+"'][data-y='"+cell_y+"']").attr('data-value', 1);
        }
        $(ship).attr('data-x', cell_x).attr('data-y', cell_y);

    } else if ((position == 'v') && (cell_y >= 0 && cell_y <= 10 - length)){
        for (i=0; i<length; i++){
            y_coord = i + cell_y;
            $("div.cell[data-x='"+cell_x+"'][data-y='"+y_coord+"']").attr('data-value', 1);
        }
        $(ship).attr('data-x', cell_x).attr('data-y', cell_y);

    }
    update_matrix();
}

function clear_old_place(ship_x, ship_y, length, position){
    var old_x = 0, old_y = 0;
    if (position == "h"){
        for (i=0; i<length; i++){
            old_x = i + ship_x;
            $("div.cell[data-x='"+old_x+"'][data-y='"+ship_y+"']").attr('data-value', 0);
        }
    } else {
        for (i=0; i<length; i++){
            old_y = i + ship_y;
            $("div.cell[data-x='"+ship_x+"'][data-y='"+old_y+"']").attr('data-value', 0);
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
        if ((x == 10) && (y == 10)){
            placed = false
        }
    }
    return placed;
}

function update_matrix(){
    for (i=0; i<10; i++){
        for (j=0; j<10; j++){
            BATTLE_FIELD[i][j] = $("div.cell[data-x='"+j+"'][data-y='"+i+"']").attr('data-value');
        }
    }
    $.cookie('battle_field', BATTLE_FIELD.toString());
}

function connect(){
    socket = io.connect('http://192.168.1.6:8001');

    socket.on('connect', function(){
        $('#connect').show().fadeOut(2000);
        socket.emit('get_user', $('.auth a:first-child').text());
//        socket.join('room');
    });

    socket.on('disconnect', function() {
        $('#disconnect').show().fadeOut(2000);
        setTimeout(socket.socket.reconnect, 3000);
    });

    socket.on('message', function(msg) {
        console.log(msg);
    });


//   sock = new SockJS('http://192.168.1.6:8001/ships');
//
//   sock.onopen = function() {
//       $('#connect').show().fadeOut(2000);
//       sock.send(JSON.stringify({
//           'username': $('.auth a:first-child').text()
//       }));
//   };
//
//   sock.onmessage = function(msg) {
//       console.log('message', msg.data);
//   };
//
//   sock.onclose = function() {
//       $('#disconnect').show().fadeOut(2000);
//       setTimeout(sock.reconnect, 3000);
//   };

//    socket = new io.Socket();
//    socket.connect();

}

function make_shoot(cell){
    socket.json.send({x: $(cell).attr('data-x'), y: $(cell).attr('data-y')});

//    sock.send(JSON.stringify({
//       'x': $(cell).attr('data-x'),
//       'y': $(cell).attr('data-y')
//    }));
}