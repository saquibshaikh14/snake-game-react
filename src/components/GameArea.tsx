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
import { GameAreaProps, PositionCoordinate } from "../types";


const COL = (WIDTH / BLOCK_SIZE) - 1;
const ROW = (HEIGHT / BLOCK_SIZE) - 1;

const INIT_POSX = Math.max(0, COL / 2 << 0);
const INIT_POSY = Math.max(0, ROW / 2 << 0);

var DIRECTION_BUFFER: string[] = [];




export default function GameArea(props: GameAreaProps) {

  const { score, gameState, updateScore, updateGameState } = props;

  const [snakePos, setSnakePos] = useState<PositionCoordinate[]>([{ posX: INIT_POSX, posY: INIT_POSY }, { posX: INIT_POSX + 1, posY: INIT_POSY }, { posX: INIT_POSX + 2, posY: INIT_POSY }]);
  const [snakeSpeed, setSnakeSpeed] = useState(3.2);
  const [snakeMoveDirection, setSnakeMoveDirection] = useState('ArrowLeft');
  const [foodPos, setFoodPos] = useState<PositionCoordinate | null>(null);
  const [cellTrack, updateCellTrack] = useState<Record<string, { posX: number; posY: number }>>({});

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timerRef = useRef<number | null>(null);

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

    //keep record of each cell. start is 0 and end is (col,row) -1;
    const _cellTrack: Record<string, { posX: number; posY: number }> = {}
    for (let col = 0; col <= COL; col++) {
      for (let row = 0; row <= ROW; row++) {
        _cellTrack["C" + col + "R" + row] = { posX: col, posY: row };
      }
    }
    //change occupied status of snakePos coordinates
    for (const cord of snakePos) {

      delete _cellTrack["C" + cord.posX + "R" + cord.posY];
    }
    updateCellTrack(_cellTrack);

    setFoodPos(generateFoodPos(_cellTrack));

  }, []);

  //draw food
  useEffect(() => {
    console.log("food draw hook called", foodPos)
    if (!foodPos) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    console.log("Food Pos change", foodPos)

    context.fillStyle = SNAKE_FOOD_COLOR;
    context.fillRect((foodPos.posX * BLOCK_SIZE) + 1, (foodPos.posY * BLOCK_SIZE) + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);

  }, [foodPos])

  //draw snake.
  useEffect(() => {

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    //get snake head
    const snakeHead = snakePos[0] || { posX: 0, posY: 0 };


    //draw head
    context.fillStyle = SNAKE_HEAD_COLOR;
    context.fillRect((snakeHead.posX * BLOCK_SIZE) + 1, (snakeHead.posY * BLOCK_SIZE) + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);

    //draw rest body.
    context.fillStyle = SNAKE_BODY_COLOR;
    for (let i = 1; snakePos.length > 0 && i < snakePos.length; i++) {
      let { posX = 0, posY = 0 } = snakePos[i] || {};

      //check if snakeHead colliding with Body
      if (snakeHead.posX == posX && snakeHead.posY == posY) {
        //collision
        context.fillStyle = "red";
        context.fillRect((posX * BLOCK_SIZE) + 1, (posY * BLOCK_SIZE) + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);

        updateGameState(false);
        alert("Game over, snake hits it's body. Score: " + score);
        return;
        //remove and let draw full snake boody, handle game end 
      }

      context.fillRect((posX * BLOCK_SIZE) + 1, (posY * BLOCK_SIZE) + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
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
    if (!gameState) {
      return;
    }

    timerRef.current = setInterval(() => {
      moveSnake();
    }, 1000 / snakeSpeed);

    return () => { timerRef && clearInterval(timerRef.current!) } //cleanup clear timer if any

  }, [gameState, snakeMoveDirection, snakePos])

  const moveSnake = (): void => {
    let _snakePos = [...snakePos];

    let currentSnakeHead = _snakePos[0] || {
      posX: 0,
      posY: 0,
    };

    let newSnakeHead: PositionCoordinate;
    let latestLegalMoveDirection: string = DIRECTION_BUFFER.length ? DIRECTION_BUFFER.pop()! : snakeMoveDirection;

    switch (latestLegalMoveDirection) {
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



    //cell track
    let _cellTrack = { ...cellTrack };

    //set new head to other end of the canvas if it reaches edge
    if (newSnakeHead.posX < 0) newSnakeHead.posX = COL;
    else if (newSnakeHead.posX > COL) newSnakeHead.posX = 0;

    if (newSnakeHead.posY < 0) newSnakeHead.posY = ROW;
    else if (newSnakeHead.posY > ROW) newSnakeHead.posY = 0;

    //delete occupied block from tracking
    delete _cellTrack["C" + newSnakeHead.posX + "R" + newSnakeHead.posY];

    _snakePos.unshift(newSnakeHead); //add new head to snake(copy)

    if (!helper.objectEqual(foodPos as PositionCoordinate, newSnakeHead)) {
      let snakeTail = _snakePos.pop() as PositionCoordinate; //reomve tail
      clearCanvasArea(snakeTail.posX, snakeTail.posY, BLOCK_SIZE, BLOCK_SIZE);

      //[vacate]: update cell track
      _cellTrack["C" + snakeTail.posX + "R" + snakeTail.posY] = { ...snakeTail }

    } else {
      //create new foodPos
      let newfPos = generateFoodPos(_cellTrack);
      console.log("equal -> food touched", { foodPos, newSnakeHead, newfPos, snakePos, _cellTrack, cellTrack })
      setFoodPos(/*generateFoodPos(_cellTrack)*/newfPos);

      //update score
      updateScore(score + 1);
    }


    //update snake move direction
    setSnakeMoveDirection(latestLegalMoveDirection);
    //clear buffer
    DIRECTION_BUFFER = [];
    setSnakePos(_snakePos); //update new snake position
    updateCellTrack(_cellTrack); //updating new vacate and occupied list

  }



  function clearCanvasArea(posX: number | undefined, posY: number | undefined, width: number, height: number, blockSize: number = BLOCK_SIZE) {
    if (typeof posX == "undefined" || typeof posY == "undefined") return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.clearRect(posX * blockSize + 1, posY * blockSize + 1, width - 2, height - 2);
  }

  function generateFoodPos(_cellTrack: Record<string, { posX: number; posY: number; }>) {

    let keys = Object.keys(_cellTrack);
    let emptyCell = _cellTrack[keys[keys.length * Math.random() << 0]]
    return { posX: emptyCell.posX, posY: emptyCell.posY }; //_cellTrack[keys[ keys.length * Math.random() << 0]];
  }

  const _setSnakeMoveDirection = (event: KeyboardEvent): void => {
    switch (event.key) {
      case 'ArrowDown':
        if (snakeMoveDirection !== 'ArrowUp') {
          // setSnakeMoveDirection('ArrowDown');
          DIRECTION_BUFFER.push('ArrowDown')
        }
        break;
      case 'ArrowLeft':
        if (snakeMoveDirection !== 'ArrowRight') {
          // setSnakeMoveDirection('ArrowLeft');
          DIRECTION_BUFFER.push('ArrowLeft')
        }
        break;
      case 'ArrowUp':
        if (snakeMoveDirection !== 'ArrowDown') {
          // setSnakeMoveDirection('ArrowUp');
          DIRECTION_BUFFER.push('ArrowUp')
        }
        break;
      case 'ArrowRight':
        if (snakeMoveDirection !== 'ArrowLeft') {
          // setSnakeMoveDirection('ArrowRight');
          DIRECTION_BUFFER.push('ArrowRight')
        }
        break;
      default:
        break;
    }

    !gameState && updateGameState(true); //change game state to playing. once key is pressed
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


