# Space Explorer - Portfolio Game

A visually impressive HTML5 Canvas space exploration game built with modern JavaScript ES6+. This **multi-mode** game features single player, competitive VS, and cooperative gameplay, showcasing advanced programming concepts, smooth animations, particle effects, audio system, and engaging gameplay - perfect for a developer portfolio.

## 🎮 Game Features

- **Intelligent Navigation Flow**: Title Screen → Player Count → Mode Selection → Gameplay
- **Three Game Modes**: Single Player, VS Mode (competitive), and Co-op Mode (cooperative)
- **Flexible Single Player**: Choose between WASD or Arrow key controls (3 lives)
- **Competitive VS Mode**: Last player standing wins! (3 lives each player)
- **Cooperative Co-op Mode**: Team survival with shared life pool (5 shared lives)
- **Advanced Physics**: Momentum-based movement with realistic acceleration and friction
- **Dynamic Asteroid System**: Procedurally generated asteroids that split into smaller pieces
- **Professional Particle Effects**: Explosions, trails, stars, and collection effects
- **Immersive Audio System**: Sound effects, background music, and audio toggle controls
- **Strategic Power-up System**: Health, shield, speed boost, and score multiplier collectibles
- **Progressive Difficulty**: Dynamic challenge scaling as levels advance
- **Mode-Specific High Scores**: Independent score tracking for each game mode with real-time display
- **Victory Celebrations**: Special winner announcements with particle effects for VS mode
- **Professional UI/UX**: Multi-screen navigation with contextual information and smooth transitions
- **Responsive Design**: Optimized for different screen sizes and devices
- **Modern Styling**: Space-themed interface with glowing effects, gradients, and custom favicon

## 🚀 Live Demo

To run the game locally:
```bash
npm install
npm start
```
The game will automatically open in your browser at `http://localhost:3000`

## 🛠️ Technologies Used

- **HTML5 Canvas**: For high-performance 2D rendering
- **JavaScript ES6+**: Modern JavaScript with classes, modules, and arrow functions
- **Web Audio API**: Dynamic sound effects and background music
- **CSS3**: Advanced styling with gradients, animations, and flexbox
- **Local Storage**: Persistent high score tracking
- **Live Server**: Development server with hot reload

## 📁 Project Structure

```
Space Explorer Game/
├── index.html          # Main HTML file with game UI
├── package.json        # Project configuration and dependencies
├── favicon.svg         # Custom game favicon
├── css/
│   └── style.css      # Game styling and UI
├── js/
│   ├── main.js        # Entry point and game initialization
│   ├── game.js        # Main game logic and state management
│   ├── player.js      # Player spaceship class
│   ├── asteroid.js    # Asteroid obstacle class
│   ├── powerup.js     # Power-up collectibles
│   ├── particle.js    # Particle system for effects
│   ├── audio.js       # Audio system and sound management
│   └── utils.js       # Utility functions and Vector2 class
└── .github/
    └── copilot-instructions.md
```

## 🎯 Game Mechanics

### Navigation Flow
1. **Title Screen** → Click "Start Game"
2. **Player Count Selection** → Choose "1 Player" or "2 Players"
3. **Mode Selection** → Choose specific game mode based on player count
4. **Gameplay** → Enjoy the selected mode!

### Game Mode Selection

#### **Single Player Options:**
- **WASD Controls**: Use W/A/S/D keys for movement (3 lives, independent high score)
- **Arrow Controls**: Use Arrow keys for movement (3 lives, shared high score with WASD)

#### **Two Player Options:**
- **VS Mode**: Competitive battle with last-player-standing wins (3 lives each, independent high score)
- **Co-op Mode**: Cooperative survival with teamwork focus (5 shared lives, independent high score)

### Controls
- **Single Player**: WASD or Arrow keys (your choice)
- **Player 1 (Multiplayer)**: WASD keys for movement  
- **Player 2 (Multiplayer)**: Arrow keys for movement
- **Audio Toggle**: Click the speaker icon to toggle sound on/off

### Objectives
- **Single Player**: Survive as long as possible, avoid asteroids, collect power-ups
- **VS Mode**: Be the last player standing! Outlast your opponent
- **Co-op Mode**: Work together to survive and achieve high scores

### Scoring System
- **Base Score**: Continuous time-based scoring (25 points/second + level multiplier)
- **Asteroid Destruction**: Bonus points for destroying asteroids by collision
- **Power-up Multipliers**: Score enhancement collectibles
- **Mode-Specific High Scores**: Independent tracking for Single Player, VS Mode, and Co-op Mode
- **Real-Time Display**: High scores shown on mode selection buttons with golden highlighting
- **Persistent Storage**: Scores saved across browser sessions with LocalStorage

### Power-ups
- **Health (+)**: 
  - Single/VS Mode: Restores one health point to the collecting player
  - Co-op Mode: Restores one shared life to the team
- **Shield (◆)**: Temporary invulnerability for the collecting player
- **Speed (▲)**: Temporary speed boost for the collecting player
- **Score (★)**: Bonus points for the team/player

