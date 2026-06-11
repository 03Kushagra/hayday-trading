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

let itemsPerRow = 8;
let tradeRowsPerRow = 4;
let textListSeparatorSelectedRadio = 0;

let itemsPerRowSlider, itemsPerRowLabel, itemsPerRowOptionLabel, itemNameInput, itemQuantityInput, itemInfinityQuantityButton, itemPriceOrMultiplierInput, itemTable, normalItemsPlaceholder;
let normalViewButton, tradeViewButton, itemEditorModeTitle, normalItemEntryHint, normalItemEntryArea, tradeItemEntryArea, normalItemClickInfo, hideInTradeViewElems;
let tradeOfferNameInput, tradeOfferQuantityInput, tradeWantNameInput, tradeWantQuantityInput, tradeOfferFuzzyMatchesHolder, tradeWantFuzzyMatchesHolder, tradeDisplay;
let tradeDraftSummary, tradeCancelEditButton;
let tradeSelectionModeStateSpan, tradeUnselectedVisibilityStateSpan, disableOutsideTradeSelectionModeElems;
let bottomText, screenshotRegion, screenshotPriceHolder, leftWatermark;
let stylingDrawer, stylingDrawerOpenButton, stylingDrawerCloseButton, advancedSettingsDrawerContent;
let generatedImageBackgroundModeInput, generatedImagePresetInput, generatedImagePresetLabel, generatedImageSolidPaletteField, generatedImageBackgroundColorInput, generatedImageGradientColorInput, generatedImageGradientAngleInput, generatedImageGradientAngleLabel, generatedImageBorderColorInput, generatedImageBorderThicknessInput, generatedImageBorderThicknessOutput, generatedImageTextColorInput, generatedImageFontInput, generatedImageBottomTextInput, generatedImageShowBottomTextInput, generatedImageCreditInput, generatedImageGradientFields;
let generatedImagePaddingTopInput, generatedImagePaddingRightInput, generatedImagePaddingBottomInput, generatedImagePaddingLeftInput, generatedImagePaddingTopOutput, generatedImagePaddingRightOutput, generatedImagePaddingBottomOutput, generatedImagePaddingLeftOutput, generatedImagePaddingResetButton;
let generatedImageShowItemQuantityInput, generatedImageEnableInfinityInput, generatedImageItemQuantitySizeInput, generatedImageItemQuantitySizeOutput, generatedImageShowItemPriceInput, generatedImageItemPriceSizeInput, generatedImageItemPriceSizeOutput;
let suggestionOverlayShowButton, suggestionForm, suggestionSubmitButton, suggestionLoadingWheel, suggestionStatus, suggestionDiscordInput, suggestionIncognitoInput, importFileInput, itemListDropdown, deleteItemListButton, createItemListInput, createItemListButton, includeSettingsInItemListCheckBox, copyCurrentItemsFromItemListCheckBox, abbreviationMappingTable, textListSeparatorRadios, textListCustomSeparatorInput, textListSeparatorCustomRadio, textListFormatInput, priceCalculationItemInput, defaultQuantityInput, defaultPriceOrMultiplierInput, refocusNameOnSubmitCheckBox, focusQuantityOnAutocompleteCheckBox, ignoreLocaleCheckBox ;
let priceCalculationModeStateSpan;
let disableInPriceCalculationModeElems, disableOutsidePriceCalculationModeElems;
let equationVisibilityStateSpan, unselectedItemsVisibilityStateSpan;
let isPriceCalculationModeEnabled = false;
let shouldHideUnselectedItems = false;
let isTradeSelectionModeEnabled = false, shouldHideUnselectedTrades = false;
let totalSelectedPriceArea, totalSelectedPriceMessageHolder, totalSelectedPriceEquationHolder;
let coinImageUrl;
let priceCalculationItem;
let priceCalculationModeSelectionInfo;
let failedCopyOverlay, contactOverlay, suggestionOverlay;
let copyImageLoadingWheel, copyImageStatus;
let activeItemList;
let shouldIncludeSettingsInItemList, shouldCopyCurrentItemsFromItemList;
let defaultQuantity, defaultPriceOrMultiplier;
let shouldRefocusNameOnSubmit, shouldFocusQuantityOnAutocomplete, shouldIgnoreLocale;

let itemNameFuzzyMatchesHolder, priceCalculationItemFuzzyMatchesHolder;

let preparedItemNames;

let items = new Map();
let tradeRows = [];
let tradeDraftOfferItems = [], tradeDraftWantItems = [];
let tradeDraftPendingPromises = [];
let tradeDraftOrder = 0;
let editingTradeRowIndex = undefined;
let tradeOfferInputItemCache, tradeWantInputItemCache;

let itemLists = new Map();
let buySellItemLists = new Map(), tradeItemLists = new Map();
let buySellActiveItemList = "Default", tradeActiveItemList = "Default";

let abbreviationMapping = new Map([
    ["tnt", "tnt barrel"],
    ["dyn", "dynamite"],
    ["wsugar", "white sugar"],
    ["bsugar", "brown sugar"],
    ["bpop", "buttered popcorn"],
    ["cpop", "cherry popsicle"],
    ["bmuff", "blackberry muffin"],
    ["rmuff", "raspberry muffin"],
    ["vice", "vanilla ice cream"],
    ["sice", "strawberry ice cream"],
    ["gbar", "gold bar"],
    ["sbar", "silver bar"],
    ["pbar", "platinum bar"],
    ["rcoal", "refined coal"],
    ["gcheese", "goat cheese"],
    ["wax", "beeswax"],
    ["lobster", "lobster tail"],
    ["lobsters", "lobster tail"],
    ["feather", "duck feather"],
    ["feathers", "duck feather"],
    ["bem", "BEM Set"],
    ["bems", "BEM Set"],
    ["bemset", "BEM Set"],
    ["sem", "SEM Set"],
    ["sems", "SEM Set"],
    ["semset", "SEM Set"],
    ["tem", "TEM Set"],
    ["tems", "TEM Set"],
    ["temset", "TEM Set"],
    ["lem", "LEM Set"],
    ["lems", "LEM Set"],
    ["lemset", "LEM Set"]
]);
let isActivelyCopyingImage = false;

