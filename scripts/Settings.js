const generatedImageSolidColors = ["#171a1f", "#111827", "#132a26", "#271a30", "#16243a", "#f8fafc", "#fff8b8", "#dbeafe", "#dcfce7", "#fae8ff"];
const generatedImageBorderColors = ["#ffffff", "#000000", "#5865f2", "#00aa77", "#ff7eb3", "#ff9f43", "#ffd43b", "#45aaf2", "#a55eea", "#ff5e57"];
const generatedImageTextColors = ["#ffffff", "#000000", "#ff3b30", "#007aff", "#34c759", "#ffcc00", "#ff9500", "#af52de", "#ff2d55", "#64d2ff"];
const suggestionFormEndpoint = "https://formspree.io/f/mnjrezjw";
const generatedImageDefaultPadding = "10";
const generatedImageMaxPadding = 10;
let stylingDrawerViewportWasMobile = null;

function clampGeneratedImagePadding(value)
{
    const numberValue = Number(value);
    if(!Number.isFinite(numberValue))
        return generatedImageDefaultPadding;
    return String(Math.min(generatedImageMaxPadding, Math.max(0, numberValue)));
}

function setSuggestionOverlayVisible(shouldShow)
{
    if(suggestionSubmitButton.prop("disabled"))
        return;

    suggestionOverlay.overlay.prop("hidden", !shouldShow);
    $("html, body").css("overflow-y", shouldShow ? "hidden" : "visible");
    screenshotRegion.css("margin-right", shouldShow ? "calc(100vw - 100%)" : "unset");

    if(shouldShow)
        suggestionDiscordInput.trigger("focus");
    else
        setSuggestionStatus("", "");
}

function updateSuggestionIncognitoState()
{
    const shouldSubmitAnonymously = suggestionIncognitoInput.prop("checked");
    suggestionDiscordInput.prop("disabled", shouldSubmitAnonymously);
    suggestionDiscordInput.val(shouldSubmitAnonymously ? "Incognito" : "");
}

function setSuggestionStatus(state, message)
{
    suggestionStatus.removeClass("sending success error");
    if(state)
        suggestionStatus.addClass(state);
    suggestionStatus.text(message);
}

async function submitSuggestionForm(event)
{
    event.preventDefault();
    if(suggestionSubmitButton.prop("disabled"))
        return;

    suggestionSubmitButton.prop("disabled", true);
    suggestionLoadingWheel.prop("hidden", false);
    setSuggestionStatus("sending", "Sending...");

    const formData = new FormData(suggestionForm[0]);
    if(suggestionIncognitoInput.prop("checked"))
        formData.set("discordUsername", "Incognito");
    if(!$("#suggestionScreenshotInput")[0].files.length)
        formData.delete("screenshot");
    formData.append("_subject", "Hay Day Trading suggestion");
    formData.append("view", getIsInTradeView() ? "Trade" : "Buy / Sell");
    formData.append("sheet", getCurrentModeActiveItemList());
    formData.append("page", window.location.href);
    formData.append("submittedAt", new Date().toISOString());

    try
    {
        const response = await fetch(suggestionFormEndpoint, {
            method: "POST",
            body: formData,
            headers: {Accept: "application/json"}
        });
        const result = await response.json();
        if(!response.ok)
            throw new Error(result.errors?.map(error => error.message).join(" ") || "Unable to send suggestion.");

        suggestionForm[0].reset();
        updateSuggestionIncognitoState();
        setSuggestionStatus("success", "Suggestion sent successfully.");
    }
    catch(error)
    {
        console.log("Unable to send suggestion --", error);
        setSuggestionStatus("error", "Unable to send. Please try again.");
    }
    finally
    {
        suggestionSubmitButton.prop("disabled", false);
        suggestionLoadingWheel.prop("hidden", true);
    }
}

