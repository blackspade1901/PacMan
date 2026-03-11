# PacMan Game

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)

A feature-rich, browser-based PacMan game developed as part of MCA coursework. This project extends the original implementation by [ImKennyYip](https://github.com/ImKennyYip/pacman) with enhanced gameplay features, audio integration, persistent leaderboards, and polished user experience.

---

## ✨ Features

### Core Gameplay
- **Tile-based Map System** — Classic PacMan maze loaded from a character grid
- **Smooth Player Controls** — Responsive keyboard input (Arrow keys & WASD)
- **Ghost AI** — Four colored ghosts with randomized movement patterns
- **Scoring System** — Real-time score tracking with point accumulation
- **Level Progression** — Advance to next level after clearing all pellets
- **Lives System** — Visual heart icons representing remaining lives

### 🎵 Audio Integration *(Added)*
Full sound effects and background music enhance the gameplay experience:
- **Background Music** — Looping theme during gameplay
- **Chomp Sound** — Pellet consumption feedback
- **Death Sound** — Game over audio cue
- **Fruit Collection** — Distinct sounds for bonus items
- **Intermission Theme** — Level transition music

*Audio files included: 7 sound effects (MP3/WAV format)*

### 🏆 Leaderboard System *(Added)*
- **Top 5 High Scores** — Persistent leaderboard using `localStorage`
- **Score Submission** — Automatic ranking and storage after game over
- **Cross-session Persistence** — Scores saved locally in browser storage

### 🎨 Enhanced Visuals *(Added)*
- **Animated Intro Screen** — Welcome screen with music and key press prompt
- **Heart Icons for Lives** — Visual representation instead of text counter
- **Power Pellet Graphics** — Dedicated sprite for power-ups
- **Game Over Screen** — Clean end-game display with leaderboard

### 📁 Organized Project Structure *(Added)*
```
PacMan/
├── Code/
│   ├── index.html          # Main HTML entry point
│   ├── pacman.css          # Styling and layout
│   └── pacman.js           # Game logic (575 lines)
├── Assets/
│   ├── pacman-elements/    # 14 PNG sprites (ghosts, PacMan, walls, items)
│   └── pacman-music/       # 7 audio files (background, SFX)
└── README.md
```

---

## 🎮 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Edge, Safari)
- No additional dependencies or build tools required

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/blackspade1901/PacMan.git
   cd PacMan
   ```

2. **Open the game**
   - Navigate to the `Code/` folder
   - Open `index.html` in your browser
   - Or use a local server:
     ```bash
     # Python 3
     python -m http.server 8000
     
     # Node.js
     npx http-server
     ```

3. **Start playing**
   - Press any key on the intro screen to begin
   - Use **Arrow Keys** or **WASD** to move PacMan
   - Eat all pellets to advance to the next level
   - Avoid ghosts or lose a life!

---

## 🕹️ Controls

| Key | Action |
|-----|--------|
| `↑` | Move Up |
| `↓` | Move Down |
| `←` | Move Left |
| `→` | Move Right |
| `Any Key` | Start Game (on intro screen) |

---

## 🗺️ Map Legend

The game map is defined using the following character codes:

| Symbol | Meaning |
|--------|---------|
| `X` | Wall (impassable) |
| `P` | PacMan starting position |
| `r` | Red Ghost |
| `b` | Blue Ghost |
| `o` | Orange Ghost |
| `p` | Pink Ghost |
| ` ` (space) | Empty tile (food pellet spawns here) |
| `O` | Tunnel/unused space |

---

## 🆕 Enhancements Over Original

This project builds upon [ImKennyYip's PacMan tutorial](https://github.com/ImKennyYip/pacman) with the following additions:

### Feature Comparison

| Feature | Original Repo | This Repo |
|---------|---------------|-----------|
| **Code Size** | 351 lines | 575 lines (+64%) |
| **Audio System** | ❌ None | ✅ 7 sound effects + background music |
| **Intro Screen** | ❌ None | ✅ Animated splash screen with music |
| **Leaderboard** | ❌ None | ✅ Top 5 scores with localStorage |
| **Lives Display** | Text-based (`x3`) | Visual heart icons |
| **Game Over Screen** | Simple reset | Dedicated screen with leaderboard |
| **Project Structure** | Flat (all files in root) | Organized (`Code/` + `Assets/`) |
| **Asset Count** | 15 image files | 14 images + 7 audio files |
| **File Size** | ~143 KB | ~19 MB (due to audio assets) |

### New Code Features
- `gameStarted` flag for intro screen control
- `sounds` object for centralized audio management
- `leaderboard` array with localStorage persistence
- `drawIntro()` function for animated splash screen
- `saveLeaderboard()` and `displayLeaderboard()` functions
- Enhanced visual rendering (heart icons, power pellet sprites)

---

## 🛠️ Technical Details

### Technologies Used
- **HTML5 Canvas** — Rendering engine for all graphics
- **Vanilla JavaScript (ES6)** — Game logic and entity management
- **CSS3** — Styling and layout
- **Web Storage API** — localStorage for leaderboard persistence
- **Web Audio API** — Sound effect and music playback

### Game Architecture
- **Tile-based Rendering** — 21×19 grid (32px tiles)
- **Entity System** — `Block` class for PacMan, ghosts, walls, and food
- **Game Loop** — `requestAnimationFrame` for smooth 60 FPS rendering
- **Collision Detection** — Grid-based boundary checking
- **State Management** — Lives, score, level tracking

### Browser Compatibility
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Edge 90+
- ✅ Safari 14+

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is open source and available for educational and personal use. Feel free to use and modify the code for learning purposes.

---

## 🙏 Credits

### Original Implementation
- **ImKennyYip** — [Original PacMan Tutorial](https://github.com/ImKennyYip/pacman)
  - Base game logic and rendering system
  - Tutorial video: [YouTube Link](https://youtu.be/WxeTMsaSOaA)

### Enhancements & Extensions
- **blackspade1901** — Audio integration, leaderboard system, intro screen, visual improvements, project restructuring

### Assets
- PacMan sprites and ghost graphics (PNG)
- Sound effects and background music (MP3/WAV)

---

## 📧 Contact

**Developer:** blackspade1901  
**Repository:** [github.com/blackspade1901/PacMan](https://github.com/blackspade1901/PacMan)

---

## 🎯 Future Enhancements

Potential features for future development:

- [ ] Power pellets (eat ghosts temporarily)
- [ ] Wrap-around tunnels on left/right edges
- [ ] Improved ghost AI (pathfinding/chase behavior)
- [ ] Multiple difficulty levels
- [ ] Mobile touch controls
- [ ] High score submission to cloud database
- [ ] Additional maze layouts
- [ ] Fruit bonus items with point variations

---

<p align="center">Made with ❤️ as part of MCA coursework</p>