$(document).ready(() =>
{

    if(localStorage.getItem("v2.14_backup") === null)
        localStorage.setItem("v2.14_backup", JSON.stringify(localStorage));

    setUpCustomItems();

    itemsPerRowSlider = $("#itemsPerRowSlider");
    itemsPerRowLabel = $("#itemsPerRowLabel");
    itemsPerRowOptionLabel = $("#itemsPerRowOptionLabel");
    itemNameInput = $("#itemNameInput");
    itemQuantityInput = $("#itemQuantityInput");
    itemInfinityQuantityButton = $("#itemInfinityQuantityButton");
    itemPriceOrMultiplierInput = $("#itemPriceOrMultiplierInput");
    itemTable = $("#itemTable");
    normalItemsPlaceholder = $("#normalItemsPlaceholder");

    normalViewButton = $("#normalViewButton");
    tradeViewButton = $("#tradeViewButton");
    itemEditorModeTitle = $("#itemEditorModeTitle");
    normalItemEntryHint = $("#normalItemEntryHint");
    normalItemEntryArea = $("#normalItemEntryArea");
    tradeItemEntryArea = $("#tradeItemEntryArea");
    normalItemClickInfo = $("#normalItemClickInfo");
    hideInTradeViewElems = $(".hideInTradeView");
    tradeOfferNameInput = $("#tradeOfferNameInput");
    tradeOfferQuantityInput = $("#tradeOfferQuantityInput");
    tradeWantNameInput = $("#tradeWantNameInput");
    tradeWantQuantityInput = $("#tradeWantQuantityInput");
    tradeOfferFuzzyMatchesHolder = $("#tradeOfferFuzzyMatchesHolder");
    tradeWantFuzzyMatchesHolder = $("#tradeWantFuzzyMatchesHolder");
    tradeDisplay = $("#tradeDisplay");
    tradeDraftSummary = $("#tradeDraftSummary");
    tradeCancelEditButton = $("#tradeCancelEditButton");
    tradeSelectionModeStateSpan = $("#tradeSelectionModeStateSpan");
    tradeUnselectedVisibilityStateSpan = $("#tradeUnselectedVisibilityStateSpan");
    disableOutsideTradeSelectionModeElems = $(".disableOutsideTradeSelectionMode");

    bottomText = $("#bottomText");
    screenshotRegion = $("#screenshotRegion");
    screenshotPriceHolder = $("#screenshotPriceHolder");
    leftWatermark = $("#leftWatermark");
    stylingDrawer = $("#stylingDrawer");
    stylingDrawerOpenButton = $("#stylingDrawerOpenButton");
    stylingDrawerCloseButton = $("#stylingDrawerCloseButton");
    advancedSettingsDrawerContent = $("#advancedSettingsDrawerContent");
    generatedImageBackgroundModeInput = $("#generatedImageBackgroundModeInput");
    generatedImagePresetInput = $("#generatedImagePresetInput");
    generatedImagePresetLabel = $("#generatedImagePresetLabel");
    generatedImageSolidPaletteField = $("#generatedImageSolidPaletteField");
    generatedImageBackgroundColorInput = $("#generatedImageBackgroundColorInput");
    generatedImageGradientColorInput = $("#generatedImageGradientColorInput");
    generatedImageGradientAngleInput = $("#generatedImageGradientAngleInput");
    generatedImageGradientAngleLabel = $("#generatedImageGradientAngleLabel");
    generatedImageBorderColorInput = $("#generatedImageBorderColorInput");
    generatedImageBorderThicknessInput = $("#generatedImageBorderThicknessInput");
    generatedImageBorderThicknessOutput = $("#generatedImageBorderThicknessOutput");
    generatedImageTextColorInput = $("#generatedImageTextColorInput");
    generatedImageFontInput = $("#generatedImageFontInput");
    generatedImageBottomTextInput = $("#generatedImageBottomTextInput");
    generatedImageShowBottomTextInput = $("#generatedImageShowBottomTextInput");
    generatedImageCreditInput = $("#generatedImageCreditInput");
    generatedImageGradientFields = $("#generatedImageGradientFields");
    generatedImagePaddingTopInput = $("#generatedImagePaddingTopInput");
    generatedImagePaddingRightInput = $("#generatedImagePaddingRightInput");
    generatedImagePaddingBottomInput = $("#generatedImagePaddingBottomInput");
    generatedImagePaddingLeftInput = $("#generatedImagePaddingLeftInput");
    generatedImagePaddingTopOutput = $("#generatedImagePaddingTopOutput");
    generatedImagePaddingRightOutput = $("#generatedImagePaddingRightOutput");
    generatedImagePaddingBottomOutput = $("#generatedImagePaddingBottomOutput");
    generatedImagePaddingLeftOutput = $("#generatedImagePaddingLeftOutput");
    generatedImagePaddingResetButton = $("#generatedImagePaddingResetButton");
    generatedImageShowItemQuantityInput = $("#generatedImageShowItemQuantityInput");
    generatedImageEnableInfinityInput = $("#generatedImageEnableInfinityInput");
    generatedImageItemQuantitySizeInput = $("#generatedImageItemQuantitySizeInput");
    generatedImageItemQuantitySizeOutput = $("#generatedImageItemQuantitySizeOutput");
    generatedImageShowItemPriceInput = $("#generatedImageShowItemPriceInput");
    generatedImageItemPriceSizeInput = $("#generatedImageItemPriceSizeInput");
    generatedImageItemPriceSizeOutput = $("#generatedImageItemPriceSizeOutput");

    suggestionOverlayShowButton = $("#suggestionOverlayShowButton");
    suggestionForm = $("#suggestionForm");
    suggestionSubmitButton = $("#suggestionSubmitButton");
    suggestionLoadingWheel = $("#suggestionLoadingWheel");
    suggestionStatus = $("#suggestionStatus");
    suggestionDiscordInput = $("#suggestionDiscordInput");
    suggestionIncognitoInput = $("#suggestionIncognitoInput");
    advancedSettingsDrawerContent.append($("#advancedSettingsDrawerTemplate").contents());
    $("#advancedSettingsDrawerTemplate").remove();

    importFileInput = $("#importFileInput");
    itemListDropdown = $("#itemListDropdown");
    deleteItemListButton = $("#deleteItemListButton");
    createItemListInput = $("#createItemListInput");
    createItemListButton = $("#createItemListButton");
    includeSettingsInItemListCheckBox = $("#includeSettingsInItemListCheckBox");
    copyCurrentItemsFromItemListCheckBox = $("#copyCurrentItemsFromItemListCheckBox");
    abbreviationMappingTable = $("#abbreviationMappingTable");
    textListSeparatorRadios = $("input[name='textListSeparatorGroup']");
    textListCustomSeparatorInput = $("#textListCustomSeparatorInput");
    textListSeparatorCustomRadio = $("#textListSeparatorCustomRadio");
    textListFormatInput = $("#textListFormatInput");
    priceCalculationItemInput = $("#priceCalculationItemInput");
    defaultQuantityInput = $("#defaultQuantityInput");
    defaultPriceOrMultiplierInput = $("#defaultPriceOrMultiplierInput");
    refocusNameOnSubmitCheckBox = $("#refocusNameOnSubmitCheckBox");
    focusQuantityOnAutocompleteCheckBox = $("#focusQuantityOnAutocompleteCheckBox");
    ignoreLocaleCheckBox = $("#ignoreLocaleCheckBox");

    priceCalculationModeStateSpan = $("#priceCalculationModeStateSpan");

    disableInPriceCalculationModeElems = $(".disableInPriceCalculationMode");
    disableOutsidePriceCalculationModeElems = $(".disableOutsidePriceCalculationMode");

    equationVisibilityStateSpan = $("#equationVisibilityStateSpan");
    unselectedItemsVisibilityStateSpan = $("#unselectedItemsVisibilityStateSpan");

    totalSelectedPriceArea = $("#totalSelectedPriceArea");
    totalSelectedPriceMessageHolder = $("#totalSelectedPriceMessageHolder");
    totalSelectedPriceEquationHolder = $("#totalSelectedPriceEquationHolder");

    priceCalculationModeSelectionInfo = $("#priceCalculationModeSelectionInfo");

    failedCopyOverlay = new Overlay("failedCopyOverlay", "imageHolder");

    contactOverlay = new Overlay("contactOverlay", "showButton");
    suggestionOverlay = new Overlay("suggestionOverlay");

    copyImageLoadingWheel = $(".copyImageLoadingWheel");
    copyImageStatus = $(".copyImageStatus");

    itemNameFuzzyMatchesHolder = $("#itemNameFuzzyMatchesHolder");
    priceCalculationItemFuzzyMatchesHolder = $("#priceCalculationItemFuzzyMatchesHolder");

    setUpStylingDrawer();

    tradeViewButton.on("click", () =>
    {
        setTradeViewEnabled(true);
    });
    normalViewButton.on("click", () => setTradeViewEnabled(false));

    itemsPerRowSlider.on("input", (event) =>
    {
        if(getIsInTradeView())
        {
            tradeRowsPerRow = parseInt(event.target.value);
            itemsPerRowLabel.text(tradeRowsPerRow);
            updateTradeDisplay();
        }
        else
        {
            itemsPerRow = parseInt(event.target.value);
            itemsPerRowLabel.text(itemsPerRow);
            updateItemLayout();
        }
    });

    itemNameInput.on("focus", () =>
    {
        updateFuzzyMatches(itemNameInput, itemNameFuzzyMatchesHolder);
    });
    itemNameInput.on("blur", () =>
    {
        itemNameFuzzyMatchesHolder.empty();
    });

    itemNameInput.on("keydown", (e) =>
    {

        if(e.key.length !== 1 || e.key < '0' || e.key > '9')
            return;
        let selection = e.key - '0';
        if(selection === 0)
            selection = 10;

        const buttons = itemNameFuzzyMatchesHolder.find("button");
        if(buttons.length < selection)
            return;

        buttons.eq(selection - 1).trigger("mousedown", {usedKeyboard: true});
        e.preventDefault();
    });
    itemNameInput.on("keyup", (e) =>
    {
        handleAddingItem(e);

        updateFuzzyMatches(itemNameInput, itemNameFuzzyMatchesHolder);
    });
    itemQuantityInput.on("keyup", handleAddingItem);
    itemPriceOrMultiplierInput.on("keyup", handleAddingItem);
    itemInfinityQuantityButton.on("click", () =>
    {
        itemQuantityInput.val(INFINITY_QUANTITY);
        itemQuantityInput.trigger("select");
    });
    $("#itemSubmitButton").on("click", (e) => handleAddingItem(e, true));
    $("#itemDeleteButton").on("click", (e) =>
    {

        if(!formatItemName(itemNameInput.val()).length)
        {

            if(shouldRefocusNameOnSubmit)
                itemNameInput.trigger("select");

            return;
        }

        itemQuantityInput.val("0");
        handleAddingItem(e, true);
    });

    tradeOfferNameInput.on("focus", () =>
    {
        updateFuzzyMatches(tradeOfferNameInput, tradeOfferFuzzyMatchesHolder);
    });
    tradeOfferNameInput.on("blur", () =>
    {
        tradeOfferFuzzyMatchesHolder.empty();
    });
    tradeOfferNameInput.on("keydown", (e) =>
    {
        handleFuzzyMatchKeyboardSelection(e, tradeOfferFuzzyMatchesHolder);
    });
    tradeOfferNameInput.on("keyup", (e) =>
    {
        handleSubmittingTrade(e);
        updateTradeDraftSummary();
        updateFuzzyMatches(tradeOfferNameInput, tradeOfferFuzzyMatchesHolder);
    });

    tradeWantNameInput.on("focus", () =>
    {
        updateFuzzyMatches(tradeWantNameInput, tradeWantFuzzyMatchesHolder);
    });
    tradeWantNameInput.on("blur", () =>
    {
        tradeWantFuzzyMatchesHolder.empty();
    });
    tradeWantNameInput.on("keydown", (e) =>
    {
        handleFuzzyMatchKeyboardSelection(e, tradeWantFuzzyMatchesHolder);
    });
    tradeWantNameInput.on("keyup", (e) =>
    {
        handleSubmittingTrade(e);
        updateTradeDraftSummary();
        updateFuzzyMatches(tradeWantNameInput, tradeWantFuzzyMatchesHolder);
    });
    tradeOfferQuantityInput.on("keyup", (e) =>
    {
        handleSubmittingTrade(e);
        updateTradeDraftSummary();
    });
    tradeWantQuantityInput.on("keyup", (e) =>
    {
        handleSubmittingTrade(e);
        updateTradeDraftSummary();
    });
    $("#tradeOfferAddButton").on("click", () => addTradeDraftItem("offer"));
    $("#tradeWantAddButton").on("click", () => addTradeDraftItem("want"));
    $("#tradeSubmitButton").on("click", (e) => handleSubmittingTrade(e, true));
    tradeCancelEditButton.on("click", () =>
    {
        clearTradeDraft();
        updateTradeDraftSummary();
        updateTradeSubmitButtonText();
        rescaleScreenshotRegion();
    });
    $("#tradeClearButton").on("click", () =>
    {
        clearTradeDraft();
        updateTradeDraftSummary();
        updateTradeSubmitButtonText();
        rescaleScreenshotRegion();
    });
    $("#tradeClearAllButton").on("click", () =>
    {
        if(!confirm("Clear all saved trades? This can't be undone."))
            return;

        tradeRows = [];
        saveTradeRowsToLocalStorage();
        clearTradeDraft();
        updateTradeDisplay();
        updateTradeDraftSummary();
    });
    disableOutsideTradeSelectionModeElems.prop("disabled", true);
    $("#tradeSelectionToggleButton").on("click", (event) =>
    {
        const wasEnabled = getIsInTradeSelectionMode();
        isTradeSelectionModeEnabled = !wasEnabled;
        disableOutsideTradeSelectionModeElems.prop("disabled", wasEnabled);
        tradeSelectionModeStateSpan.text(wasEnabled ? "Enable" : "Disable");
        event.currentTarget.classList.toggle("selected", !wasEnabled);
        updateTradeDisplay();
    });
    $("#tradeSelectAllButton").on("click", () =>
    {
        for(let tradeRow of tradeRows)
            tradeRow.isSelected = true;
        updateTradeDisplay();
    });
    $("#tradeClearSelectionButton").on("click", () =>
    {
        for(let tradeRow of tradeRows)
            tradeRow.isSelected = false;
        updateTradeDisplay();
    });
    $("#tradeDeleteSelectedButton").on("click", () =>
    {
        tradeRows = tradeRows.filter(tradeRow => !tradeRow.isSelected);
        saveTradeRowsToLocalStorage();
        clearTradeDraft();
        updateTradeDisplay();
        updateTradeDraftSummary();
        updateTradeSubmitButtonText();
    });
    $("#tradeUnselectedVisibilityToggleButton").on("click", (event) =>
    {
        shouldHideUnselectedTrades = !shouldHideUnselectedTrades;
        tradeUnselectedVisibilityStateSpan.text(shouldHideUnselectedTrades ? "Show" : "Hide");
        event.currentTarget.classList.toggle("selected", shouldHideUnselectedTrades);
        updateTradeDisplay();
    });

    const coinImagePromise = getImageUrl("Coin")
        .then(imageUrl => coinImageUrl = imageUrl)
        .catch(e => console.log("Failed to get coin image url --", e));

    $(".copyImageToClipboardButton").on("click", copyImageToClipboard);

    suggestionOverlayShowButton.on("click", () => setSuggestionOverlayVisible(true));
    suggestionOverlay.hideButton.on("click", () => setSuggestionOverlayVisible(false));
    suggestionOverlay.background.on("click", () => setSuggestionOverlayVisible(false));
    suggestionForm.on("submit", submitSuggestionForm);
    suggestionIncognitoInput.on("change", updateSuggestionIncognitoState);

    loadAllFromLocalStorage();
    updateScreenshotEmptyState();
    normalItemsPlaceholder.prop("hidden", !!items.size);

    ensureItemsHaveMaxPriceSet();

    coinImagePromise.then(() =>
    {
        updateItemLayout();
    });

    $("#ExportButton").on("click", exportAll);
    $("#ImportButton").on("click", () =>
    {
        importFileInput.trigger("click");
    });
    importFileInput.on("change", async (event) =>
    {
        const files = event.target.files;
        if(files.length)
            importAll(await files[0].text());
        event.target.value = null;
    });

    itemListDropdown.on("change", (event) =>
    {
        deleteItemListButton.prop("disabled", event.target.value === "Default");

        storeItemList();

        setCurrentModeActiveItemList(event.target.value);

        loadItemList();
    });
    deleteItemListButton.on("click", () =>
    {
        if(activeItemList === "Default")
        {
            console.log("Attempted to delete Default item list!  This shouldn't be possible; please contact JJCUBER.");
            return;
        }

        deleteCurrentModeItemList(activeItemList);
    });
    createItemListInput.on("input", (event) =>
    {
        createItemListButton.prop("disabled", getCurrentModeItemLists().has(event.target.value));
    });
    createItemListInput.on("keyup", (event) =>
    {

        if(event.code === "Enter" && !createItemListButton.prop("disabled"))
            createItemListButton.trigger("click");
    });
    createItemListButton.on("click", () =>
    {
        if(getCurrentModeItemLists().has(createItemListInput.val()))
        {
            console.log("Attempted to create an existing item list!  This shouldn't be possible; please contact JJCUBER.");
            return;
        }

        storeItemList();

        createNewItemList(createItemListInput.val());
        createItemListInput.val("");

        loadItemList();
    });
    includeSettingsInItemListCheckBox.on("click", () =>
    {
        shouldIncludeSettingsInItemList = !shouldIncludeSettingsInItemList;

        saveAllToLocalStorage();
    });
    copyCurrentItemsFromItemListCheckBox.on("click", () =>
    {
        shouldCopyCurrentItemsFromItemList = !shouldCopyCurrentItemsFromItemList;

        saveAllToLocalStorage();
    });

    setUpAbbreviationMappingTable();

    bottomText.on("click", () =>
    {
        openStylingDrawer("bottomText");
    });

    itemsPerRowSlider.on("change", () =>
    {
        saveAllToLocalStorage();
    });

    textListSeparatorRadios.eq(textListSeparatorSelectedRadio).prop("checked", true);
    textListCustomSeparatorInput[0].disabled = textListSeparatorRadios[textListSeparatorSelectedRadio].id !== "textListSeparatorCustomRadio";

    textListSeparatorRadios.each((i, elem) =>
    {
        $(elem).on("click", i, (event) =>
        {
            textListSeparatorSelectedRadio = event.data;

            textListCustomSeparatorInput[0].disabled = event.target !== textListSeparatorCustomRadio[0];

            saveAllToLocalStorage();
        });
    });

    textListCustomSeparatorInput.on("change", (event) =>
    {
        textListSeparatorCustomRadio.val(event.target.value);

        saveAllToLocalStorage();
    });

    textListFormatInput.on("change", () =>
    {
        saveAllToLocalStorage();
    });

    priceCalculationItemInput.on("focus", () =>
    {
        updateFuzzyMatches(priceCalculationItemInput, priceCalculationItemFuzzyMatchesHolder);
    });
    priceCalculationItemInput.on("blur", () =>
    {
        priceCalculationItemFuzzyMatchesHolder.empty();
    });
    priceCalculationItemInput.on("keydown", (e) =>
    {

        if(e.key.length !== 1 || e.key < '0' || e.key > '9')
            return;
        let selection = e.key - '0';
        if(selection === 0)
            selection = 10;

        const buttons = priceCalculationItemFuzzyMatchesHolder.find("button");
        if(buttons.length < selection)
            return;

        buttons.eq(selection - 1).trigger("mousedown", {usedKeyboard: true});
        event.preventDefault();
    });
    priceCalculationItemInput.on("keyup", (e) =>
    {
        updateFuzzyMatches(priceCalculationItemInput, priceCalculationItemFuzzyMatchesHolder);
    });
    priceCalculationItemInput.on("change", async (event) =>
    {
        let itemNameFormatted = formatItemName(event.target.value);
        let itemUrl, itemMaxPrice;
        try
        {
            itemUrl = await getImageUrl(itemNameFormatted);
            itemMaxPrice = await getMaxPrice(itemNameFormatted);
        }
        catch
        {

            itemNameFormatted = "Diamond_Ring";

            itemUrl = await getImageUrl(itemNameFormatted);
            itemMaxPrice = await getMaxPrice(itemNameFormatted);
        }

        priceCalculationItem = new Item(itemNameFormatted, undefined, itemUrl, undefined, itemMaxPrice);

        if(getIsInPriceCalculationMode())
            updateTotalPrice();
        saveAllToLocalStorage();
    });

    priceCalculationItemInput.trigger("change");

    defaultQuantityInput.on("change", (event) =>
    {

        defaultQuantity = event.target.value;

        saveAllToLocalStorage();
    });
    defaultPriceOrMultiplierInput.on("change", (event) =>
    {

        defaultPriceOrMultiplier = event.target.value;

        saveAllToLocalStorage();
    });
    refocusNameOnSubmitCheckBox.on("click", () =>
    {
        shouldRefocusNameOnSubmit = !shouldRefocusNameOnSubmit;

        saveAllToLocalStorage();
    });
    focusQuantityOnAutocompleteCheckBox.on("click", () =>
    {
        shouldFocusQuantityOnAutocomplete = !shouldFocusQuantityOnAutocomplete;

        saveAllToLocalStorage();
    });
    ignoreLocaleCheckBox.on("click", () =>
    {
        shouldIgnoreLocale = !shouldIgnoreLocale;

        updateTotalPrice();
        saveAllToLocalStorage();
    });

    $("#copyAsTextListButton").on("click", copyAsTextListToClipboard);

    $("#clearAllButton").on("click", () =>
    {
        if(confirm("Are you sure?  This will clear the items currently added and can't be undone."))
        {
            items.clear();
            updateItemLayout();

            saveAllToLocalStorage();
        }
    });

    disableOutsidePriceCalculationModeElems.prop("disabled", true);

    $("#priceCalculationToggleButton").on("click", () =>
    {

        const toggleButton = event.currentTarget;
        const wasEnabled = getIsInPriceCalculationMode();

        disableInPriceCalculationModeElems.prop("disabled", !wasEnabled);
        disableOutsidePriceCalculationModeElems.prop("disabled", wasEnabled);

        isPriceCalculationModeEnabled = !wasEnabled;
        priceCalculationModeSelectionInfo.prop("hidden", wasEnabled);

        if(wasEnabled)
        {

            priceCalculationModeStateSpan.text("Enable");
            toggleButton.classList.remove("selected");
        }
        else
        {

            priceCalculationModeStateSpan.text("Disable");
            toggleButton.classList.add("selected");
        }

        updateItemLayout();
        updatePriceCalculationDetailsVisibility();
    });

    $("#selectAllButton").on("click", () =>
    {
        const cells = $("#itemTable td");
        setSelectedStateAll(items.values(), cells, true);

        updateTotalPrice();

        if(shouldHideUnselectedItems)
            updateItemLayout();
    });

    $("#clearSelectionButton").on("click", () =>
    {
        const cells = $("#itemTable td");
        setSelectedStateAll(items.values(), cells, false);

        updateTotalPrice();

        if(shouldHideUnselectedItems)
            updateItemLayout();
    });

    $("#subtractSelectedQuantitiesButton").on("click", () =>
    {
        for(let item of items.values())
        {
            if(!item.isSelected)
                continue;

            if(getIsInfiniteQuantity(item.quantity))
            {
                item.customQuantity = undefined;
                continue;
            }

            if(getIsInfiniteQuantity(item.customQuantity))
            {
                items.delete(item.name);
                continue;
            }

            item.quantity -= item.customQuantity ?? item.quantity;

            item.customQuantity = undefined;

            if(item.quantity <= 0)
                items.delete(item.name);

        }

        updateItemLayout();

        saveAllToLocalStorage();
    });

    $("#deleteSelectedButton").on("click", () =>
    {
        for(let item of items.values())
        {
            if(item.isSelected)
                items.delete(item.name);
        }

        updateItemLayout();

        saveAllToLocalStorage();
    });

    $("#resetCustomValuesButton").on("click", () =>
    {
        for(let item of items.values())
        {
            item.customQuantity = undefined;
            item.customPriceOrMultiplier = undefined;
        }

        updateItemLayout();
    });

    $("#equationVisibilityToggleButton").on("click", () =>
    {

        const wasHidden = totalSelectedPriceEquationHolder.is("[hidden]");

        equationVisibilityStateSpan.text(wasHidden ? "Hide" : "Show");
        totalSelectedPriceEquationHolder.prop("hidden", !wasHidden);
        updatePriceCalculationDetailsVisibility();

        const toggleButton = event.currentTarget;
        if(wasHidden)
            toggleButton.classList.add("selected");
        else
            toggleButton.classList.remove("selected");
    });

    $("#unselectedItemsVisibilityToggleButton").on("click", () =>
    {
        const wasHidden = shouldHideUnselectedItems;
        unselectedItemsVisibilityStateSpan.text(wasHidden ? "Hide" : "Show");

        const toggleButton = event.currentTarget;
        if(wasHidden)
            toggleButton.classList.remove("selected");
        else
            toggleButton.classList.add("selected");

        shouldHideUnselectedItems = !shouldHideUnselectedItems;
        updateItemLayout();
    });
    failedCopyOverlay.hideButton.on("click", () =>
    {
        failedCopyOverlay.overlay.prop("hidden", true);
        $("html, body").css("overflow-y", "visible");
        screenshotRegion.css("margin-right", "unset");
    });
    failedCopyOverlay.background.on("click", () =>
    {
        failedCopyOverlay.hideButton.trigger("click");
    });

    contactOverlay.showButton.on("click", () =>
    {
        contactOverlay.overlay.prop("hidden", false);

        $("html, body").css("overflow-y", "hidden");

        screenshotRegion.css("margin-right", "calc(100vw - 100%)");
    });
    contactOverlay.hideButton.on("click", () =>
    {
        contactOverlay.overlay.prop("hidden", true);
        $("html, body").css("overflow-y", "visible");
        screenshotRegion.css("margin-right", "unset");
    });
    contactOverlay.background.on("click", () =>
    {
        contactOverlay.hideButton.trigger("click");
    });

    $("#tryNewSiteButton").on("click", () =>
    {
        window.open("https://hd.jjtechdev.com/", "_blank");
    });

    prepareAllItemNames();

    if(isRunningIOS())
        $("input, textarea").css("font-size", "16px");

    $(window).on("resize", rescaleScreenshotRegion);
    rescaleScreenshotRegion();
});

