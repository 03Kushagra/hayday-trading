const changelog = new Map();

function setUpChangelog()
{
    let changes = [];
    for(let [versionName, versionChanges] of changelog)
    {
        const changeHolder = document.createElement("div");

        const changeHeader = document.createElement("h2");
        changeHeader.innerText = versionName;
        changeHeader.style.textAlign = "center";

        const changeBody = document.createElement("p");
        changeBody.innerText = versionChanges;

        changeHolder.appendChild(changeHeader);
        changeHolder.appendChild(changeBody);

        changes.push(changeHolder);
    }

    changelogOverlay.inner.append(changes.flatMap(elem => [elem, document.createElement("hr")]).slice(0, -1));
}

function handleVersionChange()
{
    const latestVersion = changelog.keys().next().value;
    if(latestVersion === undefined)
        return;

    const sLastUsedVersion = localStorage.getItem("lastUsedVersion");

    if(sLastUsedVersion === latestVersion)
        return;

    localStorage.setItem("lastUsedVersion", latestVersion);

    const latestVersionHeader = changelogOverlay.inner.find("h2")[0];
    latestVersionHeader.innerText += " -- NEW!";
    latestVersionHeader.style.color = "red";

    changelogOverlay.showButton.trigger("click");
}
