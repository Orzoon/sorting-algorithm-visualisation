window.addEventListener('load', () => {
    let canvas = document.getElementById('canvas');
    let playButton = document.getElementById('play');
    let playIcon = document.getElementById('playIcon');
    let pauseIcon =document.getElementById('pauseIcon');
    let pauseButton = document.getElementById('pause');
    let select = document.getElementById('algorithm');
    let c = undefined;
    if(canvas.getContext('2d')){
        c = canvas.getContext('2d');
    }
    else{
        console.log('canvas not supported')
    }
    canvas.height = document.documentElement.clientHeight;
    canvas.width = document.documentElement.clientWidth;
    //setUp Variables
    let paused = false;
    let arrayLength = 200;
    let lineXGap = 2;
    let lineSize = 1;
    let currentAlgorithm = null;
    let i = 0;
    let j = 0;
    let arrayListToSort = [];
    let totXLength = 0;
    let animating = true;
    let timerId;
    //Event Listeners
    playButton.addEventListener('click', runAlgorithm);
    pauseButton.addEventListener('click', pauseAlgorithm);
    select.addEventListener('change', changeColor);
    //// ALGORITHMS VARIABLES
    let combSortGap = 0;
    let combSortGapInitial = true;
    let selectionSortMIN = 0;
    let setInsertionLoop = true;
    for(s = 0; s < arrayLength; s++){
        arrayListToSort[s] = Math.floor(Math.random()* (canvas.height-100))
        totXLength = totXLength + lineXGap;
    }
    function runAlgorithm(btnIndicator){
        paused = false;
        animating = true;
        let algorithmToRun = document.getElementById("algorithm").value.trim();
        if(currentAlgorithm === null){
            currentAlgorithm = algorithmToRun;
        }
        else if(currentAlgorithm !== algorithmToRun){
            currentAlgorithm = algorithmToRun;
            cancelAnimationFrame(timerId)
            initialSetup();
        }
        else if(currentAlgorithm === algorithmToRun){
            if(btnIndicator !== 'pausedBtn'){
                cancelAnimationFrame(timerId)
                initialSetup();
            }
        }
        //Styles
        playButton.style.color = "#300a44";
        playIcon.style.color = "#300a44";
        pauseButton.style.color = "#300a44";
        pauseIcon.style.color = "#300a44";
        switch(algorithmToRun){
            case 'drawBubbleSort': drawBubbleSort(arrayListToSort) 
            break;
            case 'drawCombSort': drawCombSort(arrayListToSort);
            break;
            case 'drawSelectionSort': drawSelectionSort(arrayListToSort);
            break;
            case 'drawInsertionSort': drawInsertionSort(arrayListToSort);
            break;
        }
        // if(algorithmToRun == 'drawBubbleSort'){
        //     drawBubbleSort(arrayListToSort);
        // } 
    }
    function initialSetup(){
         paused = false;
         arrayLength = 200;
         lineXGap = 2;
         lineSize = 1;
         i = 0;
         j = 0;
         c.clearRect(0,0,canvas.width, canvas.height)
         pauseButton.style.color = "#300a44";
         pauseIcon.style.color = "#300a44";
         pauseButton.childNodes[1].innerText = 'Pause';
    }
    function pauseAlgorithm(){
        let selection = select.value.trim();
        if(selection == "select" ){
            return
        }
        if(paused === false){
            animating = false;
            paused = true;
            pauseButton.childNodes[1].innerText = 'Resume';
            pauseButton.style.color = "#007d60";
            pauseIcon.style.color = "#007d60";
            playButton.style.color = "#300a44";
            playIcon.style.color = "#300a44";
            //playButton.disabled = true;
        }
        else {
            animating = true;
            paused = false
            pauseButton.childNodes[1].innerText = 'Pause';
            pauseButton.style.color = "#300a44";
            pauseIcon.style.color = "#300a44";
            //playButton.disabled = false;
            runAlgorithm("pausedBtn");
        }
    }

    function finishExecution(){
        if(paused === false && animating === false){
           finalDraw();
        }
        else if(paused === true) {
            animating = false
        }
    }
    function changeColor(){
      let selection = select.value.trim();
      if(selection !== "select"){
        playButton.style.color = "#007d60";
        playIcon.style.color = "#007d60";
        pauseButton.childNodes[1].innerText = 'Pause'
        pauseButton.style.color = "#300a44";
        pauseIcon.style.color = "#300a44";
      }
    }
    function finalDraw(){
        c.clearRect(0,0,canvas.width, canvas.height)
        for(z = 0; z < arrayListToSort.length; z ++){
            c.beginPath();
            c.moveTo(canvas.width/2 - totXLength/2 + (z * lineXGap), 0);
            c.lineTo(canvas.width/2 - totXLength/2 + (z * lineXGap),arrayListToSort[z]);
            c.lineWidth = lineSize;
            c.strokeStyle = 'green'
            c.stroke();
        }
    }
    /*--------------------------------------------*/
    /*------------DRAWING SORTING FUNCTIONS---------------*/
    /*-----------DRAWBUBBLESORT------------*/
    function drawBubbleSort(){
        if(animating){
            console.log('running')
            timerId =  window.requestAnimationFrame(drawBubbleSort)
            c.clearRect(0,0, canvas.width, canvas.height)
            if( j >arrayListToSort.length-i-1){
                j = 0;
                i++;
            }
            for(x = 0; x < arrayListToSort.length; x ++){
                c.beginPath();
                c.moveTo(canvas.width/2 - totXLength/2 + (x * lineXGap), 0);
                c.lineTo(canvas.width/2 - totXLength/2 + (x * lineXGap),arrayListToSort[x]);
                c.lineWidth = lineSize;
                if(x === j){
                    c.strokeStyle = 'red'
                }
                else if(x === j-1){
                    c.strokeStyle = 'blue'
                }
                else if(x > arrayListToSort.length-i-1){
                    c.strokeStyle = 'green'
                }
                else {
                    c.strokeStyle = '#ddd'
                }
                c.stroke();
            }
            if(arrayListToSort[j] > arrayListToSort[j+1]){
                let temp = arrayListToSort[j];
                arrayListToSort[j] = arrayListToSort[j+1];
                arrayListToSort[j+1] = temp;
            }
            j++;
            /* --------------DRAWING--------------*/ 
            if( i >= arrayListToSort.length){
                animating = false;
                console.log('finished')
            }
        }
        else {
            finishExecution()
        }
    }
    function drawCombSort(){
        if(animating){
            timerId = requestAnimationFrame(drawCombSort);
            c.clearRect(0,0,canvas.width, canvas.height)
            if(combSortGapInitial){
                combSortGap = arrayListToSort.length;
                combSortGapInitial = false;
            }
          
            if(combSortGap < 1){
                combSortGap = 1;
            }
            //draw
            for(x = 0; x < arrayListToSort.length; x ++){
                c.beginPath();
                c.moveTo(canvas.width/2 - totXLength/2 + (x * lineXGap), 0);
                c.lineTo(canvas.width/2 - totXLength/2 + (x * lineXGap),arrayListToSort[x]);
                c.lineWidth = lineSize;
                if(x === j){
                    c.strokeStyle = 'red'
                }
                else if(x === j+combSortGap){
                    c.strokeStyle = 'blue'
                }
                else {
                    c.strokeStyle = '#ddd'
                }
                c.stroke();
            }
            if(j + combSortGap > arrayListToSort.length){
                i++;
                j = 0;
                combSortGap = Math.floor(combSortGap/1.25);
            } 
            if(arrayListToSort[j] > arrayListToSort[j+combSortGap]){
                let temp = arrayListToSort[j];
                arrayListToSort[j] = arrayListToSort[j + combSortGap]
                arrayListToSort[j+combSortGap] = temp;
            }
            j++;
            if(i > arrayListToSort.length-2 || combSortGap === 0){
                animating = false;
                return;
            }
        }
        else {
            finishExecution()
        }
    }
    function drawSelectionSort(){
        if(animating){
            timerId = requestAnimationFrame(drawSelectionSort);
            // clearing canvas
            c.clearRect(0,0,canvas.width, canvas.height);
            // drawing list on canvas
            // checking the list
            if(j >= arrayListToSort.length){
                let temp = arrayListToSort[i];
                arrayListToSort[i] = arrayListToSort[selectionSortMIN]
                arrayListToSort[selectionSortMIN] = temp;
                i++;
                j = i;
                selectionSortMIN = i;
            }

            if(arrayListToSort[j+1] < arrayListToSort[selectionSortMIN]){
                selectionSortMIN = j+1;
            }
            for(let x = 0; x < arrayListToSort.length; x ++){
                c.beginPath();
                c.moveTo(canvas.width/2 - totXLength/2 + (x * lineXGap), 0);
                c.lineTo(canvas.width/2 - totXLength/2 + (x * lineXGap),arrayListToSort[x]);
                c.lineWidth = lineSize;
                if(x === selectionSortMIN){
                    c.strokeStyle = 'blue';
                }
                else if(x === j+ 1){
                    c.strokeStyle = 'red'
                }
                else if(x < i){
                    c.strokeStyle = 'green'
                }
                else {
                    c.strokeStyle = '#ddd';
                }
               // c.strokeStyle = 'red';
                c.stroke();
            }
            j++;
            if(i >= arrayListToSort.length){
                animating = false
            }
        }
        else{
            finishExecution()
        }
    }
    function drawInsertionSort(){
        if(animating){
            timerId = requestAnimationFrame(drawInsertionSort);
            c.clearRect(0,0,canvas.width, canvas.height);
            if(i > arrayListToSort.length-1){
                animating = false;
                return false
            }
            //draw;
            for(let x = 0; x < arrayListToSort.length; x ++){
                c.beginPath();
                c.moveTo(canvas.width/2 - totXLength/2 + (x * lineXGap), 0);
                c.lineTo(canvas.width/2 - totXLength/2 + (x * lineXGap),arrayListToSort[x]);
                c.lineWidth = lineSize;
                if(x === i){
                    c.strokeStyle = 'red'
                }
                else if(x === j){
                    c.strokeStyle = "blue"
                }
                else if (x < i) {
                    c.strokeStyle = "#90ee90"
                }
                else {
                    c.strokeStyle = "#ddd"
                }
                c.stroke();
            }
            if(setInsertionLoop === true){
                i++;
                j = i;
                setInsertionLoop = false;
            }
            if(j > 0 && arrayListToSort[j-1] > arrayListToSort[j]){
                let temp = arrayListToSort[j-1];
                arrayListToSort[j-1] = arrayListToSort[j]
                arrayListToSort[j] = temp;
                j--
            }
            else {
                setInsertionLoop = true
            }
            
          
        }
        else {
            finishExecution()
        }
    }
    //requestAnimationFrame(drawBubbleSort)
    //requestAnimationFrame(drawCombSort)
    //requestAnimationFrame(drawSelectionSort)
    //requestAnimationFrame(drawInsertionSort)
    /*------------------------------------*/
    /*---------SORTING FUNCTIONS-----------*/
     /*--------------BUBBLE SORT----------*/
    function bubbleSort(arrayListToSort){
        for(let i = 0; i < arrayListToSort.length; i++){
                for(let j = 0; j < arrayListToSort.length - i; j++ ){
                    if(arrayListToSort[j] > arrayListToSort[j+1]){
                        let temp = arrayListToSort[j];
                        arrayListToSort[j] = arrayListToSort[j+1];
                        arrayListToSort[j+1] = temp;
                    }
                }
        }
    }
    /*--------------COMB SORT----------*/
    function combSort(array){
        let sortGap = array.length;
        for(let a = 0 ; a < array.length - 1; a++){
            for(let b = 0; b+sortGap < array.length; b++){
                if(array[b] > array[b+ sortGap]){
                    let temp = array[b];
                    array[b] = array[b+sortGap];
                    array[b+sortGap] = temp;
                }
            }
            sortGap = Math.floor(sortGap/1.3);
        }
        console.log(array)
    }
    /*--------------ODD EVEN SORT----------*/
    function oddEvenSort(array){
     //to do
    }
    /*--------------SELECTION SORT----------*/
    function selectionSort(array){
        let MIN;
        for(let a = 0; a < array.length ; a++){
            MIN = a;
            for(let b = a; b < array.length; b++){
                if(array[b+1] < array[MIN]){
                    MIN = b+1;
                }
            }
            let temp = array[a];
            array[a] = array[MIN]
            array[MIN] = temp;
        }
    }
    /*--------------INSERTION SORT------------*/
    function insertionSort(array){
        let MIN;
        for(a = 0; a < array.length-1; a++){
           MIN = a;
           for(let b = a + 1; b > 0; b--){
               if(array[b] >= array[MIN]){
                   break;
               }
               if(array [b] < array[MIN]){
                   let temp = array[MIN]
                   array[MIN] = array[b]
                   array[b] = temp;
                   MIN = MIN - 1
               }
           }
        }
    }
    function mergeSort(array){
        if(array.length === 1 ){
            return array
        }
        let middle = Math.floor(array.length/2)
        let left = array.slice(0,middle);
        let right = array.slice(middle);
        return merge(mergeSort(left), mergeSort(right))
    }
    function merge(left,right){
        let mergedArray = [];
        let leftIndex = 0;
        let rightIndex = 0;
        while(leftIndex < left.length && rightIndex < right.length){
            if(left[leftIndex] < (right[rightIndex])){
                mergedArray.push(left[leftIndex])
                leftIndex++;
            }
            else{
                mergedArray.push(right[rightIndex])
                rightIndex++;
            }
        }
  
        let newArray = mergedArray.concat(left.slice(leftIndex)).concat(right.slice(rightIndex))
        console.log(newArray)
        return newArray

    }
    /*--------SORTING CALLS-----------------*/
})