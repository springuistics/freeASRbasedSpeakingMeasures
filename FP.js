function StartTest(){
    //Ensures students entered data and throws errors if they haven't 
    if (document.getElementById('snumber').value == "" || document.getElementById('tname').value == "" || atLeastOneRadio('Day') == false || atLeastOneRadio('Period') == false){
        if(document.getElementById('snumber').value == ""){
        document.getElementById('number_error').style.display = "block";
        } else  {document.getElementById('number_error').style.display = "none";}
        if(document.getElementById('tname').value == ""){
            document.getElementById('tname_error').style.display = "block";
        } else{document.getElementById('tname_error').style.display = "none";}
        if(atLeastOneRadio('Day') == false){
            document.getElementById('day_error').style.display = "block";
        } else {document.getElementById('day_error').style.display = "none";}
        if(atLeastOneRadio('Period') == false){
            document.getElementById('time_error').style.display = "block";
        } else {document.getElementById('time_error').style.display = "none";}
    } else {
    //Starts test if everything is working correctly
        document.getElementById('beginner').style.display = "none";
        document.getElementById('real_stuff').style.display = "block";
        clearInterval(Interval2);
        Interval2 = setInterval(startTimer, 1000);
        function startTimer(){
            countDown -= 1;
            var the_thing = countDown.toFixed(1);
            if (the_thing <=0) {
                //Stop the activity
                clearInterval(Interval2);
                startTask();
            } else {
                if (the_thing <10) {
                    document.getElementById('timer').style.color = "red";
                }
                var minutes = Math.floor(the_thing / 60);
                var seconds = the_thing % 60;
                if (seconds <10) {
                    seconds = "0"+seconds;
                }
                document.getElementById('timer').innerHTML = minutes + " : " + seconds;
            }
            
        }
    }
}

//This golbal variable controls whether or not to provide interrim results based on whether or not internal ASR is being used
//Newer samsung phones have a bug when using internal ASR that prevents interrim results from being cleared and messes up data
var isInternalSR = true;

//Ensures at least one of the radio buttons is checked
function atLeastOneRadio(name) {
    let losRadio = document.querySelector('input[name= "'+name+'"]:checked');
    if (losRadio != null){
        return (true);    
    } else return (false);
}

//Controls the initial test ASR
function TesttheASR(){
    document.getElementById('yo').style.display = "inline";
    document.getElementById('testing123').innerHTML = "Testing...";
    testASR();
    test_run.start();
}
function testASR(){
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    test_run = new SpeechRecognition();
    if (!test_run){
      test_run = new webkitSpeechRecognition();
    } 
    test_run.continuous = true;
    test_run.lang = 'en-US';
    test_run.interimResults = true;
    test_run.onerror = (event) => {
        console.log(event.error);
        ASRerrorHandle(event.error);
    };
    test_run.onresult = disp_test;
    }
    function disp_test(event){
        var results = event.results;
        for (var i = event.resultIndex; i < results.length; ++i) {
            if (results[i].isFinal) {
                if (results[i][0].transcript){
                    document.getElementById('testing123').innerHTML = "Your device is capturing your voice, no problem.";
                    document.getElementById('testing123').className = "w3-center w3-green";
                } else {
                    document.getElementById('testing123').innerHTML = "Your device is not capturing your voice; please try again, use a different device, or seek help.";
                    document.getElementById('testing123').className = "w3-center w3-red";
                }
                test_run.stop();
            } 
        }
}

//Global variables that hold count-downs, answers, etc.
var temp_holder = "";
var taskCounter = 0;
var countDown = 45;
var Interval;
var Interval2;

function trueBegin(){
    clearInterval(Interval2);
    init();
    recognition.start();
    clearInterval(Interval);
    Interval = setInterval(startTimer, 100);
    //This function adds 0.1 seconds to the timer every 0.1 seconds. Its not actually starting the stopwatch itself.
    function startTimer(){
        taskCounter += 1;
    }
}

//This function controls the starting/stopping and button look
function startTask() {
    var buttonH = document.getElementById('earlyBTN');
    if (buttonH.innerHTML == 'Start Early'){
        buttonH.innerHTML = 'Stop Speaking';
        buttonH.classList.remove('w3-green');
        buttonH.classList.add('w3-red');
        trueBegin();
    } else {
        clearInterval(Interval);
        buttonH.disabled = true;
        buttonH.classList.add('w3-disabled');
        recognition.onend = null;
        recognition.stop();
        setTimeout(stopPassage,3000);
    }
}

//This function allows for safe division
function safeDivision(x,y){
    if (y==0){
        return 0;
    } else {
        return (x/y);
    }
}


