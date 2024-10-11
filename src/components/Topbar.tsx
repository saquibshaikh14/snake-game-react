import React, { useCallback } from 'react';
import { RiPauseCircleLine, RiPlayLine, RiRestartLine } from 'react-icons/ri'
import { TopbarProps } from '../types';

export default function Topbar(props:TopbarProps) {

  const {score, gameState, updateGameState} = props;


  const setGameState = useCallback((event: React.SyntheticEvent) => {
    var targetElement = event.target as HTMLElement;

    //icon or any of its children clicked
    var iconClicked = targetElement.closest('.topbar-icon');

    //check for play
    if (iconClicked?.getAttribute("name") === "setGameState") {

      var isPlay = iconClicked?.getAttribute("data-gamestate") === 'true' ? true : false;

      if (isPlay && !gameState) updateGameState(isPlay)
      if (!isPlay && gameState) updateGameState(isPlay)

    }
    if (iconClicked?.getAttribute("name") === "resetGame") {
      //reset other thing
      updateGameState(false);
    }

  }, [gameState]);


  return (
    <div className="topbar-container">
      <ul className="topbar-list">
        <li className="topbar-list-item scoreboard">
          Score: <span className="score-text">{score}</span>
        </li>
        <ul className="topbar-list-item push-right" onClick={setGameState}>
          <li className="topbar-list-item">
            {
              !gameState ?
                <RiPlayLine name='setGameState' data-gamestate="true"
                  className='topbar-icon'
                />
                :
                <RiPauseCircleLine name='setGameState' data-gamestate="false"
                  className='topbar-icon'
                />
            }

          </li>
          <li className="topbar-list-item">
            <RiRestartLine name='resetGame' className='topbar-icon'
            />
          </li>
        </ul>
      </ul>
    </div>
  );
}