class Overlay
{

    constructor(overlayId, ...extraIds)
    {
        this.overlay = $(`#${overlayId}`);

        this.background = this.overlay.find(".overlayBackground");
        this.box = this.overlay.find(".overlayBox");
        this.hideButton = this.overlay.find(".overlayHideButton");
        this.inner = this.overlay.find(".overlayInner");

        for(let extraId of extraIds)
        {
            if(!extraId.length)
                continue;

            const extraIdFirstUpper = extraId[0].toUpperCase() + extraId.slice(1);
            this[extraId] = $(`#${overlayId}${extraIdFirstUpper}`);
        }
    }
}

const operators = ['+', '-', '*', '/', '^', '%', "mod", '&', '|', "<<", ">>>", ">>"];
function getIsInTradeView()
{
    return tradeViewButton.hasClass("selected");
}

function setTradeViewEnabled(shouldEnable)
{
    if(shouldEnable === getIsInTradeView())
        return;

    if(shouldEnable && getIsInPriceCalculationMode())
        $("#priceCalculationToggleButton").trigger("click");
    if(!shouldEnable && getIsInTradeSelectionMode())
        $("#tradeSelectionToggleButton").trigger("click");

    storeItemList();
    normalViewButton.toggleClass("selected", !shouldEnable);
    tradeViewButton.toggleClass("selected", shouldEnable);
    $("body").toggleClass("tradeView", shouldEnable);
    activateItemListsForCurrentMode();
    loadItemList();

    itemEditorModeTitle.text(shouldEnable ? "Trade View" : "Add/Modify Item");
    itemsPerRowOptionLabel.text(shouldEnable ? "Trades Per Row" : "Items Per Row");
    itemsPerRowSlider.prop("max", shouldEnable ? 4 : 12);
    itemsPerRowSlider.val(shouldEnable ? tradeRowsPerRow : itemsPerRow);
    itemsPerRowLabel.text(shouldEnable ? tradeRowsPerRow : itemsPerRow);
    normalItemEntryHint.prop("hidden", shouldEnable);
    normalItemEntryArea.prop("hidden", shouldEnable);
    tradeItemEntryArea.prop("hidden", !shouldEnable);
    normalItemClickInfo.prop("hidden", shouldEnable);
    priceCalculationModeSelectionInfo.prop("hidden", shouldEnable || !getIsInPriceCalculationMode());
    updatePriceCalculationDetailsVisibility();

    hideInTradeViewElems.prop("hidden", shouldEnable);
    itemTable.prop("hidden", shouldEnable);
    normalItemsPlaceholder.prop("hidden", shouldEnable || !!items.size);
    tradeDisplay.prop("hidden", !shouldEnable);

    if(shouldEnable)
    {
        screenshotPriceHolder.empty();
        updateTradeDisplay();
        updateTradeDraftSummary();
        updateTradeSubmitButtonText();
    }
    else
    {
        tradeDisplay.empty();
        updateItemLayout();
    }

    rescaleScreenshotRegion();
}

function updateScreenshotEmptyState()
{
    const isEmpty = getIsInTradeView() ? !getVisibleTradeRows().length : !items.size;
    screenshotRegion.toggleClass("emptyPreview", isEmpty);
}

function handleFuzzyMatchKeyboardSelection(e, fuzzyMatchesHolder)
{
    if(e.key.length !== 1 || e.key < '0' || e.key > '9')
        return;
    let selection = e.key - '0';
    if(selection === 0)
        selection = 10;

    const buttons = fuzzyMatchesHolder.find("button");
    if(buttons.length < selection)
        return;

    buttons.eq(selection - 1).trigger("mousedown", {usedKeyboard: true});
    e.preventDefault();
}

function getTradeSideForInput(itemInput)
{
    if(itemInput === tradeOfferNameInput)
        return "offer";
    if(itemInput === tradeWantNameInput)
        return "want";
    return undefined;
}

function getTradeInputCache(side)
{
    return side === "offer" ? tradeOfferInputItemCache : tradeWantInputItemCache;
}

function getTradeNameInput(side)
{
    return side === "offer" ? tradeOfferNameInput : tradeWantNameInput;
}

function getDisplacedTradeInputItem(side)
{
    const cachedItem = getTradeInputCache(side);
    if(!cachedItem)
        return undefined;

    return formatItemName(getTradeNameInput(side).val()) === cachedItem.name ? undefined : cachedItem;
}

