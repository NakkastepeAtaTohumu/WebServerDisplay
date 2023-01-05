var humidity = [0.2, 0.4, 0.6, 0.1, 0, 0.8, 0.4, 0.6, 0.3, 0.2, 0.9, 0.6, 0.4, 0.1, 0, 0.5];  //DATA
var irrigating = [false, true, true, false];  //DATA
var statusOK = [true, true, false, true];  //DATA
var statusMSG = ["DIS\nCON\nNEC\nTED", "DIS\nCON\nNEC\nTED", "DIS\nCON\nNEC\nTED", "DIS\nCON\nNEC\nTED"];  //DATA

let bgColor = "#00000000";
let cellColor = "8f8f8f";


let m_gridSize = 4;
let m_desiredWidth = 485;

let m_cellSize = 64;
let m_xPadding = 32;
let m_yPadding = 32;
let m_cellBorderPadding = 8;
let m_medianPadding = 64;
let m_cellToBorderRatio = 3

let m_canvas;

var m_sketch;

function setupMoistureDashboard(s) {
    let cellSizeCoeff = (m_gridSize) * m_cellToBorderRatio + (m_gridSize - 2) * 1

    let contentSize = m_desiredWidth - m_xPadding * 2 - m_medianPadding;
    let cellContentSize = contentSize / cellSizeCoeff;

    m_cellSize = cellContentSize * m_cellToBorderRatio;
    m_cellBorderPadding = cellContentSize * 1;

    console.log(m_cellSize, m_cellBorderPadding)

    m_sketch = s

    m_sketch.canvas = m_sketch.createCanvas(m_desiredWidth, (m_desiredWidth - m_medianPadding + m_cellBorderPadding - m_xPadding * 2 + m_yPadding * 2));
    m_sketch.canvas.parent("display")
}

function drawColumn(xIndex, x) {
    if (irrigating[xIndex]) {
        let contentHeight = m_cellSize * 4 + m_cellBorderPadding * 2 + m_medianPadding;

        let g = m_sketch.millis() % 2000 < 1000 ? 128 : 0;
        m_sketch.fill(0, g, 255);
        m_sketch.rect(x - m_cellBorderPadding / 2, m_yPadding - m_cellBorderPadding / 2, m_cellSize + m_cellBorderPadding, contentHeight, 0)
    }

    if (statusOK[xIndex]) {
        for (let yIndex = 0; yIndex < m_gridSize; yIndex++) {
            let y = yIndex * (m_cellSize + m_cellBorderPadding) + m_yPadding;

            drawCell(x, y, xIndex, yIndex)
        }
    }
    else {
        let contentHeight = m_cellSize * 4 + m_cellBorderPadding * 2 + m_medianPadding;

        let g = m_sketch.millis() % 500 < 250 ? 255 : 0;
        m_sketch.fill(255, g, 0)
        m_sketch.rect(x - m_cellBorderPadding / 2, m_yPadding - m_cellBorderPadding / 2, m_cellSize + m_cellBorderPadding, contentHeight, 0)

        m_sketch.fill(0);
        m_sketch.text(statusMSG[xIndex], x + 16, m_yPadding + contentHeight / 2 - 64)
    }
}

function drawCell(x, y, xIndex, yIndex) {
    let fillRed = humidity[xIndex + yIndex * m_gridSize] < 0.35 || humidity[xIndex + yIndex * m_gridSize] > 0.5 ? 255 : 0;
    let fillGreen = humidity[xIndex + yIndex * m_gridSize] < 0.6 && humidity[xIndex + yIndex * m_gridSize] > 0.15 ? 255 : 0;

    m_sketch.fill(fillRed, fillGreen, 0);
    m_sketch.rect(x, y, m_cellSize, m_cellSize, 0)

    m_sketch.fill(0);
    // Avoid float hell with parseInt
    m_sketch.text(parseInt(humidity[xIndex + yIndex * m_gridSize] * 100) + "%", x + m_cellSize / 2 - 24, y + 64)
}

function drawMoistureDashboard(s) {
    m_sketch.background(bgColor);

    m_sketch.fill(cellColor);
    m_sketch.noStroke();
    m_sketch.textSize(25);
    for (let xIndex = 0; xIndex < m_gridSize; xIndex++) {
        let x = xIndex * m_cellSize + (xIndex < m_gridSize / 2 ? xIndex : xIndex - 1) * m_cellBorderPadding + m_xPadding + (xIndex >= m_gridSize / 2 ? m_medianPadding : 0);

        drawColumn(xIndex, x)
    }
}

var moisture_sketch = function( sketch ) {
    sketch.setup = () => setupMoistureDashboard(sketch)
    sketch.draw = () => drawMoistureDashboard(sketch)
};

new p5(moisture_sketch)
