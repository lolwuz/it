import 'styles/index.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery'; 


class Board {
    constructor(game_code) {
        this.game_code = game_code; 
        this.mouse_down = false;  // Mouse down
        this.selected = []; // List of all selected position on the board
        this.letters = []; // List with all the letters
        this.guesses = [];

        $('#game-table-body').mousedown(() => {
            this.on_mouse_down();
        });

        $('#game-table-body').mouseup(() => {
            this.on_mouse_up();
        });
    }

    get_board () {
        $.get("http://0.0.0.0:5000/board/" + this.game_code, (data) => {
            let board = [];
            for (let i = 2; i < data.board.length; i = i + 5) {
                board.push(data.board[i]);
            }
    
            let tbody = $('#game-table-body');
            for (let i = 0; i < board.length; i = i + 4) {
                // create an <tr> element, append it to the <tbody> and cache it as a variable:
                let tr = $('<tr/>').appendTo(tbody);
    
                for (let j = 0; j < 4; j++) {
                    // append <td> elements to previously created <tr> element:
                    let td = $('<td/>').appendTo(tr);
                    let text = $('<div/>').appendTo(td);
                    let letter = board[i + j];
                    
                    text.addClass("table-text");
                    text.text(letter);
               
                    this.letters.push(letter);

                    text.hover(() => {
                        td.addClass('hover');
                        this.on_hover(i + j, td);
                    })

                    text.mouseleave(() => {
                        td.removeClass('hover');
                    })
                }
            }
        });
    }

    check_word(word) {
        let guesses = $("#guesses");
        this.guesses.push(word)

        $.get("http://0.0.0.0:5000/board/" + this.game_code + "/check/" + word.toLowerCase(), (data) => {
            let guess = $('<div/>').prependTo(guesses);
            guess.addClass("alert");
            guess.text(data.points + " - " + word);

            if(data.is_valid) {
                guess.addClass("alert-success");
            }
            else {
                guess.addClass("alert-warning");
            }
        })
    }

    clear_board() {
        $('#game-table-body').remove();
    }

    on_hover (board_position, element) {
        if (this.mouse_down) {
            element.addClass('selected');

            if (!this.selected.includes(board_position))
                this.selected.push(board_position);
        }
    }

    on_mouse_down () {
        this.mouse_down = true;
    }

    on_mouse_up () {
        if (this.mouse_down) {
            let word = "" // empty string to put the word in

            for (let i = 0; i < this.selected.length; i++) {
                let index = this.selected[i];
                let letter = this.letters[index];
                
                word += letter;
            }

            $(".selected").removeClass("selected");
            $("#last-word").text(word);
            
            this.check_word(word);

            this.selected = [];
        }

        this.mouse_down = false;
    }
}



const board = new Board("M6V943");
board.get_board();



