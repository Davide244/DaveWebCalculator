var isNotInResult = true;
var SettingsOpen = false;
var RoundLimit = 6;
var RoundingEnabled = true;
var CurrentResult;

//#region "Initialization"
var π = Math.PI;
function sin(x) {return Math.sin(x);}
function cos(x) {return Math.sin(x);}
function sqrt(x) {return Math.sqrt(x);}

function BTN(id, posx, posy) {  //Struct for type "BTN"
    this.id = id;
    this.posx = posx;
    this.posy = posy;
}

var countDecimals = function(value) {
    if (Math.floor(value) !== value)
        return value.toString().split(".")[1].length || 0;
    return 0;
};

const deviceType = () => {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return "tablet";
    }
    else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        return "mobile";
    }
    return "desktop";
};

window.onload = () => {
    if (deviceType() == "desktop") {
        document.getElementById("procArea").disabled = true;
        //#region "Keyboard"
        window.onkeydown=function(e){
            let key = e.key;
            let rect;
            //alert(key);
            switch (key) {
                //#region "Numbers"
                case "0":
                    rect = document.getElementById("0").getBoundingClientRect();
                    Process(null, new BTN("0", rect.x, rect.y));
                    break;
                case "1":
                    rect = document.getElementById("1").getBoundingClientRect();
                    Process(null, new BTN("1", rect.x, rect.y));
                    break;
                case "2":
                    rect = document.getElementById("2").getBoundingClientRect();
                    Process(null, new BTN("2", rect.x, rect.y));
                    break;
                case "3":
                    rect = document.getElementById("3").getBoundingClientRect();
                    Process(null, new BTN("3", rect.x, rect.y));
                    break;
                case "4":
                    rect = document.getElementById("4").getBoundingClientRect();
                    Process(null, new BTN("4", rect.x, rect.y));
                    break;
                case "5":
                    rect = document.getElementById("5").getBoundingClientRect();
                    Process(null, new BTN("5", rect.x, rect.y));
                    break;
                case "6":
                    rect = document.getElementById("6").getBoundingClientRect();
                    Process(null, new BTN("6", rect.x, rect.y));
                    break;
                case "7":
                    rect = document.getElementById("7").getBoundingClientRect();
                    Process(null, new BTN("7", rect.x, rect.y));
                    break;
                case "8":
                    rect = document.getElementById("8").getBoundingClientRect();
                    Process(null, new BTN("8", rect.x, rect.y));
                    break;
                case "9":
                    rect = document.getElementById("9").getBoundingClientRect();
                    Process(null, new BTN("9", rect.x, rect.y));
                    break;
                //#endregion
                //#region "Other"
                case ",":
                    rect = document.getElementById(".").getBoundingClientRect();
                    Process(null, new BTN(".", rect.x, rect.y));
                    break;
                case ".":
                    rect = document.getElementById(".").getBoundingClientRect();
                    Process(null, new BTN(".", rect.x, rect.y));
                    break;
                case "+":
                    rect = document.getElementById("+").getBoundingClientRect();
                    Process(null, new BTN("+", rect.x, rect.y));
                    break;
                case "-":
                    rect = document.getElementById("-").getBoundingClientRect();
                    Process(null, new BTN("-", rect.x, rect.y));
                    break;
                case "*":
                    rect = document.getElementById("*").getBoundingClientRect();
                    Process(null, new BTN("*", rect.x, rect.y));
                    break;
                case "/":
                    rect = document.getElementById("/").getBoundingClientRect();
                    Process(null, new BTN("/", rect.x, rect.y));
                    break;
                case "(":
                    rect = document.getElementById("(").getBoundingClientRect();
                    Process(null, new BTN("(", rect.x, rect.y));
                    break;
                case ")":
                    rect = document.getElementById(")").getBoundingClientRect();
                    Process(null, new BTN(")", rect.x, rect.y));
                    break;
                case "%":
                    Process(null, new BTN("%", null, null));
                    break;
                case "Dead":
                    rect = document.getElementById("**").getBoundingClientRect();
                    Process(null, new BTN("**", rect.x, rect.y));
                    break;
                case "Delete":
                    rect = document.getElementById("Clr").getBoundingClientRect();
                    Process(null, new BTN("Clr", rect.x, rect.y));
                    break;
                case "Backspace":
                    rect = document.getElementById("DEL").getBoundingClientRect();
                    Process(null, new BTN("DEL", rect.x, rect.y));
                    break;
                case "Enter":
                    rect = document.getElementById("=").getBoundingClientRect();
                    Process(null, new BTN("=", rect.x, rect.y));
                    break;
                //#endregion
            }
        }
        //#endregion
    }
    else { document.getElementById("procArea").disabled = false; }
    
    const buttons = document.querySelectorAll('td');
    buttons.forEach(_btn => {
        if (_btn.id != "procAreaParent" && _btn.id != "settingsItem") {
            console.log(_btn.id);
            _btn.addEventListener('click', Process);
        }
    });

    document.getElementById("RoundSettingsSlider").addEventListener('change', ChangeSetting);
    document.getElementById("roundingCheckbox").addEventListener('change', ChangeSetting);
}

