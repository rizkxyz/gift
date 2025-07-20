"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"

// Tetris piece definitions
const PIECES = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    color: "bg-cyan-500",
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: "bg-blue-500",
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: "bg-orange-500",
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: "bg-yellow-500",
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    color: "bg-green-500",
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: "bg-purple-500",
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    color: "bg-red-500",
  },
}

const BOARD_HEIGHT = 15
const BOARD_WIDTH = 10

// Create empty board
const createEmptyBoard = () => Array.from(Array(BOARD_HEIGHT), () => Array(BOARD_WIDTH).fill(0))

// Generate random piece
const generateRandomPiece = () => {
  const pieces = Object.keys(PIECES)
  const randomPiece = pieces[Math.floor(Math.random() * pieces.length)] as keyof typeof PIECES
  return {
    shape: PIECES[randomPiece].shape,
    color: PIECES[randomPiece].color,
    pos: { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 },
  }
}

export default function TetrisGame() {
  const [board, setBoard] = useState(createEmptyBoard())
  const [currentPiece, setCurrentPiece] = useState(generateRandomPiece())
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [level, setLevel] = useState(1)
  const [lines, setLines] = useState(0)
  const [dropTime, setDropTime] = useState(120)
  const [gameBoard, setGameBoard] = useState(createEmptyBoard())
  const [showGameOver, setShowGameOver] = useState(false)
  const [showLoveMessage, setShowLoveMessage] = useState(false)

  // Set up mobile viewport
  useEffect(() => {
    const metaViewport = document.createElement("meta")
    metaViewport.name = "viewport"
    metaViewport.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
    document.getElementsByTagName("head")[0].appendChild(metaViewport)

    const style = document.createElement("style")
    style.innerHTML = `
      * {
        touch-action: manipulation;
      }
    `
    document.head.appendChild(style)

    return () => {
      document.getElementsByTagName("head")[0].removeChild(metaViewport)
      document.head.removeChild(style)
    }
  }, [])

  // Update display board with current piece
  const updateBoard = useCallback(() => {
    const newBoard = [...gameBoard.map((row) => [...row])]
    currentPiece.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell !== 0) {
          const boardX = currentPiece.pos.x + x
          const boardY = currentPiece.pos.y + y
          if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
            newBoard[boardY][boardX] = currentPiece.color
          }
        }
      })
    })
    setBoard(newBoard)
  }, [currentPiece, gameBoard])

  // Clear completed lines
  const clearLines = useCallback(() => {
    let linesCleared = 0
    const newBoard = gameBoard.reduce((acc, row) => {
      if (row.every((cell) => cell !== 0)) {
        linesCleared++
        acc.unshift(Array(BOARD_WIDTH).fill(0))
      } else {
        acc.push(row)
      }
      return acc
    }, [] as any[])

    if (linesCleared > 0) {
      const points = [0, 40, 100, 300, 1200][linesCleared] * level
      setScore((prev) => prev + points)
      setLines((prev) => {
        const newLines = prev + linesCleared
        if (Math.floor(newLines / 3) > Math.floor(prev / 3)) {
          const newLevel = Math.floor(newLines / 3) + 1
          setLevel(newLevel)
          setDropTime(Math.max(50, 120 - (newLevel - 1) * 10))
        }
        return newLines
      })
      setGameBoard(newBoard)
    }
  }, [gameBoard, level])

  // Check collision
  const checkCollision = useCallback(
    (pos: { x: number; y: number }, shape: number[][]) => {
      for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
          if (shape[y][x] !== 0) {
            const boardX = pos.x + x
            const boardY = pos.y + y
            if (
              boardY < 0 ||
              boardY >= BOARD_HEIGHT ||
              boardX < 0 ||
              boardX >= BOARD_WIDTH ||
              (boardY >= 0 && gameBoard[boardY][boardX] !== 0)
            ) {
              return true
            }
          }
        }
      }
      return false
    },
    [gameBoard],
  )

  // Move piece horizontally
  const movePiece = useCallback(
    (direction: number) => {
      const newPos = { ...currentPiece.pos, x: currentPiece.pos.x + direction }
      if (!checkCollision(newPos, currentPiece.shape)) {
        setCurrentPiece((prev) => ({ ...prev, pos: newPos }))
      }
    },
    [currentPiece, checkCollision],
  )

  // Rotate piece
  const rotatePiece = useCallback(() => {
    const rotated = currentPiece.shape[0].map((_, index) => currentPiece.shape.map((row) => row[index]).reverse())
    const currentX = currentPiece.pos.x
    let offset = 0

    if (checkCollision(currentPiece.pos, rotated)) {
      offset = -1
      if (checkCollision({ ...currentPiece.pos, x: currentX + offset }, rotated)) {
        offset = 1
        if (checkCollision({ ...currentPiece.pos, x: currentX + offset }, rotated)) {
          return // Can't rotate
        }
      }
    }

    setCurrentPiece((prev) => ({
      ...prev,
      shape: rotated,
      pos: { ...prev.pos, x: currentX + offset },
    }))
  }, [currentPiece, checkCollision])

  // Drop piece one row
  const dropPiece = useCallback(() => {
    const newPos = { ...currentPiece.pos, y: currentPiece.pos.y + 1 }

    if (checkCollision(newPos, currentPiece.shape)) {
      // Lock piece in place
      const newBoard = [...gameBoard.map((row) => [...row])]
      currentPiece.shape.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell !== 0) {
            const boardX = currentPiece.pos.x + x
            const boardY = currentPiece.pos.y + y
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              newBoard[boardY][boardX] = currentPiece.color
            }
          }
        })
      })
      setGameBoard(newBoard)

      // Generate new piece
      const newPiece = generateRandomPiece()
      setCurrentPiece(newPiece)

      // Check game over
      if (
        (newBoard[0].some((cell) => cell !== 0) || newBoard[1].some((cell) => cell !== 0)) &&
        checkCollision({ x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 }, newPiece.shape)
      ) {
        setGameOver(true)
        setGameStarted(false)
        setShowGameOver(true)
      }

      clearLines()
    } else {
      setCurrentPiece((prev) => ({ ...prev, pos: newPos }))
    }
  }, [currentPiece, checkCollision, gameBoard, clearLines])

  // Hard drop
  const hardDrop = useCallback(() => {
    let dropY = currentPiece.pos.y
    while (!checkCollision({ ...currentPiece.pos, y: dropY + 1 }, currentPiece.shape)) {
      dropY += 1
    }
    setCurrentPiece((prev) => ({ ...prev, pos: { ...prev.pos, y: dropY } }))
    dropPiece()
  }, [currentPiece, checkCollision, dropPiece])

  // Handle keyboard input
  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (gameStarted && !gameOver) {
        if (e.keyCode === 37) {
          // Left
          movePiece(-1)
        } else if (e.keyCode === 39) {
          // Right
          movePiece(1)
        } else if (e.keyCode === 40) {
          // Down
          dropPiece()
        } else if (e.keyCode === 38) {
          // Up (rotate)
          rotatePiece()
        } else if (e.keyCode === 32) {
          // Space (hard drop)
          hardDrop()
        }
      }
    },
    [gameStarted, gameOver, movePiece, dropPiece, rotatePiece, hardDrop],
  )

  // Game loop
  useEffect(() => {
    let gameInterval: NodeJS.Timeout | null = null

    if (gameStarted && !gameOver) {
      updateBoard()
      gameInterval = setInterval(() => {
        dropPiece()
      }, dropTime)
    }

    return () => {
      if (gameInterval) clearInterval(gameInterval)
    }
  }, [gameStarted, gameOver, updateBoard, dropPiece, dropTime])

  // Handle touch controls
  const handleTouch = useCallback(
    (action: string) => {
      if (!gameOver && gameStarted) {
        if (action === "left") {
          movePiece(-1)
        } else if (action === "right") {
          movePiece(1)
        } else if (action === "rotate") {
          rotatePiece()
        } else if (action === "drop") {
          dropPiece()
        }
      }
    },
    [gameOver, gameStarted, movePiece, rotatePiece, dropPiece],
  )

  // Keyboard event listener
  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress)
    return () => document.removeEventListener("keydown", handleKeyPress)
  }, [handleKeyPress])

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-2 sm:p-4 flex items-center justify-center">
      <div className="w-full max-w-[320px] sm:max-w-md mx-auto bg-gray-900 border-4 border-yellow-300 rounded-xl overflow-hidden shadow-2xl p-3 sm:p-6">
        <div className="retro-screen bg-black rounded-lg p-2 sm:p-4 mb-3 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-center text-green-400 mb-1 sm:mb-2 retro-text">Tetris</h1>

          <div className="flex justify-between mb-1 sm:mb-2">
            <div className="text-yellow-300 retro-text text-xs sm:text-sm">Score: {score}</div>
            <div className="text-yellow-300 retro-text text-xs sm:text-sm">Level: {level}</div>
          </div>

          <div className="flex justify-between mb-2 sm:mb-4">
            <div className="text-yellow-300 retro-text text-xs sm:text-sm">Lines: {lines}</div>
            {gameOver && !showGameOver && !showLoveMessage && (
              <div className="text-red-500 retro-text text-xs sm:text-sm">GAME OVER</div>
            )}
          </div>

          {/* Game Board */}
          <div
            className="grid grid-cols-10 gap-0.5 bg-gray-800 p-1 border-2 border-gray-700 mb-3 sm:mb-4 mx-auto"
            style={{ maxWidth: "280px" }}
          >
            {board.map((row, y) =>
              row.map((cell, x) => (
                <div key={`${y}-${x}`} className={`w-[25px] h-[25px] sm:w-5 sm:h-5 ${cell || "bg-gray-900"}`} />
              )),
            )}
          </div>

          {/* Touch Controls */}
          <div className="grid grid-cols-3 gap-1 sm:gap-2 mb-3 sm:mb-4">
            <button
              onClick={() => handleTouch("left")}
              className="bg-blue-500 h-8 sm:h-10 rounded-lg text-white retro-text text-xs flex items-center justify-center"
            >
              {"<"}
            </button>
            <button
              onClick={() => handleTouch("rotate")}
              className="bg-blue-500 h-8 sm:h-10 rounded-lg text-white retro-text text-xs flex items-center justify-center"
            >
              ROTATE
            </button>
            <button
              onClick={() => handleTouch("right")}
              className="bg-blue-500 h-8 sm:h-10 rounded-lg text-white retro-text text-xs flex items-center justify-center"
            >
              {">"}
            </button>
          </div>

          {/* Start/Restart Button */}
          {!gameStarted && !showGameOver && !showLoveMessage && (
            <button
              onClick={() => {
                setGameBoard(createEmptyBoard())
                setBoard(createEmptyBoard())
                setCurrentPiece(generateRandomPiece())
                setGameOver(false)
                setShowGameOver(false)
                setShowLoveMessage(false)
                setScore(0)
                setLevel(1)
                setLines(0)
                setDropTime(120)
                setGameStarted(true)
              }}
              className="w-full bg-green-500 py-2 rounded-lg text-white retro-text text-xs sm:text-sm"
            >
              {gameOver ? "PLAY AGAIN" : "START GAME"}
            </button>
          )}
        </div>

        <Link
          href="/"
          className="block w-full bg-red-500 text-white font-bold py-2 sm:py-3 px-4 rounded-lg text-center hover:bg-red-600 transition-colors retro-button text-xs sm:text-base"
        >
          KEMBALI
        </Link>
      </div>

      {/* Game Over Modal */}
      {showGameOver && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80">
          <div className="retro-screen bg-black rounded-lg p-4 sm:p-6 max-w-[320px] sm:max-w-md w-full border-4 border-yellow-300 shadow-2xl">
            <h2 className="text-3xl sm:text-5xl font-bold text-center text-red-500 mb-6 sm:mb-10 retro-text animate-pulse tracking-widest">
              GAME OVER
            </h2>
            <div className="flex justify-center mt-6 sm:mt-10">
              <button
                onClick={() => {
                  setShowGameOver(false)
                  setShowLoveMessage(true)
                }}
                className="bg-blue-500 px-6 sm:px-8 py-2 sm:py-3 rounded-lg text-white retro-text text-sm hover:bg-blue-600 transition-colors"
              >
                CONFIRM
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Love Message Modal */}
      {showLoveMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80">
          <div className="retro-screen bg-black rounded-lg p-4 sm:p-6 max-w-[320px] sm:max-w-md w-full border-4 border-yellow-300 shadow-2xl">
            <h2 className="text-xl sm:text-2xl font-bold text-center text-yellow-300 mb-4 sm:mb-6 retro-text">
              INGET YA!
            </h2>
            <div className="text-green-400 text-center retro-text mb-6 sm:mb-8 space-y-3 sm:space-y-4 text-sm sm:text-base">
              <p>walaupun kamu kalah,</p>
              <p>tapi kamu selalu menang</p>
              <p>kok di hati aku, hehe ^_^</p>
              <p className="text-pink-400 text-xl sm:text-2xl mt-6 sm:mt-8">LOVE YOU {"<3"}</p>
            </div>
            <div className="flex justify-center mt-4 sm:mt-6">
              <button
                onClick={() => {
                  setShowLoveMessage(false)
                }}
                className="bg-blue-500 px-6 sm:px-8 py-2 sm:py-3 rounded-lg text-white retro-text text-sm hover:bg-blue-600 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .retro-text {
          font-family: 'Courier New', monospace;
          text-shadow: 0 0 10px currentColor;
        }
        .retro-screen {
          box-shadow: inset 0 0 20px rgba(0, 255, 0, 0.2);
        }
        .retro-button {
          font-family: 'Courier New', monospace;
          text-shadow: 0 0 5px currentColor;
        }
      `}</style>
    </div>
  )
}
