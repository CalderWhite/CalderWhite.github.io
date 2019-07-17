/* global $ */
/* global Typed */
//https://cloudconvert.com/webm-to-gif
//https://ezgif.com/crop
//http://png2jpg.com/

/**** SLIDES CODE ****/
// constants
var slideWait = 14000;
var projectNames = ["Hacker Speak","Backup Board","Classroom Connect","Structure Search","Cruise 64"];
// global variables
var shiftHooks = [];
var shifting;
var shiftInProgress = false;
var shifting;
var projectNameStack = [projectNames[3]];
var currentType;
var sIndex;
// functions
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
    for(i=0;i<shiftHooks.length;i++){
        shiftHooks[i]();
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
        sIndex+=1;
        infiniteShift((index+1)%projectNames.length);
    },slideWait);
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
        console.log("cleared")
    });
    $(window).focus(function(){
        shifting = setTimeout(function(){
            var ci = sIndex+1;
            if (ci < 0){
                ci = projectNames.length + ci;
            } else{
                ci = ci % projectNames.length;
            }
            sIndex = ci;
            infiniteShift(ci);
        },slideWait);
    });
    // shifting buttons
    // long code since there were bugs putting it into 1 function
    $(".slideshow-btn-right .slideshow-btn").mouseup(function(){
        if (!shiftInProgress){
            clearTimeout(shifting);
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
            shifting = setTimeout(function(){
                var ci = sIndex + 1;
                if (sIndex < 0){
                    ci = projectNames.length + ci;
                } else{
                    ci = ci % projectNames.length;
                }
                sIndex = ci;
                infiniteShift(ci);
            },slideWait);
        }
    });
    $(".slideshow-btn-left .slideshow-btn").mouseup(function(){
        if (!shiftInProgress){
            clearTimeout(shifting);
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
            shifting = setTimeout(function(){
                var ci = sIndex + 1;
                if (ci < 0){
                    ci = projectNames.length + ci;
                } else{
                    ci = ci % projectNames.length;
                }
                sIndex = ci;
                infiniteShift(ci);
            },slideWait);
        }
    });
});
function checkMedia(rule,thumbnail,img){
    if ($(rule)[0].parentElement.className.search("slide-2") > -1){
        // wait 900s to start just before transition is over to avoid lag, but also give a smooth effect from paused to playing
        setTimeout(function(){
            $(rule)[0].getElementsByTagName("img")[0].src = img;
        },900);
    } else{
        $(rule)[0].getElementsByTagName("img")[0].src = thumbnail;
    }
}
shiftHooks.push(function(){
    checkMedia(
        "#ss-demo",
        "media/structuresearch-demo-frozen.jpg",
        "media/structuresearch-demo.gif"
    );
});
shiftHooks.push(function(){
    checkMedia(
        "#cc-demo",
        "media/classroomconnect-demo-frozen.jpg",
        "media/classroomconnect-demo.gif"
    );
});
shiftHooks.push(function(){
    checkMedia(
        "#bb-slide",
        "media/backupboard-demo-frozen.jpg",
        "media/backupboard-demo.gif"
    );
});