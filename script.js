import { Chess } from "https://cdn.jsdelivr.net/npm/chess.js@1.4.0/+esm";

/*
 * Chess Up — funções da área de jogo.
 * As regras e os movimentos legais são validados pela biblioteca chess.js.
 * As partidas são locais: não existe servidor ou gravação em conta nesta versão.
 */

const chess = new Chess();

const boardElement = document.querySelector(".chessboard");
const ranksElement = document.querySelector(".board-ranks");
const filesElement = document.querySelector(".board-files");
const noteElement = document.querySelector(".board-note");
const badgeElement = document.querySelector(".status-badge");
const moveListElement = document.querySelector(".move-list");
const undoButton = document.querySelector("[data-action='undo']");
const flipButton = document.querySelector("[data-action='flip']");
const exportButton = document.querySelector("[data-action='export']");
const newGameButton = document.querySelector("[data-action='new-game']");

if (!boardElement) {
    throw new Error("O tabuleiro do Chess Up não foi encontrado.");
}

const PIECES = {
    w: { k: "♔", q: "♕", r: "♖", b: "♗", n: "♘", p: "♙" },
    b: { k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♟" }
};

const PIECE_NAMES = {
    k: "rei",
    q: "dama",
    r: "torre",
    b: "bispo",
    n: "cavalo",
    p: "peão"
};

const PIECE_VALUES = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 20 };

let selectedSquare = null;
let legalMoves = [];
let lastMove = null;
let boardFlipped = false;
let opponent = "local";
let selectedMode = "rapid";
let minutesPerSide = 10;
let remaining = { w: 600, b: 600 };
let clockStarted = false;
let clockInterval = null;
let computerTimeout = null;
let computerThinking = false;
let timeoutWinner = null;

function isFinished() {
    return Boolean(timeoutWinner) || chess.isGameOver();
}

function stopClock() {
    if (clockInterval !== null) {
        window.clearInterval(clockInterval);
        clockInterval = null;
    }
}

function formatTime(seconds) {
    const safeSeconds = Math.max(0, seconds);
    const minutes = String(Math.floor(safeSeconds / 60)).padStart(2, "0");
    const rest = String(safeSeconds % 60).padStart(2, "0");
    return minutes + ":" + rest;
}

function updateClock() {
    const clocks = document.querySelectorAll(".board-panel .clock");
    if (clocks[0]) {
        clocks[0].textContent = formatTime(remaining.b);
        clocks[0].classList.toggle("clock-low", remaining.b <= 30);
    }
    if (clocks[1]) {
        clocks[1].textContent = formatTime(remaining.w);
        clocks[1].classList.toggle("clock-low", remaining.w <= 30);
    }
}

function startClock() {
    if (clockStarted || isFinished()) return;

    clockStarted = true;
    clockInterval = window.setInterval(function () {
        if (isFinished()) {
            stopClock();
            return;
        }

        const activeColor = chess.turn();
        remaining[activeColor] = Math.max(0, remaining[activeColor] - 1);

        if (remaining[activeColor] <= 0) {
            timeoutWinner = activeColor === "w" ? "b" : "w";
            computerThinking = false;
            if (computerTimeout !== null) {
                window.clearTimeout(computerTimeout);
                computerTimeout = null;
            }
            stopClock();
            render();
            return;
        }

        updateClock();
    }, 1000);
}

function findKingSquare(color) {
    const position = chess.board();

    for (let row = 0; row < position.length; row += 1) {
        for (let col = 0; col < position[row].length; col += 1) {
            const piece = position[row][col];
            if (piece && piece.type === "k" && piece.color === color) {
                return "abcdefgh"[col] + String(8 - row);
            }
        }
    }

    return null;
}

function renderCoordinates() {
    if (ranksElement) {
        ranksElement.replaceChildren();
        for (let row = 0; row < 8; row += 1) {
            const rank = document.createElement("span");
            rank.textContent = String(boardFlipped ? row + 1 : 8 - row);
            ranksElement.appendChild(rank);
        }
    }

    if (filesElement) {
        filesElement.replaceChildren();
        const spacer = document.createElement("span");
        spacer.setAttribute("aria-hidden", "true");
        filesElement.appendChild(spacer);

        const files = boardFlipped ? "hgfedcba" : "abcdefgh";
        for (const file of files) {
            const item = document.createElement("span");
            item.textContent = file;
            filesElement.appendChild(item);
        }
    }
}

