export interface TopbarProps {
    score: number;
    gameState: boolean;
    updateGameState: (state: boolean) => void
}

export interface GameAreaProps {
    score: number;
    updateScore: (score: number) => void;
    gameState: boolean;
    updateGameState: (state: boolean) => void
}

export interface PositionCoordinate {
    posX: number;
    posY: number;
  }