function addDisplacedTradeInputItem(itemList, side)
{
    const displacedItem = getDisplacedTradeInputItem(side);
    if(displacedItem)
        addOrMergeTradeItem(itemList, Object.assign(new Item(), displacedItem));
}

function getTradeDraftItemsForSubmit(side)
{
    const sourceItems = side === "offer" ? tradeDraftOfferItems : tradeDraftWantItems;
    const itemsForSubmit = sourceItems.map(item => Object.assign(new Item(), item));
    addDisplacedTradeInputItem(itemsForSubmit, side);
    sortTradeItemsByOrder(itemsForSubmit);
    return itemsForSubmit;
}

function handleSubmittingTrade(e, usedSubmitButton = false)
{
    clearTradeInvalidState();

    if(isActivelyCopyingImage)
        return;

    if(!usedSubmitButton && e.code !== "Enter")
        return;

    Promise.all(tradeDraftPendingPromises)
        .then(() => submitTradeRow())
        .catch(e =>
        {
            console.log("Failed to resolve pending trade draft items --", e);
        });
}

function submitTradeRow()
{
    const offerItems = getTradeDraftItemsForSubmit("offer");
    const wantItems = getTradeDraftItemsForSubmit("want");
    const hasOfferInput = formatItemName(tradeOfferNameInput.val()).length > 0;
    const hasWantInput = formatItemName(tradeWantNameInput.val()).length > 0;

    Promise.all([
        hasOfferInput ? getTradeInputItem(tradeOfferNameInput, tradeOfferQuantityInput) : undefined,
        hasWantInput ? getTradeInputItem(tradeWantNameInput, tradeWantQuantityInput) : undefined
    ])
        .then(([offerInputItem, wantInputItem]) =>
        {
            if(offerInputItem)
                addOrMergeTradeItem(offerItems, offerInputItem);
            if(wantInputItem)
                addOrMergeTradeItem(wantItems, wantInputItem);
            sortTradeItemsByOrder(offerItems);
            sortTradeItemsByOrder(wantItems);

            if(!offerItems.length)
                tradeOfferNameInput.addClass("invalid");
            if(!wantItems.length)
                tradeWantNameInput.addClass("invalid");
            if(!offerItems.length || !wantItems.length)
                return;

            if(editingTradeRowIndex === undefined)
                tradeRows.push({
                    offerItems,
                    wantItems,
                    isSelected: getIsInTradeSelectionMode() && shouldHideUnselectedTrades
                });
            else
                tradeRows[editingTradeRowIndex] = {offerItems, wantItems, isSelected: tradeRows[editingTradeRowIndex].isSelected};
            saveTradeRowsToLocalStorage();
            clearTradeDraft();
            updateTradeDisplay();
            updateTradeDraftSummary();
            updateTradeSubmitButtonText();
            tradeOfferNameInput.trigger("focus").trigger("select");
        })
        .catch(e =>
        {
            console.log("Failed to create trade row --", e);
        });
}

function addTradeDraftItem(side)
{
    const isOfferSide = side === "offer";
    const itemList = isOfferSide ? tradeDraftOfferItems : tradeDraftWantItems;
    const nameInput = isOfferSide ? tradeOfferNameInput : tradeWantNameInput;
    const quantityInput = isOfferSide ? tradeOfferQuantityInput : tradeWantQuantityInput;
    const itemOrder = tradeDraftOrder++;

    clearTradeInvalidState();

    const pendingPromise = getTradeInputItem(nameInput, quantityInput, true)
        .then(item =>
        {
            if(!item)
                return;

            addDisplacedTradeInputItem(itemList, side);
            addOrMergeTradeItem(itemList, item);
            item.tradeOrder = itemOrder;
            sortTradeItemsByOrder(itemList);
            clearTradeNameInput(side, item.name);
            focusTradeQuantityInput(side);
            updateTradeDraftSummary();
            rescaleScreenshotRegion();
        })
        .catch(e =>
        {
            console.log("Failed to add trade draft item --", e);
        })
        .finally(() =>
        {
            tradeDraftPendingPromises = tradeDraftPendingPromises.filter(promise => promise !== pendingPromise);
        });
    tradeDraftPendingPromises.push(pendingPromise);
}

async function getTradeInputItem(nameInput, quantityInput, shouldRequireName = false)
{
    const itemNameFormatted = formatItemName(nameInput.val());
    if(!itemNameFormatted.length)
    {
        if(shouldRequireName)
            nameInput.addClass("invalid");
        return undefined;
    }

    let itemQuantity;
    try
    {
        itemQuantity = Math.floor(math.evaluate(quantityInput.val().trim()));
    }
    catch(e)
    {
        quantityInput.addClass("invalid");
        console.log("Unable to evaluate trade quantity --", e);
        throw e;
    }

    if(!Number.isFinite(itemQuantity) || itemQuantity <= 0)
    {
        quantityInput.addClass("invalid");
        throw new Error("Invalid trade quantity");
    }

    try
    {
        const cachedItem = nameInput === tradeOfferNameInput ? tradeOfferInputItemCache : tradeWantInputItemCache;
        if(cachedItem && cachedItem.name === itemNameFormatted)
        {
            const item = new Item(itemNameFormatted, itemQuantity, cachedItem.url, "", NaN);
            item.tradeOrder = cachedItem.tradeOrder;
            return item;
        }

        const imageUrl = await getImageUrl(itemNameFormatted);
        return new Item(itemNameFormatted, itemQuantity, imageUrl, "", NaN);
    }
    catch(e)
    {
        nameInput.addClass("invalid");
        throw e;
    }
}

function addOrMergeTradeItem(itemList, item)
{
    const existingItem = itemList.find(currItem => currItem.name === item.name);
    if(existingItem)
        existingItem.quantity += item.quantity;
    else
        itemList.push(item);
}

function sortTradeItemsByOrder(itemList)
{
    itemList.sort((item1, item2) => (item1.tradeOrder ?? Infinity) - (item2.tradeOrder ?? Infinity));
}

function clearTradeDraft()
{
    tradeDraftOfferItems = [];
    tradeDraftWantItems = [];
    tradeDraftPendingPromises = [];
    tradeDraftOrder = 0;
    editingTradeRowIndex = undefined;
    clearTradeInputs();
    clearTradeInvalidState();
    updateTradeDraftControls();
}

function clearTradeInputs(side = "all")
{
    if(side === "all" || side === "offer")
    {
        tradeOfferNameInput.val("");
        tradeOfferQuantityInput.val("");
        tradeOfferInputItemCache = undefined;
    }

    if(side === "all" || side === "want")
    {
        tradeWantNameInput.val("");
        tradeWantQuantityInput.val("");
        tradeWantInputItemCache = undefined;
    }
}

function clearTradeNameInput(side, itemNameToClear)
{
    if(side === "offer")
    {
        if(formatItemName(tradeOfferNameInput.val()) === itemNameToClear)
        {
            tradeOfferNameInput.val("");
            tradeOfferInputItemCache = undefined;
        }
    }
    else
    {
        if(formatItemName(tradeWantNameInput.val()) === itemNameToClear)
        {
            tradeWantNameInput.val("");
            tradeWantInputItemCache = undefined;
        }
    }
}

function clearTradeInvalidState()
{
    tradeOfferNameInput.removeClass("invalid");
    tradeWantNameInput.removeClass("invalid");
    tradeOfferQuantityInput.removeClass("invalid");
    tradeWantQuantityInput.removeClass("invalid");
}

function updateTradeDraftSummary()
{
    const offerSummaryParts = getTradeSummaryParts("offer");
    const wantSummaryParts = getTradeSummaryParts("want");
    const hasDraft = offerSummaryParts.length || wantSummaryParts.length;
    updateTradeDraftControls();
    tradeDraftSummary.prop("hidden", !hasDraft);
    if(!hasDraft)
    {
        tradeDraftSummary.text("");
        return;
    }

    const offerSummary = offerSummaryParts.length ? offerSummaryParts.join(" + ") : "...";
    const wantSummary = wantSummaryParts.length ? wantSummaryParts.join(" + ") : "...";
    tradeDraftSummary.text(`${editingTradeRowIndex === undefined ? "Draft" : "Editing"}: ${offerSummary} for ${wantSummary}`);
}

function updateTradeDraftControls()
{
    const hasDraftItems = tradeDraftOfferItems.length || tradeDraftWantItems.length || editingTradeRowIndex !== undefined;
    $("#tradeClearButton").prop("disabled", !hasDraftItems);
}

function getTradeSummaryParts(side)
{
    const itemList = side === "offer" ? tradeDraftOfferItems : tradeDraftWantItems;
    const parts = itemList.map(item => formatTradeItemSummary(item));
    const cachedItem = editingTradeRowIndex === undefined ? undefined : getTradeInputCache(side);
    if(cachedItem && !itemList.some(item => item.name === cachedItem.name))
        parts.unshift(formatTradeItemSummary(cachedItem));

    return parts;
}

function updateTradeSubmitButtonText()
{
    $("#tradeSubmitButton").html(`<i data-lucide="save"></i>${editingTradeRowIndex === undefined ? "Save Trade Row" : "Update Trade Row"}`);
    tradeCancelEditButton.prop("hidden", editingTradeRowIndex === undefined);
    renderLucideIcons();
}

function updateTradeDisplay()
{
    tradeDisplay.empty();
    tradeDisplay.css("grid-template-columns", `repeat(${tradeRowsPerRow}, max-content)`);
    updateScreenshotEmptyState();

    const visibleTradeRows = getVisibleTradeRows();
    if(!visibleTradeRows.length)
    {
        const placeholder = document.createElement("p");
        placeholder.innerText = tradeRows.length ? "Select trades to show in the preview" : "Add a trade to preview the ratio";
        placeholder.classList.add("tradePlaceholder");
        tradeDisplay.append(placeholder);
        rescaleScreenshotRegion();
        return;
    }

    for(let tradeRow of visibleTradeRows)
        tradeDisplay.append(createTradeRow(tradeRow, tradeRows.indexOf(tradeRow)));

    renderLucideIcons();
    rescaleScreenshotRegion();
}

function getVisibleTradeRows()
{
    if(getIsInTradeSelectionMode() && shouldHideUnselectedTrades)
        return tradeRows.filter(tradeRow => tradeRow.isSelected);

    return tradeRows;
}

function getIsInTradeSelectionMode()
{
    return isTradeSelectionModeEnabled;
}

function toggleTradeRowSelection(index)
{
    const tradeRow = tradeRows[index];
    if(!tradeRow)
        return;

    tradeRow.isSelected = !tradeRow.isSelected;
    updateTradeDisplay();
}

function createTradeRow(tradeRow, index)
{
    const rowBlock = document.createElement("div");
    rowBlock.classList.add("tradeRowBlock");
    if(getIsInTradeSelectionMode() && tradeRow.isSelected)
        rowBlock.classList.add("selected");
    $(rowBlock).on("click", () =>
    {
        if(getIsInTradeSelectionMode())
            toggleTradeRowSelection(index);
        else
            editTradeRow(index, true);
    });

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<img src="images/trash-light.png?v=2" alt="">';
    deleteButton.title = "Remove trade";
    deleteButton.setAttribute("aria-label", "Remove trade");
    deleteButton.classList.add("tradeDeleteButton");
    $(deleteButton).on("click", (event) =>
    {
        event.stopPropagation();
        removeTradeRow(index);
    });
    rowBlock.appendChild(deleteButton);

    const row = document.createElement("div");
    row.classList.add("tradeRow");

    row.appendChild(createTradeSide(tradeRow.offerItems, index, "offer"));

    const direction = document.createElement("p");
    direction.innerText = "for";
    direction.classList.add("tradeDirection");
    row.appendChild(direction);

    row.appendChild(createTradeSide(tradeRow.wantItems, index, "want"));

    const ratioBadge = document.createElement("p");
    ratioBadge.innerText = getTradeRatioText(tradeRow.offerItems, tradeRow.wantItems);
    ratioBadge.classList.add("tradeRatioBadge");
    row.appendChild(ratioBadge);

    rowBlock.appendChild(row);

    return rowBlock;
}

