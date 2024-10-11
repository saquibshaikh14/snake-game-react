import helperFunctions from "./helper-functions";

const isMobile = helperFunctions.checkForMobileDevice();

export const WIDTH = isMobile ? 375 : 500;;
export const HEIGHT = 375;
export const BLOCK_SIZE = 25;

export const BOARD_BACKGROUND_COLOR = "#006060";
export const GRID_LINE_COLOR = "#007979";
export const SNAKE_HEAD_COLOR = "#ccc";
export const SNAKE_BODY_COLOR = "#FFA07A";
export const SNAKE_FOOD_COLOR = "#FFFF66";
