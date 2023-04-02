import { useEffect, useRef, useState } from "react";
import helper from "../helper-functions";

import {
  WIDTH,
  HEIGHT,
  BLOCK_SIZE,
  BOARD_BACKGROUND_COLOR,
  SNAKE_HEAD_COLOR,
  SNAKE_BODY_COLOR,
  GRID_LINE_COLOR,
  SNAKE_FOOD_COLOR
} from '../Constants';


const COL = WIDTH / BLOCK_SIZE;
const ROW = HEIGHT / BLOCK_SIZE;
const INIT_POSX = Math.max(Math.floor(COL / 2) - 1, 0);
const INIT_POSY = Math.floor(ROW / 2);


function getRandomPos(limit: number) {
  return Math.floor(Math.random() * (limit + 1));
}

interface PositionCoordinate {
  posX: number;
  posY: number;
}


export default function GameArea() {

  const [gamePlay, setGamePlay] = useState(false);

  const [snakePos, setSnakePos] = useState<PositionCoordinate[]>([{ posX: INIT_POSX, posY: INIT_POSY }, { posX: INIT_POSX + 1, posY: INIT_POSY }, { posX: INIT_POSX + 2, posY: INIT_POSY }]);
  const [snakeLength, setSnakeLength] = useState(3);
  const [snakeSpeed, setSnakeSpeed] = useState(2);
  const [snakeMoveDirection, setSnakeMoveDirection] = useState('ArrowLeft');
  const [foodPos, setFoodPos] = useState<PositionCoordinate | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  //draw grid
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    //set stroke color
    context.strokeStyle = GRID_LINE_COLOR;

    // Draw horizontal grid lines
    for (let row = 0; row <= ROW; row++) {
      const y = row * BLOCK_SIZE;
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(WIDTH, y);
      context.stroke();
    }

    // Draw vertical grid lines
    for (let col = 0; col <= COL; col++) {
      const x = col * BLOCK_SIZE;
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, HEIGHT);
      context.stroke();
    }
  }, []);

  //draw food
  useEffect(() => {
    if (!foodPos) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.fillStyle = SNAKE_FOOD_COLOR;
    context.fillRect(foodPos.posX * BLOCK_SIZE + 1, foodPos.posY * BLOCK_SIZE + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);

  }, [foodPos])

  //draw snake.
  useEffect(() => {

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const { posX = 0, posY = 0 } = snakePos[0] || {};

    //draw head
    context.fillStyle = SNAKE_HEAD_COLOR;
    context.fillRect(posX * BLOCK_SIZE + 1, posY * BLOCK_SIZE + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);

    //draw rest body.
    context.fillStyle = SNAKE_BODY_COLOR;
    for (var i = 1; snakePos.length > 0 && i < snakePos.length; i++) {
      let { posX = 0, posY = 0 } = snakePos[i] || {};
      context.fillRect(posX * BLOCK_SIZE + 1, posY * BLOCK_SIZE + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
    }

  }, [snakePos]);

  useEffect(() => {
    //add event listener and detect key press
    document.addEventListener("keydown", _setSnakeMoveDirection)
    return () => {
      document.removeEventListener("keydown", _setSnakeMoveDirection)
    }
  }, [snakeMoveDirection])

  useEffect(() => {
    let timer: number | null = null;
    if (!gamePlay) {
      timer && clearInterval(timer); //clear timer if any
      timer = null; //remove timerid
      return;
    }

    timer = setInterval(() => {
      moveSnake();
    }, 1000 / snakeSpeed);

    return () => { timer && clearInterval(timer) } //cleanup clear timer if any

  }, [gamePlay, snakeMoveDirection, snakePos])

  const moveSnake = (): void => {
    let _snakePos = [...snakePos];

    let currentSnakeHead = _snakePos[0] || {
      posX: 0,
      posY: 0,
    };

    let newSnakeHead: PositionCoordinate;
    switch (snakeMoveDirection) {
      case 'ArrowDown':
        newSnakeHead = {
          posX: currentSnakeHead.posX,
          posY: currentSnakeHead.posY + 1
        };
        break;
      case 'ArrowLeft':
        newSnakeHead = {
          posX: currentSnakeHead.posX - 1,
          posY: currentSnakeHead.posY
        };
        break;
      case 'ArrowUp':
        newSnakeHead = {
          posX: currentSnakeHead.posX,
          posY: currentSnakeHead.posY - 1
        };
        break;
      case 'ArrowRight':
        newSnakeHead = {
          posX: currentSnakeHead.posX + 1,
          posY: currentSnakeHead.posY
        };
        break;
      default:
        newSnakeHead = {
          posX: currentSnakeHead.posX,
          posY: currentSnakeHead.posY
        }
        break;
    }

    /**
     * Check for snake head and food position
     * if head touches food
     * do not remove tail
     */

    if (!helper.objectEqual(foodPos as PositionCoordinate, newSnakeHead)) {
      let snakeTail = _snakePos.pop(); //reomve tail
      clearCanvasArea(snakeTail?.posX, snakeTail?.posY, BLOCK_SIZE, BLOCK_SIZE);
    } else {
      //create new foodPos
      console.log("equal -> food touched", { foodPos, newSnakeHead })
      setFoodPos(generateFoodPos(snakePos, COL, ROW));
    }

    //set new head to other end of the canvas if it reaches edge
    if (newSnakeHead.posX < 0) newSnakeHead.posX = COL - 1;
    else if (newSnakeHead.posX >= COL) newSnakeHead.posX = 0;

    if (newSnakeHead.posY < 0) newSnakeHead.posY = ROW - 1;
    else if (newSnakeHead.posY >= ROW) newSnakeHead.posY = 0;

    _snakePos.unshift(newSnakeHead);
    setSnakePos(_snakePos);
  }



  function clearCanvasArea(posX: number | undefined, posY: number | undefined, width: number, height: number, blockSize: number = BLOCK_SIZE) {
    if (typeof posX == "undefined" || typeof posY == "undefined") return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.clearRect(posX * blockSize + 1, posY * blockSize + 1, width - 2, height - 2);
  }

  function generateFoodPos(snakePos: any, xLimit: number, yLimit: number) {
    return snakePos;
  }

  const _setSnakeMoveDirection = (event: KeyboardEvent): void => {
    switch (event.key) {
      case 'ArrowDown':
        if (snakeMoveDirection !== 'ArrowUp') {
          setSnakeMoveDirection('ArrowDown');
        }
        break;
      case 'ArrowLeft':
        if (snakeMoveDirection !== 'ArrowRight') {
          setSnakeMoveDirection('ArrowLeft');
        }
        break;
      case 'ArrowUp':
        if (snakeMoveDirection !== 'ArrowDown') {
          setSnakeMoveDirection('ArrowUp');
        }
        break;
      case 'ArrowRight':
        if (snakeMoveDirection !== 'ArrowLeft') {
          setSnakeMoveDirection('ArrowRight');
        }
        break;
      default:
        break;
    }

    !gamePlay && setGamePlay(true); //change game state to playing. once key is pressed
  }

  return (
    <div className="gamearea-container" style={{
      width: `${WIDTH}px`,
      height: `${HEIGHT}px`,
    }}>
      <canvas className="gameboard" ref={canvasRef} style={{ background: BOARD_BACKGROUND_COLOR }} width={WIDTH} height={HEIGHT}></canvas>
    </div>
  )
}
