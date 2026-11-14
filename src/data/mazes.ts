import { MazeConfig } from '../types/game';

export const MAZES: MazeConfig[] = [
  // ==========================================
  // TIER 1: FÁCIL (EASY) - MAZES 1 TO 8
  // ==========================================

  // 01: The Brass Key
  {
    id: 1,
    difficulty: 'easy',
    titleEn: 'The Brass Key',
    titlePt: 'A Chave de Latão',
    subtitleEn: 'A timeless mechanical start',
    subtitlePt: 'Um início mecânico atemporal',
    taglineEn: 'Find the key. Unlock the door.',
    taglinePt: 'Encontre a chave. Abra a porta.',
    hintEn: 'Walk to the golden key in the bottom-left before approaching the barred gate.',
    hintPt: 'Vá até a chave dourada no canto inferior esquerdo antes de se aproximar do portão.',
    width: 4,
    height: 4,
    parMoves: 8,
    theme: {
      bg: '#181b20',
      floor: '#232832',
      wall: '#384252',
      accent: '#f59e0b',
      glow: '#fbbf24',
      gridLine: '#2e3544'
    },
    start: { x: 0, y: 0 },
    exit: { x: 3, y: 3 },
    walls: [
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 2 }
    ],
    items: [
      { id: 'key1', type: 'key', x: 0, y: 3 },
      { id: 'gate1', type: 'gate', x: 2, y: 1, isOpen: false }
    ],
    mechanicRule: 'standard'
  },

  // 02: Heavy Crate
  {
    id: 2,
    difficulty: 'easy',
    titleEn: 'Heavy Crate',
    titlePt: 'Caixote Pesado',
    subtitleEn: 'Weight matters',
    subtitlePt: 'O peso importa',
    taglineEn: 'Push the block onto the pressure sensor.',
    taglinePt: 'Empurre o caixote sobre a placa de pressão.',
    hintEn: 'Position yourself behind the wooden block and shove it onto the diamond plate.',
    hintPt: 'Fique atrás do bloco e empurre-o até a placa com losango.',
    width: 5,
    height: 5,
    parMoves: 9,
    theme: {
      bg: '#1a1815',
      floor: '#292521',
      wall: '#4a4036',
      accent: '#d97706',
      glow: '#f59e0b',
      gridLine: '#332d26'
    },
    start: { x: 0, y: 0 },
    exit: { x: 4, y: 4 },
    walls: [
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 3, y: 3 },
      { x: 3, y: 4 },
      { x: 1, y: 4 }
    ],
    items: [
      { id: 'block2', type: 'block', x: 2, y: 1 },
      { id: 'plate2', type: 'pressure_plate', x: 2, y: 3, isActive: false },
      { id: 'gate2', type: 'gate', x: 4, y: 2, isOpen: false }
    ],
    mechanicRule: 'block_push'
  },

  // 03: Color Shift
  {
    id: 3,
    difficulty: 'easy',
    titleEn: 'Color Shift',
    titlePt: 'Troca de Cores',
    subtitleEn: 'Frequency modulated pathways',
    subtitlePt: 'Caminhos modulados por frequência',
    taglineEn: 'Red and Blue gates alternate state.',
    taglinePt: 'Portões Vermelhos e Azuis alternam o estado.',
    hintEn: 'Step on the color switch to swap which gates are lowered.',
    hintPt: 'Pise no botão colorido para inverter quais portões estão abertos.',
    width: 5,
    height: 5,
    parMoves: 10,
    theme: {
      bg: '#141724',
      floor: '#1d2235',
      wall: '#333b59',
      accent: '#38bdf8',
      glow: '#818cf8',
      gridLine: '#262d45'
    },
    start: { x: 0, y: 2 },
    exit: { x: 4, y: 2 },
    walls: [
      { x: 2, y: 0 },
      { x: 2, y: 4 }
    ],
    items: [
      { id: 'sw1', type: 'color_switch', x: 1, y: 0, color: 'blue' },
      { id: 'sw2', type: 'color_switch', x: 3, y: 4, color: 'red' },
      { id: 'g_red1', type: 'color_gate', x: 2, y: 1, color: 'red', isOpen: true },
      { id: 'g_blue1', type: 'color_gate', x: 2, y: 2, color: 'blue', isOpen: false },
      { id: 'g_red2', type: 'color_gate', x: 2, y: 3, color: 'red', isOpen: true }
    ],
    mechanicRule: 'color_flip'
  },

  // 04: Zero Gravity
  {
    id: 4,
    difficulty: 'easy',
    titleEn: 'Zero Gravity',
    titlePt: 'Gravidade Zero',
    subtitleEn: 'Inertia takes command',
    subtitlePt: 'A inércia assume o comando',
    taglineEn: 'Slide continuously until hitting a solid barrier.',
    taglinePt: 'Deslize continuamente até atingir uma barreira.',
    hintEn: 'You cannot stop mid-stride. Plan your collision bounce points to reach the exit.',
    hintPt: 'Você não pode parar no meio do caminho. Planeje os pontos de colisão para chegar à saída.',
    width: 5,
    height: 5,
    parMoves: 6,
    theme: {
      bg: '#111827',
      floor: '#1f2937',
      wall: '#374151',
      accent: '#a855f7',
      glow: '#c084fc',
      gridLine: '#283344'
    },
    start: { x: 0, y: 0 },
    exit: { x: 4, y: 4 },
    walls: [
      { x: 1, y: 2 },
      { x: 3, y: 1 },
      { x: 2, y: 4 },
      { x: 3, y: 3 }
    ],
    items: [],
    mechanicRule: 'gravity_tilt'
  },

  // 05: One-Way Alleys
  {
    id: 5,
    difficulty: 'easy',
    titleEn: 'One-Way Alleys',
    titlePt: 'Ruas de Mão Única',
    subtitleEn: 'Strict vector flow',
    subtitlePt: 'Fluxo estrito de vetores',
    taglineEn: 'Arrows permit passage in one direction only.',
    taglinePt: 'Setas permitem passagem apenas na direção indicada.',
    hintEn: 'Carefully follow the permitted traffic arrows to avoid dead ends.',
    hintPt: 'Siga com atenção as setas de tráfego permitido para não ficar preso.',
    width: 5,
    height: 5,
    parMoves: 11,
    theme: {
      bg: '#171e19',
      floor: '#212c24',
      wall: '#3a4e40',
      accent: '#22c55e',
      glow: '#4ade80',
      gridLine: '#2b3930'
    },
    start: { x: 0, y: 0 },
    exit: { x: 4, y: 4 },
    walls: [
      { x: 1, y: 1 },
      { x: 3, y: 1 },
      { x: 1, y: 3 },
      { x: 3, y: 3 }
    ],
    cells: {
      '1,0': 'conveyor_right',
      '2,0': 'conveyor_right',
      '3,0': 'conveyor_down',
      '3,2': 'conveyor_down',
      '2,2': 'conveyor_left',
      '1,2': 'conveyor_down',
      '1,4': 'conveyor_right',
      '2,4': 'conveyor_right'
    },
    mechanicRule: 'conveyor'
  },

  // 06: Nanoscale
  {
    id: 6,
    difficulty: 'easy',
    titleEn: 'Nanoscale',
    titlePt: 'Nanoescala',
    subtitleEn: 'Subatomic compression',
    subtitlePt: 'Compressão subatômica',
    taglineEn: 'Grab the purple prism to compress into half size.',
    taglinePt: 'Pegue o prisma roxo para comprimir ao tamanho reduzido.',
    hintEn: 'Collect the shrink gem to pass through the narrow micro-slits.',
    hintPt: 'Colete a gema de encolhimento para passar pelas frestas estreitas.',
    width: 5,
    height: 5,
    parMoves: 10,
    theme: {
      bg: '#1c1524',
      floor: '#2a1f36',
      wall: '#4a3660',
      accent: '#e879f9',
      glow: '#f0abfc',
      gridLine: '#352745'
    },
    start: { x: 0, y: 2 },
    exit: { x: 4, y: 2 },
    walls: [
      { x: 2, y: 0 },
      { x: 2, y: 1 },
      { x: 2, y: 3 },
      { x: 2, y: 4 }
    ],
    items: [
      { id: 'shrink1', type: 'shrink_gem', x: 1, y: 0 },
      { id: 'gate_narrow', type: 'gate', x: 2, y: 2, isOpen: false }
    ],
    mechanicRule: 'shrink'
  },

  // 07: Wormhole Pair
  {
    id: 7,
    difficulty: 'easy',
    titleEn: 'Wormhole Pair',
    titlePt: 'Par de Buracos de Minhoca',
    subtitleEn: 'Folded Euclidean space',
    subtitlePt: 'Espaço euclidiano dobrado',
    taglineEn: 'Step into Orange to emerge from Cyan.',
    taglinePt: 'Entre no Laranja para emergir no Ciano.',
    hintEn: 'Portals bypass impassable walls. Use them to cross the barrier.',
    hintPt: 'Portais atravessam paredes intransponíveis. Use-os para cruzar.',
    width: 5,
    height: 5,
    parMoves: 8,
    theme: {
      bg: '#161924',
      floor: '#212638',
      wall: '#38415f',
      accent: '#06b6d4',
      glow: '#22d3ee',
      gridLine: '#2b324a'
    },
    start: { x: 0, y: 0 },
    exit: { x: 4, y: 4 },
    walls: [
      { x: 2, y: 0 },
      { x: 2, y: 1 },
      { x: 2, y: 2 },
      { x: 2, y: 3 },
      { x: 2, y: 4 }
    ],
    items: [
      { id: 'portalA', type: 'portal', x: 1, y: 2, color: 'red', pairId: 'portalB' },
      { id: 'portalB', type: 'portal', x: 3, y: 2, color: 'blue', pairId: 'portalA' }
    ],
    mechanicRule: 'portal'
  },

  // 08: Pinball Springs
  {
    id: 8,
    difficulty: 'easy',
    titleEn: 'Pinball Springs',
    titlePt: 'Molas de Pinball',
    subtitleEn: 'High elasticity launchpads',
    subtitlePt: 'Plataformas de alta elasticidade',
    taglineEn: 'Spiral springs launch you 2 tiles over deadly spikes.',
    taglinePt: 'Molas espirais lançam você 2 blocos sobre espinhos mortais.',
    hintEn: 'Step onto the spiral trampolines to vault cleanly across the spike hazards.',
    hintPt: 'Pise nos trampolins em espiral para saltar com segurança por cima dos espinhos.',
    width: 6,
    height: 5,
    parMoves: 8,
    theme: {
      bg: '#161d1e',
      floor: '#202a2c',
      wall: '#3a4c4f',
      accent: '#06b6d4',
      glow: '#67e8f9',
      gridLine: '#293739'
    },
    start: { x: 0, y: 2 },
    exit: { x: 5, y: 2 },
    walls: [
      { x: 1, y: 0 },
      { x: 1, y: 4 },
      { x: 4, y: 0 },
      { x: 4, y: 4 }
    ],
    cells: {
      '1,2': 'spring',
      '2,2': 'spike',
      '3,2': 'floor',
      '4,2': 'spring'
    },
    mechanicRule: 'spring_jump'
  },

  // ==========================================
  // TIER 2: MÉDIO (MEDIUM) - MAZES 9 TO 16
  // ==========================================

  // 09: Frozen Lake
  {
    id: 9,
    difficulty: 'medium',
    titleEn: 'Frozen Lake',
    titlePt: 'Lago Congelado',
    subtitleEn: 'Zero friction ice sheets',
    subtitlePt: 'Placas de gelo sem atrito',
    taglineEn: 'Once you slide onto ice, you slide until land.',
    taglinePt: 'Ao entrar no gelo, você desliza até tocar em solo firme.',
    hintEn: 'Position yourself on solid tiles to line up slides between pillars.',
    hintPt: 'Posicione-se em blocos firmes para alinhar deslizes entre pilares.',
    width: 6,
    height: 5,
    parMoves: 7,
    theme: {
      bg: '#111e28',
      floor: '#1b2f3f',
      wall: '#345772',
      accent: '#38bdf8',
      glow: '#7dd3fc',
      gridLine: '#243e54'
    },
    start: { x: 0, y: 2 },
    exit: { x: 5, y: 2 },
    walls: [
      { x: 2, y: 1 },
      { x: 3, y: 3 },
      { x: 4, y: 0 },
      { x: 4, y: 4 }
    ],
    cells: {
      '1,1': 'ice', '1,2': 'ice', '1,3': 'ice',
      '2,2': 'ice', '2,3': 'ice',
      '3,1': 'ice', '3,2': 'ice',
      '4,1': 'ice', '4,2': 'ice', '4,3': 'ice'
    },
    mechanicRule: 'ice_slide'
  },

  // 10: Prism & Laser
  {
    id: 10,
    difficulty: 'medium',
    titleEn: 'Prism & Laser',
    titlePt: 'Prisma e Laser',
    subtitleEn: 'Optical deflection array',
    subtitlePt: 'Arranjo de deflexão óptica',
    taglineEn: 'Press Space to rotate the mirror and redirect the beam.',
    taglinePt: 'Pressione Espaço para girar o espelho e redirecionar o feixe.',
    hintEn: 'Rotate the angled mirror prism so the red laser hits the sensor receiver.',
    hintPt: 'Gire o prisma de espelho para que o laser vermelho atinja o sensor.',
    width: 5,
    height: 5,
    parMoves: 8,
    theme: {
      bg: '#1f1618',
      floor: '#2e2024',
      wall: '#52383f',
      accent: '#f43f5e',
      glow: '#fb7185',
      gridLine: '#3d2b30'
    },
    start: { x: 0, y: 4 },
    exit: { x: 4, y: 0 },
    walls: [
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 3, y: 3 },
      { x: 3, y: 4 }
    ],
    items: [
      { id: 'emitter', type: 'laser_emitter', x: 0, y: 2, laserDir: 'right' },
      { id: 'mirror1', type: 'mirror', x: 2, y: 2, mirrorAngle: 0 },
      { id: 'receiver', type: 'laser_receiver', x: 2, y: 0, isActive: false },
      { id: 'gate_laser', type: 'gate', x: 3, y: 1, isOpen: false }
    ],
    mechanicRule: 'laser_mirror'
  },

  // 11: Shadow Twin
  {
    id: 11,
    difficulty: 'medium',
    titleEn: 'Shadow Twin',
    titlePt: 'Gêmeo de Sombra',
    subtitleEn: 'Bilateral harmonic symmetry',
    subtitlePt: 'Simetria harmônica bilateral',
    taglineEn: 'Move both orbs in mirrored tandem to their goals.',
    taglinePt: 'Mova as duas esferas espelhadas aos seus objetivos.',
    hintEn: 'When you step right, your shadow twin steps left. Align both at the same time.',
    hintPt: 'Quando você anda para a direita, a sombra vai para a esquerda. Alinhe ambas.',
    width: 5,
    height: 5,
    parMoves: 9,
    theme: {
      bg: '#181822',
      floor: '#252535',
      wall: '#42425e',
      accent: '#c084fc',
      glow: '#e9d5ff',
      gridLine: '#313146'
    },
    start: { x: 0, y: 2 },
    shadowStart: { x: 4, y: 2 },
    exit: { x: 2, y: 0 },
    walls: [
      { x: 1, y: 1 },
      { x: 3, y: 1 },
      { x: 2, y: 3 }
    ],
    items: [
      { id: 'twinGoalA', type: 'pressure_plate', x: 1, y: 0, isActive: false },
      { id: 'twinGoalB', type: 'pressure_plate', x: 3, y: 0, isActive: false },
      { id: 'twinGate', type: 'gate', x: 2, y: 1, isOpen: false }
    ],
    mechanicRule: 'shadow_twin'
  },

  // 12: Clockwork Cog
  {
    id: 12,
    difficulty: 'medium',
    titleEn: 'Clockwork Cog',
    titlePt: 'Engrenagem Mecânica',
    subtitleEn: 'Rotary labyrinth core',
    subtitlePt: 'Núcleo rotativo do labirinto',
    taglineEn: 'Stepping on the gear turns the center chamber 90°.',
    taglinePt: 'Pisar na engrenagem gira o quadrante central em 90°.',
    hintEn: 'Rotate the clockwork cog to connect previously blocked hallways.',
    hintPt: 'Gire a engrenagem para conectar os corredores que antes estavam bloqueados.',
    width: 5,
    height: 5,
    parMoves: 10,
    theme: {
      bg: '#1e1a17',
      floor: '#2d2722',
      wall: '#50453d',
      accent: '#f97316',
      glow: '#fb923c',
      gridLine: '#3a322c'
    },
    start: { x: 0, y: 2 },
    exit: { x: 4, y: 2 },
    walls: [
      { x: 1, y: 0 },
      { x: 3, y: 0 },
      { x: 1, y: 4 },
      { x: 3, y: 4 }
    ],
    items: [
      { id: 'gear1', type: 'gear_switch', x: 2, y: 2, isActive: false }
    ],
    mechanicRule: 'clockwork_gear'
  },

  // 13: Silicon Trace
  {
    id: 13,
    difficulty: 'medium',
    titleEn: 'Silicon Trace',
    titlePt: 'Trilha de Silício',
    subtitleEn: 'Microchip conductive paths',
    subtitlePt: 'Caminhos condutivos de microchip',
    taglineEn: 'Activate circuit nodes in sequence: 1 → 2 → 3.',
    taglinePt: 'Ative os nós do circuito na ordem: 1 → 2 → 3.',
    hintEn: 'Follow the PCB traces and hit the numbered copper contacts in strict numerical order.',
    hintPt: 'Siga as trilhas de cobre e ative os contatos numerados na sequência correta.',
    width: 5,
    height: 5,
    parMoves: 11,
    theme: {
      bg: '#121f18',
      floor: '#1a3025',
      wall: '#2e5441',
      accent: '#10b981',
      glow: '#34d399',
      gridLine: '#234132'
    },
    start: { x: 0, y: 4 },
    exit: { x: 4, y: 0 },
    walls: [
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 3 },
      { x: 2, y: 3 }
    ],
    items: [
      { id: 'node1', type: 'circuit_node', x: 0, y: 0, orderIndex: 1, isActive: false },
      { id: 'node2', type: 'circuit_node', x: 4, y: 4, orderIndex: 2, isActive: false },
      { id: 'node3', type: 'circuit_node', x: 2, y: 2, orderIndex: 3, isActive: false },
      { id: 'pcbGate', type: 'gate', x: 3, y: 0, isOpen: false }
    ],
    mechanicRule: 'circuit_nodes'
  },

  // 14: Magnetic Leap
  {
    id: 14,
    difficulty: 'medium',
    titleEn: 'Magnetic Leap',
    titlePt: 'Salto Magnético',
    subtitleEn: 'Bipolar attraction leap',
    subtitlePt: 'Salto por atração bipolar',
    taglineEn: 'Space flips polarity (+ / -) to be pulled toward opposites.',
    taglinePt: 'Espaço inverte sua polaridade (+ / -) para puxar você rumo ao oposto.',
    hintEn: 'Opposites attract across the void. Match opposite charges to be pulled across.',
    hintPt: 'Cargas opostas se atraem pelo vão. Alinhe cargas diferentes para ser puxado.',
    width: 6,
    height: 5,
    parMoves: 9,
    theme: {
      bg: '#1a1622',
      floor: '#272134',
      wall: '#453b5b',
      accent: '#ec4899',
      glow: '#f472b6',
      gridLine: '#332b44'
    },
    start: { x: 0, y: 2 },
    exit: { x: 5, y: 2 },
    walls: [
      { x: 2, y: 0 },
      { x: 2, y: 1 },
      { x: 2, y: 3 },
      { x: 2, y: 4 },
      { x: 3, y: 0 },
      { x: 3, y: 4 }
    ],
    items: [
      { id: 'pegNorth', type: 'magnet_peg', x: 4, y: 1, polarity: '+' },
      { id: 'pegSouth', type: 'magnet_peg', x: 4, y: 3, polarity: '-' }
    ],
    mechanicRule: 'magnetic_polarity'
  },

  // 15: Candle in the Dark
  {
    id: 15,
    difficulty: 'medium',
    titleEn: 'Candle in the Dark',
    titlePt: 'Vela no Escuro',
    subtitleEn: 'Cloaked obsidian catacomb',
    subtitlePt: 'Catacumba de obsidiana encoberta',
    taglineEn: 'Only your small candle lights the way. Ignite both braziers.',
    taglinePt: 'Apenas sua pequena vela ilumina. Acenda os dois braseiros.',
    hintEn: 'Explore carefully in the shadows to find and ignite both ceremonial braziers.',
    hintPt: 'Explore com cuidado pelas sombras para encontrar e acender os dois braseiros.',
    width: 6,
    height: 6,
    parMoves: 14,
    theme: {
      bg: '#0f1115',
      floor: '#181b21',
      wall: '#2a303b',
      accent: '#fb923c',
      glow: '#fdba74',
      gridLine: '#20242c'
    },
    start: { x: 0, y: 0 },
    exit: { x: 5, y: 5 },
    walls: [
      { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 4, y: 1 },
      { x: 1, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 },
      { x: 2, y: 4 }, { x: 2, y: 5 }
    ],
    items: [
      { id: 'torch1', type: 'torch_brazier', x: 5, y: 0, isActive: false },
      { id: 'torch2', type: 'torch_brazier', x: 0, y: 5, isActive: false },
      { id: 'shadowGate', type: 'gate', x: 4, y: 5, isOpen: false }
    ],
    mechanicRule: 'fog_lantern'
  },

  // 16: Translocator
  {
    id: 16,
    difficulty: 'medium',
    titleEn: 'Translocator',
    titlePt: 'Translocador',
    subtitleEn: 'Subspace coordinate swap',
    subtitlePt: 'Troca de coordenadas no subespaço',
    taglineEn: 'Space places a beacon; press Space again to warp back.',
    taglinePt: 'Espaço coloca uma baliza; aperte Espaço de novo para teleportar.',
    hintEn: 'Place your beacon outside the barrier, step inside to trigger the gate, then warp back.',
    hintPt: 'Coloque a baliza do lado de fora, pise no botão e teleporte de volta à baliza.',
    width: 5,
    height: 5,
    parMoves: 9,
    theme: {
      bg: '#1c1524',
      floor: '#291f35',
      wall: '#4a385f',
      accent: '#d946ef',
      glow: '#e879f9',
      gridLine: '#352945'
    },
    start: { x: 0, y: 2 },
    exit: { x: 4, y: 2 },
    walls: [
      { x: 2, y: 0 },
      { x: 2, y: 1 },
      { x: 2, y: 3 },
      { x: 2, y: 4 }
    ],
    items: [
      { id: 'gateTrans', type: 'gate', x: 2, y: 2, isOpen: false },
      { id: 'plateTrans', type: 'pressure_plate', x: 1, y: 0, isActive: false }
    ],
    mechanicRule: 'teleport_beacon'
  },

  // ==========================================
  // TIER 3: DIFÍCIL (HARD) - MAZES 17 TO 24
  // ==========================================

  // 17: Crumbling Path
  {
    id: 17,
    difficulty: 'hard',
    titleEn: 'Crumbling Path',
    titlePt: 'Chão Esfarelado',
    subtitleEn: 'Single-use brittle stones',
    subtitlePt: 'Pedras frágeis de uso único',
    taglineEn: 'Golden cracked tiles collapse into the abyss behind you.',
    taglinePt: 'Ladrilhos dourados rachados caem no abismo atrás de você.',
    hintEn: 'Trace a continuous Hamiltonian path without trapping yourself.',
    hintPt: 'Trace um caminho contínuo sem se encurralar no vazio.',
    width: 5,
    height: 5,
    parMoves: 14,
    theme: {
      bg: '#1c1914',
      floor: '#2b261e',
      wall: '#4e4537',
      accent: '#eab308',
      glow: '#facc15',
      gridLine: '#373026'
    },
    start: { x: 0, y: 0 },
    exit: { x: 4, y: 4 },
    walls: [
      { x: 2, y: 1 },
      { x: 2, y: 3 }
    ],
    cells: {
      '1,0': 'crumble', '2,0': 'crumble', '3,0': 'crumble',
      '0,1': 'crumble', '1,1': 'crumble', '3,1': 'crumble', '4,1': 'crumble',
      '0,2': 'crumble', '1,2': 'crumble', '2,2': 'crumble', '3,2': 'crumble', '4,2': 'crumble',
      '0,3': 'crumble', '1,3': 'crumble', '3,3': 'crumble', '4,3': 'crumble',
      '1,4': 'crumble', '2,4': 'crumble', '3,4': 'crumble'
    },
    mechanicRule: 'crumble_tiles'
  },

  // 18: The Postage Stamp
  {
    id: 18,
    difficulty: 'hard',
    titleEn: 'The Postage Stamp',
    titlePt: 'O Selo Postal',
    subtitleEn: 'Two-sided folded micro-sheet',
    subtitlePt: 'Microfolha dobrada em dois lados',
    taglineEn: 'Space flips the stamp over to navigate Front and Back.',
    taglinePt: 'Espaço vira o selo para navegar entre a Frente e o Verso.',
    hintEn: 'When blocked on the front side, press Space on perforation lines to flip to the back.',
    hintPt: 'Quando bloqueado na frente, pressione Espaço nas linhas perfuradas para virar ao verso.',
    width: 5,
    height: 5,
    parMoves: 10,
    theme: {
      bg: '#1b1a17',
      floor: '#292823',
      wall: '#4a483e',
      accent: '#84cc16',
      glow: '#a3e635',
      gridLine: '#35342d'
    },
    start: { x: 0, y: 0 },
    exit: { x: 4, y: 4 },
    walls: [
      { x: 2, y: 0 },
      { x: 2, y: 1 },
      { x: 2, y: 2 }
    ],
    backWalls: [
      { x: 1, y: 3 },
      { x: 2, y: 3 },
      { x: 3, y: 3 }
    ],
    items: [
      { id: 'perf1', type: 'stamp_perforation', x: 1, y: 2 },
      { id: 'perf2', type: 'stamp_perforation', x: 3, y: 2 },
      { id: 'gateStamp', type: 'gate', x: 4, y: 2, isOpen: false }
    ],
    mechanicRule: 'origami_stamp'
  },

  // 19: Echo Loop
  {
    id: 19,
    difficulty: 'hard',
    titleEn: 'Echo Loop',
    titlePt: 'Eco Temporal',
    subtitleEn: 'Chrono-recorded clone',
    subtitlePt: 'Clone cronogravado',
    taglineEn: 'Record your steps, then let your ghost replay them.',
    taglinePt: 'Grave seus passos e deixe seu fantasma repeti-los.',
    hintEn: 'Step on the Echo pad, walk to the door trigger, then press Space to replay your ghost while you rush through.',
    hintPt: 'Pise na placa de Eco, caminhe até o botão e aperte Espaço para reproduzir seu fantasma enquanto você corre.',
    width: 5,
    height: 5,
    parMoves: 12,
    theme: {
      bg: '#141c22',
      floor: '#1f2b34',
      wall: '#374b5b',
      accent: '#2dd4bf',
      glow: '#5eead4',
      gridLine: '#283743'
    },
    start: { x: 0, y: 2 },
    exit: { x: 4, y: 2 },
    walls: [
      { x: 2, y: 0 },
      { x: 2, y: 4 }
    ],
    items: [
      { id: 'echoPad', type: 'echo_plate', x: 1, y: 2 },
      { id: 'doorTrigger', type: 'pressure_plate', x: 1, y: 0, isActive: false },
      { id: 'echoGate', type: 'gate', x: 2, y: 2, isOpen: false }
    ],
    mechanicRule: 'echo_ghost'
  },

  // 20: Dual Prism Array
  {
    id: 20,
    difficulty: 'hard',
    titleEn: 'Dual Prism Array',
    titlePt: 'Matriz de Duplo Prisma',
    subtitleEn: 'Multi-bounce laser trajectory',
    subtitlePt: 'Trajetória laser de múltiplos reflexos',
    taglineEn: 'Align the mirror angles to deactivate the barrier.',
    taglinePt: 'Alinhe os ângulos do espelho para desativar a barreira.',
    hintEn: 'Rotate the prism so the laser accurately feeds the receiver terminal.',
    hintPt: 'Gire o prisma para que o laser alimente com precisão o terminal receptor.',
    width: 6,
    height: 5,
    parMoves: 12,
    theme: {
      bg: '#221518',
      floor: '#321f24',
      wall: '#5a3740',
      accent: '#f43f5e',
      glow: '#fb7185',
      gridLine: '#432930'
    },
    start: { x: 0, y: 4 },
    exit: { x: 5, y: 0 },
    walls: [
      { x: 1, y: 0 }, { x: 1, y: 1 },
      { x: 3, y: 3 }, { x: 3, y: 4 },
      { x: 4, y: 2 }
    ],
    items: [
      { id: 'emitter20', type: 'laser_emitter', x: 0, y: 2, laserDir: 'right' },
      { id: 'mirror20', type: 'mirror', x: 2, y: 2, mirrorAngle: 0 },
      { id: 'receiver20', type: 'laser_receiver', x: 2, y: 0, isActive: false },
      { id: 'gate_laser', type: 'gate', x: 4, y: 1, isOpen: false }
    ],
    mechanicRule: 'laser_mirror'
  },

  // 21: Ice & Color Vault
  {
    id: 21,
    difficulty: 'hard',
    titleEn: 'Ice & Color Vault',
    titlePt: 'Cofre de Gelo e Cores',
    subtitleEn: 'Frictional state modulation',
    subtitlePt: 'Modulação de estado sob atrito',
    taglineEn: 'Slide across ice to trigger alternating color gates.',
    taglinePt: 'Deslize pelo gelo para acionar portões de cores alternadas.',
    hintEn: 'Use stone stop-pads to aim your slide toward the blue switch.',
    hintPt: 'Use as plataformas de pedra para mirar seu deslize ao interruptor azul.',
    width: 6,
    height: 6,
    parMoves: 13,
    theme: {
      bg: '#101c26',
      floor: '#1a2c3c',
      wall: '#2e4e6a',
      accent: '#38bdf8',
      glow: '#7dd3fc',
      gridLine: '#233d54'
    },
    start: { x: 0, y: 0 },
    exit: { x: 5, y: 5 },
    walls: [
      { x: 2, y: 1 }, { x: 3, y: 4 }, { x: 4, y: 2 }
    ],
    cells: {
      '1,0': 'ice', '2,0': 'ice', '3,0': 'ice',
      '1,2': 'ice', '2,2': 'ice', '3,2': 'ice',
      '4,4': 'ice', '5,4': 'ice'
    },
    items: [
      { id: 'sw_blue', type: 'color_switch', x: 4, y: 0, color: 'blue' },
      { id: 'g_blue21', type: 'color_gate', x: 5, y: 3, color: 'blue', isOpen: false }
    ],
    mechanicRule: 'color_flip'
  },

  // 22: Twin Vector Grid
  {
    id: 22,
    difficulty: 'hard',
    titleEn: 'Twin Vector Grid',
    titlePt: 'Grade de Vetores Gêmeos',
    subtitleEn: 'Opposing conveyor crosswinds',
    subtitlePt: 'Ventos cruzados em esteiras opostas',
    taglineEn: 'Guide both mirrored orbs through directional currents.',
    taglinePt: 'Guie as esferas espelhadas através de correntes direcionais.',
    hintEn: 'Move carefully so neither twin gets dragged into a dead-end arrow.',
    hintPt: 'Mova-se com cuidado para que nenhum gêmeo seja arrastado para um beco sem saída.',
    width: 5,
    height: 5,
    parMoves: 12,
    theme: {
      bg: '#171926',
      floor: '#23263a',
      wall: '#3e4368',
      accent: '#c084fc',
      glow: '#e9d5ff',
      gridLine: '#2d314c'
    },
    start: { x: 0, y: 2 },
    shadowStart: { x: 4, y: 2 },
    exit: { x: 2, y: 0 },
    walls: [
      { x: 1, y: 1 }, { x: 3, y: 1 }
    ],
    cells: {
      '0,1': 'conveyor_up',
      '4,1': 'conveyor_up',
      '2,3': 'conveyor_left'
    },
    items: [
      { id: 'twinGoalA', type: 'pressure_plate', x: 1, y: 0, isActive: false },
      { id: 'twinGoalB', type: 'pressure_plate', x: 3, y: 0, isActive: false },
      { id: 'twinGate', type: 'gate', x: 2, y: 1, isOpen: false }
    ],
    mechanicRule: 'shadow_twin'
  },

  // 23: Magnetic Crossfire
  {
    id: 23,
    difficulty: 'hard',
    titleEn: 'Magnetic Crossfire',
    titlePt: 'Fogo Cruzado Magnético',
    subtitleEn: 'Multi-polar navigation across voids',
    subtitlePt: 'Navegação multipolar através do vazio',
    taglineEn: 'Alternate + and - to sling across deep pits.',
    taglinePt: 'Alterne + e - para arremessar seu corpo pelos fossos.',
    hintEn: 'Line up with North or South pylons and hit Space to slingshot across.',
    hintPt: 'Alinhe-se aos pilares Norte ou Sul e aperte Espaço para ser puxado.',
    width: 6,
    height: 5,
    parMoves: 11,
    theme: {
      bg: '#1c1626',
      floor: '#2b213a',
      wall: '#4a3964',
      accent: '#ec4899',
      glow: '#f472b6',
      gridLine: '#372a4b'
    },
    start: { x: 0, y: 2 },
    exit: { x: 5, y: 2 },
    walls: [
      { x: 2, y: 0 }, { x: 2, y: 4 },
      { x: 3, y: 0 }, { x: 3, y: 4 }
    ],
    items: [
      { id: 'pegN', type: 'magnet_peg', x: 3, y: 1, polarity: '+' },
      { id: 'pegS', type: 'magnet_peg', x: 3, y: 3, polarity: '-' }
    ],
    mechanicRule: 'magnetic_polarity'
  },

  // 24: Vault & Springs
  {
    id: 24,
    difficulty: 'hard',
    titleEn: 'Vault & Springs',
    titlePt: 'Salto e Molas',
    subtitleEn: 'Precision trajectory jumps',
    subtitlePt: 'Saltos de precisão em trajetória',
    taglineEn: 'Calculate bounce distance over hazardous spike fields.',
    taglinePt: 'Calcule a distância de ricochete sobre campos de espinhos.',
    hintEn: 'Enter spring pads only facing open safety terrain.',
    hintPt: 'Entre nas molas apenas voltado para terreno seguro e desobstruído.',
    width: 6,
    height: 5,
    parMoves: 10,
    theme: {
      bg: '#131e20',
      floor: '#1d2e31',
      wall: '#345258',
      accent: '#06b6d4',
      glow: '#67e8f9',
      gridLine: '#263d42'
    },
    start: { x: 0, y: 1 },
    exit: { x: 5, y: 3 },
    walls: [
      { x: 2, y: 0 }, { x: 3, y: 4 }
    ],
    cells: {
      '1,1': 'spring',
      '2,1': 'spike',
      '3,1': 'floor',
      '4,1': 'spring',
      '4,2': 'spike',
      '4,3': 'floor'
    },
    mechanicRule: 'spring_jump'
  },

  // ==========================================
  // TIER 4: HARD MASTER (EXPERT) - MAZES 25 TO 32
  // ==========================================

  // 25: Chrono Ghost Conundrum
  {
    id: 25,
    difficulty: 'master',
    titleEn: 'Chrono Ghost Conundrum',
    titlePt: 'Enigma do Fantasma Cronológico',
    subtitleEn: 'Multi-layer temporal playback',
    subtitlePt: 'Reprodução temporal em múltiplas camadas',
    taglineEn: 'Your ghost must hold down the timed trigger while you sprint.',
    taglinePt: 'Seu fantasma precisa manter o botão pressionado enquanto você corre.',
    hintEn: 'Stand on the Echo plate, take 4 steps to the switch, pause, and replay with Space.',
    hintPt: 'Pise na placa de Eco, dê 4 passos até o botão, pause e reproduza com Espaço.',
    width: 6,
    height: 6,
    parMoves: 16,
    theme: {
      bg: '#101a22',
      floor: '#182733',
      wall: '#2a455b',
      accent: '#2dd4bf',
      glow: '#5eead4',
      gridLine: '#1f3343'
    },
    start: { x: 0, y: 3 },
    exit: { x: 5, y: 3 },
    walls: [
      { x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 4 }, { x: 2, y: 5 },
      { x: 4, y: 1 }, { x: 4, y: 4 }
    ],
    items: [
      { id: 'echoPad25', type: 'echo_plate', x: 1, y: 3 },
      { id: 'doorTrigger', type: 'pressure_plate', x: 1, y: 0, isActive: false },
      { id: 'echoGate', type: 'gate', x: 2, y: 3, isOpen: false }
    ],
    mechanicRule: 'echo_ghost'
  },

  // 26: The 4-Node Microchip
  {
    id: 26,
    difficulty: 'master',
    titleEn: 'The 4-Node Microchip',
    titlePt: 'O Microchip de 4 Nós',
    subtitleEn: 'High-density motherboard interconnect',
    subtitlePt: 'Interconexão de placa-mãe de alta densidade',
    taglineEn: 'Connect electrical nodes in strict sequence 1 → 2 → 3 → 4.',
    taglinePt: 'Conecte os nós elétricos na ordem estrita 1 → 2 → 3 → 4.',
    hintEn: 'Traverse the copper tracks in exact ascending numerical order.',
    hintPt: 'Percorra as trilhas de cobre na ordem numérica crescente exata.',
    width: 6,
    height: 6,
    parMoves: 18,
    theme: {
      bg: '#0f1c15',
      floor: '#172c21',
      wall: '#284d3a',
      accent: '#10b981',
      glow: '#34d399',
      gridLine: '#1d382a'
    },
    start: { x: 0, y: 5 },
    exit: { x: 5, y: 0 },
    walls: [
      { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 4, y: 2 },
      { x: 1, y: 4 }, { x: 3, y: 4 }, { x: 4, y: 4 }
    ],
    items: [
      { id: 'node1', type: 'circuit_node', x: 0, y: 0, orderIndex: 1, isActive: false },
      { id: 'node2', type: 'circuit_node', x: 5, y: 5, orderIndex: 2, isActive: false },
      { id: 'node3', type: 'circuit_node', x: 2, y: 3, orderIndex: 3, isActive: false },
      { id: 'node4', type: 'circuit_node', x: 3, y: 1, orderIndex: 4, isActive: false },
      { id: 'pcbGate', type: 'gate', x: 4, y: 0, isOpen: false }
    ],
    mechanicRule: 'circuit_nodes'
  },

  // 27: Rotary Paradox
  {
    id: 27,
    difficulty: 'master',
    titleEn: 'Rotary Paradox',
    titlePt: 'Paradoxo Rotativo',
    subtitleEn: 'Clockwork orbital alignment',
    subtitlePt: 'Alinhamento orbital mecânico',
    taglineEn: 'Rotate the central labyrinth gear to bridge opposing sides.',
    taglinePt: 'Gire a engrenagem central para conectar os lados opostos.',
    hintEn: 'Step onto the orange gear to pivot the internal passages 90 degrees.',
    hintPt: 'Pise na engrenagem laranja para girar os corredores internos em 90 graus.',
    width: 5,
    height: 5,
    parMoves: 14,
    theme: {
      bg: '#1c1712',
      floor: '#2a231b',
      wall: '#4a3d30',
      accent: '#f97316',
      glow: '#fb923c',
      gridLine: '#352c22'
    },
    start: { x: 0, y: 2 },
    exit: { x: 4, y: 2 },
    walls: [
      { x: 1, y: 0 }, { x: 3, y: 0 },
      { x: 1, y: 4 }, { x: 3, y: 4 }
    ],
    items: [
      { id: 'gear27', type: 'gear_switch', x: 2, y: 2, isActive: false }
    ],
    mechanicRule: 'clockwork_gear'
  },

  // 28: Origami Double Fold
  {
    id: 28,
    difficulty: 'master',
    titleEn: 'Origami Double Fold',
    titlePt: 'Dobra Dupla de Origami',
    subtitleEn: 'Multi-dimensional paper sheet topology',
    subtitlePt: 'Topologia multidimensional em papel',
    taglineEn: 'Flip between Front and Back face along perforated boundaries.',
    taglinePt: 'Vire entre Frente e Verso ao longo das bordas perfuradas.',
    hintEn: 'When dead-ended, flip to Side B to access parallel corridors.',
    hintPt: 'Quando estiver sem saída, vire para o Lado B para acessar corredores paralelos.',
    width: 6,
    height: 6,
    parMoves: 16,
    theme: {
      bg: '#1a1914',
      floor: '#28271f',
      wall: '#474537',
      accent: '#84cc16',
      glow: '#a3e635',
      gridLine: '#333227'
    },
    start: { x: 0, y: 0 },
    exit: { x: 5, y: 5 },
    walls: [
      { x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 2, y: 3 },
      { x: 4, y: 2 }, { x: 4, y: 3 }
    ],
    backWalls: [
      { x: 1, y: 4 }, { x: 2, y: 4 }, { x: 3, y: 4 },
      { x: 3, y: 1 }, { x: 4, y: 1 }
    ],
    items: [
      { id: 'perf28A', type: 'stamp_perforation', x: 1, y: 2 },
      { id: 'perf28B', type: 'stamp_perforation', x: 3, y: 2 },
      { id: 'gateStamp', type: 'gate', x: 4, y: 4, isOpen: false }
    ],
    mechanicRule: 'origami_stamp'
  },

  // 29: Shadow Void
  {
    id: 29,
    difficulty: 'master',
    titleEn: 'Shadow Void',
    titlePt: 'Vazio das Sombras',
    subtitleEn: 'Mirrored tandem over brittle abyss',
    subtitlePt: 'Tandem espelhado sobre abismo frágil',
    taglineEn: 'Every move breaks brittle stone under both orbs.',
    taglinePt: 'Cada movimento quebra pedras frágeis sob ambas as esferas.',
    hintEn: 'Keep both entities synchronized; a misstep collapses the escape path.',
    hintPt: 'Mantenha as duas entidades sincronizadas; um passo em falso desmorona o caminho.',
    width: 5,
    height: 5,
    parMoves: 15,
    theme: {
      bg: '#151522',
      floor: '#212135',
      wall: '#3a3a5e',
      accent: '#c084fc',
      glow: '#e9d5ff',
      gridLine: '#2b2b46'
    },
    start: { x: 0, y: 2 },
    shadowStart: { x: 4, y: 2 },
    exit: { x: 2, y: 0 },
    walls: [
      { x: 1, y: 1 }, { x: 3, y: 1 }, { x: 2, y: 3 }
    ],
    cells: {
      '0,1': 'crumble', '4,1': 'crumble',
      '1,2': 'crumble', '3,2': 'crumble'
    },
    items: [
      { id: 'twinGoalA', type: 'pressure_plate', x: 1, y: 0, isActive: false },
      { id: 'twinGoalB', type: 'pressure_plate', x: 3, y: 0, isActive: false },
      { id: 'twinGate', type: 'gate', x: 2, y: 1, isOpen: false }
    ],
    mechanicRule: 'shadow_twin'
  },

  // 30: Cryo Zero-G
  {
    id: 30,
    difficulty: 'master',
    titleEn: 'Cryo Zero-G',
    titlePt: 'Criogenia Zero-G',
    subtitleEn: 'Unstoppable momentum on frictionless ice',
    subtitlePt: 'Momento imparável em gelo sem atrito',
    taglineEn: 'Slide from wall to wall without stopping.',
    taglinePt: 'Deslize de parede a parede sem parar.',
    hintEn: 'Line up collision points to bank your momentum toward the exit.',
    hintPt: 'Alinhe os pontos de colisão para rebater seu impulso até a saída.',
    width: 6,
    height: 6,
    parMoves: 14,
    theme: {
      bg: '#0e1822',
      floor: '#162738',
      wall: '#274562',
      accent: '#38bdf8',
      glow: '#7dd3fc',
      gridLine: '#1d344b'
    },
    start: { x: 0, y: 0 },
    exit: { x: 5, y: 5 },
    walls: [
      { x: 2, y: 0 }, { x: 4, y: 1 }, { x: 1, y: 3 },
      { x: 3, y: 4 }, { x: 4, y: 5 }
    ],
    items: [],
    mechanicRule: 'gravity_tilt'
  },

  // 31: Quantum Translocator
  {
    id: 31,
    difficulty: 'master',
    titleEn: 'Quantum Translocator',
    titlePt: 'Translocador Quântico',
    subtitleEn: 'Subspace beacon repositioning',
    subtitlePt: 'Reposicionamento de baliza no subespaço',
    taglineEn: 'Deploy beacon, navigate maze interior, and warp back across gates.',
    taglinePt: 'Posicione a baliza, navegue pelo interior e teleporte de volta.',
    hintEn: 'Place the beacon before walking through the one-way gate, then warp back.',
    hintPt: 'Coloque a baliza antes de passar pelo portão unidirecional e teleporte de volta.',
    width: 6,
    height: 5,
    parMoves: 13,
    theme: {
      bg: '#1b1224',
      floor: '#291b36',
      wall: '#4a3162',
      accent: '#d946ef',
      glow: '#e879f9',
      gridLine: '#352346'
    },
    start: { x: 0, y: 2 },
    exit: { x: 5, y: 2 },
    walls: [
      { x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 3 }, { x: 2, y: 4 },
      { x: 4, y: 0 }, { x: 4, y: 4 }
    ],
    items: [
      { id: 'gateTrans', type: 'gate', x: 2, y: 2, isOpen: false },
      { id: 'plateTrans', type: 'pressure_plate', x: 3, y: 0, isActive: false }
    ],
    mechanicRule: 'teleport_beacon'
  },

  // 32: The Grand Paradox (Sovereign)
  {
    id: 32,
    difficulty: 'master',
    titleEn: 'The Grand Paradox: Sovereign',
    titlePt: 'O Grande Paradoxo: Soberano',
    subtitleEn: 'Masterwork culmination of all micro laws',
    subtitlePt: 'A culminação suprema de todas as micro-leis',
    taglineEn: 'Push crates, toggle frequencies, warp through portals, and claim the master key.',
    taglinePt: 'Empurre caixotes, alterne frequências, cruze portais e conquiste a chave mestre.',
    hintEn: 'Push the block onto the switch, enter the red portal, acquire the key, and unlock eternity.',
    hintPt: 'Empurre a caixa sobre o botão, entre no portal vermelho, pegue a chave e abra a eternidade.',
    width: 6,
    height: 6,
    parMoves: 18,
    theme: {
      bg: '#181825',
      floor: '#242436',
      wall: '#424261',
      accent: '#f59e0b',
      glow: '#fbbf24',
      gridLine: '#2f2f47'
    },
    start: { x: 0, y: 0 },
    exit: { x: 5, y: 5 },
    walls: [
      { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 4, y: 1 },
      { x: 1, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 },
      { x: 1, y: 4 }
    ],
    items: [
      { id: 'gp_block', type: 'block', x: 1, y: 0 },
      { id: 'gp_switch', type: 'color_switch', x: 3, y: 0, color: 'blue' },
      { id: 'gp_blueGate', type: 'color_gate', x: 2, y: 2, color: 'blue', isOpen: false },
      { id: 'gp_portalA', type: 'portal', x: 0, y: 4, color: 'red', pairId: 'gp_portalB' },
      { id: 'gp_portalB', type: 'portal', x: 5, y: 1, color: 'blue', pairId: 'gp_portalA' },
      { id: 'gp_key', type: 'key', x: 5, y: 0 },
      { id: 'gp_masterGate', type: 'gate', x: 4, y: 5, isOpen: false }
    ],
    mechanicRule: 'grand_paradox'
  }
];