function setUpStylingDrawer()
{
    stylingDrawerOpenButton.on("click", () => openStylingDrawer());
    stylingDrawerCloseButton.on("click", closeStylingDrawer);
    $(window).on("resize", syncStylingDrawerForViewport);
    $(".mainWorkspace").on("transitionend", event =>
    {
        if(event.originalEvent.propertyName === "margin-right")
            rescaleScreenshotRegion();
    });
    syncStylingDrawerForViewport();

    const backgroundInputs = $([
        generatedImageBackgroundModeInput[0],
        generatedImageGradientAngleInput[0]
    ]);
    const styleInputs = $([
        generatedImageBorderColorInput[0],
        generatedImageBorderThicknessInput[0],
        generatedImageTextColorInput[0],
        generatedImageFontInput[0],
        generatedImageShowBottomTextInput[0],
        generatedImagePaddingTopInput[0],
        generatedImagePaddingRightInput[0],
        generatedImagePaddingBottomInput[0],
        generatedImagePaddingLeftInput[0],
        generatedImageShowItemQuantityInput[0],
        generatedImageEnableInfinityInput[0],
        generatedImageItemQuantitySizeInput[0],
        generatedImageShowItemPriceInput[0],
        generatedImageItemPriceSizeInput[0]
    ]);
    backgroundInputs.on("input", () =>
    {
        normalizeGeneratedImageColors();
        applyGeneratedImageStyles();
    });
    backgroundInputs.on("change", () =>
    {
        normalizeGeneratedImageColors();
        applyGeneratedImageStyles();
        saveAllToLocalStorage();
        rescaleScreenshotRegion();
    });
    styleInputs.on("input", applyGeneratedImageStyles);
    styleInputs.on("change", () =>
    {
        applyGeneratedImageStyles();
        saveAllToLocalStorage();
        rescaleScreenshotRegion();
    });
    generatedImagePaddingResetButton.on("click", () =>
    {
        generatedImagePaddingTopInput.val(generatedImageDefaultPadding);
        generatedImagePaddingRightInput.val(generatedImageDefaultPadding);
        generatedImagePaddingBottomInput.val(generatedImageDefaultPadding);
        generatedImagePaddingLeftInput.val(generatedImageDefaultPadding);
        applyGeneratedImageStyles();
        saveAllToLocalStorage();
        rescaleScreenshotRegion();
    });
    generatedImagePresetInput.on("change", () =>
    {
        applyGeneratedImagePreset();
        applyGeneratedImageStyles();
        saveAllToLocalStorage();
        rescaleScreenshotRegion();
    });
    $(".stylingColorSwatch").on("click", event =>
    {
        const swatch = $(event.currentTarget);
        $(`#${swatch.data("target")}`).val(swatch.data("color"));
        applyGeneratedImageStyles();
        saveAllToLocalStorage();
        rescaleScreenshotRegion();
    });

    generatedImageBottomTextInput.on("input", event =>
    {
        setGeneratedImageBottomText(event.target.value);
    });
    generatedImageBottomTextInput.on("change", event =>
    {
        setGeneratedImageBottomText(event.target.value);
        saveAllToLocalStorage();
        rescaleScreenshotRegion();
    });

    generatedImageCreditInput.on("input", applyGeneratedImageStyles);
    generatedImageCreditInput.on("change", () =>
    {
        applyGeneratedImageStyles();
        saveAllToLocalStorage();
        rescaleScreenshotRegion();
    });
}

function openStylingDrawer(focusTarget = "")
{
    stylingDrawer.prop("hidden", false);
    stylingDrawer.removeClass("collapsed");
    updateStylingDrawerToggle();
    rescaleScreenshotRegion();
    if(focusTarget === "bottomText")
    {
        generatedImageBottomTextInput[0].scrollIntoView({block: "center"});
        generatedImageBottomTextInput.trigger("select");
    }
    else if(focusTarget === "advanced")
        advancedSettingsDrawerContent[0].scrollIntoView({block: "start"});
}

function closeStylingDrawer()
{
    if(getIsMobileStylingDrawer())
        stylingDrawer.prop("hidden", true);
    else
        stylingDrawer.toggleClass("collapsed");

    updateStylingDrawerToggle();
    rescaleScreenshotRegion();
}

function getIsMobileStylingDrawer()
{
    return window.matchMedia("(max-width: 760px)").matches;
}

function syncStylingDrawerForViewport()
{
    const isMobile = getIsMobileStylingDrawer();
    if(isMobile)
    {
        if(stylingDrawerViewportWasMobile !== true)
            stylingDrawer.prop("hidden", true);
    }
    else
        stylingDrawer.prop("hidden", false);

    stylingDrawerViewportWasMobile = isMobile;
    updateStylingDrawerToggle();
    rescaleScreenshotRegion();
}

