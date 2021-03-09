const images = {
  imgKaboom: './images/cartoon-kaboom.png',
  imgDanger: './images/danger.png',
  imgDirt: './images/dirt.png',
  imgGrass: './images/grass2.jpeg',
  imgLandmine: './images/landmine.png'
}

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  let width = 10
  let mineAmount = 20
  let flags = 0
  let plots = []
  let isGameOver = false

  // Create Board
  createBoard = () => {

    // Get shuffled game array with random mines
    const minesArray = Array(mineAmount).fill('mine')
    const emptyArray = Array(width*width - mineAmount).fill('valid')
    const gameArray = emptyArray.concat(minesArray)
    const shuffledArray = gameArray.sort(() => Math.random() -0.5)

    for (let i = 0; i < width*width; i++) {
      const plot = document.createElement('div')
      plot.setAttribute('id', i)
      plot.classList.add(shuffledArray[i])
      grid.appendChild(plot)
      plots.push(plot)

      // Normal click
      plot.addEventListener('click', e => {
        uncoverPlot(plot)
      })

      // Ctrl + left click
      plot.oncontextmenu = e => {
        e.preventDefault()
        toggleFlag(plot)
      }
    }

    // Add number of surrounding mines
    for (let i = 0; i < plots.length; i++) {
      let total = 0
      const isLeftEdge = (i % width === 0)
      const isRightEdge = (i % width === width -1)

      if (plots[i].classList.contains('valid')) {
        // Check plots to the west for mine
        if (i > 0 && !isLeftEdge && plots[i - 1].classList.contains('mine')) total++
        // Check plots to the northwest for mine
        if (i > 11 && !isLeftEdge && plots[i - 1 - width].classList.contains('mine')) total++
        // Check plots to the north for mine
        if (i > 10 && plots[i - width].classList.contains('mine')) total++
        // Check plots to the northeast for mine
        if (i > 9 && !isRightEdge && plots[i + 1 - width].classList.contains('mine')) total++
        // Check plots to the east for mine
        if (i < 98 && !isRightEdge && plots[i + 1].classList.contains('mine')) total++
        // Check plots to the southeast for mine
        if (i < 88 && !isRightEdge && plots[i + 1 + width].classList.contains('mine')) total++
        // Check plots to the south for mine
        if (i < 89 && plots[i + width].classList.contains('mine')) total++
        // Check plots to the southwest for mine
        if (i < 90 && !isLeftEdge && plots[i - 1 + width].classList.contains('mine')) total++

        plots[i].setAttribute('data-mines', total)
      }
    }

    plots.forEach(plot => {
      const img = document.createElement('img')
      img.setAttribute('src', images.imgGrass)
      plot.appendChild(img)
    })
  }

  createBoard()

  // Add flag with right click 
  toggleFlag = plot => {
    if (isGameOver) return
    if (!plot.classList.contains('checked') && (flags < mineAmount)) {
      if (!plot.classList.contains('flag')) {
        plot.classList.add('flag')
        plot.innerText = 'A'
        flags++
        checkForWin()
      } else {
        plot.classList.remove('flag')
        plot.innerText = ''
        flags--
      }
    }
  }

  // Click on plot handler
  uncoverPlot = plot => {
    const child = plot.childNodes[0]
    let currentId = plot.id
    let uncovered = false 

    if (plot.classList.contains('checked') || plot.classList.contains('flag')) {
      uncovered = true
    }

    if (isGameOver || uncovered) return

    // Selected plot is a mine else it's valid
    if (plot.classList.contains('mine')) {
      gameOver(plot)
    } else {
      let total = plot.getAttribute('data-mines')
      
      if (total !=0) {
        plot.classList.add('checked')
        child.setAttribute('src', images.imgDirt)
        console.log(child)
        // plot.innerText = total
        return
      }
      checkNeighbours(plot, currentId)
    }
    plot.classList.add('checked')
    child.setAttribute('src', images.imgDirt)
  }

  // Check neighbouring plots when a plot is clicked
  checkNeighbours = (plot, currentId) => {
    const isLeftEdge = (currentId % width === 0)
    const isRightEdge = (currentId % width === width - 1)

    setTimeout(() => {
      if (currentId > 0 && !isLeftEdge) {
        const newId = plots[parseInt(currentId) -1].id
        checkNextPlot(newId)
      }
      if (currentId > 9 && !isRightEdge) {
        const newId = plots[parseInt(currentId) + 1 - width].id
        checkNextPlot(newId)
      }
      if (currentId > 10) {
        const newId = plots[parseInt(currentId - width)].id
        checkNextPlot(newId)
      }
      if (currentId > 11 && !isLeftEdge) {
        const newId = plots[parseInt(currentId) - 1 - width].id
        checkNextPlot(newId)
      }
      if (currentId < 98 && !isRightEdge) {
        const newId = plots[parseInt(currentId) + 1].id
        checkNextPlot(newId)
      }
      if (currentId < 90 && !isLeftEdge) {
        const newId = plots[parseInt(currentId) - 1 + width].id
        checkNextPlot(newId)
      }
      if (currentId < 88 && !isRightEdge) {
        const newId = plots[parseInt(currentId) + 1 + width].id
        checkNextPlot(newId)
      }
      if (currentId < 89) {
        const newId = plots[parseInt(currentId) + width].id
        checkNextPlot(newId)
      }
    }, 10)
  }

  // Assigns ID for the next plot to be checked and 
  checkNextPlot = id => {
    const newPlot = document.getElementById(id)
    uncoverPlot(newPlot)
  }

  gameOver = plot => {
    isGameOver = true
    console.log('Kaboom!')

    // Show all mine locations
    plots.forEach(plot => {
      if (plot.classList.contains('mine')) {
        plot.innerText = 'X'
      }
    })
  }

  // Check for win
  checkForWin = () => {
    let matches = 0
    for (let i = 0; i < plots.length; i++) {
      if (plots[i].classList.contains('flag') && plots[i].classList.contains('mine')) {
        matches++
      }
      if (matches === mineAmount) {
        console.log('Well done, soldier! You made it through in one piece.')
        isGameOver = true
      }
    }
  }

})