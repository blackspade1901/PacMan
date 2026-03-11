# PacMan Game

A browser-based PacMan remake developed as part of MCA coursework. Uses HTML5 canvas for rendering, JavaScript for game logic, and local storage for leaderboard.

## Features

- Tile-based map loaded from a character grid
- Player-controlled PacMan with keyboard input
- Four ghosts with basic AI and chase behavior
- Food items and scoring system
- Level progression with increasing difficulty
- Lives, game over screen, and top-5 leaderboard
- Intro screen with music and animations

## Getting Started

1. Open `index.html` in a modern web browser (Chrome/Firefox/Edge).
2. Ensure the `Output` folder contains the `pacman-elements` images and `pacman-music` audio files with correct relative paths.
3. Press any key to start, use arrow keys or WASD to move PacMan.

## Map Legend

- `X` = Wall
- `P` = PacMan (player)
- `r` = Red Ghost
- `b` = Blue Ghost
- `o` = Orange Ghost
- `p` = Pink Ghost
- ` ` = Empty space (food spawns)
- `O` = Tunnel/unused space

## Project Structure

```
Code/
  index.html
  pacman.css
  pacman.js
Output/
  pacman-elements/  (images)
  pacman-music/     (audio)
```

## Development Notes

- Game logic is in `pacman.js`.
- Entities are represented by `Block` objects with movement and collision handling.
- Leaderboard uses `localStorage` to persist top scores.

## License

Feel free to use and modify this code for learning and personal projects.
