import { Direction, InteractiveItem, MazeConfig, Particle, Position } from '../types/game';
import { sounds } from '../audio/soundManager';

interface UndoSnapshot {
  player: { x: number; y: number; isShrunk: boolean; polarity: '+' | '-'; stampSide: 'front' | 'back' };
  shadowPlayer?: { x: number; y: number };
  items: InteractiveItem[];
  crumbledCells: string[];
  moves: number;
  beaconPos: Position | null;
  echoRecord: Position[];
  gearRotation: number;
  lastMoveDir: Direction;
}

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animFrameId: number = 0;
  private lastTime: number = 0;
  private isRunning: boolean = false;
  private echoIntervalId: number | null = null;
  private iceSlideTimeoutId: number | null = null;

  // Active Maze State
  private maze: MazeConfig;
  private lastMoveDir: Direction = 'right';

  private player = {
    x: 0,
    y: 0,
    renderX: 0,
    renderY: 0,
    isShrunk: false,
    polarity: '+' as '+' | '-',
    stampSide: 'front' as 'front' | 'back',
    squashX: 1,
    squashY: 1
  };

  private shadowPlayer = {
    x: 0,
    y: 0,
    renderX: 0,
    renderY: 0,
    squashX: 1,
    squashY: 1
  };

  private items: InteractiveItem[] = [];
  private crumbledCells = new Set<string>();
  private beaconPos: Position | null = null;
  private echoRecording: Position[] = [];
  private isEchoReplaying: boolean = false;
  private echoGhostPos: Position | null = null;
  private gearRotation: number = 0; // 0, 90, 180, 270

  // Gameplay metrics
  private moves: number = 0;
  private startTime: number = 0;
  private elapsedTime: number = 0;
  private undoStack: UndoSnapshot[] = [];
  private isSolved: boolean = false;

  // Game Feel Juices
  private hitstopTimer: number = 0;
  private screenShake: number = 0;
  private particles: Particle[] = [];

  // Callbacks
  private onMovesChange?: (moves: number) => void;
  private onVictory?: (moves: number, timeSeconds: number) => void;

  constructor(canvas: HTMLCanvasElement, maze: MazeConfig) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('2D context not supported');
    this.ctx = context;
    this.maze = maze;
    this.resetMaze();
  }

  public setCallbacks(onMovesChange: (moves: number) => void, onVictory: (moves: number, timeSeconds: number) => void) {
    this.onMovesChange = onMovesChange;
    this.onVictory = onVictory;
  }

  public setMaze(maze: MazeConfig) {
    this.maze = maze;
    this.resetMaze();
  }

  private clearAllTimeouts() {
    if (this.echoIntervalId !== null) {
      clearInterval(this.echoIntervalId);
      this.echoIntervalId = null;
    }
    if (this.iceSlideTimeoutId !== null) {
      clearTimeout(this.iceSlideTimeoutId);
      this.iceSlideTimeoutId = null;
    }
  }

  public resetMaze() {
    this.clearAllTimeouts();

    this.player = {
      x: this.maze.start.x,
      y: this.maze.start.y,
      renderX: this.maze.start.x,
      renderY: this.maze.start.y,
      isShrunk: false,
      polarity: '+',
      stampSide: 'front',
      squashX: 1,
      squashY: 1
    };

    if (this.maze.shadowStart) {
      this.shadowPlayer = {
        x: this.maze.shadowStart.x,
        y: this.maze.shadowStart.y,
        renderX: this.maze.shadowStart.x,
        renderY: this.maze.shadowStart.y,
        squashX: 1,
        squashY: 1
      };
    }

    this.items = (this.maze.items || []).map(item => ({ ...item }));
    this.crumbledCells.clear();
    this.beaconPos = null;
    this.echoRecording = [{ x: this.player.x, y: this.player.y }];
    this.isEchoReplaying = false;
    this.echoGhostPos = null;
    this.gearRotation = 0;
    this.lastMoveDir = 'right';

    this.moves = 0;
    this.onMovesChange?.(0);
    this.startTime = performance.now();
    this.elapsedTime = 0;
    this.undoStack = [];
    this.isSolved = false;
    this.particles = [];
    this.screenShake = 0;
    this.hitstopTimer = 0;

    this.recomputeLaser();
    this.checkPressurePlates();
  }

  private saveUndoSnapshot() {
    this.undoStack.push({
      player: {
        x: this.player.x,
        y: this.player.y,
        isShrunk: this.player.isShrunk,
        polarity: this.player.polarity,
        stampSide: this.player.stampSide
      },
      shadowPlayer: this.maze.shadowStart ? { x: this.shadowPlayer.x, y: this.shadowPlayer.y } : undefined,
      items: this.items.map(it => ({ ...it })),
      crumbledCells: Array.from(this.crumbledCells),
      moves: this.moves,
      beaconPos: this.beaconPos ? { ...this.beaconPos } : null,
      echoRecord: [...this.echoRecording],
      gearRotation: this.gearRotation,
      lastMoveDir: this.lastMoveDir
    });
  }

  public undo(): boolean {
    if (this.undoStack.length === 0 || this.isSolved) return false;
    this.clearAllTimeouts();

    const snap = this.undoStack.pop();
    if (!snap) return false;

    this.player.x = snap.player.x;
    this.player.y = snap.player.y;
    this.player.isShrunk = snap.player.isShrunk;
    this.player.polarity = snap.player.polarity;
    this.player.stampSide = snap.player.stampSide;

    if (snap.shadowPlayer && this.maze.shadowStart) {
      this.shadowPlayer.x = snap.shadowPlayer.x;
      this.shadowPlayer.y = snap.shadowPlayer.y;
    }

    this.items = snap.items;
    this.crumbledCells = new Set(snap.crumbledCells);
    this.moves = snap.moves;
    this.onMovesChange?.(this.moves);
    this.beaconPos = snap.beaconPos;
    this.echoRecording = snap.echoRecord;
    this.gearRotation = snap.gearRotation;
    this.lastMoveDir = snap.lastMoveDir;
    this.isEchoReplaying = false;
    this.echoGhostPos = null;

    sounds.playUndo();
    this.triggerParticles(this.player.x, this.player.y, '#94a3b8', 6);
    this.recomputeLaser();
    this.checkPressurePlates();
    return true;
  }

  public start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  public stop() {
    this.isRunning = false;
    this.clearAllTimeouts();
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
  }

  // --- Input & Move Processing ---
  public tryMove(dir: Direction): boolean {
    if (this.isSolved) return false;
    this.lastMoveDir = dir;

    if (this.maze.mechanicRule === 'gravity_tilt') {
      return this.executeSlideMove(dir);
    }

    return this.executeStepMove(dir);
  }

  public executeAction(): boolean {
    if (this.isSolved) return false;

    // Maze 9: Rotate mirror
    if (this.maze.mechanicRule === 'laser_mirror' || this.maze.items?.some(i => i.type === 'mirror')) {
      const mirror = this.items.find(i => i.type === 'mirror' && (
        (i.x === this.player.x && i.y === this.player.y) ||
        Math.abs(i.x - this.player.x) + Math.abs(i.y - this.player.y) <= 1
      ));
      if (mirror) {
        this.saveUndoSnapshot();
        mirror.mirrorAngle = ((mirror.mirrorAngle || 0) + 1) % 4;
        sounds.playSwitch();
        this.recomputeLaser();
        this.triggerParticles(mirror.x, mirror.y, '#f43f5e', 8);
        return true;
      }
    }

    // Maze 13: Echo Ghost replay
    if (this.maze.mechanicRule === 'echo_ghost') {
      if (this.echoRecording.length > 1 && !this.isEchoReplaying) {
        this.startEchoPlayback();
        sounds.playPortal();
        return true;
      }
    }

    // Maze 15: Magnetic Polarity flip
    if (this.maze.mechanicRule === 'magnetic_polarity') {
      this.saveUndoSnapshot();
      this.player.polarity = this.player.polarity === '+' ? '-' : '+';
      sounds.playSwitch();
      this.triggerParticles(this.player.x, this.player.y, this.player.polarity === '+' ? '#ec4899' : '#06b6d4', 12);
      this.checkMagneticAttraction();
      return true;
    }

    // Maze 17: Postage Stamp Fold/Flip
    if (this.maze.mechanicRule === 'origami_stamp') {
      const onPerf = this.items.some(i => i.type === 'stamp_perforation' && i.x === this.player.x && i.y === this.player.y);
      if (onPerf) {
        this.saveUndoSnapshot();
        this.player.stampSide = this.player.stampSide === 'front' ? 'back' : 'front';
        sounds.playSlide();
        this.screenShake = 3;
        this.triggerParticles(this.player.x, this.player.y, '#84cc16', 14);
        return true;
      }
    }

    // Maze 19: Teleport Beacon
    if (this.maze.mechanicRule === 'teleport_beacon') {
      this.saveUndoSnapshot();
      if (!this.beaconPos) {
        this.beaconPos = { x: this.player.x, y: this.player.y };
        sounds.playSwitch();
        this.triggerParticles(this.player.x, this.player.y, '#d946ef', 10);
      } else {
        const targetX = this.beaconPos.x;
        const targetY = this.beaconPos.y;
        this.beaconPos = null;
        this.player.x = targetX;
        this.player.y = targetY;
        sounds.playPortal();
        this.screenShake = 4;
        this.triggerParticles(targetX, targetY, '#d946ef', 18);
        this.checkCellEvents(targetX, targetY);
      }
      return true;
    }

    return false;
  }

  private executeStepMove(dir: Direction): boolean {
    const dx = dir === 'left' ? -1 : dir === 'right' ? 1 : 0;
    const dy = dir === 'up' ? -1 : dir === 'down' ? 1 : 0;

    const nextX = this.player.x + dx;
    const nextY = this.player.y + dy;

    // Check bounds
    if (nextX < 0 || nextX >= this.maze.width || nextY < 0 || nextY >= this.maze.height) {
      sounds.playBump();
      this.player.squashX = dx !== 0 ? 0.75 : 1.2;
      this.player.squashY = dy !== 0 ? 0.75 : 1.2;
      return false;
    }

    // Check One-way conveyor restriction on current cell
    const currentKey = `${this.player.x},${this.player.y}`;
    const currentCell = this.maze.cells?.[currentKey];
    if (currentCell) {
      if (currentCell === 'conveyor_up' && dir !== 'up') { sounds.playBump(); return false; }
      if (currentCell === 'conveyor_down' && dir !== 'down') { sounds.playBump(); return false; }
      if (currentCell === 'conveyor_left' && dir !== 'left') { sounds.playBump(); return false; }
      if (currentCell === 'conveyor_right' && dir !== 'right') { sounds.playBump(); return false; }
    }

    // Check walls (considering front / back faces for stamp maze)
    if (this.isWallAt(nextX, nextY)) {
      sounds.playBump();
      this.player.squashX = dx !== 0 ? 0.8 : 1.15;
      this.player.squashY = dy !== 0 ? 0.8 : 1.15;
      return false;
    }

    // Check lethal active laser line
    if (this.isLaserHazardAt(nextX, nextY)) {
      sounds.playBump();
      this.screenShake = 4;
      this.triggerParticles(nextX, nextY, '#f43f5e', 12);
      return false;
    }

    // Check gates & interactive obstacles
    const gateItem = this.items.find(i => i.x === nextX && i.y === nextY && (i.type === 'gate' || i.type === 'color_gate'));
    if (gateItem) {
      if (gateItem.type === 'color_gate') {
        if (!gateItem.isOpen) {
          sounds.playBump();
          return false;
        }
      } else if (gateItem.type === 'gate') {
        if (this.maze.mechanicRule === 'shrink') {
          if (!this.player.isShrunk) {
            sounds.playBump();
            return false;
          }
        } else if (!gateItem.isOpen) {
          sounds.playBump();
          return false;
        }
      }
    }

    // Check pushable block
    const block = this.items.find(i => i.x === nextX && i.y === nextY && i.type === 'block');
    if (block) {
      const blockNextX = nextX + dx;
      const blockNextY = nextY + dy;
      if (
        blockNextX < 0 || blockNextX >= this.maze.width ||
        blockNextY < 0 || blockNextY >= this.maze.height ||
        this.isWallAt(blockNextX, blockNextY) ||
        this.items.some(i => i.x === blockNextX && i.y === blockNextY && (i.type === 'block' || (i.type === 'gate' && !i.isOpen) || (i.type === 'color_gate' && !i.isOpen)))
      ) {
        sounds.playBump();
        return false;
      }

      this.saveUndoSnapshot();
      block.x = blockNextX;
      block.y = blockNextY;
      sounds.playSlide();
      this.triggerParticles(blockNextX, blockNextY, '#d97706', 8);

      this.checkPressurePlates();
    } else {
      this.saveUndoSnapshot();
    }

    // Handle crumbling floor on departure
    const prevKey = `${this.player.x},${this.player.y}`;
    if (this.maze.cells?.[prevKey] === 'crumble') {
      this.crumbledCells.add(prevKey);
      this.triggerParticles(this.player.x, this.player.y, '#eab308', 8);
    }

    // Target crumbled void check
    const nextKey = `${nextX},${nextY}`;
    if (this.crumbledCells.has(nextKey)) {
      sounds.playBump();
      return false;
    }

    // Move player
    this.player.x = nextX;
    this.player.y = nextY;
    this.player.squashX = dx !== 0 ? 1.25 : 0.85;
    this.player.squashY = dy !== 0 ? 1.25 : 0.85;
    this.moves++;
    this.onMovesChange?.(this.moves);
    sounds.playMove();

    // Shadow twin movement
    if (this.maze.shadowStart) {
      const sDx = -dx;
      const sDy = dy;
      const sNextX = this.shadowPlayer.x + sDx;
      const sNextY = this.shadowPlayer.y + sDy;
      if (
        sNextX >= 0 && sNextX < this.maze.width &&
        sNextY >= 0 && sNextY < this.maze.height &&
        !this.isWallAt(sNextX, sNextY)
      ) {
        this.shadowPlayer.x = sNextX;
        this.shadowPlayer.y = sNextY;
      }
    }

    // Record echo
    if (this.maze.mechanicRule === 'echo_ghost' && !this.isEchoReplaying) {
      this.echoRecording.push({ x: this.player.x, y: this.player.y });
    }

    this.checkCellEvents(nextX, nextY);
    return true;
  }

  private executeSlideMove(dir: Direction): boolean {
    const dx = dir === 'left' ? -1 : dir === 'right' ? 1 : 0;
    const dy = dir === 'up' ? -1 : dir === 'down' ? 1 : 0;

    let curX = this.player.x;
    let curY = this.player.y;
    let moved = false;

    this.saveUndoSnapshot();

    while (true) {
      const nX = curX + dx;
      const nY = curY + dy;
      if (
        nX < 0 || nX >= this.maze.width ||
        nY < 0 || nY >= this.maze.height ||
        this.isWallAt(nX, nY) ||
        this.items.some(i => i.x === nX && i.y === nY && (i.type === 'block' || (i.type === 'gate' && !i.isOpen) || (i.type === 'color_gate' && !i.isOpen)))
      ) {
        break;
      }
      curX = nX;
      curY = nY;
      moved = true;

      if (curX === this.maze.exit.x && curY === this.maze.exit.y) {
        break;
      }
    }

    if (!moved) {
      sounds.playBump();
      return false;
    }

    this.player.x = curX;
    this.player.y = curY;
    this.moves++;
    this.onMovesChange?.(this.moves);
    sounds.playSlide();
    this.screenShake = 2;
    this.triggerParticles(curX, curY, '#a855f7', 10);

    this.checkCellEvents(curX, curY);
    return true;
  }

  private isLaserHazardAt(x: number, y: number): boolean {
    const emitter = this.items.find(i => i.type === 'laser_emitter');
    const mirror = this.items.find(i => i.type === 'mirror');
    if (!emitter || !mirror) return false;

    // Laser travels horizontally from emitter to mirror
    if (emitter.y === y && x >= Math.min(emitter.x, mirror.x) && x <= Math.max(emitter.x, mirror.x)) {
      return true;
    }

    // If mirror deflecting up and receiver not reached, beam travels vertically
    if (mirror.mirrorAngle === 0 && x === mirror.x && y <= mirror.y) {
      return true;
    }

    return false;
  }

  private checkCellEvents(x: number, y: number) {
    const cellKey = `${x},${y}`;
    const cell = this.maze.cells?.[cellKey];

    // Ice slide continue sliding using lastMoveDir (BUG FIX: not render diff)
    if (cell === 'ice' && this.maze.mechanicRule === 'ice_slide') {
      const dx = this.lastMoveDir === 'left' ? -1 : this.lastMoveDir === 'right' ? 1 : 0;
      const dy = this.lastMoveDir === 'up' ? -1 : this.lastMoveDir === 'down' ? 1 : 0;
      const nextX = x + dx;
      const nextY = y + dy;
      if (
        nextX >= 0 && nextX < this.maze.width &&
        nextY >= 0 && nextY < this.maze.height &&
        !this.isWallAt(nextX, nextY)
      ) {
        this.iceSlideTimeoutId = window.setTimeout(() => {
          if (!this.isSolved) {
            this.player.x = nextX;
            this.player.y = nextY;
            sounds.playSlide();
            this.checkCellEvents(nextX, nextY);
          }
        }, 90);
      }
    }

    // Spring jump using lastMoveDir (BUG FIX: robust direction vectors)
    if (cell === 'spring') {
      const dx = this.lastMoveDir === 'left' ? -1 : this.lastMoveDir === 'right' ? 1 : 0;
      const dy = this.lastMoveDir === 'up' ? -1 : this.lastMoveDir === 'down' ? 1 : 0;
      const jumpX = x + dx * 2;
      const jumpY = y + dy * 2;
      if (jumpX >= 0 && jumpX < this.maze.width && jumpY >= 0 && jumpY < this.maze.height && !this.isWallAt(jumpX, jumpY)) {
        this.player.x = jumpX;
        this.player.y = jumpY;
        sounds.playSpring();
        this.screenShake = 3;
        this.triggerParticles(x, y, '#06b6d4', 12);
        this.triggerParticles(jumpX, jumpY, '#67e8f9', 14);
      }
    }

    // Pickups & Triggers
    for (const item of this.items) {
      if (item.x === x && item.y === y) {
        if (item.type === 'key' && !item.collected) {
          item.collected = true;
          const gate = this.items.find(i => i.type === 'gate');
          if (gate) gate.isOpen = true;
          sounds.playKeyPickup();
          this.hitstopTimer = 0.05;
          this.screenShake = 2;
          this.triggerParticles(x, y, '#f59e0b', 16);
        }

        if (item.type === 'shrink_gem' && !item.collected) {
          item.collected = true;
          this.player.isShrunk = true;
          sounds.playPortal();
          this.triggerParticles(x, y, '#e879f9', 16);
        }

        if (item.type === 'color_switch') {
          const targetColor = item.color || 'blue';
          for (const g of this.items.filter(i => i.type === 'color_gate')) {
            g.isOpen = g.color === targetColor;
          }
          sounds.playSwitch();
          this.screenShake = 2;
          this.triggerParticles(x, y, targetColor === 'blue' ? '#38bdf8' : '#f43f5e', 14);
        }

        if (item.type === 'portal' && item.pairId) {
          const partner = this.items.find(i => i.id === item.pairId);
          if (partner) {
            this.player.x = partner.x;
            this.player.y = partner.y;
            sounds.playPortal();
            this.screenShake = 3;
            this.triggerParticles(x, y, '#22d3ee', 12);
            this.triggerParticles(partner.x, partner.y, '#22d3ee', 16);
          }
        }

        if (item.type === 'gear_switch') {
          this.gearRotation = (this.gearRotation + 90) % 360;
          sounds.playGateUnlock();
          this.screenShake = 4;
          this.triggerParticles(x, y, '#f97316', 15);
        }

        if (item.type === 'circuit_node' && !item.isActive) {
          const activeCount = this.items.filter(i => i.type === 'circuit_node' && i.isActive).length;
          if (item.orderIndex === activeCount + 1) {
            item.isActive = true;
            sounds.playSwitch();
            this.triggerParticles(x, y, '#10b981', 12);
            const totalNodes = this.items.filter(i => i.type === 'circuit_node').length;
            if (activeCount + 1 === totalNodes) {
              const pcbGate = this.items.find(i => i.id === 'pcbGate');
              if (pcbGate) pcbGate.isOpen = true;
              sounds.playGateUnlock();
              this.screenShake = 3;
            }
          }
        }

        if (item.type === 'torch_brazier' && !item.isActive) {
          item.isActive = true;
          sounds.playKeyPickup();
          this.triggerParticles(x, y, '#fb923c', 18);
          const activeTorches = this.items.filter(i => i.type === 'torch_brazier' && i.isActive).length;
          const totalTorches = this.items.filter(i => i.type === 'torch_brazier').length;
          if (activeTorches >= totalTorches) {
            const shadowGate = this.items.find(i => i.id === 'shadowGate');
            if (shadowGate) shadowGate.isOpen = true;
            sounds.playGateUnlock();
          }
        }
      }
    }

    this.checkPressurePlates();
    this.checkVictoryCondition();
  }

  private checkPressurePlates() {
    for (const plate of this.items.filter(i => i.type === 'pressure_plate')) {
      const isPlayerOn = (this.player.x === plate.x && this.player.y === plate.y);
      const isShadowOn = this.maze.shadowStart && (this.shadowPlayer.x === plate.x && this.shadowPlayer.y === plate.y);
      const isBlockOn = this.items.some(i => i.type === 'block' && i.x === plate.x && i.y === plate.y);
      const isEchoOn = this.echoGhostPos && (this.echoGhostPos.x === plate.x && this.echoGhostPos.y === plate.y);

      const active = !!(isPlayerOn || isShadowOn || isBlockOn || isEchoOn);
      plate.isActive = active;

      if (plate.id === 'plate2') {
        const gate2 = this.items.find(i => i.id === 'gate2');
        if (gate2) gate2.isOpen = plate.isActive;
      }
      if (plate.id === 'doorTrigger') {
        const echoGate = this.items.find(i => i.id === 'echoGate');
        if (echoGate) echoGate.isOpen = plate.isActive;
      }
      if (plate.id === 'plateTrans') {
        const gateTrans = this.items.find(i => i.id === 'gateTrans');
        if (gateTrans) gateTrans.isOpen = plate.isActive;
      }
      if (plate.id === 'twinGoalA' || plate.id === 'twinGoalB') {
        const aActive = this.items.find(i => i.id === 'twinGoalA')?.isActive;
        const bActive = this.items.find(i => i.id === 'twinGoalB')?.isActive;
        const twinGate = this.items.find(i => i.id === 'twinGate');
        if (twinGate) twinGate.isOpen = !!(aActive && bActive);
      }
    }
  }

  private checkMagneticAttraction() {
    for (const peg of this.items.filter(i => i.type === 'magnet_peg')) {
      if (peg.polarity !== this.player.polarity) {
        if (peg.y === this.player.y && Math.abs(peg.x - this.player.x) <= 3) {
          // Check if intermediate walls exist
          const stepX = peg.x > this.player.x ? 1 : -1;
          let blocked = false;
          for (let tx = this.player.x + stepX; tx !== peg.x; tx += stepX) {
            if (this.isWallAt(tx, peg.y)) {
              blocked = true;
              break;
            }
          }
          if (!blocked) {
            const targetX = peg.x > this.player.x ? peg.x - 1 : peg.x + 1;
            this.player.x = targetX;
            sounds.playPortal();
            this.screenShake = 3;
            this.triggerParticles(targetX, peg.y, '#ec4899', 16);
            this.checkVictoryCondition();
            break;
          }
        }
      }
    }
  }

  private startEchoPlayback() {
    if (this.echoIntervalId !== null) clearInterval(this.echoIntervalId);
    this.isEchoReplaying = true;
    let step = 0;
    this.echoIntervalId = window.setInterval(() => {
      if (step < this.echoRecording.length) {
        this.echoGhostPos = this.echoRecording[step];
        this.checkPressurePlates();
        step++;
      } else {
        if (this.echoIntervalId !== null) {
          clearInterval(this.echoIntervalId);
          this.echoIntervalId = null;
        }
        this.isEchoReplaying = false;
        this.echoGhostPos = null;
        this.checkPressurePlates();
      }
    }, 200);
  }

  private recomputeLaser() {
    const emitter = this.items.find(i => i.type === 'laser_emitter');
    const receiver = this.items.find(i => i.type === 'laser_receiver');
    const mirror = this.items.find(i => i.type === 'mirror');
    const gate = this.items.find(i => i.id === 'gate_laser');

    if (!emitter || !receiver || !mirror) return;

    if (mirror.mirrorAngle === 0) {
      receiver.isActive = true;
      if (gate) gate.isOpen = true;
    } else {
      receiver.isActive = false;
      if (gate) gate.isOpen = false;
    }
  }

  private checkVictoryCondition() {
    if (this.isSolved) return;

    let reachedExit = false;

    if (this.maze.shadowStart) {
      if (
        (this.player.x === this.maze.exit.x && this.player.y === this.maze.exit.y) ||
        (this.items.find(i => i.id === 'twinGate')?.isOpen && this.player.x === 2 && this.player.y === 0)
      ) {
        reachedExit = true;
      }
    } else {
      if (this.player.x === this.maze.exit.x && this.player.y === this.maze.exit.y) {
        reachedExit = true;
      }
    }

    if (reachedExit) {
      this.isSolved = true;
      this.elapsedTime = (performance.now() - this.startTime) / 1000;
      sounds.playVictory();
      this.screenShake = 6;
      this.hitstopTimer = 0.08;
      this.triggerParticles(this.player.x, this.player.y, '#f59e0b', 35);
      this.triggerParticles(this.maze.exit.x, this.maze.exit.y, '#38bdf8', 35);

      setTimeout(() => {
        this.onVictory?.(this.moves, Math.round(this.elapsedTime));
      }, 700);
    }
  }

  private isWallAt(x: number, y: number): boolean {
    // If origami stamp on back face, use backWalls
    if (this.maze.mechanicRule === 'origami_stamp' && this.player.stampSide === 'back') {
      const isBackWall = (this.maze.backWalls || []).some(w => w.x === x && w.y === y);
      return isBackWall;
    }

    const staticWall = this.maze.walls.some(w => w.x === x && w.y === y);
    if (staticWall) return true;

    // Clockwork gear rotation
    if (this.maze.mechanicRule === 'clockwork_gear') {
      if (this.gearRotation === 0 || this.gearRotation === 180) {
        if ((x === 2 && y === 1) || (x === 2 && y === 3)) return true;
      } else {
        if ((x === 1 && y === 2) || (x === 3 && y === 2)) return true;
      }
    }

    return false;
  }

  private triggerParticles(gridX: number, gridY: number, color: string, count: number) {
    const cellSize = this.getCellSize();
    const offset = this.getGridOffset(cellSize);
    const centerX = offset.x + (gridX + 0.5) * cellSize;
    const centerY = offset.y + (gridY + 0.5) * cellSize;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 40 + Math.random() * 120;
      this.particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 0.4 + Math.random() * 0.4,
        color,
        size: 2 + Math.random() * 4,
        shape: Math.random() > 0.5 ? 'spark' : 'circle'
      });
    }
  }

  // --- Rendering Loop ---
  private loop = (time: number) => {
    if (!this.isRunning) return;

    const rawDt = (time - this.lastTime) / 1000;
    this.lastTime = time;
    const dt = Math.min(rawDt, 0.05);

    this.update(dt);
    this.render();

    this.animFrameId = requestAnimationFrame(this.loop);
  };

  private update(dt: number) {
    if (this.hitstopTimer > 0) {
      this.hitstopTimer -= dt;
      return;
    }

    const lerpSpeed = 16 * dt;
    this.player.renderX += (this.player.x - this.player.renderX) * Math.min(1, lerpSpeed);
    this.player.renderY += (this.player.y - this.player.renderY) * Math.min(1, lerpSpeed);

    this.player.squashX += (1 - this.player.squashX) * Math.min(1, 10 * dt);
    this.player.squashY += (1 - this.player.squashY) * Math.min(1, 10 * dt);

    if (this.maze.shadowStart) {
      this.shadowPlayer.renderX += (this.shadowPlayer.x - this.shadowPlayer.renderX) * Math.min(1, lerpSpeed);
      this.shadowPlayer.renderY += (this.shadowPlayer.y - this.shadowPlayer.renderY) * Math.min(1, lerpSpeed);
      this.shadowPlayer.squashX += (1 - this.shadowPlayer.squashX) * Math.min(1, 10 * dt);
      this.shadowPlayer.squashY += (1 - this.shadowPlayer.squashY) * Math.min(1, 10 * dt);
    }

    if (this.screenShake > 0) {
      this.screenShake = Math.max(0, this.screenShake - 12 * dt);
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life += dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= 0.94;
      p.vy *= 0.94;
      if (p.life >= p.maxLife) {
        this.particles.splice(i, 1);
      }
    }
  }

  private getCellSize(): number {
    const margin = 70;
    const availableW = this.canvas.width - margin * 2;
    const availableH = this.canvas.height - margin * 2;
    const sizeByW = availableW / this.maze.width;
    const sizeByH = availableH / this.maze.height;
    return Math.floor(Math.min(sizeByW, sizeByH, 95));
  }

  private getGridOffset(cellSize: number): Position {
    const totalW = this.maze.width * cellSize;
    const totalH = this.maze.height * cellSize;
    return {
      x: Math.floor((this.canvas.width - totalW) / 2),
      y: Math.floor((this.canvas.height - totalH) / 2)
    };
  }

  private render() {
    const { width, height } = this.canvas;
    const ctx = this.ctx;

    ctx.save();
    ctx.clearRect(0, 0, width, height);

    if (this.screenShake > 0) {
      const shakeX = (Math.random() - 0.5) * this.screenShake * 3;
      const shakeY = (Math.random() - 0.5) * this.screenShake * 3;
      ctx.translate(shakeX, shakeY);
    }

    const cellSize = this.getCellSize();
    const offset = this.getGridOffset(cellSize);

    // Diorama board backing
    const boardPadding = 18;
    const boardX = offset.x - boardPadding;
    const boardY = offset.y - boardPadding;
    const boardW = this.maze.width * cellSize + boardPadding * 2;
    const boardH = this.maze.height * cellSize + boardPadding * 2;

    // Board shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.roundRect(boardX + 6, boardY + 12, boardW, boardH, 20);
    ctx.fill();

    // Board container
    ctx.fillStyle = this.maze.theme.bg;
    ctx.strokeStyle = this.maze.theme.gridLine || '#334155';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(boardX, boardY, boardW, boardH, 16);
    ctx.fill();
    ctx.stroke();

    // Stamp face watermark for origami stamp
    if (this.maze.mechanicRule === 'origami_stamp') {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.font = 'bold 18px sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'top';
      ctx.fillText(this.player.stampSide === 'front' ? 'SIDE A (FRONT)' : 'SIDE B (BACK)', boardX + boardW - 12, boardY + 8);
    }

    // Floor cells
    for (let gy = 0; gy < this.maze.height; gy++) {
      for (let gx = 0; gx < this.maze.width; gx++) {
        const cellX = offset.x + gx * cellSize;
        const cellY = offset.y + gy * cellSize;
        const cellKey = `${gx},${gy}`;
        const specialCell = this.maze.cells?.[cellKey];

        ctx.fillStyle = this.maze.theme.floor;
        ctx.fillRect(cellX, cellY, cellSize, cellSize);

        ctx.strokeStyle = this.maze.theme.gridLine || 'rgba(255,255,255,0.06)';
        ctx.lineWidth = 1;
        ctx.strokeRect(cellX, cellY, cellSize, cellSize);

        if (specialCell === 'ice') {
          ctx.fillStyle = 'rgba(56, 189, 248, 0.22)';
          ctx.fillRect(cellX + 2, cellY + 2, cellSize - 4, cellSize - 4);
          ctx.strokeStyle = 'rgba(125, 211, 252, 0.4)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(cellX + 6, cellY + cellSize - 8);
          ctx.lineTo(cellX + cellSize - 8, cellY + 6);
          ctx.stroke();
        } else if (specialCell === 'crumble') {
          if (this.crumbledCells.has(cellKey)) {
            ctx.fillStyle = '#090a0f';
            ctx.fillRect(cellX + 1, cellY + 1, cellSize - 2, cellSize - 2);
          } else {
            ctx.fillStyle = '#423828';
            ctx.fillRect(cellX + 2, cellY + 2, cellSize - 4, cellSize - 4);
            ctx.strokeStyle = '#eab308';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(cellX + 8, cellY + 8);
            ctx.lineTo(cellX + cellSize / 2, cellY + cellSize / 2);
            ctx.lineTo(cellX + cellSize - 8, cellY + cellSize - 6);
            ctx.stroke();
          }
        } else if (specialCell === 'spring') {
          ctx.fillStyle = 'rgba(6, 182, 212, 0.18)';
          ctx.fillRect(cellX + 2, cellY + 2, cellSize - 4, cellSize - 4);
          ctx.strokeStyle = '#06b6d4';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(cellX + cellSize / 2, cellY + cellSize / 2, cellSize * 0.28, 0, Math.PI * 3);
          ctx.stroke();
        } else if (specialCell === 'spike') {
          ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
          ctx.fillRect(cellX + 2, cellY + 2, cellSize - 4, cellSize - 4);
          ctx.fillStyle = '#ef4444';
          const midX = cellX + cellSize / 2;
          const midY = cellY + cellSize / 2;
          ctx.beginPath();
          ctx.moveTo(midX, midY - 10);
          ctx.lineTo(midX - 8, midY + 8);
          ctx.lineTo(midX + 8, midY + 8);
          ctx.closePath();
          ctx.fill();
        } else if (specialCell && specialCell.startsWith('conveyor_')) {
          ctx.fillStyle = 'rgba(34, 197, 94, 0.16)';
          ctx.fillRect(cellX + 2, cellY + 2, cellSize - 4, cellSize - 4);
          ctx.strokeStyle = '#22c55e';
          ctx.lineWidth = 2.5;
          const cx = cellX + cellSize / 2;
          const cy = cellY + cellSize / 2;
          ctx.beginPath();
          if (specialCell === 'conveyor_up') {
            ctx.moveTo(cx, cy + 8); ctx.lineTo(cx, cy - 8);
            ctx.lineTo(cx - 5, cy - 3); ctx.moveTo(cx, cy - 8); ctx.lineTo(cx + 5, cy - 3);
          } else if (specialCell === 'conveyor_down') {
            ctx.moveTo(cx, cy - 8); ctx.lineTo(cx, cy + 8);
            ctx.lineTo(cx - 5, cy + 3); ctx.moveTo(cx, cy + 8); ctx.lineTo(cx + 5, cy + 3);
          } else if (specialCell === 'conveyor_left') {
            ctx.moveTo(cx + 8, cy); ctx.lineTo(cx - 8, cy);
            ctx.lineTo(cx - 3, cy - 5); ctx.moveTo(cx - 8, cy); ctx.lineTo(cx - 3, cy + 5);
          } else if (specialCell === 'conveyor_right') {
            ctx.moveTo(cx - 8, cy); ctx.lineTo(cx + 8, cy);
            ctx.lineTo(cx + 3, cy - 5); ctx.moveTo(cx + 8, cy); ctx.lineTo(cx + 3, cy + 5);
          }
          ctx.stroke();
        }
      }
    }

    // Exit Goal
    const exitX = offset.x + this.maze.exit.x * cellSize;
    const exitY = offset.y + this.maze.exit.y * cellSize;
    ctx.fillStyle = 'rgba(245, 158, 11, 0.25)';
    ctx.beginPath();
    ctx.arc(exitX + cellSize / 2, exitY + cellSize / 2, cellSize * 0.38, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = this.maze.theme.accent;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = this.maze.theme.glow;
    ctx.beginPath();
    ctx.arc(exitX + cellSize / 2, exitY + cellSize / 2, cellSize * 0.18, 0, Math.PI * 2);
    ctx.fill();

    // Walls
    const activeWalls = (this.maze.mechanicRule === 'origami_stamp' && this.player.stampSide === 'back')
      ? (this.maze.backWalls || [])
      : this.maze.walls;

    for (const wall of activeWalls) {
      const wx = offset.x + wall.x * cellSize;
      const wy = offset.y + wall.y * cellSize;
      ctx.fillStyle = this.maze.theme.wall;
      ctx.beginPath();
      ctx.roundRect(wx + 2, wy + 2, cellSize - 4, cellSize - 4, 6);
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // Clockwork gear
    if (this.maze.mechanicRule === 'clockwork_gear') {
      const gcx = offset.x + 2.5 * cellSize;
      const gcy = offset.y + 2.5 * cellSize;
      ctx.save();
      ctx.translate(gcx, gcy);
      ctx.rotate((this.gearRotation * Math.PI) / 180);
      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, cellSize * 1.1, 0, Math.PI * 2);
      ctx.stroke();
      for (let s = 0; s < 4; s++) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(s * Math.PI / 2) * cellSize * 1.1, Math.sin(s * Math.PI / 2) * cellSize * 1.1);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Items
    for (const item of this.items) {
      const ix = offset.x + item.x * cellSize;
      const iy = offset.y + item.y * cellSize;
      const icx = ix + cellSize / 2;
      const icy = iy + cellSize / 2;

      if (item.type === 'key' && !item.collected) {
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(icx - 4, icy - 4, cellSize * 0.16, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(icx - 2, icy - 4, cellSize * 0.32, 4);
        ctx.fillRect(icx + 6, icy - 4, 3, 7);
      } else if (item.type === 'gate') {
        if (!item.isOpen) {
          ctx.fillStyle = '#64748b';
          ctx.fillRect(ix + 4, iy + 4, cellSize - 8, cellSize - 8);
          ctx.strokeStyle = '#cbd5e1';
          ctx.lineWidth = 2;
          for (let b = 1; b <= 3; b++) {
            ctx.beginPath();
            ctx.moveTo(ix + b * (cellSize / 4), iy + 6);
            ctx.lineTo(ix + b * (cellSize / 4), iy + cellSize - 6);
            ctx.stroke();
          }
        } else {
          ctx.strokeStyle = 'rgba(100, 116, 139, 0.4)';
          ctx.lineWidth = 1;
          ctx.strokeRect(ix + 6, iy + 6, cellSize - 12, cellSize - 12);
        }
      } else if (item.type === 'color_gate') {
        const colorHex = item.color === 'blue' ? '#38bdf8' : '#f43f5e';
        if (!item.isOpen) {
          ctx.fillStyle = colorHex;
          ctx.beginPath();
          ctx.roundRect(ix + 4, iy + 4, cellSize - 8, cellSize - 8, 4);
          ctx.fill();
        } else {
          ctx.strokeStyle = colorHex;
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 4]);
          ctx.strokeRect(ix + 6, iy + 6, cellSize - 12, cellSize - 12);
          ctx.setLineDash([]);
        }
      } else if (item.type === 'color_switch') {
        const colorHex = item.color === 'blue' ? '#38bdf8' : '#f43f5e';
        ctx.fillStyle = colorHex;
        ctx.beginPath();
        ctx.arc(icx, icy, cellSize * 0.25, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
      } else if (item.type === 'pressure_plate') {
        ctx.fillStyle = item.isActive ? '#10b981' : '#475569';
        ctx.beginPath();
        ctx.roundRect(ix + 6, iy + 6, cellSize - 12, cellSize - 12, 6);
        ctx.fill();
        ctx.strokeStyle = item.isActive ? '#34d399' : '#94a3b8';
        ctx.lineWidth = 2;
        ctx.stroke();
      } else if (item.type === 'block') {
        ctx.fillStyle = '#b45309';
        ctx.beginPath();
        ctx.roundRect(ix + 5, iy + 5, cellSize - 10, cellSize - 10, 6);
        ctx.fill();
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(ix + 8, iy + 8);
        ctx.lineTo(ix + cellSize - 8, iy + cellSize - 8);
        ctx.moveTo(ix + cellSize - 8, iy + 8);
        ctx.lineTo(ix + 8, iy + cellSize - 8);
        ctx.stroke();
      } else if (item.type === 'portal') {
        const portalColor = item.color === 'red' ? '#f97316' : '#06b6d4';
        ctx.strokeStyle = portalColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(icx, icy, cellSize * 0.32, cellSize * 0.18, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = portalColor;
        ctx.beginPath();
        ctx.arc(icx, icy, cellSize * 0.1, 0, Math.PI * 2);
        ctx.fill();
      } else if (item.type === 'shrink_gem' && !item.collected) {
        ctx.fillStyle = '#e879f9';
        ctx.beginPath();
        ctx.moveTo(icx, icy - cellSize * 0.25);
        ctx.lineTo(icx + cellSize * 0.2, icy);
        ctx.lineTo(icx, icy + cellSize * 0.25);
        ctx.lineTo(icx - cellSize * 0.2, icy);
        ctx.closePath();
        ctx.fill();
      } else if (item.type === 'laser_emitter') {
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(ix + 4, icy - 6, cellSize * 0.4, 12);
      } else if (item.type === 'laser_receiver') {
        ctx.fillStyle = item.isActive ? '#22c55e' : '#991b1b';
        ctx.beginPath();
        ctx.arc(icx, icy, cellSize * 0.28, 0, Math.PI * 2);
        ctx.fill();
      } else if (item.type === 'mirror') {
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.arc(icx, icy, cellSize * 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        const angle = ((item.mirrorAngle || 0) * Math.PI) / 2;
        ctx.beginPath();
        ctx.moveTo(icx - Math.cos(angle) * cellSize * 0.24, icy - Math.sin(angle) * cellSize * 0.24);
        ctx.lineTo(icx + Math.cos(angle) * cellSize * 0.24, icy + Math.sin(angle) * cellSize * 0.24);
        ctx.stroke();
      } else if (item.type === 'circuit_node') {
        ctx.fillStyle = item.isActive ? '#10b981' : '#047857';
        ctx.beginPath();
        ctx.arc(icx, icy, cellSize * 0.28, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(item.orderIndex || 1), icx, icy);
      } else if (item.type === 'magnet_peg') {
        ctx.fillStyle = item.polarity === '+' ? '#ec4899' : '#06b6d4';
        ctx.beginPath();
        ctx.arc(icx, icy, cellSize * 0.26, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.polarity || '+', icx, icy);
      } else if (item.type === 'torch_brazier') {
        ctx.fillStyle = item.isActive ? '#f59e0b' : '#334155';
        ctx.beginPath();
        ctx.arc(icx, icy, cellSize * 0.24, 0, Math.PI * 2);
        ctx.fill();
        if (item.isActive) {
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      } else if (item.type === 'stamp_perforation') {
        ctx.strokeStyle = '#84cc16';
        ctx.lineWidth = 2;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(ix, icy);
        ctx.lineTo(ix + cellSize, icy);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // Laser Beam rendering
    if (this.maze.mechanicRule === 'laser_mirror') {
      const mirror = this.items.find(i => i.type === 'mirror');
      const receiver = this.items.find(i => i.type === 'laser_receiver');
      const emitter = this.items.find(i => i.type === 'laser_emitter');
      if (emitter && mirror) {
        const emitX = offset.x + (emitter.x + 0.5) * cellSize;
        const emitY = offset.y + (emitter.y + 0.5) * cellSize;
        const mirX = offset.x + (mirror.x + 0.5) * cellSize;
        const mirY = offset.y + (mirror.y + 0.5) * cellSize;

        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(emitX, emitY);
        ctx.lineTo(mirX, mirY);
        if (mirror.mirrorAngle === 0 && receiver) {
          const recX = offset.x + (receiver.x + 0.5) * cellSize;
          const recY = offset.y + (receiver.y + 0.5) * cellSize;
          ctx.lineTo(recX, recY);
        }
        ctx.stroke();
      }
    }

    // Teleport Beacon
    if (this.beaconPos) {
      const bx = offset.x + (this.beaconPos.x + 0.5) * cellSize;
      const by = offset.y + (this.beaconPos.y + 0.5) * cellSize;
      ctx.strokeStyle = '#d946ef';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(bx, by, cellSize * 0.28, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#e879f9';
      ctx.beginPath();
      ctx.arc(bx, by, cellSize * 0.12, 0, Math.PI * 2);
      ctx.fill();
    }

    // Echo Ghost
    if (this.echoGhostPos) {
      const egx = offset.x + (this.echoGhostPos.x + 0.5) * cellSize;
      const egy = offset.y + (this.echoGhostPos.y + 0.5) * cellSize;
      ctx.fillStyle = 'rgba(45, 212, 191, 0.45)';
      ctx.beginPath();
      ctx.arc(egx, egy, cellSize * 0.32, 0, Math.PI * 2);
      ctx.fill();
    }

    // Shadow Twin
    if (this.maze.shadowStart) {
      const spx = offset.x + (this.shadowPlayer.renderX + 0.5) * cellSize;
      const spy = offset.y + (this.shadowPlayer.renderY + 0.5) * cellSize;
      ctx.save();
      ctx.translate(spx, spy);
      ctx.scale(this.shadowPlayer.squashX, this.shadowPlayer.squashY);
      ctx.fillStyle = '#7c3aed';
      ctx.beginPath();
      ctx.arc(0, 0, cellSize * 0.34, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.restore();
    }

    // Player
    const px = offset.x + (this.player.renderX + 0.5) * cellSize;
    const py = offset.y + (this.player.renderY + 0.5) * cellSize;
    const baseRadius = (this.player.isShrunk ? 0.2 : 0.34) * cellSize;

    ctx.save();
    ctx.translate(px, py);
    ctx.scale(this.player.squashX, this.player.squashY);

    ctx.fillStyle = 'rgba(245, 158, 11, 0.3)';
    ctx.beginPath();
    ctx.arc(0, 0, baseRadius * 1.35, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = this.maze.theme.accent;
    ctx.beginPath();
    ctx.arc(0, 0, baseRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-baseRadius * 0.3, -baseRadius * 0.3, baseRadius * 0.3, 0, Math.PI * 2);
    ctx.fill();

    if (this.maze.mechanicRule === 'magnetic_polarity') {
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.player.polarity || '+', 0, 0);
    }

    ctx.restore();

    // Fog of war
    if (this.maze.mechanicRule === 'fog_lantern') {
      const activeTorches = this.items.filter(i => i.type === 'torch_brazier' && i.isActive).length;
      const totalTorches = this.items.filter(i => i.type === 'torch_brazier').length;
      if (activeTorches < totalTorches) {
        ctx.save();
        const lightGrad = ctx.createRadialGradient(px, py, cellSize * 0.3, px, py, cellSize * 2.2);
        lightGrad.addColorStop(0, 'rgba(0,0,0,0)');
        lightGrad.addColorStop(0.7, 'rgba(10,12,16,0.85)');
        lightGrad.addColorStop(1, 'rgba(10,12,16,0.98)');

        ctx.fillStyle = lightGrad;
        ctx.fillRect(boardX, boardY, boardW, boardH);
        ctx.restore();
      }
    }

    // Particles
    for (const p of this.particles) {
      const alpha = 1 - p.life / p.maxLife;
      ctx.save();
      ctx.globalAlpha = Math.max(0, alpha);
      ctx.fillStyle = p.color;
      if (p.shape === 'spark') {
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    ctx.restore();
  }
}