function updateStylingDrawerToggle()
{
    const isCollapsed = stylingDrawer.hasClass("collapsed");
    $("body").toggleClass("stylingDrawerCollapsed", isCollapsed && !getIsMobileStylingDrawer());
    stylingDrawerCloseButton.html(`<i data-lucide="${isCollapsed ? "chevron-left" : "chevron-right"}">${isCollapsed ? "&#10094;" : "&#10095;"}</i>`);
    stylingDrawerCloseButton.attr("title", isCollapsed ? "Expand styling options" : "Collapse styling options");
    stylingDrawerCloseButton.attr("aria-label", isCollapsed ? "Expand styling options" : "Collapse styling options");
    renderLucideIcons();
}

function renderLucideIcons()
{
    if(window.lucide)
        window.lucide.createIcons();
}

function setGeneratedImageBottomText(text)
{
    bottomText[0].innerText = text;
    generatedImageBottomTextInput.val(text);
    fitGeneratedImageBottomText();
}

function getGeneratedImageCreditColor()
{
    const colorValues = [generatedImageBackgroundColorInput.val()];
    if(generatedImageBackgroundModeInput.val() !== "solid")
        colorValues.push(generatedImageGradientColorInput.val());

    const averageLuminance = colorValues
        .map(color => color.match(/[a-f\d]{2}/gi).map(value => parseInt(value, 16) / 255))
        .map(([red, green, blue]) => 0.2126 * red + 0.7152 * green + 0.0722 * blue)
        .reduce((sum, luminance) => sum + luminance, 0) / colorValues.length;

    return averageLuminance > 0.62 ? "#000000" : "#ffffff";
}

function applyGeneratedImageStyles()
{
    const primaryColor = generatedImageBackgroundColorInput.val();
    const backgroundMode = generatedImageBackgroundModeInput.val();
    let background = primaryColor;
    if(backgroundMode === "gradient")
        background = `linear-gradient(${generatedImageGradientAngleInput.val()}deg, ${primaryColor}, ${generatedImageGradientColorInput.val()})`;
    else if(backgroundMode === "radial")
        background = `radial-gradient(circle, ${primaryColor}, ${generatedImageGradientColorInput.val()})`;

    const bottomTextIsHidden = !generatedImageShowBottomTextInput.prop("checked");
    generatedImagePresetLabel.prop("hidden", backgroundMode === "solid");
    generatedImagePresetInput.prop("hidden", backgroundMode === "solid");
    generatedImageSolidPaletteField.prop("hidden", backgroundMode !== "solid");
    generatedImageGradientFields.prop("hidden", backgroundMode !== "gradient");
    generatedImageGradientAngleLabel.prop("hidden", backgroundMode !== "gradient");
    generatedImageGradientAngleInput.prop("hidden", backgroundMode !== "gradient");
    screenshotRegion[0].style.setProperty("--screenshot-background", background);
    screenshotRegion[0].style.setProperty("--trade-border-color", generatedImageBorderColorInput.val());
    screenshotRegion[0].style.setProperty("--trade-border-width", `${generatedImageBorderThicknessInput.val()}px`);
    screenshotRegion[0].style.setProperty("--screenshot-text-color", generatedImageTextColorInput.val());
    const creditColor = getGeneratedImageCreditColor();
    screenshotRegion[0].style.setProperty("--screenshot-credit-color", creditColor);
    screenshotRegion[0].style.setProperty("--screenshot-credit-shadow", creditColor === "#ffffff" ? "#000000" : "#ffffff");
    screenshotRegion[0].style.setProperty("--screenshot-font-family", generatedImageFontInput.val());
    screenshotRegion[0].style.setProperty("--screenshot-padding-top", `${generatedImagePaddingTopInput.val()}px`);
    screenshotRegion[0].style.setProperty("--screenshot-padding-right", `${generatedImagePaddingRightInput.val()}px`);
    screenshotRegion[0].style.setProperty("--screenshot-padding-bottom", `${generatedImagePaddingBottomInput.val()}px`);
    screenshotRegion[0].style.setProperty("--screenshot-padding-left", `${generatedImagePaddingLeftInput.val()}px`);
    screenshotRegion[0].style.setProperty("--normal-item-quantity-size", `${generatedImageItemQuantitySizeInput.val()}px`);
    screenshotRegion[0].style.setProperty("--normal-item-price-size", `${generatedImageItemPriceSizeInput.val()}px`);
    generatedImageBorderThicknessOutput.text(`${generatedImageBorderThicknessInput.val()}px`);
    generatedImagePaddingTopOutput.text(`${generatedImagePaddingTopInput.val()}px`);
    generatedImagePaddingRightOutput.text(`${generatedImagePaddingRightInput.val()}px`);
    generatedImagePaddingBottomOutput.text(`${generatedImagePaddingBottomInput.val()}px`);
    generatedImagePaddingLeftOutput.text(`${generatedImagePaddingLeftInput.val()}px`);
    generatedImageItemQuantitySizeOutput.text(`${generatedImageItemQuantitySizeInput.val()}px`);
    generatedImageItemPriceSizeOutput.text(`${generatedImageItemPriceSizeInput.val()}px`);
    bottomText.prop("hidden", bottomTextIsHidden);
    screenshotRegion.toggleClass("bottomTextHidden", bottomTextIsHidden);
    screenshotRegion.toggleClass("hideGeneratedItemQuantities", !generatedImageShowItemQuantityInput.prop("checked"));
    screenshotRegion.toggleClass("hideGeneratedItemPrices", !generatedImageShowItemPriceInput.prop("checked"));
    itemInfinityQuantityButton.prop("hidden", !generatedImageEnableInfinityInput.prop("checked"));
    leftWatermark.text(generatedImageCreditInput.val());
    fitGeneratedImageBottomText();
    updateGeneratedImageColorSwatches();
}

