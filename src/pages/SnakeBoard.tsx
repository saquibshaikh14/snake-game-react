import {useState} from 'react';

import { WIDTH } from "../Constants";

//Component import
import GameArea from "../components/GameArea";
import Topbar from "../components/Topbar";

export default function SnakeBoard() {

  const [score, updateScore] = useState(0);
  const [gameState, updateGameState] = useState(false); //inital game should be in pause state


  return (
   <div className="main-container" style={{width: WIDTH + "px", border: "2px solid #3c3c3c"}}>
      <Topbar score={score} gameState={gameState} updateGameState={updateGameState}/>
      <GameArea score={score} updateScore={updateScore} gameState={gameState} updateGameState={updateGameState} />
   </div>
  );
}
