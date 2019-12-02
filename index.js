window.addEventListener('load', () => {
    let canvas = document.getElementById('canvas');
    let playButton = document.getElementById('play');
    let playIcon = document.getElementById('playIcon');
    let pauseIcon =document.getElementById('pauseIcon');
    let pauseButton = document.getElementById('pause');
    let select = document.getElementById('algorithm');
    let controlsBtn = document.getElementById('controlsBtn');
    let controlsContainer  = document.getElementById('controlsContainer');
    // controls Elements
    let range = document.querySelectorAll(".range");
    let input = document.querySelectorAll(".input");
    let screenSizeValue = document.querySelector(".screenSizeValue");
    let totalCalcValue = document.querySelector(".totalCalcValue");
    let totalWithinRange = true;
    let controlStrong = document.querySelector(".controlStrong");

    let c = undefined;
    if(canvas.getContext('2d')){
        c = canvas.getContext('2d');
    }
    else{
        console.log('canvas not supported')
    }
    //setUp Variables
    let controlsVisible = false;
    let paused = false;
    let arrayLength = null;
    let lineSize = null;
    let lineXGap = null;
    let currentAlgorithm = null;
    let i = 0;
    let j = 0;
    let arrayListToSort = [];
    let totXLength = 0;
    let animating = true;
    let rangeInputChange = false;
    let timerId;
    //colors
    let sortedColor = "#6decb9";
    let unsortedColor = "#ddd";
    let pointer = "red";
    let marker = "blue";
    let finalColor = sortedColor;
    canvas.height = document.documentElement.clientHeight;
    canvas.width = null;
    //Event Listeners
    playButton.addEventListener('click', runAlgorithm);
    pauseButton.addEventListener('click', pauseAlgorithm);
    select.addEventListener('change', changeColor);
    controlsBtn.addEventListener('click', showControls);
    window.addEventListener("resize", init);
    for(let a = 0; a < range.length; a++){
        range[a].addEventListener("change", setInputValueFromRange.bind(this,a));
        input[a].addEventListener("change", setRangeValueFromInput.bind(this,a));
    }
    //// ALGORITHMS VARIABLES
    let combSortGap = 0;
    let combSortGapInitial = true;
    let selectionSortMIN = 0;
    let setInsertionLoop = true;
    function initialDraw(){
        totXLength = 0;
        arrayListToSort = [];
        for(let s = 0; s < arrayLength; s++){
            arrayListToSort[s] = Math.floor(Math.random()* (canvas.height-10))
            totXLength = totXLength + lineXGap;
        }
        // drawing Initially
        c.clearRect(0,0,canvas.width, canvas.height)
        for(z = 0; z < arrayListToSort.length; z ++){
            c.beginPath();
            c.moveTo(canvas.width/2 - totXLength/2 + (z * lineXGap), 0);
            c.lineTo(canvas.width/2 - totXLength/2 + (z * lineXGap),arrayListToSort[z]);
            c.lineWidth = lineSize;
            c.strokeStyle = "#ddd";
            c.stroke();
        }
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
        arrayLength = parseInt(input[0].value);
        lineSize = parseInt(input[1].value);
        let gap = parseInt(input[2].value);
        lineXGap = gap + lineSize;
        i = 0;
        j = 0;
        //c.clearRect(0,0,canvas.width, canvas.height)
        pauseButton.style.color = "#300a44";
        pauseIcon.style.color = "#300a44";
        pauseButton.childNodes[1].innerText = 'Pause';

         // algorithms Initials
         combSortGap = 0;
         combSortGapInitial = true;
         selectionSortMIN = 0;
         setInsertionLoop = true;
         rangeInputChange = false;
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
            pauseButton.style.color = "#5CB85C";
            pauseIcon.style.color = "#5CB85C";
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
        if(rangeInputChange === true){
            if(timerId){
                cancelAnimationFrame(timerId)
            }
            initialSetup();
            initialDraw();
            rangeInputChange = false;
            animating = true;
        }
        else if(paused === false && animating === false){
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
        cancelAnimationFrame(timerId);
        initialSetup();
        initialDraw();
      }
    }
    function showControls(){
       controlsVisible = !controlsVisible;
        if(controlsVisible){
            controlsContainer.style.left = "0%";
            controlsBtn.style.color = "#5CB85C";
            setTimeout(() => {
                window.addEventListener('click', externalControlClick, false);
            }, 200);
       
        }
        else {
            controlsContainer.style.left = "-100%";
            controlsBtn.style.color = "#300a44";
            setTimeout(() => {
                window.removeEventListener('click', externalControlClick);
          }, 200);
        }
    }
    function externalControlClick(e){
      if(!controlsContainer.contains(e.target) ||  controlsVisible === false){
            controlsVisible = false;
            window.removeEventListener('click', externalControlClick)
            controlsContainer.style.left = "-100%";
            controlsBtn.style.color = "#300a44";
      }
    }
    function setRange(){
        let totWidth = canvas.width;
        range[0].max = totWidth;
        range[1].max = 10;
        range[2].max = 20;
        input[0].max = range[0].max;
        input[1].max = range[1].max;
        input[2].max = range[2].max;
        for(let a = 0; a < range.length; a++){
            if(a === 0){
                range[a].min = 10;
                input[a].min = 10;
            }
            else if(a === 1){
                range[a].min = 1;
                input[a].min = 1;
            }
            else if(a === 2){
                range[a].min = 1;
                input[a].min = 1;
            }
        }
        range[0].value = 50;
        range[1].value = 3;
        range[2].value = 4;

        // setting canvas Size
        screenSizeValue.innerText = totWidth;
    }
    function setInputValueFromRange(index){
      switch(index){
        case 0: 
            input[0].value = range[0].value
            break;
        case 1: 
            input[1].value = range[1].value
            break;
        case 2: 
            input[2].value = range[2].value
            break;
      }
      setTotal()
      animating = false;
      rangeInputChange = true;
      finishExecution();
    }
    function setRangeValueFromInput(index){
        switch(index){
            case 0: 
                range[0].value = range[0].value
                break;
            case 1: 
                range[1].value = range[1].value
                break;
            case 2: 
                range[2].value = range[2].value
                break;
          }
          // setting total
          setTotal()
          // setting on change everyTime
          rangeInputChange = true;
          animating = false;
          finishExecution();
          
    }
    function setTotal(){
        totXLength = 0;
        arrayLength = parseInt(input[0].value);
        lineSize = parseInt(input[1].value);
        let gap = parseInt(input[2].value);
        lineXGap = gap + lineSize;
        for(let a = 0; a < arrayLength; a++){
            totXLength = totXLength + lineXGap;
        }
        totalCalcValue.innerText = totXLength;
        if(totXLength > parseInt(screenSizeValue.innerText)){
            totalCalcValue.style.color = "#e4000f";
            controlStrong.style.color = "#e4000f";
        }
        else {
            totalCalcValue.style.color = "#00AA66";
            controlStrong.style.color = "#00AA66";
        }
    }
    function finalDraw(){
        c.clearRect(0,0,canvas.width, canvas.height)
        for(z = 0; z < arrayListToSort.length; z ++){
            c.beginPath();
            c.moveTo(canvas.width/2 - totXLength/2 + (z * lineXGap), 0);
            c.lineTo(canvas.width/2 - totXLength/2 + (z * lineXGap),arrayListToSort[z]);
            c.lineWidth = lineSize;
            c.strokeStyle = finalColor;
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
                    c.strokeStyle = pointer;
                }
                else if(x === j-1){
                    c.strokeStyle = marker;
                }
                else if(x > arrayListToSort.length-i-1){
                    c.strokeStyle = sortedColor;
                }
                else {
                    c.strokeStyle = unsortedColor;
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
                    c.strokeStyle = pointer;
                }
                else if(x === j+combSortGap){
                    c.strokeStyle = marker;
                }
                else {
                    c.strokeStyle = unsortedColor;
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
                    c.strokeStyle = marker;
                }
                else if(x === j+ 1){
                    c.strokeStyle = pointer;
                }
                else if(x < i){
                    c.strokeStyle = sortedColor;
                }
                else {
                    c.strokeStyle = unsortedColor;
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
                    c.strokeStyle = pointer;
                }
                else if(x === j){
                    c.strokeStyle = marker;
                }
                else if (x < i) {
                    c.strokeStyle = sortedColor;
                }
                else {
                    c.strokeStyle = unsortedColor;
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
    function init(){
        let width = window.innerWidth;
        let menuHeight = document.getElementById('header').clientHeight;
        if(width >= 768 && width <=899){
            if(controlsVisible === true){
                window.removeEventListener("click",externalControlClick)
                controlsVisible = false; 
                controlsBtn.style.color = "#300a44";
                controlsContainer.style.left = "-100%";
            }
            controlsContainer.style.left = "auto";
            canvas.width = 510;
            canvas.height = document.documentElement.clientHeight - menuHeight;
        }
        else if(width >= 900 && width <=1099){
            if(controlsVisible === true){
                window.removeEventListener("click",externalControlClick)
                controlsVisible = false; 
                controlsBtn.style.color = "#300a44";
                controlsContainer.style.left = "auto";
                controlsContainer.style.position = "relative";
            }
            controlsContainer.style.left = "auto";
            canvas.width = 650;
            canvas.height = document.documentElement.clientHeight - menuHeight;
        }
        else if(width >=1100){
            if(controlsVisible === true){
                window.removeEventListener("click",externalControlClick)
                controlsVisible = false; 
                controlsBtn.style.color = "#300a44";
                controlsContainer.style.position = "relative";
            }
            controlsContainer.style.left = "auto";
            canvas.width = 850;
            canvas.height = document.documentElement.clientHeight - menuHeight;
        }
        else{
            if(controlsVisible === true){
                window.removeEventListener("click",externalControlClick)
                controlsVisible = false; 
                controlsBtn.style.color = "#300a44";
                controlsContainer.style.left = "-100%";
            }
            controlsContainer.style.left = "-100%";
            canvas.height = document.documentElement.clientHeight - menuHeight;
            canvas.width = document.documentElement.clientWidth;
        }
        setRange()
        for(let a = 0; a < range.length; a++){
            setInputValueFromRange(a)
        }
        initialSetup();
        initialDraw();
    }
    /*------------INIT------------*/
    init();
})