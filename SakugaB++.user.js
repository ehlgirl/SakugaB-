// ==UserScript==
// @name         SakugaB++
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  Adds some useful features to sakugabooru :^)
// @author       ehlboy
// @match        https://www.sakugabooru.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js

/*
//=======================================
//             HOW TO USE
//=======================================
//
// Hover over the star underneath posts and
// press "ENTER".
//
//
//
//
//       FEATURES TO ADD
// - right click to expand video?
// - button to close expanded video
//
//
//
//      KNOWN ISSUES
// - disables left click on post image
// 
//
*/

//=======================================
//          ==/UserScript==
//=======================================


//=======================================
//             VARIABLES
//=======================================

var MAIN_URL = "https://www.sakugabooru.com/";
var BOILER_URL = "https://www.sakugabooru.com/post?page=";

var addressValue = "";
var addressChk = "";
var urlPg;
var thisPg;
var sidebarFocus = false;

//=======================================
//               Style
//=======================================

$("<style>")
    .prop("type", "text/css")
    .html("\
    .cbtn {\
        color: white;\
        background-color: #111;\
        padding: .5em 1em,\
        text-decoration: none,\
        border: 0px,\
    }")
    .appendTo("head");

//=======================================
//               MAIN
//=======================================

// gets link when you hover over the star
$( "a.directlink" ).hover(function() {
    //e.disableDefault();
    addressValue = $(this).attr("href");
    //console.log(addressValue);
});

$('input').focusin(function(){
    //console.log("input focused");
    sidebarFocus = true;
});

$('input').focusout(function(){
    //console.log("input not focused");
    sidebarFocus = false;
});

// keyboard shortcuts
$(document).keydown(function(e){
    //console.log(e.which);

    // DISPLAYS VIDEOS
    //
    // ENTER pressed
    if ( e.which == 13 && addressValue && addressChk != addressValue) {
        addressChk = addressValue;
        //console.log("enter pressed");
        var generatedVid = VidLinkGen(addressValue);
        $("#genVid").remove();
        $("#vidbar").remove();
        $(".content").prepend("<div id='vidbar' style='width: 100%; height: 25px; display:flex ; margin: -2px 0px 25px 0px;'></div>");
        $(".content").prepend("<div id='video'></div>");
        $("#video").append(generatedVid);
        $("#vidbar").append("<button class='cbtn' type='button' style='border:0px; width:-webkit-fill-available;' onclick='genVid.pause(); genVid.currentTime -= (1/24);'>Previous Frame ( , )</button>");
        $("#vidbar").append("<button class='cbtn' type='button' style='border:0px; width:-webkit-fill-available;' onclick='genVid.pause(); genVid.currentTime += (1/24);'>Next Frame ( . )</button>");
    }


    if ( e.which == 190 ) {
        //console.log("you pressed '.'");
        genVid.pause();
        genVid.currentTime += (1/24);
    }
    if ( e.which == 188 ) {
        //console.log("you pressed ','");
        genVid.pause();
        genVid.currentTime -= (1/24);
    }

    // NAVIGATES PAGES
    //
    if (!sidebarFocus) {
        // 'right arrow' or 'd' press down
        if ( e.which == 39 || e.which == 68 ) {
            //console.log('here');
            thisPg = GetPgNum();
            ++thisPg;
            //console.log(thisPg);
            LoadPgNum(thisPg);
        }
        // 'left arrow' or 'a' press down
        if ( e.which == 37 || e.which == 65) {
            //console.log('here');
            thisPg = GetPgNum();
            --thisPg;
            if (thisPg < 1) {
                thisPg = 1;
            }
            //console.log(thisPg);
            LoadPgNum(thisPg);
        }

        // 'p' FOR DEBUG USE
        /*
    if ( e.which == 80 ) {
        console.log("Current Page #: " + GetPgNum());
    }
    */
    }
});

//=======================================
//             FUNCTIONS
//=======================================

// returns video code to implement on page
function VidLinkGen(RawLink) {
	var myString = "<video id='genVid' width='100%' height='480' controls='true' autoplay='true' loop='true' src='" + RawLink + "' type='video/mp4'>Your browser does not support mp4 video. </video>"
    return myString
};

// returns page number
function GetPgNum() {
    var urlValue = window.location.href;

    // -11 first characters of post
    if (window.location.href != MAIN_URL) {
        //console.log(urlValue);
        urlValue.toString();
        var urlPg_STR = urlValue.substring(38);
        //console.log(urlPg_STR);
        if (urlPg_STR == "" || urlPg_STR == "NaN") {
            urlPg = 1;
        } else {
            urlPg = parseInt(urlPg_STR);
        }
        //console.log(urlPg);
    }
    return urlPg;
};

function LoadPgNum (pgnum) {
    var fullURL = BOILER_URL + pgnum
    window.location.replace(fullURL);
}