function getGeneratedImageStoragePrefix()
{
    return getIsInTradeView() ? "trade" : "buySell";
}

function getGeneratedImageStorageKey(settingName)
{
    return `${getGeneratedImageStoragePrefix()}GeneratedImage${settingName}`;
}

function getStoredGeneratedImageSetting(settingName, legacyKey, fallback)
{
    return localStorage.getItem(getGeneratedImageStorageKey(settingName)) ?? localStorage.getItem(legacyKey) ?? fallback;
}

function loadGeneratedImageStylesForCurrentMode()
{
    const isTradeView = getIsInTradeView();
    const bottomTextValue = getStoredGeneratedImageSetting("BottomText", "bottomText", "Partial Accepted");
    const savedGeneratedImageTextColor = getStoredGeneratedImageSetting("TextColor", "generatedImageTextColor", "#ffffff");
    const savedGeneratedImageCredit = getStoredGeneratedImageSetting("Credit", "generatedImageCredit", "Gamingwith3K");
    const shouldMigrateGeneratedImageCredit = !savedGeneratedImageCredit || savedGeneratedImageCredit.toLowerCase().replaceAll(" ", "") === "madebygamingwith3k";

    generatedImageBottomTextInput.val(bottomTextValue);
    bottomText[0].innerText = bottomTextValue;
    generatedImageBackgroundModeInput.val(getStoredGeneratedImageSetting("BackgroundMode", "generatedImageBackgroundMode", "radial"));
    generatedImagePresetInput.val(getStoredGeneratedImageSetting("Preset", "generatedImagePreset", "blurpleGlow"));
    if(!generatedImagePresetInput.val())
        generatedImagePresetInput.val("blurpleGlow");
    generatedImageBackgroundColorInput.val(getStoredGeneratedImageSetting("BackgroundColor", "generatedImageBackgroundColor", "#3f4652"));
    generatedImageGradientColorInput.val(getStoredGeneratedImageSetting("GradientColor", "generatedImageGradientColor", "#111318"));
    generatedImageGradientAngleInput.val("135");
    generatedImageBorderColorInput.val(getStoredGeneratedImageSetting("BorderColor", "generatedImageBorderColor", "#ffffff"));
    const savedBorderThickness = localStorage.getItem(getGeneratedImageStorageKey("BorderThickness"));
    generatedImageBorderThicknessInput.val(savedBorderThickness ?? (isTradeView ? "3" : localStorage.getItem("generatedImageBorderThickness") ?? "1"));
    generatedImageTextColorInput.val(savedGeneratedImageTextColor);
    generatedImageFontInput.val("Georgia");
    generatedImageShowBottomTextInput.prop("checked", getStoredGeneratedImageSetting("ShowBottomText", "generatedImageShowBottomText", "true") === "true");
    generatedImageCreditInput.val(shouldMigrateGeneratedImageCredit ? "Gamingwith3K" : savedGeneratedImageCredit);
    generatedImagePaddingTopInput.val(clampGeneratedImagePadding(getStoredGeneratedImageSetting("PaddingTop", "generatedImagePaddingTop", generatedImageDefaultPadding)));
    generatedImagePaddingRightInput.val(clampGeneratedImagePadding(getStoredGeneratedImageSetting("PaddingRight", "generatedImagePaddingRight", generatedImageDefaultPadding)));
    generatedImagePaddingBottomInput.val(clampGeneratedImagePadding(getStoredGeneratedImageSetting("PaddingBottom", "generatedImagePaddingBottom", generatedImageDefaultPadding)));
    generatedImagePaddingLeftInput.val(clampGeneratedImagePadding(getStoredGeneratedImageSetting("PaddingLeft", "generatedImagePaddingLeft", generatedImageDefaultPadding)));
    generatedImageShowItemQuantityInput.prop("checked", getStoredGeneratedImageSetting("ShowItemQuantity", "generatedImageShowItemQuantity", "true") === "true");
    generatedImageEnableInfinityInput.prop("checked", getStoredGeneratedImageSetting("EnableInfinity", "generatedImageEnableInfinity", "false") === "true");
    generatedImageItemQuantitySizeInput.val(getStoredGeneratedImageSetting("ItemQuantitySize", "generatedImageItemQuantitySize", "34"));
    generatedImageShowItemPriceInput.prop("checked", getStoredGeneratedImageSetting("ShowItemPrice", "generatedImageShowItemPrice", "true") === "true");
    generatedImageItemPriceSizeInput.val(getStoredGeneratedImageSetting("ItemPriceSize", "generatedImageItemPriceSize", "22"));
    normalizeGeneratedImageColors();
    applyGeneratedImageStyles();
}

