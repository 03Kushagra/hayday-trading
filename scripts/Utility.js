function convertToTitleSnakeCase(phrase)
{
    if(!phrase.length)
        return phrase;

    phrase = phrase.replaceAll("_", " ");
    let words = phrase.split(" ");
    let titleCaseWords = [];
    for(let word of words)
        titleCaseWords.push(word[0].toUpperCase() + word.slice(1).toLowerCase());

    return titleCaseWords.join("_");
}

const iOSPlatformList = new Set(["iPad Simulator", "iPhone Simulator", "iPod Simulator", "iPad", "iPhone", "iPod"]);
function isRunningIOS()
{
    return iOSPlatformList.has(navigator.platform) ||

        (navigator.userAgent.includes("Mac") && "ontouchend" in document);
}

function getLocaleString(num)
{

    return shouldIgnoreLocale ? num.toLocaleString("en-US") : num.toLocaleString();
}
