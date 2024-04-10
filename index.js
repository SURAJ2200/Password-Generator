const inputslider = document.querySelector("[data-lengthslider]")
const lengthdisplay = document.querySelector("[data-lengthNumber]")

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generate-button");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordlength = 10;
let checkcount = 0;
// set circle color to grey
handleslider();
setIndicator("#ccc");



// set password length (password length ko ui per reflect karwata hai)
function handleslider(){
inputslider.value = passwordlength;
lengthdisplay.innerText = passwordlength;
const min = inputslider.min
const max = inputslider.max
inputslider.style.backgroundSize = ( (passwordlength - min)*100/(max - min)) + "% 100%"
}
function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandomInteger(min,max){
       return Math.floor(Math.random()*(max-min))+min;
}

function generateRandomNumber(){
         return getRandomInteger(0,9)
}

function generateLowercase(){
    return String.fromCharCode(getRandomInteger(97,123))
}

function generateUppercase(){
    return String.fromCharCode(getRandomInteger(65,90))
}

function generateSymbol(){
    const randomNUmber = getRandomInteger(0, symbols.length);
    return symbols.charAt(randomNUmber) ;
}

function CalculateStrength(){
         let hasUpper = false;
        let hasLower = false;
        let hasNum = false;
        let hasSym = false;
        if (uppercaseCheck.checked) hasUpper = true;
        if (lowercaseCheck.checked) hasLower = true;
        if (numbersCheck.checked) hasNum = true;
        if (symbolsCheck.checked) hasSym = true;
      
        if (hasUpper && hasLower && (hasNum || hasSym) && passwordlength >= 8) {
          setIndicator("#0f0");
        } else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordlength >= 6) {
          setIndicator("#ff0");
        } else {
          setIndicator("#f00");
        }
    }
async function copycontent(){
         try {
            await navigator.clipboard.writeText(passwordDisplay.value);    //copy method
            copyMsg.innerText = "copied" 
         } catch (e) {
            copyMsg.innerText = "failed"
         }
        //  to make copy wala span visible
         copyMsg.classList.add("active")
        
         setTimeout(() => {
            copyMsg.classList.remove("active")
         }, 2000);
    }

function shufflepassword(array){
    // fisher yates method
    for (let i = array.length - 1; i > 0; i--) {
        // random j found
        const j = Math.floor(Math.random() * (i + 1));
        //swapping
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckBoxChange(){
    checkcount = 0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)           //how many boxes checked
        checkcount++;
    })

    // special case
    if(passwordlength<checkcount)
       passwordlength=checkcount;
       handleslider();

}

 allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange)
 })

inputslider.addEventListener('input',(e)=>{
     passwordlength = e.target.value;
     handleslider()
})

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value)
    copycontent();
})

generateBtn.addEventListener('click',() => {
    //none of the box is selected
    if(checkcount == 0)
    return;
    

    if(passwordlength<checkcount){
       passwordlength=checkcount;
       handleslider();
    }

    // let's start the find new password
    console.log("Starting the Journey");
    // remove old password

    password = "";

    // put the stuff mentioned by checkboxes

    // if(uppercaseCheck.checked){
    //     password += generateUppercase();
    // }
    // if(lowercaseCheck.checked){
    //     password += generateLowercase
    // }
    // if(numbersCheck.checked){
    //     password += generateRandomNumber();
    // }
    // if(symbolsCheck.checked){
    //     password += generateSymbol();
    // }

    let functionArr = [];

    if(uppercaseCheck.checked)
    functionArr.push(generateUppercase);
 
    if(lowercaseCheck.checked)
    functionArr.push(generateLowercase);
 
    if(numbersCheck.checked)
    functionArr.push(generateRandomNumber);
 
    if(symbolsCheck.checked)
    functionArr.push(generateSymbol);

    // compuslory addition
    for(let i=0; i<functionArr.length; i++){
        password += functionArr[i]();
    }
    console.log("COmpulsory adddition done");
    // remaining addition

    for( let i=0 ; i<passwordlength-functionArr.length; i++){
        let randIndex = getRandomInteger(0 , functionArr.length);
        console.log("randIndex" + randIndex);
        password += functionArr[randIndex]();
    }
    console.log("Remaining adddition done");
    // shuffle the password
    password = shufflepassword(Array.from(password));    //password string pass in shufflepassword in the form of array
    console.log("Shuffling done");
    // show in ui
    passwordDisplay.value = password;
    console.log("UI adddition done");

    // calculate strength
    CalculateStrength();    
});