function stopPassage(){
    let spoken = temp_holder.toLowerCase();
    let spkArray = ProvideWords(spoken);
    let thePassage = "Glassblowing, a technique used to shape and curve glass, has been around for over one thousand years. In fact, the earliest record of glassblowing is from 2,000 years ago. It's one of the fastest growing hobbies in the United States. If you want to try this art, first you're going to need a furnace. Furthermore, you'll need the right contents, such as limestone and sand. Ultimately, it takes a lot of money and skill to become an expert in this art.".replace(/\./g, ' ');
    thePassage = thePassage.toLowerCase();
    let PassArray = ProvideWords(thePassage);
    let passObject = DifferentWordsPreprocessed(PassArray);
    //Get the array of different words for checking
    let dwArray = [];
    let dwNumbers = [];
    for (let [key, value] of passObject.DWCounts){
        dwArray.push(key);
        dwNumbers.push(value);
    }

    //Check how many extra words there are
    let correctTWs = [];
    let extraWords = 0;
    for (let i=0; i<spkArray.length; i++){
        let found = false;
        for (let j=0; j<dwArray.length; j++){
            if (spkArray[i] == dwArray[j]){
                correctTWs.push(spkArray[i]);
                found = true;
            }
        }
        if (found == false){
            extraWords +=1;
        }
    }
    
    //Check if the targets are found or not
    let target1 = ["the", "earliest", "record"];
    let target2 = ["united", "states"];
    let target3 = ["fastest", "growing", "hobbies"];
    let target4 = ["it's", "one", "of", "the", "fastest"];
    
    let target1yn = CheckForKeywordsAndPhrasesPreprocessed(target1, spkArray);
    let target2yn = CheckForKeywordsAndPhrasesPreprocessed(target2, spkArray);
    let target3yn = CheckForKeywordsAndPhrasesPreprocessed(target3, spkArray);
    let target4yn = CheckForKeywordsAndPhrasesPreprocessed(target4, spkArray);

    //Check how many words were correctly found
    let correctCount = 0;
    let correctCounts = DifferentWordsPreprocessed(correctTWs);
    for (let [key, value] of passObject.DWCounts){
        if (correctTWs.includes(key)){
            if (correctCounts.DWCounts.get(key) <= value){
                correctCount += correctCounts.DWCounts.get(key);
            } else {
                correctCount += value;
                extraWords += (correctCounts.DWCounts.get(key) - value);
            }
        }
    }

    //Calculated penalized correct
    let penalizedCorrect = safeDivision((correctCount - extraWords), PassArray.length);
    let spokenCorrect = safeDivision(correctCount, PassArray.length);
    
    //Get syllables, time, and SR
    let allWords = ProvideWords(temp_holder);
    let syllables = 0;
    for (let i=0; i<allWords.length; i++){
        let tempCNT = syllableCount(allWords[i]);
        if (!isNaN(tempCNT)) {
            syllables += tempCNT;
        }
    }
    let PassSyllables = 0;
    for (let i=0; i<PassArray.length; i++){
        let tempCNT = syllableCount(PassArray[i]);
        if (!isNaN(tempCNT)) {
            PassSyllables += tempCNT;
        }
    }
    let timeNow = safeDivision(taskCounter, 10);
    let speechRate = safeDivision(syllables, timeNow);   
    
    
    //Use in model, taskCounter as elTimo, speechRate as sRate, penalizedCorrect as penalized, extraWords as extraWords, and the four targets
    let weights = [-0.494743549, 0.07693533, 0.056865244, -0.14144632, 0.020229372, 0.058298821, 0.081236062, 0.070245301];
    //Set variables
    let timeScore = 0; let srScore = 0; let ewScore = 0; let t1Score = 0; let t2Score = 0; let t3Score = 0; let t4score = 0;

    //Calculate scores
    timeScore = safeDivision( (timeNow - 26), (53-26) );
    srScore = safeDivision( (speechRate - 0.7179), (3.4356-0.7179) );
    let pcScore = penalizedCorrect;
    if (extraWords == 0){
        ewScore = 0;
    } else {
        ewScore = safeDivision( (extraWords - 6), (34-6) );
    }
    if (target1yn.count >= 1){
        t1Score = 1;
    } else {
        t1Score = 0;
    }
    if (target2yn.count >= 1){
        t2Score = 1;
    } else {
        t2Score = 0;
    }
    if (target3yn.count >= 1){
        t3Score = 1;
    } else {
        t3Score = 0;
    }
    if (target4yn.count >= 1){
        t4score = 1;
    } else {
        t4score = 0;
    }
    
    //Run through the model
    let rawScore = (timeScore*weights[0]) + (srScore*weights[1]) + (pcScore*weights[2]) + (ewScore*weights[3]) + (t1Score * weights[4]) + (t2Score * weights[5]) + (t3Score * weights[6]) + (t4score * weights[7]);
    
    //Bucket drop
    let finalScore;
    if (spokenCorrect < 0.4){
        finalScore = 0;
    } else if (rawScore >0.1){
        finalScore = 5;
    } else if (rawScore > -0.2){
        finalScore = 4;
    } else if (rawScore > -0.4) {
        finalScore = 3;
    } else {
        if (spokenCorrect > 0.15){
            finalScore = 2;
        } else {
            finalScore = 1;
        }
        
    }
    

    document.getElementById('score').value = finalScore;
    document.getElementById('corrP').value = spokenCorrect;
    document.getElementById('penP').value = penalizedCorrect;
    document.getElementById('speechRate').value = speechRate;
    document.getElementById('numberofWords').value = spkArray.length;
    document.getElementById('numberofSyllables').value = syllables;
    document.getElementById('extraW').value = spkArray.length - PassArray.length;
    document.getElementById('distS').value = syllables - PassSyllables;  
    document.getElementById('transcript').value = temp_holder;
    document.getElementById('allFinished').style.display = "block";
    document.getElementById('theMainForm').submit();
    //alert('Your score was: '+(srScore+prScore));
}

function init() {
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    if (!recognition){
      recognition = new webkitSpeechRecognition();
      isInternalSR = false;
    } 
    recognition.continuous = true;
    recognition.lang = 'en-US';
    if (isInternalSR == false){
        recognition.interimResults = true;
    } else {
        recognition.interimResults = false;
    }
    recognition.onerror = (event) => {
        console.log(event.error);
        ASRerrorHandle(event.error);
    };
    recognition.onresult = disp;
}
function disp(event) {
    var results = event.results;
    for (var i = event.resultIndex; i < results.length; ++i) {
        if (results[i].isFinal) {
                temp_holder += results[i][0].transcript;
        }
    }
}

