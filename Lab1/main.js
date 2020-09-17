const WALL = -1;
const BLANK = -2;
const EXIT_WAY = -3;

let W = 10;
let H = 10;
let endX = W - 1;
let endY = H - 1;

let px = [];
let py = [];
let len;
let grid = [
  [BLANK, BLANK, WALL, BLANK, WALL, BLANK, WALL, WALL, WALL, WALL],
  [WALL, BLANK, BLANK, WALL, WALL, BLANK, WALL, WALL, WALL, WALL],
  [WALL, WALL, BLANK, BLANK, WALL, BLANK, WALL, WALL, WALL, WALL],
  [WALL, WALL, WALL, BLANK, BLANK, WALL, WALL, WALL, WALL, WALL],
  [WALL, WALL, WALL, WALL, BLANK, BLANK, WALL, WALL, WALL, WALL],
  [WALL, WALL, WALL, WALL, WALL, BLANK, BLANK, BLANK, WALL, WALL],
  [WALL, WALL, WALL, WALL, WALL, WALL, WALL, BLANK, WALL, WALL],
  [WALL, WALL, WALL, WALL, WALL, BLANK, WALL, BLANK, BLANK, WALL],
  [WALL, WALL, WALL, WALL, WALL, BLANK, WALL, WALL, BLANK, BLANK],
  [WALL, WALL, WALL, WALL, WALL, BLANK, WALL, WALL, WALL, BLANK],
];

const lee = (ax, ay, bx, by) => {
  const dx = [1, 0, -1, 0];
  const dy = [0, 1, 0, -1];
  let d;
  let x;
  let y;
  let k;
  let stop;

  if (grid[ay][ax] == WALL || grid[by][bx] == WALL) return false;

  d = 0;
  grid[ay][ax] = 0;
  do {
    stop = true;
    for (y = 0; y < W; ++y)
      for (x = 0; x < H; ++x)
        if (grid[y][x] == d) {
          for (k = 0; k < 4; ++k) {
            let iy = y + dy[k];
            let ix = x + dx[k];
            if (
              iy >= 0 &&
              iy < H &&
              ix >= 0 &&
              ix < W &&
              grid[iy][ix] == BLANK
            ) {
              stop = false;
              grid[iy][ix] = d + 1;
            }
          }
        }
    d++;
  } while (!stop && grid[by][bx] == BLANK);

  if (grid[by][bx] == BLANK) {
    return false;
  }

  len = grid[by][bx];
  x = bx;
  y = by;
  d = len;
  while (d > 0) {
    px[d] = x;
    py[d] = y;
    d--;
    for (k = 0; k < 4; ++k) {
      const iy = y + dy[k];
      const ix = x + dx[k];
      if (iy >= 0 && iy < H && ix >= 0 && ix < W && grid[iy][ix] == d) {
        x = x + dx[k];
        y = y + dy[k];
        break;
      }
    }
  }
  px[0] = ax;
  py[0] = ay;
  return true;
};

const onLoad = () => {
  drawGrid();
  document
    .getElementById('gen-btn')
    .addEventListener('click', () => resetGrid());
};

const clickableGrid = (rows, cols, callback, labirintGrid) => {
  let i = 0;
  let grid = document.createElement('table');
  grid.id = 'table';
  grid.className = 'grid';
  for (let r = 0; r < rows; ++r) {
    let tr = grid.appendChild(document.createElement('tr'));
    for (let c = 0; c < cols; ++c) {
      let cell = tr.appendChild(document.createElement('td'));
      cell.innerHTML = ++i;
      if ((r === 0 && c == 0) || (r === W - 1 && c === H - 1)) {
        cell.style.background = '#03a762';
        cell.style.color = '#fff';
      } else if (labirintGrid[r][c] === EXIT_WAY) {
        cell.className = 'exit-way';
      } else if (labirintGrid[r][c] === WALL) {
        cell.className = 'wall';
      }
      cell.addEventListener(
        'click',
        ((el, r, c, i) => {
          return function () {
            callback(el, r, c, i);
          };
        })(cell, r, c, i),
        false
      );
    }
  }
  return grid;
};

const findWay = () => {
  if (lee(0, 0, endX, endY)) {
    document.getElementById('alert-found').style.display = 'initial';
    document.getElementById('alert-not-found').style.display = 'none';
    drawExit();
  } else {
    document.getElementById('alert-found').style.display = 'none';
    document.getElementById('alert-not-found').style.display = 'initial';
  }
};

const drawGrid = () => {
  const drawing = clickableGrid(
    H,
    W,
    (el, row, col, i) => {
      console.log('You clicked on element:', el);
      console.log('You clicked on row:', row);
      console.log('You clicked on col:', col);
      console.log('You clicked on item #:', i);
    },
    grid
  );

  document.body.appendChild(drawing);
};

const drawExit = () => {
  for (let i = 0, j = 0; i < px.length, j < py.length; i++, j++) {
    grid[py[i]][px[j]] = EXIT_WAY;
  }
  document.getElementById('table').remove();
  drawGrid();
};

const resetGrid = () => {
  document.getElementById('alert-found').style.display = 'none';
  document.getElementById('alert-not-found').style.display = 'none';
  document.getElementById('table').remove();
  for (let i = 0; i < H; i++) {
    for (let j = 0; j < W; j++) {
      grid[i][j] = Math.floor(Math.random() * 2) + 1 === 1 ? WALL : BLANK;
    }
  }
  grid[0][0] = BLANK;
  grid[0][1] = BLANK;
  grid[1][0] = BLANK;
  grid[W - 1][H - 1] = BLANK;
  grid[W - 2][H - 1] = BLANK;
  grid[W - 2][H - 1] = BLANK;
  grid[W - 3][H - 1] = BLANK;
  grid[W - 2][H - 2] = BLANK;
  drawGrid();
};