console.log("You are currently using a " + deviceType());
//#endregion "Initialization"

function Process(e = null, btnoverride = null) {
    var btn;    // Variable initialization
    let x;      // Variable initialization
    let y;      // Variable initialization
    let procArea = document.getElementById("procArea");

    if (btnoverride == null && e != null) {
         btn = e.target.id;
         x = e.clientX - e.target.offsetLeft
         y = e.clientY - e.target.offsetTop
         }
    else if (btnoverride != null && e == null) {
         btn = btnoverride.id;
         x = null;
         console.log("raw x:" + btnoverride.posx + "; raw y: " + btnoverride.posy);
         y = parseFloat(document.getElementById(btn).getBoundingClientRect().top) % parseFloat(btnoverride.posy);    // Add a small bit of randomness to the y-coordinate
         }
    else { alert("Critical Error: Invalid arguments passed to Process()"); }

    //#region "Ripple"
    let ripples;
    if (btn != "%") {       // If Statement to ingnore non existant buttons
        console.log(x + ", " + y);

        ripples = document.createElement("span");
        ripples.style.left = x + "px";
        ripples.style.top = y + "px";

        document.getElementById(btn).appendChild(ripples);
    }
    //#endregion
    
    switch (btn) {
        case '=':
            if (isNotInResult) {
                isNotInResult = false;
                try {
                    let result = Function("return " + procArea.value)(); //eval() is evil. Input example that would destroy a linux server: var exec = require('child_process').exec; exec('sudo rm -rf /')
                    if (countDecimals(result) > RoundLimit) {
                        if (RoundingEnabled) {
                            procArea.value = "≈ " + parseInt(result);
                            CurrentResult = result;
                        }
                        procArea.value = "≈ " + result.toFixed(RoundLimit);
                        CurrentResult = result.toFixed(RoundLimit);
                    }
                    else if (result == Infinity) { procArea.value = "= ∞";  CurrentResult = result; }
                    else {
                        procArea.value = "= " + result;
                        CurrentResult = result;
                    }
                }
                catch { procArea.value = "= Syntax Error"; }
            }
            break;
        case 'DEL':
            if (isNotInResult) {
                procArea.value = procArea.value.slice(0, procArea.value.length - 1); //Delete last character of string
            }
            else {
                procArea.value = null;
                isNotInResult = true;
            }
            break;
        case 'procArea':
            break;
        case 'Clr':
            procArea.value = null;
            isNotInResult = true;
            break;
        default:
            if (isNotInResult) {
                procArea.value += btn;
            }
            else {
                if (btn == "+" || btn == "-" || btn == "*" || btn == "/" || btn == "**" || btn == "%") {
                    isNotInResult = true;
                    procArea.value = CurrentResult + btn;
                }
                else {
                    isNotInResult = true;
                    procArea.value = btn;
                }
            }
            break;
    }
    if (btn != "%") {
        setTimeout(() => {
            ripples.remove();
        }, 300);
    }
}

function ToggleSettings() {
    if (SettingsOpen == false) {
        SettingsOpen = true;
        let settingsPage = document.getElementById("settingsPage");
        document.getElementById("settingsbtn").style.animation = "animatesettingsbtnopen 0.25s ease-out";
        settingsPage.style.display = "block";
        settingsPage.style.animation = "animatesettingsopen 0.25s ease-out";
        setTimeout(() => {
            settingsPage.style.opacity = "1";
        }, 240);
    }
    else {
        SettingsOpen = false;
        let settingsPage = document.getElementById("settingsPage");
        document.getElementById("settingsbtn").style.animation = "animatesettingsbtnclose 0.25s ease-out";
        settingsPage.style.animation = "animatesettingsclose 0.25s ease-out";
        setTimeout(() => {
            settingsPage.style.display = "none";
            settingsPage.style.opacity = "0";
        }, 240);
    }
}

function ChangeSetting(e) {
    var sender = e.target.id;
    switch (sender) {
        case 'RoundSettingsSlider':
            RoundLimit = e.target.value;
            document.getElementById("settingsSliderLabel").innerText = "Round to: " + RoundLimit;
            document.getElementById("roundingCheckbox").checked = false;
            break;
        case 'roundingCheckbox':
            if (e.target.checked) {
                RoundLimit = 0;
                //RoundingEnabled = false;
                //console.log("Rounding Disabled");
            }
            else {
                RoundLimit = document.getElementById("RoundSettingsSlider").value;
                //RoundingEnabled = true;
                //console.log("Rounding Enabled");
            }
            break;
    }
}