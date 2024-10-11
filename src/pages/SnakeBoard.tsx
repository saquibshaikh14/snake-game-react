import {SyntheticEvent, useState} from 'react';
import { RiPauseLine, RiPlayLine, RiArrowDownLine, RiArrowLeftLine, RiArrowRightLine, RiArrowUpLine } from 'react-icons/ri'


//Component import
import GameArea from "../components/GameArea";
import Topbar from "../components/Topbar";

import helperFunctions from '../helper-functions';

export default function SnakeBoard() {

  const [score, updateScore] = useState(0);
  const [gameState, updateGameState] = useState(false); //inital game should be in pause state

  const handleNavigation = (event: SyntheticEvent) => {
    var targetElement = event.target as HTMLElement;
    var targetName = targetElement.getAttribute('name');
    if(targetName === "navigate"){
      var key = targetElement.getAttribute("data-navigate") ?? "";
      triggerKeyPress(key);
    }
  }

  const triggerKeyPress = (key: string) => {
    const keyboardEvent = new KeyboardEvent('keydown', {key});
    document.dispatchEvent(keyboardEvent);
  }

  return (
   <div style={{display: "flex", flexDirection: "column"}}>
    <div>
      {
        helperFunctions.checkForMobileDevice()
        ?
        <>
          <h4 style={{textAlign: "center", marginTop: "5px"}}>Snake Game</h4>
          <h5 style={{textAlign: "center", marginTop: "2px", color: "#7f7f7f"}} >Navigate your snake to eat food and avoid collisions!</h5>
        </>
        : 
        <>
          <h2 style={{textAlign: "center", marginTop: "15px"}}>Snake Game</h2>
          <h4 style={{textAlign: "center", marginTop: "5px", color: "#7f7f7f"}} >Navigate your snake to eat food and avoid collisions! Use the arrow keys or the on-screen buttons.</h4>
        </>
      }
    </div>
    <div className="main-container" style={{ border: "2px solid #3c3c3c", ...helperFunctions.checkForMobileDevice() && {margin: "10px auto"}}}>
        <Topbar score={score} gameState={gameState} updateGameState={updateGameState}/>
        <GameArea score={score} updateScore={updateScore} gameState={gameState} updateGameState={updateGameState} />
    </div>
    <div className="navigation-buttons" onClick={handleNavigation}>
        <div className="row">
           <RiArrowUpLine name="navigate" className="navigate-icon" data-navigate="ArrowUp" />
        </div>
        <div className="row">
            <RiArrowLeftLine name="navigate" className="navigate-icon" data-navigate="ArrowLeft" />
            {gameState?<RiPauseLine  name="navigate" className="navigate-icon" data-navigate=" " />:<RiPlayLine name="navigate" className="navigate-icon" data-navigate=" " />}
            <RiArrowRightLine name="navigate" className="navigate-icon" data-navigate="ArrowRight" />
        </div>
        <div className="row">
              <RiArrowDownLine name="navigate" className="navigate-icon" data-navigate="ArrowDown" />
        </div>
    </div>
   </div>
  );
}
 