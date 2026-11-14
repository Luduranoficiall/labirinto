export type GameScreen = 'TITLE' | 'GALLERY' | 'PLAYING' | 'VICTORY' | 'ALL_CLEAR';

export type Language = 'en' | 'pt';

export type Direction = 'up' | 'down' | 'left' | 'right';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'master';

export interface Position {
  x: number;
  y: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  shape?: 'circle' | 'square' | 'spark';
}

export type CellType = 
  | 'floor'
  | 'wall'
  | 'exit'
  | 'ice'
  | 'crumble'
  | 'spring'
  | 'spike'
  | 'conveyor_up'
  | 'conveyor_down'
  | 'conveyor_left'
  | 'conveyor_right';

export interface InteractiveItem {
  id: string;
  type: 
    | 'key'
    | 'gate'
    | 'block'
    | 'pressure_plate'
    | 'color_switch'
    | 'color_gate'
    | 'portal'
    | 'shrink_gem'
    | 'mirror'
    | 'laser_emitter'
    | 'laser_receiver'
    | 'gear_switch'
    | 'echo_plate'
    | 'circuit_node'
    | 'magnet_peg'
    | 'torch_brazier'
    | 'stamp_perforation'
    | 'swap_beacon';
  x: number;
  y: number;
  // Specific item properties
  color?: 'red' | 'blue';
  isOpen?: boolean;
  isActive?: boolean;
  pairId?: string; // For portals
  mirrorAngle?: number; // 0: 45deg, 1: 135deg, 2: 225deg, 3: 315deg
  laserDir?: Direction;
  orderIndex?: number; // For circuit nodes
  polarity?: '+' | '-';
  collected?: boolean;
  side?: 'front' | 'back'; // For origami stamp maze
}

export interface MazeConfig {
  id: number;
  difficulty: Difficulty;
  titleEn: string;
  titlePt: string;
  subtitleEn: string;
  subtitlePt: string;
  taglineEn: string;
  taglinePt: string;
  hintEn: string;
  hintPt: string;
  width: number;
  height: number;
  parMoves: number;
  theme: {
    bg: string;
    floor: string;
    wall: string;
    accent: string;
    glow: string;
    gridLine?: string;
  };
  start: Position;
  // Optional second player for shadow twin maze
  shadowStart?: Position;
  exit: Position;
  walls: Position[]; // Wall coordinates
  backWalls?: Position[]; // Distinct walls for the back face of origami stamp
  cells?: Record<string, CellType>; // Special floor tiles ('x,y' -> CellType)
  items?: InteractiveItem[];
  mechanicRule: 
    | 'standard'
    | 'block_push'
    | 'color_flip'
    | 'gravity_tilt'
    | 'conveyor'
    | 'shrink'
    | 'portal'
    | 'ice_slide'
    | 'laser_mirror'
    | 'shadow_twin'
    | 'crumble_tiles'
    | 'clockwork_gear'
    | 'echo_ghost'
    | 'circuit_nodes'
    | 'magnetic_polarity'
    | 'fog_lantern'
    | 'origami_stamp'
    | 'spring_jump'
    | 'teleport_beacon'
    | 'grand_paradox';
}

export interface PlayerState {
  x: number;
  y: number;
  renderX: number;
  renderY: number;
  targetX: number;
  targetY: number;
  isMoving: boolean;
  isShrunk?: boolean;
  polarity?: '+' | '-';
  stampSide?: 'front' | 'back';
  squashX: number;
  squashY: number;
}

export interface MazeProgress {
  completed: boolean;
  bestMoves?: number;
  bestTimeSeconds?: number;
  stars: number; // 1: completed, 2: completed within 1.5x par, 3: completed within par
}

export interface GameSaveData {
  mazes: Record<number, MazeProgress>;
  currentMazeId: number;
  soundEnabled: boolean;
  volume: number;
  language: Language;
  filterDifficulty?: Difficulty | 'all';
}
