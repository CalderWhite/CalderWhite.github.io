/* global $ */
/* global Typed */
// SLIDES CODE:
var shifting;
var shiftInProgress = false;
var btnShifting;
var projectNames = ["slide 0","slide 1","slide 2","slide 3","slide 4"];
var projectNameStack = ["slide 3"];
var currentType;
var sIndex;
function shiftSlides(forward) {
    shiftInProgress = true;
    var s = document.getElementsByClassName("slide");
    var currentSlide;
    var nextClass;
    for(var i=0;i<s.length;i++){
        var increment = 1;
        if (!forward && forward != undefined) {
            increment = -1
        }
        currentSlide = (Number(
            s[i].className
            .replace("slide-","")
            .replace(" slide","")
            ) - increment);
        if(currentSlide < 0){
            currentSlide = s.length - Math.abs(currentSlide);
        } else{
            currentSlide = currentSlide % s.length;
        }
        nextClass = "slide-" + currentSlide.toString() + " slide";
        s[i].className = nextClass;
        //console.log(s[i],s[i].className)
    }
    setTimeout(function(){
        shiftInProgress = false;
    },1000)
}
function infiniteShift(index){
    // when you add the next string to the stack, it will delete what is currently being displayed
    projectNameStack.push(projectNames[index]);
    // quickly destroy the Typed object after, so our next one isn't competing with it (and any other previous ones)
    currentType.destroy();
    // adding the true parameter pops the first item of the projectNameStack
    // leaving it with only the current string (header text)
    runTyped(true);
    //var cursor0 = document.getElementsByClassName("typed-cursor")[0];
    // so they run concurrently
    shiftSlides();
    // subtract 1000 off the timeout, since transitions take 1 second.
    shifting = setTimeout(function() {
        infiniteShift((index+1)%projectNames.length);
        sIndex+=1;
    },6000);
}
function runTyped(doPop){
    // use the global variable projectNameStack, so that other programs can modify it while in use
    var options = {
        strings: projectNameStack,
        typeSpeed:40
    };
    // adding the true parameter pops the first item of the projectNameStack
    // leaving it with only the current string (header text)
    if (doPop){
        options.onStringTyped = function(){
            projectNameStack.pop(0);
        };
    }
    // set the global variable currentType to the new instance of this object,
    // so another function can destroy it later (before it is replaced)
    currentType = new Typed("#projectName", options);
}
// init code
$(document).ready(function() {
    // SLIDES INIT
    // type out the first company name
    runTyped();
    // set the first index to 3 becuase I don't even know.
    // whatever, it works. For some reason there's an offset, and I tried to accomodate that,
    // but apparently the only way to make it work is to start on the 4th item (with an index of 0)
    var sIndex = 3;
    infiniteShift(sIndex);
    // prevent shifting while the user isn't on the tab/window.
    // effectively preventing multiple shifts when the user returns
    $(window).blur(function() {
        clearTimeout(shifting);
    });
    $(window).focus(function(){
        btnShifting = setTimeout(function(){
            var ci = sIndex + 1;
            if (sIndex < 0){
                ci = projectNames.length + ci;
            } else{
                ci = ci % projectNames.length;
            }
            infiniteShift(ci);
        },6000);
    });
    // shifting buttons
    // long code since there were bugs putting it into 1 function
    $(".slideshow-btn-left .slideshow-btn").mouseup(function(){
        if (!shiftInProgress){
            clearTimeout(shifting);
            if (btnShifting!= undefined){
                clearTimeout(btnShifting);
            }
            shiftSlides(true);
            sIndex+=1;
            sIndex %=projectNames.length;
            // when you add the next string to the stack, it will delete what is currently being displayed
            projectNameStack.push(projectNames[sIndex]);
            // quickly destroy the Typed object after, so our next one isn't competing with it (and any other previous ones)
            currentType.destroy();
            // adding the true parameter pops the first item of the projectNameStack
            // leaving it with only the current string (header text)
            runTyped(true);
            // reset recursive loop
            btnShifting = setTimeout(function(){
                var ci = sIndex + 1;
                if (sIndex < 0){
                    ci = projectNames.length + ci;
                } else{
                    ci = ci % projectNames.length;
                }
                infiniteShift(ci);
            },6000);
        }
    });
    $(".slideshow-btn-right .slideshow-btn").mouseup(function(){
        if (!shiftInProgress){
            clearTimeout(shifting);
            if (btnShifting!= undefined){
                clearTimeout(btnShifting);
            }
            shiftSlides(false);
            sIndex-=1;
            if (sIndex < 0) {
                sIndex = projectNames.length+sIndex;
            }
            // when you add the next string to the stack, it will delete what is currently being displayed
            projectNameStack.push(projectNames[sIndex]);
            // quickly destroy the Typed object after, so our next one isn't competing with it (and any other previous ones)
            currentType.destroy();
            // adding the true parameter pops the first item of the projectNameStack
            // leaving it with only the current string (header text)
            runTyped(true);
            // reset recursive loop
            btnShifting = setTimeout(function(){
                var ci = sIndex + 1;
                if (sIndex < 0){
                    ci = projectNames.length + ci;
                } else{
                    ci = ci % projectNames.length;
                }
                infiniteShift(ci);
            },6000);
        }
    });
})