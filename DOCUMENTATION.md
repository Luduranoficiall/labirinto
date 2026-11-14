# 📘 Technical Architecture & Engineering Documentation

## 32 Even Smaller Mazes | Documentação Técnica Profissional

Esta documentação fornece uma visão técnica detalhada da arquitetura de software, pipeline de renderização, simulação a 60 FPS, gerenciamento de estado e guia de extensão para o jogo **32 Even Smaller Mazes**.

---

## 1. Arquitetura do Sistema e Fluxo de Dados

A aplicação combina **React 19** para o gerenciamento de estados macro (menus, navegação, HUD perimétrico e persistência) com um **HTML5 Canvas 2D Engine** desacoplado para a simulação física e renderização de alta taxa de quadros.

```
┌─────────────────────────────────────────────────────────────────┐
│                          REACT APP                              │
│  (State: Screen, SaveData, SoundVolume, Locale, ActiveMazeId)   │
└────────────────┬───────────────────────────────▲────────────────┘
                 │ Instancia / Atualiza          │ Eventos de Vitória
                 ▼                               │ e Movimento
┌────────────────────────────────────────────────┴────────────────┐
│                       GAME ENGINE CLASS                         │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ 1. Input Processing (WASD / Arrows / Space / Z Undo / R)  │  │
│  ├───────────────────────────────────────────────────────────┤  │
│  │ 2. Game Logic (Collisions, Conveyors, Portals, Lasers)    │  │
│  ├───────────────────────────────────────────────────────────┤  │
│  │ 3. Animation State (Squash & Stretch, Particles, Shake)   │  │
│  ├───────────────────────────────────────────────────────────┤  │
│  │ 4. Canvas 2D Renderer (Diorama Board, Bevels, Glow FX)    │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────────────────────┬────────────────────────────────┘
                                 │ Sintetiza Áudio
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SOUND MANAGER (Web Audio)                  │
│       (Oscillators, Biquad Filters, Gain Nodes, Arpeggios)      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Ciclo de Vida da Simulação a 60 FPS

O loop de jogo reside exclusivamente dentro de `GameEngine.ts`, executado através de `requestAnimationFrame`.

### Clamp de Delta Time (`dt`)
Para prevenir anomalias de física quando o usuário troca de aba no navegador ou ocorre congelamento transitório, o `dt` é limitado a 50 milissegundos:

```typescript
const rawDt = (time - this.lastTime) / 1000;
this.lastTime = time;
const dt = Math.min(rawDt, 0.05); // Garante estabilidade na interpolação
```

### Ordem de Execução por Frame
1. **Hitstop Check**: Se `hitstopTimer > 0`, a atualização física é congelada para dar peso ao impacto.
2. **Interpolação de Movimento**: `renderX` e `renderY` convergem para `x` e `y` via interpolação exponencial suave:
   ```typescript
   this.player.renderX += (this.player.x - this.player.renderX) * Math.min(1, 16 * dt);
   ```
3. **Squash & Stretch Recovery**: Fatores de escala retornam a `1.0` usando amortecimento elástico.
4. **Decaimento de Screen Shake**: Trepidação de câmera dissipa a `12 * dt` por segundo.
5. **Atualização de Partículas**: Partículas integradas por velocidade e taxa de atrito com remoção automática pós-vida útil.
6. **Passo de Renderização**: Limpeza de tela, aplicação da matriz de câmera (screen shake) e desenho em camadas.

---

## 3. Ordem de Renderização das Camadas (Layer Pipeline)

A renderização do diorama segue uma hierarquia de profundidade estrita para evitar artefatos visuais:

1. **Sombra Projetada da Mesa**: Retângulo arredondado com desfoque e opacidade de 45%.
2. **Borda do Tabuleiro de Madeira**: Fundo do tema com borda milimétrica de chanfro.
3. **Marca D'água de Fase (Origami Stamp)**: Identificador do lado ativo (Face A ou Face B).
4. **Ladrilhos de Chão (Piso Normal, Gelo, Armadilhas de Espinho, Ladrilhos Quebradiços)**.
5. **Portal de Saída (Objetivo)**: Círculo ressonante com estrela central pulsante.
6. **Paredes e Obstáculos Sólidos**: Blocos chanfrados com realces de iluminação superior.
7. **Itens Interativos Estáticos**: Botões de pressão, nós de circuito PCB, braseiros e perfurações.
8. **Engrenagem Central Mecânica** (quando ativa): Disco rotativo com raios de sustentação.
9. **Feixes e Linhas de Laser**: Trajetórias ópticas com vértices refletidos por prismas.
10. **Caixotes e Blocos Empurráveis**: Elementos físicos com marcação em cruz de madeira.
11. **Gêmeo das Sombras** (Maze 11, 22, 29): Avatar púrpura espelhado.
12. **Esfera do Jogador**: Núcleo dourado com halo de iluminação e reflexo especular superior.
13. **Máscara de Névoa de Guerra / Lanterna** (Maze 15): Gradiente radial opaco que simula o alcance de uma vela.
14. **Sistema de Partículas**: Faíscas e fragmentos coloridos em alpha blending.

---

## 4. Pilha Infinita de Desfazer (Undo System)

Toda ação ou movimento grava um snapshot completo do estado do labirinto antes da transição:

```typescript
interface UndoSnapshot {
  player: { 
    x: number; 
    y: number; 
    isShrunk: boolean; 
    polarity: '+' | '-'; 
    stampSide: 'front' | 'back';
  };
  shadowPlayer?: { x: number; y: number };
  items: InteractiveItem[];
  crumbledCells: string[];
  moves: number;
  beaconPos: Position | null;
  echoRecord: Position[];
  gearRotation: number;
  lastMoveDir: Direction;
}
```

Ao acionar `undo()`:
- O snapshot do topo da pilha é desempilhado.
- Todas as propriedades físicas, itens coletados, sensores de pressão e paredes do lado oposto são revertidos atomicamente.
- O contador de movimentos é sincronizado sem recarregar o Canvas.
- É disparado o som procedural suave de reversão temporal.

---

## 5. Sintetizador Web Audio API

O arquivo `src/audio/soundManager.ts` opera de forma 100% autônoma, sem dependências externas de rede.

### Principais Fórmulas e Curvas Sonoras
- **Movimento / Passo**:
  - Forma de onda: `triangle`
  - Frequência: Rampa exponencial de `280 Hz` para `140 Hz` em `50 ms`.
  - Ganho: `0.15` com envelope de decaimento rápido.
- **Portais & Saltos Quânticos**:
  - Forma de onda: `sine`
  - Frequência: Rampa ascendente de `320 Hz` para `960 Hz` em `180 ms`.
  - Ganho: `0.22` com final suave.
- **Acorde de Vitória**:
  - Frequências: `[523.25, 659.25, 783.99, 1046.5]` Hz (C5, E5, G5, C6).
  - Intervalo de nota: `90 ms` de desfasamento entre tons, gerando um arpejo cerimonial maior límpido.

---

## 6. Como Adicionar um Novo Micro-Labirinto (Tutorial)

Para adicionar uma nova fase à coleção, basta adicionar um novo objeto ao array `MAZES` em `src/data/mazes.ts`:

```typescript
{
  id: 33, // Próximo ID
  difficulty: 'hard', // 'easy' | 'medium' | 'hard' | 'master'
  titleEn: 'My Custom Micro-Maze',
  titlePt: 'Meu Micro-Labirinto Customizado',
  subtitleEn: 'Electromagnetic repulsion',
  subtitlePt: 'Repulsão eletromagnética',
  taglineEn: 'Solve the magnetic tension.',
  taglinePt: 'Resolva a tensão magnética.',
  hintEn: 'Look for the pylon across the chasm.',
  hintPt: 'Procure o pilar através do abismo.',
  width: 5,
  height: 5,
  parMoves: 12,
  theme: {
    bg: '#181b20',
    floor: '#232832',
    wall: '#384252',
    accent: '#f59e0b',
    glow: '#fbbf24',
    gridLine: '#2e3544'
  },
  start: { x: 0, y: 0 },
  exit: { x: 4, y: 4 },
  walls: [
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 3, y: 3 }
  ],
  items: [
    { id: 'key33', type: 'key', x: 0, y: 4 },
    { id: 'gate33', type: 'gate', x: 3, y: 4, isOpen: false }
  ],
  mechanicRule: 'standard' // Ou qualquer regra suportada
}
```

O jogo calcula automaticamente o progresso global, atualiza a galeria de fases e integra o seletor de dificuldade sem necessidade de alterações manuais no motor.

---

## 7. Persistência de Dados (`localStorage`)

Os dados de progresso do jogador são mantidos no armazenamento local do navegador sob a chave `even_smaller_mazes_save_v1`:

```json
{
  "mazes": {
    "1": { "completed": true, "bestMoves": 8, "bestTimeSeconds": 6, "stars": 3 },
    "2": { "completed": true, "bestMoves": 9, "bestTimeSeconds": 8, "stars": 3 }
  },
  "currentMazeId": 3,
  "soundEnabled": true,
  "volume": 0.6,
  "language": "pt"
}
```

---

## 8. Conformidade de Testes e Compilação

Para verificar que a base de código está 100% livre de erros ou inconsistências de tipo:

```bash
# Executa a verificação estrita de tipagens TypeScript
npm run lint

# Executa o build de produção do Vite
npm run build
```

Ambos os comandos devem concluir com código de retorno 0.