function renderBoard() {
    const ranks = boardFlipped ? [1, 2, 3, 4, 5, 6, 7, 8] : [8, 7, 6, 5, 4, 3, 2, 1];
    const files = boardFlipped ? "hgfedcba" : "abcdefgh";
    const checkedKing = chess.isCheck() ? findKingSquare(chess.turn()) : null;
    const computerTurn = opponent === "computer" && chess.turn() === "b";

    boardElement.replaceChildren();
    boardElement.setAttribute("role", "group");
    boardElement.setAttribute("aria-label", "Tabuleiro interativo do Chess Up");

    ranks.forEach(function (rank, rowIndex) {
        files.split("").forEach(function (file, colIndex) {
            const squareName = file + String(rank);
            const piece = chess.get(squareName);
            const button = document.createElement("button");
            const isLight = (rowIndex + colIndex) % 2 === 0;
            const selected = selectedSquare === squareName;
            const targets = legalMoves.filter(function (move) {
                return move.to === squareName;
            });
            const last = lastMove && (lastMove.from === squareName || lastMove.to === squareName);

            button.type = "button";
            button.className = "square " + (isLight ? "square-light" : "square-dark");

            if (piece) {
                button.classList.add(piece.color === "w" ? "piece-white" : "piece-black");
                button.textContent = PIECES[piece.color][piece.type];
            } else {
                button.textContent = "";
            }

            if (selected) button.classList.add("selected");
            if (targets.length) {
                const capture = targets.some(function (move) {
                    return move.flags.includes("c") || move.flags.includes("e");
                });
                button.classList.add(capture ? "capture-target" : "legal-target");
            }
            if (last) button.classList.add("last-move");
            if (checkedKing === squareName) button.classList.add("in-check");

            const pieceDescription = piece
                ? (piece.color === "w" ? "branca" : "preta") + " " + PIECE_NAMES[piece.type]
                : "casa vazia";

            button.setAttribute("aria-label", squareName + ", " + pieceDescription);
            button.setAttribute("aria-pressed", selected ? "true" : "false");
            button.dataset.square = squareName;
            button.disabled = isFinished() || computerTurn;
            button.addEventListener("click", function () {
                handleSquareClick(squareName);
            });

            boardElement.appendChild(button);
        });
    });

    renderCoordinates();
}

function updateMoveHistory() {
    if (!moveListElement) return;

    const history = chess.history();
    moveListElement.replaceChildren();

    if (history.length === 0) {
        const item = document.createElement("li");
        item.className = "move-pair";
        item.style.gridColumn = "1 / -1";
        item.textContent = "Nenhuma jogada realizada.";
        moveListElement.appendChild(item);
        return;
    }

    for (let index = 0; index < history.length; index += 2) {
        const item = document.createElement("li");
        item.className = "move-pair";

        const number = document.createElement("span");
        number.className = "move-number";
        number.textContent = String(Math.floor(index / 2) + 1) + ".";

        const whiteMove = document.createElement("span");
        whiteMove.textContent = history[index];

        const blackMove = document.createElement("span");
        blackMove.textContent = history[index + 1] || "…";

        item.append(number, whiteMove, blackMove);
        moveListElement.appendChild(item);
    }
}

function updatePlayers() {
    const bars = document.querySelectorAll(".board-panel .player-bar");
    const blackName = opponent === "computer" ? "Computador" : "Jogador 2";
    const whiteName = opponent === "computer" ? "Você" : "Jogador 1";

    if (bars[0]) {
        const label = bars[0].querySelector(".player-label");
        const name = label && label.querySelector("span:last-child");
        if (name) name.textContent = blackName + " · Pretas";
        bars[0].classList.toggle("active-player", chess.turn() === "b" && !isFinished());
    }

    if (bars[1]) {
        const label = bars[1].querySelector(".player-label");
        const name = label && label.querySelector("span:last-child");
        if (name) name.textContent = whiteName + " · Brancas";
        bars[1].classList.toggle("active-player", chess.turn() === "w" && !isFinished());
    }
}