function editTradeRow(index, shouldPopulateInputs = false)
{
    const tradeRow = tradeRows[index];
    if(!tradeRow)
        return;

    editingTradeRowIndex = index;
    tradeDraftOfferItems = tradeRow.offerItems.map((item, i) =>
    {
        const copy = Object.assign(new Item(), item);
        copy.tradeOrder = i;
        return copy;
    });
    tradeDraftWantItems = tradeRow.wantItems.map((item, i) =>
    {
        const copy = Object.assign(new Item(), item);
        copy.tradeOrder = i;
        return copy;
    });
    tradeDraftPendingPromises = [];
    tradeDraftOrder = Math.max(tradeDraftOfferItems.length, tradeDraftWantItems.length);
    clearTradeInputs();
    clearTradeInvalidState();
    if(shouldPopulateInputs)
    {
        moveTradeDraftItemAtIndexToInput("offer", 0);
        moveTradeDraftItemAtIndexToInput("want", 0);
    }
    updateTradeDraftSummary();
    updateTradeSubmitButtonText();
}

function removeTradeRow(index)
{
    tradeRows.splice(index, 1);
    if(editingTradeRowIndex === index)
        clearTradeDraft();
    else if(editingTradeRowIndex > index)
        editingTradeRowIndex--;

    saveTradeRowsToLocalStorage();
    updateTradeDisplay();
    updateTradeDraftSummary();
    updateTradeSubmitButtonText();
}

function createTradeSide(items, rowIndex, side)
{
    const tradeSide = document.createElement("div");
    tradeSide.classList.add("tradeSide");

    for(let item of items)
        tradeSide.appendChild(createTradeCard(item, () =>
        {
            if(getIsInTradeSelectionMode())
            {
                toggleTradeRowSelection(rowIndex);
                return;
            }

            editTradeRow(rowIndex);
            moveTradeDraftItemToInput(side, item.name);
            populateOppositeTradeSideInput(side);
            focusTradeQuantityInput(side);
        }));

    return tradeSide;
}

function createTradeCard(item, clickHandler)
{
    const card = document.createElement("div");
    card.classList.add("tradeCard");
    if(clickHandler)
    {
        $(card).on("click", (event) =>
        {
            event.stopPropagation();
            clickHandler();
        });
    }

    const image = document.createElement("img");
    image.src = item.url;
    image.alt = item.getHumanReadableName();

    const quantityLabel = document.createElement("p");
    quantityLabel.innerText = item.quantity;
    quantityLabel.classList.add("label", "tradeQuantityLabel");

    const itemName = document.createElement("p");
    itemName.innerText = item.getHumanReadableName();
    itemName.classList.add("tradeItemName");

    card.appendChild(image);
    card.appendChild(quantityLabel);
    card.appendChild(itemName);

    return card;
}

function moveTradeDraftItemToInput(side, itemName)
{
    const itemList = side === "offer" ? tradeDraftOfferItems : tradeDraftWantItems;
    const itemIndex = itemList.findIndex(item => item.name === itemName);
    if(itemIndex === -1)
        return;

    moveTradeDraftItemAtIndexToInput(side, itemIndex);
}

function moveTradeDraftItemAtIndexToInput(side, itemIndex)
{
    const itemList = side === "offer" ? tradeDraftOfferItems : tradeDraftWantItems;
    if(itemIndex < 0 || itemIndex >= itemList.length)
        return;

    const item = itemList.splice(itemIndex, 1)[0];
    if(side === "offer")
    {
        tradeOfferNameInput.val(item.getHumanReadableName());
        tradeOfferQuantityInput.val(item.quantity);
        tradeOfferInputItemCache = item;
        tradeOfferNameInput.trigger("select");
    }
    else
    {
        tradeWantNameInput.val(item.getHumanReadableName());
        tradeWantQuantityInput.val(item.quantity);
        tradeWantInputItemCache = item;
        tradeWantNameInput.trigger("select");
    }

    updateTradeDraftSummary();
    focusTradeQuantityInput(side);
}

function populateOppositeTradeSideInput(side)
{
    if(side === "offer")
        moveTradeDraftItemAtIndexToInput("want", 0);
    else
        moveTradeDraftItemAtIndexToInput("offer", 0);
}

function focusTradeQuantityInput(side)
{
    if(side === "offer")
        tradeOfferQuantityInput.trigger("select");
    else
        tradeWantQuantityInput.trigger("select");
}

function formatTradeSideSummary(items)
{
    return items.map(formatTradeItemSummary).join(" + ");
}

function formatTradeItemSummary(item)
{
    return `${item.quantity}x ${item.getHumanReadableName()}`;
}

function getTradeInputSummary(side)
{
    const nameInput = side === "offer" ? tradeOfferNameInput : tradeWantNameInput;
    const quantityInput = side === "offer" ? tradeOfferQuantityInput : tradeWantQuantityInput;
    const cachedItem = side === "offer" ? tradeOfferInputItemCache : tradeWantInputItemCache;
    const rawName = nameInput.val().trim();

    if(!rawName.length)
        return undefined;

    const itemName = formatItemName(rawName);
    const quantity = quantityInput.val().trim() || "1";
    const displayName = cachedItem && cachedItem.name === itemName ? cachedItem.getHumanReadableName() : rawName;
    return `${quantity}x ${displayName}`;
}

function getTradeSideRatioTotal(items)
{
    return items.reduce((total, item) => total + getTradeRatioQuantity(item), 0);
}

function getTradeRatioQuantity(item)
{
    return customItemNames.has(item.name) ? item.quantity * 89 : item.quantity;
}

function getTradeRatioText(offerItems, wantItems)
{
    const offerSetCount = getTradeSetCount(offerItems);
    const wantSetCount = getTradeSetCount(wantItems);
    const offerTotal = getTradeSideRatioTotal(offerItems);
    const wantTotal = getTradeSideRatioTotal(wantItems);

    if(wantSetCount > 0 && wantSetCount === getTradeSideQuantityTotal(wantItems))
        return `${formatTradeRatioNumber(offerTotal / wantSetCount)}:89`;

    if(offerSetCount > 0 && offerSetCount === getTradeSideQuantityTotal(offerItems))
        return `89:${formatTradeRatioNumber(wantTotal / offerSetCount)}`;

    return `${formatTradeRatioNumber(offerTotal)}:${formatTradeRatioNumber(wantTotal)}`;
}

function getTradeSetCount(items)
{
    return items.reduce((total, item) => total + (customItemNames.has(item.name) ? item.quantity : 0), 0);
}

function getTradeSideQuantityTotal(items)
{
    return items.reduce((total, item) => total + item.quantity, 0);
}

function formatTradeRatioNumber(num)
{
    return Number.isInteger(num) ? num : +num.toFixed(2);
}

const INFINITY_QUANTITY = "\u221e";

function getIsInfiniteQuantity(quantity)
{
    return quantity === INFINITY_QUANTITY;
}

function getQuantitySortValue(quantity)
{
    return getIsInfiniteQuantity(quantity) ? Number.POSITIVE_INFINITY : quantity;
}

function getHasInfiniteQuantity(itemsToCheck, shouldIgnoreCustomValues = false, shouldOnlyCheckSelected = false)
{
    for(let item of itemsToCheck)
    {
        if(shouldOnlyCheckSelected && !item.isSelected)
            continue;

        const quantity = shouldIgnoreCustomValues ? item.quantity : (item.customQuantity ?? item.quantity);
        if(getIsInfiniteQuantity(quantity))
            return true;
    }

    return false;
}

function handleAddingItem(e, usedSubmitButton = false)
{

    if(itemNameInput.hasClass("invalid"))
        itemNameInput.removeClass("invalid");

    if(isActivelyCopyingImage)
        return;

    if(!usedSubmitButton && e.code !== "Enter")
        return;

    if(shouldRefocusNameOnSubmit)
        itemNameInput.trigger("select");

    const itemNameFormatted = formatItemName(itemNameInput.val());
    if(!itemNameFormatted.length)
        return;

    let itemQuantity, prependedQuantityOperator = "";
    let itemQuantityEquation = itemQuantityInput.val().trim();

    if(items.has(itemNameFormatted))
    {
        for(let operator of operators)
        {
            if(!itemQuantityEquation.startsWith(operator))
                continue;

            prependedQuantityOperator = operator;
            itemQuantityEquation = itemQuantityEquation.substr(prependedQuantityOperator.length);
            break;
        }
    }

    try
    {

        if(itemQuantityEquation === INFINITY_QUANTITY)
        {
            if(!generatedImageEnableInfinityInput.prop("checked") || prependedQuantityOperator)
                return;

            itemQuantity = INFINITY_QUANTITY;
        }
        else
            itemQuantity = itemQuantityEquation.length ? math.evaluate(itemQuantityEquation) : 0;

        if(!getIsInfiniteQuantity(itemQuantity) && !Number.isFinite(itemQuantity))
            return;
    }
    catch(e)
    {
        console.log("Unable to evaluate quantity --", e);
        return;
    }

    addItem(itemNameFormatted, itemQuantity, itemPriceOrMultiplierInput.val(), prependedQuantityOperator)
        .then(() => updateItemLayout())
        .catch(e =>
        {
            console.log("Failed to add item and update layout --", e);

            itemNameInput.addClass("invalid");
        });

    itemNameInput.val("");
    itemQuantityInput.val(defaultQuantity);
    itemPriceOrMultiplierInput.val(defaultPriceOrMultiplier);
}

class Item
{
    static fieldsToOmitFromLocalStorage = new Set(["customQuantity", "customPriceOrMultiplier", "isSelected"]);
    constructor(name, quantity, url, priceOrMultiplier, maxPrice)
    {
        this.name = name;
        this.quantity = quantity;
        this.url = url;
        this.priceOrMultiplier = priceOrMultiplier;
        this.maxPrice = maxPrice;

        this.customQuantity = undefined;
        this.customPriceOrMultiplier = undefined;
        this.isSelected = false;
    }

    getHumanReadableName()
    {
        return this.name.replaceAll("_", " ");
    }

    calculateTotalPrice(shouldIgnoreCustomValues = false)
    {
        let quantity = this.customQuantity ?? this.quantity,
            priceOrMultiplier = this.customPriceOrMultiplier ?? this.priceOrMultiplier,
            maxPrice = this.maxPrice;

        if(shouldIgnoreCustomValues)
        {
            quantity = this.quantity;
            priceOrMultiplier = this.priceOrMultiplier;
        }

        if(getIsInfiniteQuantity(quantity))
            return [NaN, INFINITY_QUANTITY, `${this.getHumanReadableName()} has an infinite quantity, so its total cannot be calculated.`];

        if(!maxPrice && !customItemNames.has(this.name))
            return [NaN, "NaN", `${this.getHumanReadableName()} doesn't have a valid maximum price (${maxPrice}).`];

        priceOrMultiplier = priceOrMultiplier.trim();

        let price, mult;
        let warning;
        if(!priceOrMultiplier.length)
        {
            mult = "1";
            warning = `The price/multiplier for ${this.getHumanReadableName()} was empty, so it was defaulted to 1x.` ;
        }
        else if(priceOrMultiplier.endsWith('x'))
        {

            if(!maxPrice)
                return [NaN, "NaN", `${this.getHumanReadableName()} is a custom item without a valid maximum price (${maxPrice}).`];

            mult = priceOrMultiplier.slice(0, -1);
        }
        else if(priceOrMultiplier.endsWith('k'))
            price = `(${priceOrMultiplier.slice(0, -1)})*10^3`;
        else if(priceOrMultiplier.endsWith('m'))
            price = `(${priceOrMultiplier.slice(0, -1)})*10^6`;
        else
            price = priceOrMultiplier;

        if(mult)
            price = `${maxPrice}*(${mult})`;

        price = `${quantity}*(${price})`;

        try
        {
            return [math.evaluate(price), price, undefined, warning];
        }
        catch(e)
        {
            console.log(e);

            return [NaN, price, `${this.getHumanReadableName()} has an invalid price/multiplier (price/multiplier: ${priceOrMultiplier} -- equation: ${price}).`, warning];
        }
    }
}

