/* eslint-disable camelcase */
import 'styles/index.scss'
import { url } from 'constants.js'
import $ from 'jquery'

class Game {
	/**
	 * Setup the board
	 */
	constructor () {
		this.start_button = $('#start-button')
		this.random_button = $('#random-button')
		this.game_card = $('#game-card')
		this.current_board = null

		this.random_button.click(() => this.random_game())
		this.start_button.click(() => this.existing_game())
	}

	random_game () {
		$.ajax({
			url: url + 'board',
			type: 'POST',
			crossDomain: true,

			success: (data) => {
				this.current_board = new Board(data.game_code, 60)
				this.setup_game()
			}
		})
	}

	existing_game () {
		let game_code = $('#code-input').val()

		this.current_board = new Board(game_code)

		this.setup_game()
	}

	setup_game () {
		this.game_card.empty()

		this.game_card.addClass('card card-margin')
		let body = $('<div class="card-body"/>').appendTo(this.game_card)
		let code = $('<h5 id="code"/>').appendTo(body)
		let timer = $('<h6 id="timer"/>').appendTo(body)
		let points = $('<h6 id="points"/>').appendTo(body)

		code.text('Game code: ' + this.current_board.game_code)
		timer.text('Time remaining: ' + this.current_board.time)
		points.text('Total points scored: ' + 0)

		let button = $('<button class="btn btn-outline-primary"/>').appendTo(this.game_card)

		button.text('start timer')

		button.click(() => this.start())
	}

	start () {
		this.current_board.get_board()
	}
}

class Board {
	constructor (game_code, time) {
		/**
		 * @param game_code unique code of the game
		 * @param time time this board can be played
		 */
		this.table_body = $('#game-table-body')
		this.game_code = game_code
		this.mouse_down = false // Mouse down
		this.selected = [] // List of all selected position on the board
		this.letters = [] // List with all the letters
		this.guesses = []
		this.time = time
		this.begin_time = null
		this.intervals = []
		this.points = 0

		this.new_table_body()
	}

	new_table_body () {
		/** Remove the table body if old game is still loaded */
		this.table_body.empty()

		this.table_body.mousedown(() => {
			this.on_mouse_down()
		})

		this.table_body.mouseup(() => {
			this.on_mouse_up()
		})
	}

	get_board () {
		this.new_table_body()

		$.ajax({
			url: url + 'board/' + this.game_code,
			crossDomain: true,

			success: (data) => {
				let board = []
				for (let i = 2; i < data.board.length; i = i + 5) {
					board.push(data.board[i])
				}

				let tbody = this.table_body
				for (let i = 0; i < board.length; i = i + 4) {
					// create an <tr> element, append it to the <tbody> and cache it as a variable:
					let tr = $('<tr/>').appendTo(tbody)

					for (let j = 0; j < 4; j++) {
						// append <td> elements to previously created <tr> element:
						let td = $('<td/>').appendTo(tr)
						let text = $('<div/>').appendTo(td)
						let letter = board[i + j]

						text.addClass('table-text')
						text.text(letter)

						this.letters.push(letter)

						text.hover(() => {
							td.addClass('hover')
							this.on_hover(i + j, td)
						})

						text.mouseleave(() => {
							td.removeClass('hover')
						})
					}

					this.begin_time = new Date()
					let time_interval = setInterval(() => this.update_time(), 1000)
					this.intervals.push(time_interval)
				}
			}
		})
	}

	check_word (word) {
		let guesses = $('#guesses')

		$.ajax({
			url: url + 'board/' + this.game_code + '/check/' + word.toLowerCase(),
			crossDomain: true,

			success: (data) => {
				let guess = $('<div/>').prependTo(guesses)
				guess.addClass('alert')
				guess.text(data.points + ' - ' + word)

				// Check if valid word.
				if (data.is_valid) {
					// Update points
					if (!this.guesses.includes(word)) { // Only when not already guessed.
						// Valid word and not guessed. Adding points to score.
						this.points += data.points
						$('#points').text('Total points scored: ' + this.points)

						// Add alert success
						guess.addClass('alert-success')

						this.guesses.push(word)
					} else {
						// Word is valid but already guessed.
						guess.addClass('alert-info')
					}
				} else {
					// Invalid word error.
					guess.addClass('alert-danger')
				}
			}
		})
	}

	is_inbound (board_position) {
		if (this.selected.length < 1) { return true }

		let last_position = this.selected[this.selected.length - 1]

		if (Math.abs(board_position - last_position) < 6) { return true } else { return false }
	}

	on_hover (board_position, element) {
		if (this.mouse_down) {
			if (this.is_inbound(board_position)) {
				element.addClass('selected')

				if (!this.selected.includes(board_position)) { this.selected.push(board_position) }
			}
		}
	}

	on_mouse_down () {
		this.mouse_down = true
	}

	on_mouse_up () {
		if (this.mouse_down) {
			let word = '' // empty string to put the word in

			for (let i = 0; i < this.selected.length; i++) {
				let index = this.selected[i]
				let letter = this.letters[index]

				word += letter
			}

			$('.selected').removeClass('selected')
			$('#last-word').text(word)

			this.check_word(word)

			this.selected = []
		}

		this.mouse_down = false
	}

	update_time () {
		let current_time = new Date()
		let time_diff = current_time - this.begin_time // in ms
		// strip the ms
		time_diff /= 1000

		if (this.time - time_diff < 10) {
			$('#timer').text(Math.round(this.time - time_diff) + ' second remaining!')
			$('#timer').addClass('time-warning')
		} else {
			$('#timer').text(Math.round(this.time - time_diff) + ' second remaining')
		}

		if (time_diff > this.time) {
			$('#timer').text(Math.round(this.time - time_diff) + ' Time is up!')

			for (let i = 0; i < this.intervals.length; i++) {
				this.solve()
				clearInterval(this.intervals[i])
			}
		}
	}

	solve () {
		let solved = $('#solved')

		$.ajax({
			url: url + 'board/solution/' + this.game_code,
			crossDomain: true,

			success: (data) => {
				for (let i = 0; i < data.solved.length; i++) {
					let solve = $('<div/>').prependTo(solved)
					solve.addClass('alert')
					solve.text(data.solved[i])
				}
			}
		})

		// this.table_body.empty()
	}
}

let game = new Game()