function updateStatus() {
    let message = "";
    let badgeText = "Pronto para jogar";
    const finished = isFinished();

    if (timeoutWinner) {
        const winner = timeoutWinner === "w" ? "Brancas" : "Pretas";
        message = "Tempo esgotado! Vitória das " + winner.toLowerCase() + ".";
        badgeText = "Tempo esgotado";
    } else if (chess.isCheckmate()) {
        const winner = chess.turn() === "w" ? "Pretas" : "Brancas";
        message = "Xeque-mate! Vitória das " + winner.toLowerCase() + ".";
        badgeText = "Xeque-mate";
    } else if (chess.isStalemate()) {
        message = "Empate por afogamento.";
        badgeText = "Empate";
    } else if (chess.isDraw()) {
        message = "A partida terminou empatada.";
        badgeText = "Empate";
    } else if (computerThinking) {
        message = "O computador está pensando...";
        badgeText = "Computador pensando";
    } else if (chess.isCheck()) {
        message = "Xeque! " + (chess.turn() === "w" ? "As brancas" : "As pretas") + " precisam proteger o rei.";
        badgeText = "Xeque";
    } else if (chess.turn() === "w") {
        message = "Vez das brancas. Selecione uma peça para ver os movimentos possíveis.";
        badgeText = clockStarted ? "Em andamento" : "Pronto para jogar";
    } else {
        message = "Vez das pretas. Selecione uma peça e uma casa de destino.";
        badgeText = "Em andamento";
    }

    if (noteElement) noteElement.textContent = message;
    if (badgeElement) {
        badgeElement.textContent = badgeText;
        badgeElement.classList.toggle("is-finished", finished);
    }

    if (finished) stopClock();
}

function updateUndoButton() {
    if (undoButton) {
        undoButton.disabled = chess.history().length === 0;
    }
}

function render() {
    renderBoard();
    updateMoveHistory();
    updatePlayers();
    updateClock();
    updateStatus();
    updateUndoButton();
}

function handleSquareClick(squareName) {
    if (isFinished() || computerThinking) return;
    if (opponent === "computer" && chess.turn() === "b") return;

    const clickedPiece = chess.get(squareName);
    const destinationMove = legalMoves.find(function (move) {
        return move.to === squareName;
    });

    if (selectedSquare && destinationMove) {
        makeMove(selectedSquare, squareName);
        return;
    }

    if (clickedPiece && clickedPiece.color === chess.turn()) {
        selectedSquare = squareName;
        legalMoves = chess.moves({ square: squareName, verbose: true });
        renderBoard();

        if (noteElement) {
            noteElement.textContent = legalMoves.length
                ? "Peça selecionada. Escolha uma das casas destacadas."
                : "Essa peça não tem movimentos legais disponíveis.";
        }
        return;
    }

    selectedSquare = null;
    legalMoves = [];
    renderBoard();
}

function makeMove(from, to) {
    try {
        const move = chess.move({ from: from, to: to, promotion: "q" });
        lastMove = move;
        selectedSquare = null;
        legalMoves = [];

        if (!clockStarted) startClock();

        render();

        if (!isFinished() && opponent === "computer" && chess.turn() === "b") {
            scheduleComputerMove();
        }
        return true;
    } catch (error) {
        selectedSquare = null;
        legalMoves = [];
        render();
        if (noteElement) noteElement.textContent = "Movimento inválido. Escolha uma casa destacada.";
        return false;
    }
}

function chooseComputerMove() {
    const candidates = chess.moves({ verbose: true });
    let bestScore = -Infinity;
    let bestMoves = [];

    candidates.forEach(function (candidate) {
        chess.move({
            from: candidate.from,
            to: candidate.to,
            promotion: candidate.promotion || "q"
        });

        let score = 0;
        if (candidate.captured) score += PIECE_VALUES[candidate.captured] || 0;
        if (candidate.promotion) score += 8;
        if (chess.isCheckmate()) score += 100;
        else if (chess.isCheck()) score += 0.5;

        const fileIndex = candidate.to.charCodeAt(0) - 97;
        const rankIndex = Number(candidate.to[1]) - 1;
        const centerDistance = Math.abs(3.5 - fileIndex) + Math.abs(3.5 - rankIndex);
        score += Math.max(0, 7 - centerDistance) * 0.03;

        chess.undo();

        if (score > bestScore) {
            bestScore = score;
            bestMoves = [candidate];
        } else if (score === bestScore) {
            bestMoves.push(candidate);
        }
    });

    if (bestMoves.length === 0) return null;
    return bestMoves[Math.floor(Math.random() * bestMoves.length)];
}