### Game States & Flow
- **Title Screen**: Professional welcome interface with start button
- **Player Count Selection**: Choose between 1 or 2 players with large, engaging buttons
- **Mode Selection**: Contextual mode options based on player count with high score display
- **Active Gameplay**: Real-time game with appropriate UI for selected mode
- **Winner Screen**: VS Mode victory celebration with golden effects and particle systems
- **Game Over Screen**: Final score display with restart functionality and high score comparison

### Game End Conditions
- **Single Player**: Game ends when the player loses all health
- **VS Mode**: Game ends when one player loses all health, other player wins
- **Co-op Mode**: Game ends when the team loses all 5 shared lives

## 🔧 Development Setup

### Prerequisites
- Node.js and npm installed
- Modern web browser

### Installation & Running
```bash
# Install dependencies
npm install

# Start development server
npm start

# The game will open automatically in your default browser
```

### Development Commands
```bash
npm start    # Start development server
npm run dev  # Start with file watching
npm run build # Prepare for deployment
```

## 💻 Code Highlights

### Advanced Features Demonstrated

1. **Object-Oriented Design**: Clean class structure with inheritance and composition
2. **Multi-Mode Game Architecture**: Dynamic switching between single, competitive, and cooperative modes
3. **Intelligent Navigation Flow**: Intuitive user flow with contextual mode selection
4. **Complex Game State Management**: Handling different life systems, win conditions, and UI states
5. **Dynamic UI Generation**: Context-aware interface that adapts to player count and mode selection
6. **Multiplayer Architecture**: Simultaneous multi-player input handling and state management
7. **Vector Mathematics**: Custom Vector2 class for 2D physics calculations
8. **Particle Systems**: Advanced particle effects with lifecycle management
9. **Audio Management**: Web Audio API integration with dynamic sound effects
10. **Game Loop Optimization**: Proper game loop with delta time calculations and multiple screen states
11. **Collision Detection**: Efficient circle-based collision algorithms for multiple entities
12. **Mode-Specific Data Persistence**: Separate high score tracking for each game mode
13. **Memory Management**: Proper cleanup of game objects and particles
14. **Performance Optimization**: RequestAnimationFrame for smooth 60fps gameplay

### Key Programming Concepts

- **ES6+ Features**: Classes, arrow functions, destructuring, template literals
- **Canvas API**: Advanced 2D rendering techniques
- **Web Audio API**: Dynamic audio generation and management
- **Multi-Mode Game Design**: Single-player, competitive, and cooperative game mechanics
- **Game Development Patterns**: Entity-Component-System architecture
- **Physics Simulation**: Velocity, acceleration, and friction
- **Event Handling**: Multiple keyboard input streams and UI interaction management
- **Animation**: Smooth interpolation and easing functions
- **Complex State Management**: Game states, win conditions, and mode transitions
- **Competitive & Cooperative Gameplay**: Different multiplayer paradigms and mechanics

## 🎨 Visual & Audio Features

- **Dynamic Lighting**: Glowing effects and gradients
- **Particle Systems**: Explosions, trails, and environmental effects
- **Smooth Animations**: 60fps gameplay with proper delta time
- **Immersive Audio**: Dynamic sound effects and background music
- **Responsive UI**: Adapts to different screen sizes
- **Professional Styling**: Modern space theme with CSS3 effects
- **Custom Favicon**: Branded game icon

## 🌟 Portfolio Value

This game demonstrates:

- **Technical Skills**: Advanced JavaScript, HTML5 Canvas, Web Audio API, multi-mode game development
- **Problem Solving**: Complex collision detection, performance optimization, state management, competitive/cooperative mechanics
- **Code Quality**: Clean, documented, maintainable code architecture with flexible design patterns
- **User Experience**: Intuitive controls, multiple engaging gameplay modes, polished UI/UX
- **Visual Design**: Professional-grade graphics and effects
- **Audio Design**: Immersive sound experience with user controls
- **Game Design**: Multiple gameplay paradigms (single-player, competitive, cooperative)
- **System Architecture**: Flexible, extensible codebase supporting different game modes

## 📱 Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 🚀 Deployment

The game is ready for deployment to any static hosting service:

1. **GitHub Pages**: Upload to repository and enable Pages
2. **Netlify**: Drag and drop the project folder
3. **Vercel**: Connect repository for automatic deployment

## 📈 Future Enhancements

Potential improvements to showcase additional skills:

- **Advanced Audio**: Spatial audio and dynamic music system
- **Multiplayer**: WebSocket-based real-time gameplay
- **WebGL**: 3D graphics and advanced shaders
- **Progressive Web App**: Service workers and offline functionality
- **Leaderboards**: Backend integration with databases
- **Mobile Controls**: Touch and gyroscope support

## 🏆 Achievement Unlocked

**Portfolio Game Complete!** - Successfully created a professional-grade game demonstrating advanced web development skills.

---

*Built with passion for clean code and engaging user experiences.*