function saveGeneratedImageStylesForCurrentMode()
{
    const set = (settingName, value) => localStorage.setItem(getGeneratedImageStorageKey(settingName), value);
    set("BottomText", bottomText[0].innerText);
    set("BackgroundMode", generatedImageBackgroundModeInput.val());
    set("Preset", generatedImagePresetInput.val());
    set("BackgroundColor", generatedImageBackgroundColorInput.val());
    set("GradientColor", generatedImageGradientColorInput.val());
    set("BorderColor", generatedImageBorderColorInput.val());
    set("BorderThickness", generatedImageBorderThicknessInput.val());
    set("TextColor", generatedImageTextColorInput.val());
    set("ShowBottomText", generatedImageShowBottomTextInput.prop("checked"));
    set("Credit", generatedImageCreditInput.val());
    set("PaddingTop", generatedImagePaddingTopInput.val());
    set("PaddingRight", generatedImagePaddingRightInput.val());
    set("PaddingBottom", generatedImagePaddingBottomInput.val());
    set("PaddingLeft", generatedImagePaddingLeftInput.val());
    set("ShowItemQuantity", generatedImageShowItemQuantityInput.prop("checked"));
    set("EnableInfinity", generatedImageEnableInfinityInput.prop("checked"));
    set("ItemQuantitySize", generatedImageItemQuantitySizeInput.val());
    set("ShowItemPrice", generatedImageShowItemPriceInput.prop("checked"));
    set("ItemPriceSize", generatedImageItemPriceSizeInput.val());
}

function updateGeneratedImageColorSwatches()
{
    $(".stylingColorSwatch").each((i, element) =>
    {
        const swatch = $(element);
        swatch.toggleClass("selected", $(`#${swatch.data("target")}`).val() === swatch.data("color"));
    });
}

function normalizeGeneratedImageColors()
{
    if(generatedImageBackgroundModeInput.val() === "solid")
    {
        if(!generatedImageSolidColors.includes(generatedImageBackgroundColorInput.val()))
            generatedImageBackgroundColorInput.val("#171a1f");
    }
    else
        applyGeneratedImagePreset(false);

    if(!generatedImageBorderColors.includes(generatedImageBorderColorInput.val()))
        generatedImageBorderColorInput.val("#ffffff");
    if(!generatedImageTextColors.includes(generatedImageTextColorInput.val()))
        generatedImageTextColorInput.val("#ffffff");
}

