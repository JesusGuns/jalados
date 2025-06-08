define(["jquery", "helpers"], function ($,helpers) {
    const puzzleContainer = document.getElementById('_template-puzzle-container');
    const puzzleSize = 4;
    let draggedPiece = null;
    let initialPosition = {};
    const board = [];

    
    function createPuzzle() {
        const imageUrl = helpers.onGetResources().MainEvent.CollageImages[3];
        const pieces = [];
        let pieceSize = 125;

        if(window.innerWidth < 325.98){
            pieceSize = 60;
        }else if(window.innerWidth < 375.98){
            pieceSize = 67.5;
        }else if(window.innerWidth < 575.98){
            pieceSize = 75
        }

        for (let row = 0; row < puzzleSize; row++) {
          board[row] = [];
          for (let col = 0; col < puzzleSize; col++) {
            const piece = document.createElement('div');
            piece.classList.add('_piece');
            piece.setAttribute('draggable', true);
            piece.style.backgroundImage = `url(${imageUrl})`;
            piece.style.backgroundPosition = `-${col * pieceSize}px -${row * pieceSize}px`;
            piece.dataset.correctIndex = row * puzzleSize + col;

            piece.addEventListener('dragstart', dragStart);
            piece.addEventListener('dragover', dragOver);
            piece.addEventListener('drop', drop);
            piece.addEventListener('dragend', dragEnd);

            piece.addEventListener('touchstart', touchStart);
            piece.addEventListener('touchmove', touchMove);
            piece.addEventListener('touchend', touchEnd);

            pieces.push(piece);
          }
        }

        shufflePieces(pieces);
    }

    function shufflePieces(pieces) {
        pieces.sort(() => Math.random() - 0.5);

        for (let i = 0; i < pieces.length; i++) {
        const row = Math.floor(i / puzzleSize);
        const col = i % puzzleSize;
        board[row][col] = pieces[i];
        puzzleContainer.appendChild(pieces[i]);
        }
    }

    function dragStart(e) {
        draggedPiece = e.target;
        draggedPiece.classList.add('dragging');
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function drop(e) {
        if (draggedPiece !== e.target) {
        swapPieces(draggedPiece, e.target);
        }
    }

    function dragEnd() {
        if (draggedPiece) draggedPiece.classList.remove('dragging');
        draggedPiece = null;
    }

    function touchStart(e) {
        e.preventDefault();
        draggedPiece = e.target;
        initialPosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        draggedPiece.classList.add('dragging');
    }

    function touchMove(e) {
        e.preventDefault();
        if (draggedPiece) {
        const deltaX = e.touches[0].clientX - initialPosition.x;
        const deltaY = e.touches[0].clientY - initialPosition.y;
        draggedPiece.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        }
    }

    function touchEnd(e) {
        e.preventDefault();
        if (draggedPiece) {
        draggedPiece.style.visibility = 'hidden';
        const touch = e.changedTouches[0];
        const targetPiece = document.elementFromPoint(touch.clientX, touch.clientY);
        draggedPiece.style.visibility = 'visible';

        if (targetPiece && targetPiece !== draggedPiece && targetPiece.classList.contains('_piece')) {
            swapPieces(draggedPiece, targetPiece);
        }

        draggedPiece.style.transform = '';
        draggedPiece.classList.remove('dragging');
        draggedPiece = null;
        }
    }

    function swapPieces(piece1, piece2) {
        const index1 = getPieceIndex(piece1);
        const index2 = getPieceIndex(piece2);

        if (index1 && index2) {
        const temp = board[index1.row][index1.col];
        board[index1.row][index1.col] = board[index2.row][index2.col];
        board[index2.row][index2.col] = temp;

        puzzleContainer.innerHTML = '';
        board.flat().forEach(piece => puzzleContainer.appendChild(piece));

        checkWin();
        }
    }

    function getPieceIndex(piece) {
        for (let row = 0; row < puzzleSize; row++) {
        for (let col = 0; col < puzzleSize; col++) {
            if (board[row][col] === piece) {
            return { row, col };
            }
        }
        }
        return null;
    }

    function checkWin() {
        let count = 0;
        for (let row = 0; row < puzzleSize; row++) {
        for (let col = 0; col < puzzleSize; col++) {
            const correctIndex = row * puzzleSize + col;
            if (parseInt(board[row][col].dataset.correctIndex) !== correctIndex) {
            return false;
            }
            count++;
        }
        }

        document.getElementById('_template-puzzle-container').style.display = 'none';
        const completeImage = document.getElementById('_template-Puzzle-Completed');
        completeImage.classList.add('visible');
        completeImage.style.display = 'block';
        return true;
    }

    var module = {
        onCreatePuzzle: function(){
            createPuzzle();
        }
    };

    return module;
});
