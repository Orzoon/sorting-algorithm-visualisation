window.addEventListener('load', () => {
    let canvas = document.getElementById('canvas');
    let c = undefined;
    if(canvas.getContext('2d')){
        c = canvas.getContext('2d');
    }
    else{
        console.log('canvas not supported')
    }
    canvas.height = document.documentElement.clientHeight;
    canvas.width = document.documentElement.clientWidth;
    let arrayListToSort = [];
    let totXLength = 0;
    let lineSize = 5;
    let lineXGap = 10;
    let arrayLength = 90;
    let i = 0;
    let j = 0;
    let animating = true;
    for(s = 0; s < arrayLength; s++){
        arrayListToSort[s] = Math.floor(Math.random()* (canvas.height-100))
        totXLength = totXLength + lineXGap;
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
    /*------------SORTING FUNCTIONS---------------*/
    /*-----------DRAWBUBBLESORT------------*/
    function drawBubbleSort(){
        if(animating){
            window.requestAnimationFrame(drawBubbleSort)
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
                else {
                    c.strokeStyle = '#000'
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
            finalDraw()
        }
    }

    //requestAnimationFrame(drawBubbleSort)
    /*------------------------------------*/
    /*---------SORTING FUNCTIONS-----------*/
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
    /*--------SORTING CALLS-----------------*/
    /*-------CALLING BUBBLE SORT-----------*/
    //drawBubbleSort();
    
})