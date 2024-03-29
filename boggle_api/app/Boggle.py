import os
from collections import Counter
from random import randint


def load_dictionary(file):
    """
    Loads a dictionary file into Boggle object's word list

    :param file: Path to the dictionary file
    :return: None
    """
    words = set()
    prefixes = set()

    this_folder = os.path.dirname(os.path.abspath(__file__))
    my_file = os.path.join(this_folder, '../', file)

    with open(my_file, 'r') as f:
        for line in f:
            word = line.rstrip().upper()
            if len(word) >= 3:
                words.add(word)
                for i in range(len(word)):
                    prefixes.add(word[:i])

    return words, prefixes


def to_array(fn):
    return [[fn() for _ in range(4)] for _ in range(4)]


def weighted_random(pairs):
    total = sum(pair[1] for pair in pairs)
    r = randint(1, total)
    for (value, weight) in pairs:
        r -= weight
        if r <= 0:
            return value


class Boggle:
    def __init__(self, file, size=4, points=None):
        """
        Boggle board class constructor

        :param file: Path to the dictionary file
        :param size: Size of the board
        :param points: The points corresponding to word lengths
        :return: None
        """
        self.size = size
        self.board = [[' '] * self.size for _ in range(self.size)]
        self.adjacency = self.build_adjacency()
        self.words, self.prefixes = load_dictionary(file)
        self.letter_scores = Counter(self.letters())

        # Points per word of given length
        points = points if points is not None else {3: 1, 5: 2, 6: 3, 7: 5, 8: 11}
        self.points = [0 for _ in range(self.size ** 2)]
        for i in range(len(self.points)):
            if i in points:
                self.points[i] = points[i]
            elif i > 0:
                self.points[i] = self.points[i - 1]

    def __repr__(self):
        """
        Prints the Boggle board

        :return: A string representation of the board
        """
        return '\n'.join([' '.join(row) for row in self.board])

    def adjacent(self, pos):
        """
        Finds all adjacent positions for a given position on the board

        :param pos: A 2-tuple giving row and column of a position
        :return: A list of positions adjacent to the given position
        """
        row, col = pos
        adj = []
        for i in [-1, 0, 1]:
            for j in [-1, 0, 1]:
                new_row = row + i
                new_col = col + j
                if 0 <= new_row < self.size and 0 <= new_col < self.size and not (i == j == 0):
                    adj.append((new_row, new_col))
                    
        return adj

    def build_adjacency(self):
        """
        Builds the adjacency lookup for each position on the board

        :return: A dictionary of adjacent positions for each position on the board
        """
        adjacency = dict()
        for row in range(0, self.size):
            for col in range(0, self.size):
                adjacency[(row, col)] = self.adjacent((row, col))

        return adjacency

    def get_letter(self, pos):
        """
        Gets the letter at a given position

        :param pos: A 2-tuple giving row and column location of a position
        :return: A letter at the given position
        """
        return self.board[pos[0]][pos[1]]

    def set_board(self, letters):
        """
        Sets the letters on the board

        :param letters: A string giving the letters, row by row
        :return: None
        """
        for row in range(self.size):
            index = row * self.size
            row_letters = letters[index:index + self.size]
            for col, letter in enumerate(row_letters):
                self.board[row][col] = letter

    def find_words(self):
        """
        Finds all words on the board

        :return: A set of words found on the board
        """
        words = set()
        for row in range(self.size):
            for col in range(self.size):
                words |= self.find_words_pos((row, col))

        return words

    def find_words_pos(self, pos):
        """
        Finds words starting at a given position on the board

        :param pos: A 2-tuple giving row and column on the board
        :return: A set of words starting at the given position
        """
        stack = [(n, [pos], self.get_letter(pos)) for n in self.adjacency[pos]]
        words = set()

        while stack:
            curr, path, chars = stack.pop()
            curr_char = self.get_letter(curr)
            curr_chars = chars + curr_char

            # Check if path forms a word
            if curr_chars in self.words:
                words.add(curr_chars)

            # Check if path forms the prefix of a word
            if curr_chars in self.prefixes:
                # Get adjacent positions
                curr_adj = self.adjacency[curr]

                # Check if adjacent positions have already been visited
                stack.extend([(n, path + [curr], curr_chars) for n in curr_adj if n not in path])

        return words

    def score(self):
        """
        Scores the Boggle board

        :return: The Boggle board score
        """
        score = 0
        words = self.find_words()
        for word in words:
            score += self.points[len(word)]
        return score

    def letters(self):
        for word in self.words:
            for letter in word.upper():
                if 'A' <= letter <= 'Z':
                    yield letter

    def generate_random(self):
        return to_array(lambda: weighted_random(self.letter_scores.items()))