function addItem(itemNameFormatted, itemQuantity, itemPriceOrMultiplier, prependedQuantityOperator = "")
{
    const isInPriceCalculationMode = getIsInPriceCalculationMode();

    if(!prependedQuantityOperator && !getIsInfiniteQuantity(itemQuantity))
        itemQuantity = Math.floor(itemQuantity);

    if(items.has(itemNameFormatted))
    {
        const currItem = items.get(itemNameFormatted);

        if(isInPriceCalculationMode)
        {
            if(prependedQuantityOperator.length && (getIsInfiniteQuantity(currItem.customQuantity ?? currItem.quantity) || getIsInfiniteQuantity(itemQuantity)))
                return Promise.resolve();

            if(prependedQuantityOperator.length)
                itemQuantity = Math.floor(math.evaluate(`${currItem.customQuantity ?? currItem.quantity} ${prependedQuantityOperator} ${itemQuantity}`));

            currItem.customQuantity = ((getIsInfiniteQuantity(itemQuantity) || itemQuantity > 0) && itemQuantity !== currItem.quantity) ? itemQuantity : undefined;
            currItem.customPriceOrMultiplier = (itemPriceOrMultiplier.trim().length && itemPriceOrMultiplier !== currItem.priceOrMultiplier) ? itemPriceOrMultiplier : undefined;

            currItem.isSelected = true;

            return Promise.resolve();
        }

        if(prependedQuantityOperator.length && getIsInfiniteQuantity(currItem.quantity))
            return Promise.resolve();

        if(prependedQuantityOperator.length)
            itemQuantity = Math.floor(math.evaluate(`${currItem.quantity} ${prependedQuantityOperator} ${itemQuantity}`));

        if(getIsInfiniteQuantity(itemQuantity) || itemQuantity > 0)
        {
            const prevQuantity = currItem.quantity;
            currItem.quantity = itemQuantity;
            currItem.priceOrMultiplier = itemPriceOrMultiplier;

            if(currItem.customQuantity === currItem.quantity || (currItem.customQuantity > currItem.quantity && currItem.customQuantity < prevQuantity))
                currItem.customQuantity = undefined;
            if(currItem.customPriceOrMultiplier === currItem.priceOrMultiplier)
                currItem.customPriceOrMultiplier = undefined;
        }
        else
            items.delete(itemNameFormatted);

        saveAllToLocalStorage();

        return Promise.resolve();
    }

    if(isInPriceCalculationMode)
        return Promise.resolve();

    if(!getIsInfiniteQuantity(itemQuantity) && itemQuantity <= 0)
        return Promise.resolve();

    return getImageUrl(itemNameFormatted)
        .then(async imageUrl =>
        {
            const maxPrice = await getMaxPrice(itemNameFormatted);

            items.set(itemNameFormatted, new Item(itemNameFormatted, itemQuantity, imageUrl, itemPriceOrMultiplier, maxPrice));

            saveAllToLocalStorage();
        });
}

function formatItemName(itemName)
{
    const itemNameTrimmed = itemName.trim();
    if(!itemNameTrimmed.length)
        return itemNameTrimmed;

    const unabbreviatedItemName = handleAbbreviations(itemNameTrimmed);
    const itemNameTitleSnakeCase = convertToTitleSnakeCase(unabbreviatedItemName);
    const itemNameFormatted = handleSpecialNames(itemNameTitleSnakeCase);

    return itemNameFormatted;
}

function handleAbbreviations(itemName)
{
    return abbreviationMapping.get(itemName.toLowerCase()) ?? itemName;
}

const specialNameMapping = new Map([
    ["Tnt_Barrel", "TNT_Barrel"],
    ["Blt_Salad", "BLT_Salad"],
    ["Bem", "BEM Set"],
    ["Bems", "BEM Set"],
    ["Bemset", "BEM Set"],
    ["Sem", "SEM Set"],
    ["Sems", "SEM Set"],
    ["Semset", "SEM Set"],
    ["Tem", "TEM Set"],
    ["Tems", "TEM Set"],
    ["Temset", "TEM Set"],
    ["Lem", "LEM Set"],
    ["Lems", "LEM Set"],
    ["Lemset", "LEM Set"],
    ["Wax", "Beeswax"],
    ["Lobster", "Lobster_Tail"],
    ["Lobsters", "Lobster_Tail"],
    ["Feather", "Duck_Feather"],
    ["Feathers", "Duck_Feather"],
    ["Bacon_And_Eggs", "Bacon_and_Eggs"],
    ["Fish_And_Chips", "Fish_and_Chips"],
    ["Lobster_Tails", "Lobster_Tail"],
    ["Peanut_Butter_And_Jelly_Sandwich", "Peanut_Butter_and_Jelly_Sandwich"],
    ["Frutti_Di_Mare_Pizza", "Frutti_di_Mare_Pizza"]
]);
function handleSpecialNames(itemName)
{
    return specialNameMapping.get(itemName) ?? itemName;
}

const customItemNames = new Set(["BEM Set", "SEM Set", "TEM Set", "LEM Set"]);
const localImageItemNames = new Set([...customItemNames, "Lamb_Doner_Wrap", "Tower_Doner_Supreme", "Spicy_Bean_Doner"]);
function setUpCustomItems()
{
    for(let name of customItemNames)
        specialNameMapping.set(convertToTitleSnakeCase(name), name);
}

function getImageUrl(itemNameTitleSnakeCase)
{
    if(localImageItemNames.has(itemNameTitleSnakeCase))

        return Promise.resolve(`images/${itemNameTitleSnakeCase}.png`);

    return fetch(`https://hayday.fandom.com/api.php?action=query&prop=imageinfo&iiprop=url&titles=File:${itemNameTitleSnakeCase}.png&format=json&origin=*`)
        .then(response => response.json())
        .then(data =>
        {

            const pages = data.query.pages;
            const pageId = Object.keys(pages)[0];

            return pages[pageId].imageinfo[0].url.split("\/revision\/")[0];

        });
}

let previousSelection;
function updateItemLayout()
{
    itemTable.empty();
    normalItemsPlaceholder.prop("hidden", !!items.size || getIsInTradeView());
    updateScreenshotEmptyState();

    const shouldShowSelection = getIsInPriceCalculationMode();
    updateTotalPrice();

    if(!items.size)
    {
        rescaleScreenshotRegion();
        return;
    }

    previousSelection = undefined;

    let itemsUnsorted = [...items.values()];

    if(shouldShowSelection && shouldHideUnselectedItems)
    {
        itemsUnsorted = itemsUnsorted.filter(item => item.isSelected);

        if(!itemsUnsorted.length)
        {
            rescaleScreenshotRegion();
            return;
        }
    }
    const itemsSortedDescending = itemsUnsorted.sort((item1, item2) => getQuantitySortValue(item2.quantity) - getQuantitySortValue(item1.quantity));

    const itemCt = itemsSortedDescending.length;
    let rowCt = Math.ceil(itemCt / itemsPerRow);

    let i = 0;
    while(rowCt--)
    {
        const tableRow = document.createElement("tr");
        for(let j = 0; i < itemCt && j < itemsPerRow; i++, j++)
        {
            const currItem = itemsSortedDescending[i];
            const tableCell = document.createElement("td");
            tableCell.classList.add("itemCell");

            if(shouldShowSelection && currItem.isSelected)
                tableCell.classList.add("selected");

            $(tableCell).on("mouseup", {index: i, item: currItem}, (event) =>
            {
                const item = event.data.item;
                itemNameInput.val(item.getHumanReadableName());
                itemQuantityInput.val(shouldShowSelection ? (item.customQuantity ?? item.quantity) : item.quantity);
                itemPriceOrMultiplierInput.val(shouldShowSelection ? (item.customPriceOrMultiplier ?? item.priceOrMultiplier) : item.priceOrMultiplier);

                if(!shouldShowSelection)
                    return;

                const index = event.data.index;
                const [first, last] = [index, previousSelection ?? index].sort((n1, n2) => n1 - n2);
                if(event.shiftKey)
                {
                    $("#itemTable td").slice(first, last + 1)
                        .each((k, elem) =>
                        {
                            const currItem = itemsSortedDescending[first + k];
                            setSelectedState(currItem, elem, true);
                        });
                }
                else if(event.altKey)
                {
                    $("#itemTable td").slice(first, last + 1)
                        .each((k, elem) =>
                        {
                            const currItem = itemsSortedDescending[first + k];
                            setSelectedState(currItem, elem, false);
                        });
                }
                else if(event.ctrlKey)
                {
                    $("#itemTable td").slice(first, last + 1)
                        .each((k, elem) =>
                        {
                            const currItem = itemsSortedDescending[first + k];
                            setSelectedState(currItem, elem, !currItem.isSelected);
                        });
                }
                else
                {
                    const cell = event.currentTarget;
                    setSelectedState(item, cell, !item.isSelected);
                }

                updateTotalPrice();

                previousSelection = index;
            });

            const image = document.createElement("img");
            image.src = currItem.url;
            image.classList.add("itemImage");
            $(image).on("click", () =>
            {

                if(!shouldShowSelection)
                    itemNameInput.trigger("select");

                else if(shouldHideUnselectedItems)
                    updateItemLayout();
            });

            const quantityLabel = document.createElement("p");
            quantityLabel.innerText = currItem.quantity;
            quantityLabel.classList.add("label", "quantityLabel");
            $(quantityLabel).on("click", () =>
            {
                itemQuantityInput.trigger("select");
            });

            const priceLabel = document.createElement("p");
            priceLabel.innerHTML = formatItemPriceLabel(currItem.priceOrMultiplier);
            priceLabel.classList.add("label", "priceLabel");
            $(priceLabel).on("click", () =>
            {
                itemPriceOrMultiplierInput.trigger("select");
            });

            let customQuantityLabel, customPriceLabel;
            if(shouldShowSelection)
            {

                if(currItem.customQuantity !== undefined)
                {
                    customQuantityLabel = document.createElement("p");
                    customQuantityLabel.innerText = currItem.customQuantity;
                    customQuantityLabel.classList.add("label", "customLabel", "customQuantityLabel");
                    customQuantityLabel.hidden =  !currItem.isSelected;
                    $(customQuantityLabel).on("click", () =>
                    {
                        itemQuantityInput.trigger("select");
                    });

                    if(currItem.isSelected)
                        quantityLabel.style.opacity = 0.5;
                }

                if(currItem.customPriceOrMultiplier !== undefined)
                {
                    customPriceLabel = document.createElement("p");
                    customPriceLabel.innerHTML = formatItemPriceLabel(currItem.customPriceOrMultiplier);
                    customPriceLabel.classList.add("label", "customLabel", "customPriceLabel");
                    customPriceLabel.hidden =  !currItem.isSelected;
                    $(customPriceLabel).on("click", () =>
                    {
                        itemPriceOrMultiplierInput.trigger("select");
                    });

                    if(currItem.isSelected)
                        priceLabel.style.opacity = 0.5;
                }
            }

            tableCell.appendChild(image);
            tableCell.appendChild(quantityLabel);
            tableCell.appendChild(priceLabel);
            if(customQuantityLabel)
                tableCell.appendChild(customQuantityLabel);
            if(customPriceLabel)
                tableCell.appendChild(customPriceLabel);

            tableRow.appendChild(tableCell);
        }

        itemTable.append(tableRow);
    }

    rescaleScreenshotRegion();
}

function formatItemPriceLabel(priceOrMultiplier)
{
    const priceStr = String(priceOrMultiplier);
    const priceStrTrimmed = priceStr.trim();
    return priceOrMultiplier + (!priceStrTrimmed.length || priceStrTrimmed.endsWith('x') ? "" : `<img class="coin" src="${coinImageUrl}">`);
}

function createImageExportTarget()
{
    const targetWidth = screenshotRegion.outerWidth();
    const targetHeight = screenshotRegion.outerHeight();
    const holder = document.createElement("div");
    holder.style.position = "fixed";
    holder.style.top = "0";
    holder.style.left = "-100000px";
    holder.style.width = `${targetWidth}px`;
    holder.style.height = `${targetHeight}px`;
    holder.style.pointerEvents = "none";

    const target = screenshotRegion[0].cloneNode(true);
    target.style.transform = "";
    target.style.marginLeft = "";
    target.style.marginRight = "";
    target.style.marginBottom = "";
    target.classList.add("copyExport");

    holder.appendChild(target);
    document.body.appendChild(holder);
    holder.style.width = `${target.offsetWidth}px`;
    holder.style.height = `${target.offsetHeight}px`;
    return {holder, target};
}