function applyGeneratedImagePreset(shouldApplyMode = true)
{
    const presets = {
        blurpleGlow: {mode: "radial", primary: "#3f4652", secondary: "#111318", text: "#ffffff", angle: "135"},
        sunsetPeach: {mode: "gradient", primary: "#633544", secondary: "#1a1016", text: "#ffffff", angle: "135"},
        mintSky: {mode: "radial", primary: "#31564c", secondary: "#0d1716", text: "#ffffff", angle: "135"},
        berryCream: {mode: "gradient", primary: "#51385c", secondary: "#15101a", text: "#ffffff", angle: "135"},
        morningMist: {mode: "radial", primary: "#f7fbff", secondary: "#c7d9ee", text: "#151a20", angle: "135"},
        peachBloom: {mode: "gradient", primary: "#fff0dc", secondary: "#f4b6bd", text: "#25171a", angle: "135"},
        mintCream: {mode: "radial", primary: "#f2fff8", secondary: "#a8dfc4", text: "#10241b", angle: "135"},
        lavenderSky: {mode: "gradient", primary: "#f8f1ff", secondary: "#c7b8ed", text: "#211831", angle: "135"}
    };
    const preset = presets[generatedImagePresetInput.val()];
    if(!preset)
        return;

    if(shouldApplyMode)
    {
        generatedImageBackgroundModeInput.val(preset.mode);
        generatedImageTextColorInput.val(preset.text);
    }
    generatedImageBackgroundColorInput.val(preset.primary);
    generatedImageGradientColorInput.val(preset.secondary);
    generatedImageGradientAngleInput.val(preset.angle);
}

function setUpAbbreviationMappingTable()
{
    for(let [abbreviation, abbreviationExpanded] of abbreviationMapping)
        addAbbreviationMappingTableRow(abbreviation, abbreviationExpanded);

    ensureExtraAbbreviationMappingTableRow();
}

function addAbbreviationMappingTableRow(abbreviation, abbreviationExpanded)
{
    const abbreviationTableRow = document.createElement("tr");

    const abbreviationCell = document.createElement("td");
    const abbreviationExpandedCell = document.createElement("td");

    const abbreviationInput = document.createElement("input");
    const abbreviationInputSelector = $(abbreviationInput);
    abbreviationInputSelector.on("change", handleAbbreviationChange);
    abbreviationInput.type = "text";
    abbreviationInput.style.maxWidth = "8em";
    abbreviationInput.value = abbreviation;
    abbreviationInput.dataset.previousValue = abbreviation;

    const abbreviationExpandedInput = document.createElement("input");
    const abbreviationExpandedInputSelector = $(abbreviationExpandedInput);
    abbreviationExpandedInputSelector.on("change", handleAbbreviationChange);
    abbreviationExpandedInput.type = "text";
    abbreviationExpandedInput.style.maxWidth = "8em";
    abbreviationExpandedInput.value = abbreviationExpanded;

    $(abbreviationCell).on("click", (e) =>
    {

        if(e.target === e.currentTarget)
            abbreviationInputSelector.trigger("focus");
    });
    $(abbreviationExpandedCell).on("click", (e) =>
    {

        if(e.target === e.currentTarget)
            abbreviationExpandedInputSelector.trigger("focus");
    });

    abbreviationCell.appendChild(abbreviationInput);
    abbreviationExpandedCell.appendChild(abbreviationExpandedInput);

    abbreviationTableRow.appendChild(abbreviationCell);
    abbreviationTableRow.appendChild(abbreviationExpandedCell);

    abbreviationMappingTable.append(abbreviationTableRow);
}

function handleAbbreviationChange(event)
{
    const previousValue = event.target.dataset.previousValue;

    const row = $(event.target).closest("tr");
    const cells = row.find("input");
    const abbreviation = cells.eq(0);

    if(!abbreviation.val().length)
    {
        removeAbbreviation(previousValue);
        row.remove();

        ensureExtraAbbreviationMappingTableRow();

        return;
    }
    const abbreviationExpanded = cells.eq(1);

    abbreviation.val(abbreviation.val().trim().toLowerCase());
    abbreviationExpanded.val(abbreviationExpanded.val().trim().toLowerCase());

    updateAbbreviation(previousValue, abbreviation.val(), abbreviationExpanded.val());

    abbreviation[0].dataset.previousValue = abbreviation.val();

    ensureExtraAbbreviationMappingTableRow();
};