function scheduleComputerMove() {
    computerThinking = true;
    render();

    computerTimeout = window.setTimeout(function () {
        computerTimeout = null;
        if (isFinished() || opponent !== "computer" || chess.turn() !== "b") {
            computerThinking = false;
            render();
            return;
        }

        const candidate = chooseComputerMove();
        computerThinking = false;

        if (candidate) {
            const move = chess.move({
                from: candidate.from,
                to: candidate.to,
                promotion: candidate.promotion || "q"
            });
            lastMove = move;
        }

        render();
    }, 450);
}

function resetGame() {
    stopClock();

    if (computerTimeout !== null) {
        window.clearTimeout(computerTimeout);
        computerTimeout = null;
    }

    chess.reset();
    selectedSquare = null;
    legalMoves = [];
    lastMove = null;
    remaining = { w: minutesPerSide * 60, b: minutesPerSide * 60 };
    clockStarted = false;
    computerThinking = false;
    timeoutWinner = null;

    render();
}

function undoMove() {
    if (computerTimeout !== null) {
        window.clearTimeout(computerTimeout);
        computerTimeout = null;
    }
    computerThinking = false;

    const undoCount = opponent === "computer" ? 2 : 1;
    let undone = false;

    for (let index = 0; index < undoCount; index += 1) {
        if (chess.undo()) undone = true;
    }

    if (!undone) {
        if (noteElement) noteElement.textContent = "Ainda não há jogadas para desfazer.";
        return;
    }

    timeoutWinner = null;
    selectedSquare = null;
    legalMoves = [];
    const history = chess.history({ verbose: true });
    lastMove = history.length ? history[history.length - 1] : null;
    render();
}

function exportPGN() {
    if (chess.history().length === 0) {
        if (noteElement) noteElement.textContent = "Faça pelo menos uma jogada antes de exportar a partida.";
        return;
    }

    chess.setHeader("Event", "Chess Up");
    chess.setHeader("White", opponent === "computer" ? "Jogador" : "Jogador 1");
    chess.setHeader("Black", opponent === "computer" ? "Computador Chess Up" : "Jogador 2");
    chess.setHeader("TimeControl", String(minutesPerSide * 60));

    const pgn = chess.pgn();
    const blob = new Blob([pgn], { type: "application/x-chess-pgn;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "chess-up-partida.pgn";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(function () {
        URL.revokeObjectURL(url);
    }, 1000);
}

document.querySelectorAll(".mode-option").forEach(function (button) {
    button.addEventListener("click", function () {
        document.querySelectorAll(".mode-option").forEach(function (item) {
            item.classList.remove("is-selected");
            item.setAttribute("aria-pressed", "false");
        });

        button.classList.add("is-selected");
        button.setAttribute("aria-pressed", "true");
        selectedMode = button.dataset.mode || "rapid";
        minutesPerSide = Number(button.dataset.minutes) || 10;
        resetGame();
    });
});

document.querySelectorAll(".opponent-option").forEach(function (button) {
    button.addEventListener("click", function () {
        document.querySelectorAll(".opponent-option").forEach(function (item) {
            item.classList.remove("is-selected");
            item.setAttribute("aria-pressed", "false");
        });

        button.classList.add("is-selected");
        button.setAttribute("aria-pressed", "true");
        opponent = button.dataset.opponent === "computer" ? "computer" : "local";
        resetGame();
    });
});

if (undoButton) undoButton.addEventListener("click", undoMove);
if (flipButton) {
    flipButton.addEventListener("click", function () {
        boardFlipped = !boardFlipped;
        renderBoard();
    });
}
if (exportButton) exportButton.addEventListener("click", exportPGN);
if (newGameButton) newGameButton.addEventListener("click", resetGame);

document.querySelectorAll(".mode-option, .opponent-option").forEach(function (button) {
    button.setAttribute("aria-pressed", button.classList.contains("is-selected") ? "true" : "false");
});

resetGame();