function copyImageToClipboard()
{
    if(isActivelyCopyingImage)
        return;
    isActivelyCopyingImage = true;
    setCopyImageStatus("copying", "Copying image...");

    copyImageLoadingWheel.prop("hidden", false);
    fitGeneratedImageBottomText();
    const exportTarget = createImageExportTarget();
    itemsPerRowSlider.prop("disabled", true);

    let screenshotBlob;
    let clipboardWrittenPromise;

    if(isRunningIOS())
    {
        clipboardWrittenPromise = navigator.clipboard.write(
            [new ClipboardItem(
                {
                    "image/png":
                        (async () =>
                        {

                            await htmlToImage.toBlob(exportTarget.target);
                            let blob = await htmlToImage.toBlob(exportTarget.target);

                            screenshotBlob = blob;

                            return blob;
                        })()
                }
            )]
        );
    }
    else
    {

        clipboardWrittenPromise = htmlToImage.toBlob(exportTarget.target)
            .then(blob => screenshotBlob = blob)
            .then(blob => new ClipboardItem({"image/png": blob}))
            .then(clipboardItem => navigator.clipboard.write([clipboardItem]));
    }

    clipboardWrittenPromise
        .then(() =>
        {
            createSuccessfulCopyNotification();
            setCopyImageStatus("success", "Image copied");
        })
        .catch(e =>
        {
            console.log("Unable to generate image and/or copy it to clipboard --", e);

            createFailedCopyNotification();
            setCopyImageStatus("error", "Unable to copy image");

            if(screenshotBlob)
            {
                failedCopyOverlay.imageHolder[0].src = window.URL.createObjectURL(screenshotBlob);

                failedCopyOverlay.overlay.prop("hidden", false);

                $("html, body").css("overflow-y", "hidden");

                screenshotRegion.css("margin-right", "calc(100vw - 100%)");
            }
        })
        .finally(() =>
        {
            exportTarget.holder.remove();
            isActivelyCopyingImage = false;

            copyImageLoadingWheel.prop("hidden", true);
            rescaleScreenshotRegion();
            itemsPerRowSlider.prop("disabled", false);
        });
}

let copyImageStatusTimeout;
function setCopyImageStatus(state, message)
{
    clearTimeout(copyImageStatusTimeout);
    copyImageStatus.removeClass("copying success error");
    copyImageStatus.addClass(state);
    copyImageStatus.text(message);
    $(".copyImageToClipboardButton").prop("disabled", state === "copying");

    if(state !== "copying")
        copyImageStatusTimeout = setTimeout(() => copyImageStatus.text("").removeClass(state), 4200);
}

function copyAsTextListToClipboard()
{
    const itemStrs = [];

    const format = textListFormatInput.val();
    const itemsSortedDescending = [...items.values()].sort((item1, item2) => getQuantitySortValue(item2.quantity) - getQuantitySortValue(item1.quantity));
    for(let item of itemsSortedDescending)
        itemStrs.push(formatTextListItem(format, item));

    const textList = itemStrs.join(textListSeparatorRadios[textListSeparatorSelectedRadio].value);
    navigator.clipboard.writeText(textList)
        .then(createSuccessfulCopyNotification)

        .catch(console.log);
}

function getMaxPrice(itemNameTitleSnakeCase)
{

    if(customItemNames.has(itemNameTitleSnakeCase))
        return Promise.resolve(NaN);

    const properPageName = handleSpecialPageNames(itemNameTitleSnakeCase);
    const url = "https://hayday.fandom.com/api.php?" +
        new URLSearchParams({
            origin: "*",
            action: "parse",
            page: properPageName,
            format: "json",
            prop: "text",
        });

    return fetch(url)
        .then(response => response.json())
        .then(json => json.parse.text["*"])
        .then(html =>
        {

            const priceRange = $(html).find("aside.portable-infobox div[data-source='price']").children().text();
            const maxPrice = parseInt(priceRange.split(" to ")[1].replaceAll(",", ""));
            console.log(itemNameTitleSnakeCase, "max price:", maxPrice);
            return maxPrice;
        }).catch(e =>
        {
            console.log(e);
            console.log(itemNameTitleSnakeCase, "max price:", NaN);

            return NaN;
        });
}

const specialPageNameMapping = new Map([
    ["Shepherds_Pie", "Shepherd's_Pie"],
    ["Caffe_Latte", "Caffè_Latte"],
    ["Caffe_Mocha", "Caffè_Mocha"]
]);
function handleSpecialPageNames(itemName)
{
    return specialPageNameMapping.get(itemName) ?? itemName;
}

async function ensureItemsHaveMaxPriceSet()
{
    let shouldSave = false;
    for(let item of items.values())
    {

        if(item.maxPrice === null)
        {
            item.maxPrice = NaN;
            continue;
        }
        if(item.maxPrice !== undefined)
            continue;

        item.maxPrice = await getMaxPrice(item.name);
        shouldSave = true;

        if(getIsInPriceCalculationMode() || !getIsInTradeView())
            updateTotalPrice();
    }

    if(shouldSave)
        saveItemsToLocalStorage();
}

function formatTextListItem(format, item)
{
    return format.replaceAll("{{name}}", item.getHumanReadableName())
        .replaceAll("{{quantity}}", item.quantity)
        .replaceAll("{{price}}", item.priceOrMultiplier);
}

function calculateTotalSelectedPrice()
{
    if(getHasInfiniteQuantity(items.values(), false, true))
    {
        totalSelectedPriceMessageHolder.text("");
        totalSelectedPriceMessageHolder.prop("hidden", true);
        totalSelectedPriceEquationHolder.text("");
        return undefined;
    }

    let total = 0;
    let equations = [];

    const itemsSortedDescending = [...items.values()].sort((item1, item2) => getQuantitySortValue(item2.quantity) - getQuantitySortValue(item1.quantity));
    let message, isError = false;
    for(let item of itemsSortedDescending)
    {
        if(!item.isSelected)
            continue;

        let [itemTotalPrice, equation, error, warning] = item.calculateTotalPrice();

        total += itemTotalPrice;

        equations.push(equation);

        if(error)
        {
            console.log(error);

            message = error;
            isError = true;
            break;
        }

        if(warning)
        {
            console.log(warning);

            message ??= warning;
        }
    }

    const hasMessage = message !== undefined;
    if(hasMessage)
    {
        totalSelectedPriceMessageHolder.text(message);
        totalSelectedPriceMessageHolder.css("color", isError ? "red" : "purple");
    }
    totalSelectedPriceMessageHolder.prop("hidden", !hasMessage);

    totalSelectedPriceEquationHolder.text(equations.join(" + "));

    return total;
}

function updateTotalPrice()
{
    if(getIsInTradeView())
    {
        screenshotPriceHolder.empty();
        updatePriceCalculationDetailsVisibility();
        return;
    }

    const totalSelectedPrice = calculateTotalSelectedPrice();

    if(!priceCalculationItem)
        return;

    const isInPriceCalculationMode = getIsInPriceCalculationMode();
    const totalPrice = isInPriceCalculationMode ? totalSelectedPrice : calculateTotalPrice();
    const itemCount = isInPriceCalculationMode ? getSelectedItemCount() : getTotalItemCount();
    const totalPriceHTML = items.size ? getTotalPriceHTML(totalPrice, itemCount) : "";
    screenshotPriceHolder.html(totalPriceHTML);

    updatePriceCalculationDetailsVisibility();
}

function getTotalPriceHTML(totalPrice, itemCount)
{
    const totalsAreUnavailable = totalPrice === undefined || itemCount === undefined || !Number.isFinite(totalPrice);
    const totalPriceFormatted = totalsAreUnavailable ? "N/A" : getLocaleString(totalPrice);
    const totalPriceInItems = totalsAreUnavailable ? undefined : +(totalPrice / priceCalculationItem.maxPrice).toFixed(2);
    const totalPriceInItemsFormatted = totalsAreUnavailable ? "N/A" : getLocaleString(totalPriceInItems);
    const itemCountFormatted = itemCount === undefined ? "N/A" : getLocaleString(itemCount);
    return `${totalPriceFormatted}<img src="${coinImageUrl}" style="width: 14px; height: 14px;"><span style="display: inline-block; width: 10px;"></span>${totalPriceInItemsFormatted}<img src="${priceCalculationItem.url}" style="width: 14px; height: 14px;"><span style="display: inline-block; width: 10px;"></span>(${itemCountFormatted} item${itemCount === 1 ? "" : "s"})`;
}

function getIsInPriceCalculationMode()
{
    return isPriceCalculationModeEnabled;
}

function updatePriceCalculationDetailsVisibility()
{
    const shouldShowEquation = !totalSelectedPriceEquationHolder.is("[hidden]") && !!totalSelectedPriceEquationHolder.text();
    const shouldShowMessage = !totalSelectedPriceMessageHolder.is("[hidden]") && !!totalSelectedPriceMessageHolder.text();
    totalSelectedPriceArea.prop("hidden", getIsInTradeView() || !getIsInPriceCalculationMode() || (!shouldShowEquation && !shouldShowMessage));
}

function calculateTotalPrice()
{
    if(getHasInfiniteQuantity(items.values(), true))
        return undefined;

    let total = 0;
    const itemsSortedDescending = [...items.values()].sort((item1, item2) => getQuantitySortValue(item2.quantity) - getQuantitySortValue(item1.quantity));
    for(let item of itemsSortedDescending)
    {
        const [itemTotalPrice, , error] = item.calculateTotalPrice(true);
        if(error || !Number.isFinite(itemTotalPrice))
            return undefined;

        total += itemTotalPrice;
    }

    return total;
}

function setSelectedState(item, cell, isSelected)
{
    item.isSelected = isSelected;

    if(isSelected)
        cell.classList.add("selected");
    else
        cell.classList.remove("selected");

    const cellSelector = $(cell);
    cellSelector.find(".customLabel").prop("hidden", !isSelected);

    cellSelector.find(".quantityLabel").css("opacity", isSelected && item.customQuantity !== undefined ? 0.5 : 1);
    cellSelector.find(".priceLabel").css("opacity", isSelected && item.customPriceOrMultiplier !== undefined ? 0.5 : 1);
}

function setSelectedStateAll(items, cells, isSelected)
{
    for(let item of items)
        item.isSelected = isSelected;

    for(let cell of cells)
    {
        if(isSelected)
            cell.classList.add("selected");
        else
            cell.classList.remove("selected");

        $(cell).find(".customLabel").prop("hidden", !isSelected);
    }
}

async function prepareAllItemNames()
{
    const itemNames = await getAllItemNames();

    const prepared = [];
    for(let itemName of itemNames)
        prepared.push(fuzzysort.prepare(itemName));

    preparedItemNames = prepared;
}

const suppliesNames = ["Axe", "Dynamite", "Saw", "Shovel", "TNT Barrel", "Pickaxe", "Bolt", "Brick", "Duct Tape", "Hammer", "Hand Drill", "Nail", "Paint Bucket", "Plank", "Screw", "Stone Block", "Tar Bucket", "Wood Panel", "Land Deed", "Mallet", "Map Piece", "Marker Stake"];

const nameBlacklist = new Set(["Chicken Feed", "Cow Feed", "Pig Feed", "Sheep Feed", "Red Lure", "Green Lure", "Blue Lure", "Purple Lure", "Gold Lure", "Fishing Net", "Mystery Net", "Goat Feed", "Lobster Trap", "Duck Trap", "Honey Mask", "Field", "Apple Tree", "Shop Icon", "Coins", "Experience", "Caffè Latte", "Caffè Mocha"]);
async function getAllItemNames()
{
    const fetchPortion = (pageName) =>
    {
        const url = "https://hayday.fandom.com/api.php?" +
            new URLSearchParams({
                origin: "*",
                action: "parse",
                page: pageName,
                format: "json",
                prop: "images",
            });

        return fetch(url)
            .then(response => response.json())
            .then(json => json.parse.images)
            .then(images => images.map(image => image.split(".png")[0].replaceAll("_", " ")));
    };

    const productNames = await fetchPortion("Products");
    const cropNames = await fetchPortion("Crops");
    const animalProductNames = await fetchPortion("Animal_Goods");

    return productNames.concat(cropNames, animalProductNames, suppliesNames).filter(name => !nameBlacklist.has(name)).concat([...localImageItemNames.values()].map(name => name.replaceAll("_", " ")));
}

