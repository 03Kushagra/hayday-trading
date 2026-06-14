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
