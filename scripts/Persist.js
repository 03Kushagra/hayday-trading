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
    syncTradeRowsToActiveItemList(sTradeRows);
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
    const serializedTradeRows = JSON.stringify(persistedTradeRows, (key, value) => Item.fieldsToOmitFromLocalStorage.has(key) ? undefined : value);
    localStorage.setItem("tradeRows", serializedTradeRows);
    syncTradeRowsToActiveItemList(serializedTradeRows);
    saveItemListCollectionsToLocalStorage();
}

function syncTradeRowsToActiveItemList(serializedTradeRows)
{
    if(serializedTradeRows === null || !tradeItemLists.has(tradeActiveItemList))
        return;

    tradeItemLists.get(tradeActiveItemList).tradeRows = serializedTradeRows;
}