function updateFuzzyMatches(itemInput, fuzzyMatchesHolder)
{

    if((itemInput === itemNameInput && getIsInPriceCalculationMode()) || !preparedItemNames)
        return;

    const matches = fuzzysort.go(itemInput.val(), preparedItemNames, {limit: 10});

    const matchHTMLs = [];
    let i = 0;
    for(let match of matches)
    {
        i++;

        const div = document.createElement("div");

        const button = document.createElement("button");
        button.tabIndex = -1;
        button.innerHTML = fuzzysort.highlight(match, "<b style='color: orange;'>", "</b>");
        $(button).on("mousedown", {itemName: match.target}, (event, customParams) =>
        {
            itemInput.val(event.data.itemName);

            if(itemInput === priceCalculationItemInput)
                itemInput.trigger("change");

            if(!customParams || !customParams.usedKeyboard)

                $("*").one("mouseup.fuzzyMatchClick", (e) =>
                {
                    const tradeSide = getTradeSideForInput(itemInput);
                    if(tradeSide)
                        focusTradeQuantityInput(tradeSide);
                    else if(shouldFocusQuantityOnAutocomplete && itemInput === itemNameInput)
                        itemQuantityInput.trigger("select");
                    else
                        itemInput.trigger("focus");
                    e.stopPropagation();

                    $("*").off(".fuzzyMatchClick");
                });
            else
            {
                const tradeSide = getTradeSideForInput(itemInput);
                if(tradeSide)
                    focusTradeQuantityInput(tradeSide);
                else if(shouldFocusQuantityOnAutocomplete && itemInput === itemNameInput)
                    itemQuantityInput.trigger("select");
            }
        });

        const p = document.createElement("p");
        p.innerText = i === 10 ? 0 : i;

        div.appendChild(button);
        div.appendChild(p);

        matchHTMLs.push(div);
    }

    fuzzyMatchesHolder.empty();
    fuzzyMatchesHolder[0].append(...matchHTMLs);
}

function createSuccessfulCopyNotification()
{
    let notification = document.createElement("p");
    notification.innerText = "Successfully Copied!";
    notification.classList.add("notification", "notificationSuccess");
    $(notification).on("animationend", notification.remove);
    document.body.appendChild(notification);
}

function createFailedCopyNotification()
{
    let notification = document.createElement("p");
    notification.innerText = "Failed to Copy!";
    notification.classList.add("notification", "notificationFail");
    $(notification).on("animationend", notification.remove);
    document.body.appendChild(notification);
}

function fitGeneratedImageBottomText()
{
    if(!bottomText?.length || bottomText.prop("hidden"))
        return;

    const bottomTextElement = bottomText[0];
    bottomTextElement.style.fontSize = "";

    const screenshotStyles = getComputedStyle(screenshotRegion[0]);
    const availableWidth = screenshotRegion[0].clientWidth -
        parseFloat(screenshotStyles.paddingLeft) -
        parseFloat(screenshotStyles.paddingRight);
    if(availableWidth <= 0)
        return;

    const bottomTextStyles = getComputedStyle(bottomTextElement);
    const maxFontSize = 50;
    const measurementCanvas = document.createElement("canvas");
    const context = measurementCanvas.getContext("2d");
    context.font = `${bottomTextStyles.fontWeight} ${maxFontSize}px ${bottomTextStyles.fontFamily}`;

    const longestLineWidth = bottomTextElement.innerText
        .split("\n")
        .reduce((width, line) => Math.max(width, context.measureText(line).width), 0);
    const fontSize = longestLineWidth > availableWidth
        ? Math.max(12, maxFontSize * availableWidth / longestLineWidth * 0.96)
        : maxFontSize;

    bottomTextElement.style.fontSize = `${fontSize}px`;
}

function rescaleScreenshotRegion()
{

    if(isActivelyCopyingImage)
        return;

    const previewStage = $(".previewStage");
    const previewCanvas = $(".previewCanvas");
    const availableWidth = previewStage.width() || document.documentElement.clientWidth;
    screenshotRegion[0].style.transform = "";
    screenshotRegion.css({
        "margin-left": "",
        "margin-right": "",
        "margin-bottom": ""
    });
    fitGeneratedImageBottomText();
    const screenshotWidth = screenshotRegion.outerWidth();
    const screenshotHeight = screenshotRegion.outerHeight();
    const actualFactor = 0.96 * availableWidth / screenshotWidth;

    const scaleFactor = Math.min(1.2, actualFactor);
    screenshotRegion[0].style.transform = `scale(${scaleFactor})`;
    previewCanvas.css({
        "width": `${screenshotWidth * scaleFactor}px`,
        "height": `${screenshotHeight * scaleFactor}px`
    });
    previewStage.css("min-height", `${Math.max(160, previewCanvas.outerHeight() + 32)}px`);
}

function getSelectedItemCount()
{
    let count = 0;
    for(let item of [...items.values()])
    {
        if(item.isSelected)
        {
            const quantity = item.customQuantity ?? item.quantity;
            if(getIsInfiniteQuantity(quantity))
                return undefined;

            count += quantity;
        }
    }

    return count;
}

function getTotalItemCount()
{
    let count = 0;
    for(let item of [...items.values()])
    {
        if(getIsInfiniteQuantity(item.quantity))
            return undefined;

        count += item.quantity;
    }

    return count;
}

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
        return {...styleDefaults, tradeRowsPerRow: "4"};

    return {
        ...styleDefaults,
        itemsPerRow: String(Math.min(Math.floor(document.documentElement.clientWidth / 110), 8)),
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

function loadAllFromLocalStorage()
{
    const sItems = localStorage.getItem("items");
    if(sItems)
    {

        let kvps = JSON.parse(sItems);
        for(let i in kvps)
            kvps[i][1] = Object.assign(new Item(), kvps[i][1]);
        items = new Map(kvps);
    }
    else
        items = new Map();

    const sTradeRows = localStorage.getItem("tradeRows");
    if(sTradeRows)
    {
        tradeRows = JSON.parse(sTradeRows).map(row =>
        {
            return {
                offerItems: row.offerItems.map(item => Object.assign(new Item(), item)),
                wantItems: row.wantItems.map(item => Object.assign(new Item(), item)),
                isSelected: false
            };
        });
    }
    else
        tradeRows = [];

    const sIncludeSettingsInItemList = (localStorage.getItem("includeSettingsInItemList") ?? "true") === "true";
    shouldIncludeSettingsInItemList = sIncludeSettingsInItemList;
    includeSettingsInItemListCheckBox.prop("checked", sIncludeSettingsInItemList);

    const sCopyCurrentItemsFromItemList = (localStorage.getItem("copyCurrentItemsFromItemList") ?? "false") === "true";
    shouldCopyCurrentItemsFromItemList = sCopyCurrentItemsFromItemList;
    copyCurrentItemsFromItemListCheckBox.prop("checked", sCopyCurrentItemsFromItemList);

    const legacyActiveItemList = localStorage.getItem("activeItemList") ?? "Default";
    const legacyItemLists = localStorage.getItem("itemLists");
    const savedBuySellItemLists = localStorage.getItem("buySellItemLists") ?? legacyItemLists;
    const savedTradeItemLists = localStorage.getItem("tradeItemLists");
    buySellActiveItemList = localStorage.getItem("buySellActiveItemList") ?? legacyActiveItemList;
    tradeActiveItemList = localStorage.getItem("tradeActiveItemList") ?? "Default";
    buySellItemLists = savedBuySellItemLists ? new Map(JSON.parse(savedBuySellItemLists)) : new Map();
    tradeItemLists = savedTradeItemLists ? new Map(JSON.parse(savedTradeItemLists)) : new Map();
    activateItemListsForCurrentMode();

    const sAbbreviationMapping = localStorage.getItem("abbreviationMapping");
    if(sAbbreviationMapping)
        abbreviationMapping = new Map(JSON.parse(sAbbreviationMapping));

    localStorage.removeItem("generatedImageBoxColor");
    localStorage.removeItem("generatedImageShowBoxBackground");
    localStorage.removeItem("generatedImageGradientAngle");
    localStorage.removeItem("generatedImageFont");
    loadGeneratedImageStylesForCurrentMode();

    const sItemsPerRow = localStorage.getItem("itemsPerRow") ?? Math.min(Math.floor(document.documentElement.clientWidth / 110), 8);
    itemsPerRowSlider.val(sItemsPerRow);
    itemsPerRowLabel.text(sItemsPerRow);
    itemsPerRow = parseInt(sItemsPerRow);
    tradeRowsPerRow = Math.min(4, parseInt(localStorage.getItem("tradeRowsPerRow") ?? "4"));

    textListSeparatorSelectedRadio = parseInt(localStorage.getItem("textListSeparatorSelectedRadio") ?? 0);
    const sTextListCustomSeparator = localStorage.getItem("textListCustomSeparator") ?? "";
    textListSeparatorCustomRadio.val(sTextListCustomSeparator);
    textListCustomSeparatorInput.val(sTextListCustomSeparator);

    const sTextListFormat = localStorage.getItem("textListFormat") ?? "{{quantity}} {{name}} ({{price}})";
    textListFormatInput.val(sTextListFormat);

    const sPriceCalculationItem = localStorage.getItem("priceCalculationItem") ?? "Diamond Ring";
    priceCalculationItemInput.val(sPriceCalculationItem);

    const sDefaultQuantity = localStorage.getItem("defaultQuantity") ?? "";
    defaultQuantity = sDefaultQuantity;
    defaultQuantityInput.val(sDefaultQuantity);
    itemQuantityInput.val(sDefaultQuantity);

    const sDefaultPriceOrMultiplier = localStorage.getItem("defaultPriceOrMultiplier") ?? "5x";
    defaultPriceOrMultiplier = sDefaultPriceOrMultiplier;
    defaultPriceOrMultiplierInput.val(sDefaultPriceOrMultiplier);
    itemPriceOrMultiplierInput.val(sDefaultPriceOrMultiplier);

    const sRefocusNameOnSubmit = (localStorage.getItem("refocusNameOnSubmit") ?? "true") === "true";
    shouldRefocusNameOnSubmit = sRefocusNameOnSubmit;
    refocusNameOnSubmitCheckBox.prop("checked", sRefocusNameOnSubmit);

    const sFocusQuantityOnAutocomplete = (localStorage.getItem("focusQuantityOnAutocomplete") ?? "true") === "true";
    shouldFocusQuantityOnAutocomplete = sFocusQuantityOnAutocomplete;
    focusQuantityOnAutocompleteCheckBox.prop("checked", sFocusQuantityOnAutocomplete);

    const sIgnoreLocale = (localStorage.getItem("ignoreLocale") ?? "false") === "true";
    shouldIgnoreLocale = sIgnoreLocale;
    ignoreLocaleCheckBox.prop("checked", sIgnoreLocale);
}

function saveAllToLocalStorage()
{
    saveItemsToLocalStorage();
    saveTradeRowsToLocalStorage();

    localStorage.setItem("includeSettingsInItemList", shouldIncludeSettingsInItemList);
    localStorage.setItem("copyCurrentItemsFromItemList", shouldCopyCurrentItemsFromItemList);
    saveItemListCollectionsToLocalStorage();

    localStorage.setItem("abbreviationMapping", JSON.stringify([...abbreviationMapping]));
    saveGeneratedImageStylesForCurrentMode();
    localStorage.setItem("itemsPerRow", itemsPerRow);
    localStorage.setItem("tradeRowsPerRow", tradeRowsPerRow);
    localStorage.setItem("textListSeparatorSelectedRadio", textListSeparatorSelectedRadio);
    localStorage.setItem("textListCustomSeparator", textListCustomSeparatorInput.val());
    localStorage.setItem("textListFormat", textListFormatInput.val());
    localStorage.setItem("priceCalculationItem", priceCalculationItemInput.val());

    localStorage.setItem("defaultQuantity", defaultQuantity);
    localStorage.setItem("defaultPriceOrMultiplier", defaultPriceOrMultiplier);

    localStorage.setItem("refocusNameOnSubmit", shouldRefocusNameOnSubmit);
    localStorage.setItem("focusQuantityOnAutocomplete", shouldFocusQuantityOnAutocomplete);
    localStorage.setItem("ignoreLocale", shouldIgnoreLocale);
}

function saveItemsToLocalStorage()
{
    localStorage.setItem("items", JSON.stringify([...items], (key, value) => Item.fieldsToOmitFromLocalStorage.has(key) ? undefined : value));
}

function saveTradeRowsToLocalStorage()
{
    const persistedTradeRows = tradeRows.map(row => ({offerItems: row.offerItems, wantItems: row.wantItems}));
    localStorage.setItem("tradeRows", JSON.stringify(persistedTradeRows, (key, value) => Item.fieldsToOmitFromLocalStorage.has(key) ? undefined : value));
}

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