function removeAbbreviation(abbreviation)
{
    abbreviationMapping.delete(abbreviation);

    saveAllToLocalStorage();
}

function updateAbbreviation(oldAbbreviation, newAbbreviation, abbreviationExpanded)
{
    abbreviationMapping.set(newAbbreviation, abbreviationExpanded);

    if(oldAbbreviation !== newAbbreviation)
        removeAbbreviation(oldAbbreviation);
    else
        saveAllToLocalStorage();
}

function ensureExtraAbbreviationMappingTableRow()
{
    const lastRow = abbreviationMappingTable.find("tr").last();
    const abbreviation = lastRow.find("input").first();

    if(!abbreviation.length || abbreviation.val().length)
        addAbbreviationMappingTableRow("", "");
}

function exportAll()
{
    let blob = new Blob([JSON.stringify(localStorage)], {type: "application/json"});

    let aElement = document.createElement("a");
    aElement.href = URL.createObjectURL(blob);
    aElement.download = `Full Export -- ${(new Date()).toISOString()}.json`;
    aElement.hidden = true;
    document.body.appendChild(aElement);

    aElement.click();
    aElement.remove();
}

function importAll(jsonBlob)
{
    let json = JSON.parse(jsonBlob);
    if(typeof json === "string")
        json = JSON.parse(json);

    for(let [key, value] of Object.entries(json))
        localStorage.setItem(key, value);

    loadAllFromLocalStorage();
    updateItemLayout();
}

function getItemListContentKey()
{
    return getIsInTradeView() ? "tradeRows" : "items";
}

function getEmptyItemListContent()
{
    return JSON.stringify([]);
}

function getDefaultItemListSettings()
{
    const storagePrefix = getGeneratedImageStoragePrefix();
    const styleDefaults = {
        [`${storagePrefix}GeneratedImageBottomText`]: "Partial Accepted",
        [`${storagePrefix}GeneratedImageBackgroundMode`]: "radial",
        [`${storagePrefix}GeneratedImagePreset`]: "blurpleGlow",
        [`${storagePrefix}GeneratedImageBackgroundColor`]: "#3f4652",
        [`${storagePrefix}GeneratedImageGradientColor`]: "#111318",
        [`${storagePrefix}GeneratedImageBorderColor`]: "#ffffff",
        [`${storagePrefix}GeneratedImageBorderThickness`]: getIsInTradeView() ? "3" : "1",
        [`${storagePrefix}GeneratedImageTextColor`]: "#ffffff",
        [`${storagePrefix}GeneratedImageShowBottomText`]: "true",
        [`${storagePrefix}GeneratedImageCredit`]: "Gamingwith3K",
        [`${storagePrefix}GeneratedImagePaddingTop`]: generatedImageDefaultPadding,
        [`${storagePrefix}GeneratedImagePaddingRight`]: generatedImageDefaultPadding,
        [`${storagePrefix}GeneratedImagePaddingBottom`]: generatedImageDefaultPadding,
        [`${storagePrefix}GeneratedImagePaddingLeft`]: generatedImageDefaultPadding,
        [`${storagePrefix}GeneratedImageShowItemQuantity`]: "true",
        [`${storagePrefix}GeneratedImageEnableInfinity`]: "false",
        [`${storagePrefix}GeneratedImageItemQuantitySize`]: "34",
        [`${storagePrefix}GeneratedImageShowItemPrice`]: "true",
        [`${storagePrefix}GeneratedImageItemPriceSize`]: "22"
    };

    if(getIsInTradeView())
        return {...styleDefaults, tradeRowsPerRow: "2"};

    return {
        ...styleDefaults,
        itemsPerRow: "8",
        textListSeparatorSelectedRadio: "0",
        textListCustomSeparator: "",
        textListFormat: "{{quantity}} {{name}} ({{price}})",
        priceCalculationItem: "Diamond Ring",
        defaultQuantity: "",
        defaultPriceOrMultiplier: "5x",
        refocusNameOnSubmit: "true",
        focusQuantityOnAutocomplete: "true",
        ignoreLocale: "false"
    };
}

