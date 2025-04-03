let canvas = document.getElementById('main-grid')
let clearButton = document.getElementById('click')
let submitButton = document.getElementById('getData')
let context = canvas.getContext("2d");
context.fillStyle = 'white'
context.fillRect(0, 0, canvas.width, canvas.height)
let drawing = false

 canvas.addEventListener('mousedown', () => drawing = true)
 canvas.addEventListener('mouseup', () => drawing = false)
 canvas.addEventListener('mousemove', draw)
 clearButton.addEventListener('click', clearGrid)
 submitButton.addEventListener('click', sendData)

 function draw(event)
 {
    if(drawing)
    {
        
        let rect = canvas.getBoundingClientRect()
        let mousePosX = event.clientX - rect.left
        let mousePosY = event.clientY - rect.top
        mousePosX = Math.floor(mousePosX/20)*20
        mousePosY = Math.floor(mousePosY/20)*20
        context.fillStyle = 'black'
        context.fillRect(mousePosX, mousePosY, 40, 40)
    }
    else
    {
        return
    }
 }

 function clearGrid()
 {
    context.fillStyle = 'white'
    context.fillRect(0, 0, canvas.width, canvas.height)

 }

 function getGrayScaleVals()
 {
    let imgData = context.getImageData(0, 0, canvas.width, canvas.height)
    let imgArray = imgData.data

    let grayScale = []
    for(let y = 0; y < 560; y += 20)
    {
        let row = []
        for(let x = 0; x < 560; x += 20)
        {
            let index = (y * 560 + x)*4

            let r = imgArray[index]
            let g = imgArray[index + 1]
            let b = imgArray[index + 2]

            grayVal = Math.round(0.3 * r + 0.59 * g + 0.11 * b);
            row.push((grayVal/255))
        }
        grayScale.push(row)
    }
    return grayScale
 }

 function sendData()
 {
    let dataGrayScale = getGrayScaleVals()
    fetch('http://127.0.0.1:5000/predict', {method: 'POST', 
        headers: {'Content-Type':'application/json'},
        body:JSON.stringify({data: dataGrayScale})
    })
    .then(response => response.json())
    .then(data => {
        console.log("Response Data:", data);
        document.getElementById('predBox').value = `${data.prediction}`
    })
    .catch(error => {console.error('Error : ', error)})       
 }