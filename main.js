"use strict";
const keypad = document.querySelector(".keypad");
const keypadInput = keypad.querySelector("input#keypad-input");
const responseArea = keypad.querySelector("input.keypad__response");
const keys = keypad.querySelectorAll("button.keypad__key");
const resultArea = document.querySelector("#result");
const responseTimeout = 2000;
const responsePositive = "Success!";
const responseNegative = "Incorrect!";
const encryptedContent = "60;56;4c;16;51;5a;51;45;59;43;13;9;5a;13;9;23;11;46;1d;57;17;11;50;53;5a;13;46;6;50;19;42;5a;5c;19;4a;53;56;46;47;c;44;4e;12;5d;5d;13;52;42;b;15;44;4c;d;41;13;5c;5b;47;56;b;14";
// CryptoJS is only used for md5 hashing
const md5 = (input) => {
    return CryptoJS.MD5(input).toString();
};
// Click events for the keys
keys.forEach((key) => {
    key.addEventListener("click", (e) => {
        var _a;
        keypadInput.classList.remove("hidden");
        responseArea.classList.add("hidden");
        let keyValue = (_a = key.value) !== null && _a !== void 0 ? _a : false;
        if (!keyValue)
            return;
        switch (keyValue) {
            case "back":
                // Clear the input field
                keypadInput.value = "";
                break;
            case "accept":
                // Submit the password
                if (checkPasscode(keypadInput.value)) {
                    showMessage(responsePositive);
                    resultArea.innerHTML = decrypt(md5(keypadInput.value), encryptedContent);
                    resultArea.classList.remove("hidden");
                    keypad.querySelector("button.keypad__button").classList.add("hidden");
                    setTimeout(() => {
                        document.activeElement.blur();
                    }, 500);
                    keypadInput.value = "";
                    window.location.href = 'https://thoughtjumper.com';
                }
                else {
                    showMessage(responseNegative);
                    keypadInput.value = "";
                }
                break;
            default:
                // Add the key to the input field
                if (keypadInput.value.length < 4)
                    keypadInput.value += keyValue;
        }
    });
});
function checkPasscode(code) {
    return decrypt(md5(code), "4d;4b;4c;53") === "true";
}
function showMessage(message) {
    responseArea.value = message;
    keypadInput.classList.add("hidden");
    responseArea.classList.remove("hidden");
    //Reset
    setTimeout(() => {
        keypadInput.classList.remove("hidden");
        responseArea.classList.add("hidden");
    }, responseTimeout);
}
// Create a hex encoded string from a key and a data string
function encrypt(key, data) {
    return _.join(_.map(data, function (c, i) {
        let b = c.charCodeAt(0) ^ key.charCodeAt(Math.floor(i % key.length));
        return b.toString(16);
    }), ";");
}
// Decrypt data from a hex encoded string and a key
// Using a simple xor cipher
function decrypt(key, data) {
    let bArr = _.split(data, ";");
    return _.map(bArr, function (c, i) {
        return String.fromCharCode(parseInt(c, 16) ^ key.charCodeAt(Math.floor(i % key.length)));
    }).join("");
}
// Spoilers below
document.querySelector(".solution__button").addEventListener("click", (e) => {
    let solutionArea = document.querySelector(".solution__area");
    // Uh oh, is this making it too easy? ;)
    let solutionKey = decrypt("9996535e07258a7bbfd8b132435c5962", "8;b;a;3");
    solutionArea.innerText = `The passcode is: ${solutionKey}`;
    e.target.classList.add("hidden");
    solutionArea.classList.remove("hidden");
});