function getStoredItemListSettings()
{
    const settings = {};
    for(let [key, fallback] of Object.entries(getDefaultItemListSettings()))
        settings[key] = localStorage.getItem(key) ?? fallback;

    return settings;
}

function createItemListObject(shouldIncludeContent, shouldIncludeSettings)
{
    const obj = shouldIncludeSettings ? getStoredItemListSettings() : getDefaultItemListSettings();
    const contentKey = getItemListContentKey();
    obj[contentKey] = shouldIncludeContent ? localStorage.getItem(contentKey) ?? getEmptyItemListContent() : getEmptyItemListContent();
    return obj;
}

function getCurrentModeItemLists()
{
    return getIsInTradeView() ? tradeItemLists : buySellItemLists;
}

function getCurrentModeActiveItemList()
{
    return getIsInTradeView() ? tradeActiveItemList : buySellActiveItemList;
}

function setCurrentModeActiveItemList(name)
{
    activeItemList = name;
    if(getIsInTradeView())
        tradeActiveItemList = name;
    else
        buySellActiveItemList = name;
}

function saveItemListCollectionsToLocalStorage()
{
    localStorage.setItem("buySellActiveItemList", buySellActiveItemList);
    localStorage.setItem("tradeActiveItemList", tradeActiveItemList);
    localStorage.setItem("buySellItemLists", JSON.stringify([...buySellItemLists]));
    localStorage.setItem("tradeItemLists", JSON.stringify([...tradeItemLists]));
}

function refreshItemListDropdown()
{
    itemLists = getCurrentModeItemLists();
    activeItemList = getCurrentModeActiveItemList();
    itemListDropdown.empty();
    for(let name of itemLists.keys())
    {
        const option = new Option(name);
        itemListDropdown.append(option);
        if(activeItemList === name)
            $(option).prop("selected", true);
    }

    deleteItemListButton.prop("disabled", activeItemList === "Default");
    createItemListButton.prop("disabled", itemLists.has(createItemListInput.val()));
}

function activateItemListsForCurrentMode()
{
    itemLists = getCurrentModeItemLists();
    activeItemList = getCurrentModeActiveItemList();

    if(!itemLists.has("Default"))
        itemLists.set("Default", createItemListObject(true, true));
    if(!itemLists.has(activeItemList))
        setCurrentModeActiveItemList("Default");

    refreshItemListDropdown();
    saveItemListCollectionsToLocalStorage();
}

function createNewItemList(name)
{
    const shouldCreateInitialDefault = name === "Default";
    const obj = createItemListObject(
        shouldCreateInitialDefault || shouldCopyCurrentItemsFromItemList,
        shouldCreateInitialDefault || shouldIncludeSettingsInItemList
    );

    const currentModeItemLists = getCurrentModeItemLists();
    currentModeItemLists.set(name, obj);
    itemLists = currentModeItemLists;
    setCurrentModeActiveItemList(name);
    refreshItemListDropdown();
    saveItemListCollectionsToLocalStorage();
}

function storeItemList()
{
    saveAllToLocalStorage();
    const currentModeItemLists = getCurrentModeItemLists();
    currentModeItemLists.set(getCurrentModeActiveItemList(), createItemListObject(true, true));
    itemLists = currentModeItemLists;
    saveItemListCollectionsToLocalStorage();
}

function deleteCurrentModeItemList(name)
{
    const currentModeItemLists = getCurrentModeItemLists();
    currentModeItemLists.delete(name);
    itemLists = currentModeItemLists;
    setCurrentModeActiveItemList("Default");
    saveItemListCollectionsToLocalStorage();
    loadItemList();
}

function loadItemList()
{
    itemLists = getCurrentModeItemLists();
    activeItemList = getCurrentModeActiveItemList();
    const obj = itemLists.get(activeItemList);
    const settings = {...getDefaultItemListSettings(), ...obj};
    for(let key of Object.keys(getDefaultItemListSettings()))
        localStorage.setItem(key, settings[key]);

    const contentKey = getItemListContentKey();
    localStorage.setItem(contentKey, obj[contentKey] ?? getEmptyItemListContent());
    saveItemListCollectionsToLocalStorage();
    loadAllFromLocalStorage();

    if(getIsInTradeView())
    {
        updateTradeDisplay();
        updateTradeDraftSummary();
        updateTradeSubmitButtonText();
    }
    else
        updateItemLayout();
}
