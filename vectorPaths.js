let grid = []
let radianArray = []
let rows, cols
let space = 25
let yo = 0
let inc = 0.065

function setup() {
    createCanvas(1000, 1000)
    strokeWeight(2)
    cols = width / space
    rows = height / space
    for (let y = 0; y < rows; y++) {
        let row = []
        let xo = 0
        for (let x = 0; x < cols; x++) {
            let t = map(noise(xo, yo), 0, 1, 0, 2 * TAU)
            row.push(new VPoint(x, y, t))
            xo += inc
        }
        yo += inc
        grid.push(row)
    }
    for (let i = 0; i < 17; i++) radianArray.push(i * QUARTER_PI)
}

function draw() {
    stroke(0)
    let r = floor(random(rows))
    let c = floor(random(cols))
    let nextPoint = grid[r][c]

    while (true) {
        ellipse(nextPoint.x * space, nextPoint.y * space, 10)
        let theta = closestValue(nextPoint.t, radianArray)
        let directions = provideDirs(theta)
        c += directions[1]
        r += directions[0]
        if (c < 0 || c >= rows || r < 0 || r >= rows) break
        nextPoint = grid[r][c]
    }
    
    for (i in grid) {
        for (j in grid[i]) {
            stroke(0, 50)
            push()
            translate(grid[i][j].x * space, grid[i][j].y * space)
            let theta = grid[i][j].t
            line(0, 0, cos(theta) * space, sin(theta) * space)
            pop()
        }
    }
    noLoop()
}

/* 
    Function made with ChatGPT-3. 
    Takes angle, theta, and compares to list 
    of angles to determine which is closest to theta.
*/
function closestValue(theta, array) {  
    let minDiff = Infinity   // Set initial minimum difference to infinity  
    let closestVal          // Variable to store the closest value  
  
    for (let val of array) {   // Loop through each value in the array  
      const diff = abs(val - theta)   // Get absolute difference between current value and 'theta'
  
      if (diff < minDiff) {     // If this difference is smaller than what we had before  
        minDiff = diff         // Update minimum difference  
        closestVal = val      // Store this as our closest value so far  
      }  
    }
  
    return closestVal    // Return the closest value found in the array  
}

function getNeighbors(r, c) {
    let angles = []
    for (let i = -1; i <= 1; i++)   {
        if (r - 1 >= 0) {
            if (c + i >= 0 && c + i <= rows - 1) angles.push(grid[r - 1][c + i])
        }
        if (r + 1 <= rows - 1) {
            if (c + i >= 0 && c + i <= rows - 1) angles.push(grid[r + 1][c + i])
        }
    }
    if (c - 1 >= 0) angles.push(grid[r][c - 1])
    if (c + 1 <= rows - 1) angles.push(grid[r][c + 1])
    return angles
}

class VPoint {
    constructor(x, y, t) {
        this.x = x
        this.y = y
        this.t = t
    }
}

function provideDirs(t) {
    const directions = [[0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1]]
    const index = round(t / (0.7853981633974483))
    return directions[index % 8]
}
