import React, { useCallback, useState } from 'react';
import { RiPauseCircleLine, RiPauseLine, RiPlayLine, RiRestartLine } from 'react-icons/ri'

export default function Topbar() {

  const [gamePlay, setGamePlay] = useState(false);


  const setGameState = useCallback((event: React.SyntheticEvent) => {
    var targetElement = event.target as HTMLElement;

    //icon or any of its children clicked
    var iconClicked = targetElement.closest('.topbar-icon');

    //check for play
    if (iconClicked?.getAttribute("name") === "setGameState") {

      var isPlay = iconClicked?.getAttribute("data-gamestate") === 'true' ? true : false;

      if (isPlay && !gamePlay) setGamePlay(isPlay)
      if (!isPlay && gamePlay) setGamePlay(isPlay)

    }
    if (iconClicked?.getAttribute("name") === "resetGame") {
      //reset other thing
      setGamePlay(false);
    }

  }, [gamePlay]);


  return (
    <div className="topbar-container">
      <ul className="topbar-list">
        <li className="topbar-list-item scoreboard">
          Score: <span className="score-text">1000</span>
        </li>
        <ul className="topbar-list-item push-right" onClick={setGameState}>
          <li className="topbar-list-item">
            {
              !gamePlay ?
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