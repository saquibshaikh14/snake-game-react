import { WIDTH } from "../Constants";
import GameArea from "../components/GameArea";
import Topbar from "../components/Topbar";


//Component import

export default function SnakeBoard() {
  return (
   <div className="main-container" style={{width: WIDTH + "px", border: "2px solid #3c3c3c"}}>
      <Topbar />
      <GameArea />
   </div>
  );
}
