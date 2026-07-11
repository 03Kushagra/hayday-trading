const operators = ['+', '-', '*', '/', '^', '%', "mod", '&', '|', "<<", ">>>", ">>"];
const EXCHANGE_DEFAULT_ROW_COUNT = 1;

function getIsInBuySellView()
{
    return currentViewMode === "buySell";
}

function getIsInTradeView()
{
    return currentViewMode === "trade";
}

function getIsInExchangeView()
{
    return currentViewMode === "exchange";
}

function getIsInTradeLikeView()
{
    return getIsInTradeView() || getIsInExchangeView();
}

function setTradeViewEnabled(shouldEnable)
{
    setEditorMode(shouldEnable ? "trade" : "buySell");
}

function setEditorMode(mode)
{
    if(mode === "exchange" && !isExchangeFeatureEnabled)
        mode = "buySell";

    if(mode === currentViewMode)
        return;

    const leavingTradeView = getIsInTradeView();
    if(mode !== "buySell" && getIsInPriceCalculationMode())
        $("#priceCalculationToggleButton").trigger("click");
    if(leavingTradeView && getIsInTradeSelectionMode())
        $("#tradeSelectionToggleButton").trigger("click");

    storeItemList();
    currentViewMode = mode;
    const isTradeView = getIsInTradeView();
    const isExchangeView = getIsInExchangeView();
    const isTradeLikeView = getIsInTradeLikeView();
    normalViewButton.toggleClass("selected", getIsInBuySellView());
    tradeViewButton.toggleClass("selected", isTradeView);
    exchangeViewButton.toggleClass("selected", isExchangeView);
    $("body").toggleClass("tradeView", isTradeLikeView);
    $("body").toggleClass("exchangeView", isExchangeView);
    activateItemListsForCurrentMode();
    loadItemList();

    itemEditorModeTitle.text(isTradeView ? "Trade View" : isExchangeView ? "Exchange Resource" : "Add/Modify Item");
    itemsPerRowOptionLabel.text(isTradeView ? "Trades Per Row" : "Items Per Row");
    itemsPerRowSlider.prop("max", isTradeView ? 4 : 12);
    itemsPerRowSlider.val(isTradeView ? tradeRowsPerRow : itemsPerRow);
    itemsPerRowLabel.text(isTradeView ? tradeRowsPerRow : itemsPerRow);
    $(".rowCountControl").prop("hidden", isExchangeView);
    normalItemEntryHint.prop("hidden", isTradeLikeView);
    normalItemEntryArea.prop("hidden", isTradeLikeView);
    tradeItemEntryArea.prop("hidden", !isTradeView);
    exchangeItemEntryArea.prop("hidden", !isExchangeView);
    normalItemClickInfo.prop("hidden", isTradeLikeView);
    priceCalculationModeSelectionInfo.prop("hidden", isTradeLikeView || !getIsInPriceCalculationMode());
    updatePriceCalculationDetailsVisibility();

    hideInTradeViewElems.prop("hidden", isTradeLikeView);
    itemTable.prop("hidden", isTradeLikeView);
    normalItemsPlaceholder.prop("hidden", isTradeLikeView || !!items.size);
    tradeDisplay.prop("hidden", !isTradeView);
    exchangeDisplay.prop("hidden", !isExchangeView);

    if(isTradeView)
    {
        screenshotPriceHolder.empty();
        exchangeDisplay.empty();
        updateTradeDisplay();
        updateTradeDraftSummary();
        updateTradeSubmitButtonText();
    }
    else if(isExchangeView)
    {
        screenshotPriceHolder.empty();
        tradeDisplay.empty();
        updateExchangeEditorRows();
        updateExchangeDisplay();
    }
    else
    {
        tradeDisplay.empty();
        exchangeDisplay.empty();
        updateItemLayout();
    }

    rescaleScreenshotRegion();
}

function updateScreenshotEmptyState()
{
    const isEmpty = getIsInExchangeView() ? !getExchangeHasItems() : getIsInTradeView() ? !getVisibleTradeRows().length : !items.size;
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
    const inputElement = itemInput?.[0];
    if(inputElement === tradeOfferNameInput?.[0])
        return "offer";
    if(inputElement === tradeWantNameInput?.[0])
        return "want";
    return undefined;
}

function getQuantityInputForAutocomplete(itemInput)
{
    const tradeSide = getTradeSideForInput(itemInput);
    if(tradeSide)
        return tradeSide === "offer" ? tradeOfferQuantityInput : tradeWantQuantityInput;

    if(itemInput?.[0] === exchangeNameInput?.[0])
        return exchangeQuantityInput;

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
    const shouldRemoveOfferInput = shouldRemoveSelectedTradeInput("offer");
    const shouldRemoveWantInput = shouldRemoveSelectedTradeInput("want");

    Promise.all([
        hasOfferInput && !shouldRemoveOfferInput ? getTradeInputItem(tradeOfferNameInput, tradeOfferQuantityInput) : undefined,
        hasWantInput && !shouldRemoveWantInput ? getTradeInputItem(tradeWantNameInput, tradeWantQuantityInput) : undefined
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
                    shouldReduceRatio: false,
                    isSelected: getIsInTradeSelectionMode() && shouldHideUnselectedTrades
                });
            else
                tradeRows[editingTradeRowIndex] = {
                    offerItems,
                    wantItems,
                    shouldReduceRatio: tradeRows[editingTradeRowIndex].shouldReduceRatio === true,
                    isSelected: tradeRows[editingTradeRowIndex].isSelected
                };
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

    clearTradeInvalidState();

    if(shouldRemoveSelectedTradeInput(side))
    {
        resetTradeInputAfterDraftChange(side);
        updateTradeDraftSummary();
        rescaleScreenshotRegion();
        return;
    }

    const itemOrder = tradeDraftOrder++;
    const pendingPromise = getTradeInputItem(nameInput, quantityInput, true)
        .then(item =>
        {
            if(!item)
                return;

            addDisplacedTradeInputItem(itemList, side);
            addOrMergeTradeItem(itemList, item);
            item.tradeOrder = itemOrder;
            sortTradeItemsByOrder(itemList);
            resetTradeInputAfterDraftChange(side, item.name);
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

function shouldRemoveSelectedTradeInput(side)
{
    if(editingTradeRowIndex === undefined)
        return false;

    const cachedItem = getTradeInputCache(side);
    const nameInput = getTradeNameInput(side);
    const quantityInput = side === "offer" ? tradeOfferQuantityInput : tradeWantQuantityInput;
    if(!cachedItem || formatItemName(nameInput.val()) !== cachedItem.name)
        return false;

    try
    {
        return Number(math.evaluate(quantityInput.val().trim())) === 0;
    }
    catch(e)
    {
        return false;
    }
}

function resetTradeInputAfterDraftChange(side, itemNameToClear)
{
    const nameInput = getTradeNameInput(side);
    const quantityInput = side === "offer" ? tradeOfferQuantityInput : tradeWantQuantityInput;
    if(itemNameToClear === undefined || formatItemName(nameInput.val()) === itemNameToClear)
    {
        nameInput.val("");
        quantityInput.val("0");
        if(side === "offer")
            tradeOfferInputItemCache = undefined;
        else
            tradeWantInputItemCache = undefined;
    }

    nameInput.trigger("focus").trigger("select");
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
    updateTradeSelectionControls();
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
    if(cachedItem && !shouldRemoveSelectedTradeInput(side) && !itemList.some(item => item.name === cachedItem.name))
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
    updateTradeSelectionControls();

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

function getSelectedTradeRowIndexes()
{
    return tradeRows.reduce((indexes, tradeRow, index) =>
    {
        if(tradeRow.isSelected)
            indexes.push(index);
        return indexes;
    }, []);
}

function updateTradeSelectionControls()
{
    if(!disableOutsideTradeSelectionModeElems)
        return;

    const ratioTargetIndex = getTradeRatioFormatTargetIndex();
    const selectedTradeRow = ratioTargetIndex === undefined ? undefined : tradeRows[ratioTargetIndex];
    disableOutsideTradeSelectionModeElems.prop("disabled", !getIsInTradeSelectionMode());
    tradeRatioFormatToggleButton.prop("disabled", ratioTargetIndex === undefined);
    tradeRatioFormatToggleButton.toggleClass("selected", selectedTradeRow?.shouldReduceRatio === true);
}

function getTradeRatioFormatTargetIndex()
{
    const selectedIndexes = getSelectedTradeRowIndexes();
    if(getIsInTradeSelectionMode())
        return selectedIndexes.length === 1 ? selectedIndexes[0] : undefined;

    return editingTradeRowIndex;
}

function toggleSelectedTradeRatioFormat()
{
    const ratioTargetIndex = getTradeRatioFormatTargetIndex();
    if(ratioTargetIndex === undefined)
        return;

    const tradeRow = tradeRows[ratioTargetIndex];
    tradeRow.shouldReduceRatio = tradeRow.shouldReduceRatio !== true;
    saveTradeRowsToLocalStorage();
    updateTradeDisplay();
}

function toggleTradeRowSelection(index)
{
    const tradeRow = tradeRows[index];
    if(!tradeRow)
        return;

    tradeRow.isSelected = !tradeRow.isSelected;
    updateTradeSelectionControls();
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
    ratioBadge.innerText = getTradeRatioText(tradeRow.offerItems, tradeRow.wantItems, tradeRow.shouldReduceRatio);
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
    updateTradeSelectionControls();
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

function getExchangeEntries(side)
{
    return side === "have" ? exchangeRows.have : exchangeRows.want;
}

function setExchangeEntries(side, entries)
{
    if(side === "have")
        exchangeRows.have = entries;
    else
        exchangeRows.want = entries;
}

function normalizeExchangeEntries(entries)
{
    if(!Array.isArray(entries))
        return [];

    return entries.map(row => Array.isArray(row) ? row.map(normalizeExchangeEntry).filter(Boolean) : [normalizeExchangeEntry(row)].filter(Boolean));
}

function normalizeExchangeEntry(entry)
{
    if(!entry)
        return undefined;

    if(entry instanceof Item)
        return {name: entry.getHumanReadableName(), quantity: String(entry.quantity)};

    const item = Object.assign(new Item(), entry.item ?? entry);
    return {
        name: entry.name ?? (item.name ? item.getHumanReadableName() : ""),
        quantity: String(entry.quantity ?? item.quantity ?? "")
    };
}

function getExchangeRowEntries(side, index)
{
    const entries = getExchangeEntries(side);
    if(!Array.isArray(entries[index]))
        entries[index] = entries[index] ? [normalizeExchangeEntry(entries[index])].filter(Boolean) : [];
    return entries[index];
}

function getExchangeEditorMinimumRowCount()
{
    return Math.max(EXCHANGE_DEFAULT_ROW_COUNT, exchangeEditorRowCount, exchangeRows.have.length, exchangeRows.want.length);
}

function updateExchangeEditorRows()
{
    exchangeEditorRowCount = getExchangeEditorMinimumRowCount();
    syncExchangeTopEditorFields();
    updateExchangeDisplay();
}

function clearExchangeInvalidState()
{
    exchangeNameInput?.removeClass("invalid");
    exchangeQuantityInput?.removeClass("invalid");
}

async function getExchangeItemFromEntry(entry, side, index, itemIndex)
{
    const itemNameFormatted = formatItemName(entry.name ?? "");
    if(!itemNameFormatted.length)
        return undefined;

    const quantity = getExchangeQuantity(entry.quantity ?? "");
    if(quantity === undefined)
    {
        if(side === exchangeEditingSide && index === exchangeEditingIndex && itemIndex === exchangeEditingItemIndex)
            exchangeQuantityInput.addClass("invalid");
        return undefined;
    }

    try
    {
        const imageUrl = await getImageUrl(itemNameFormatted);
        const item = new Item(itemNameFormatted, quantity, imageUrl, "", NaN);
        item.exchangeIndex = index;
        item.exchangeItemIndex = itemIndex;
        return item;
    }
    catch(e)
    {
        if(side === exchangeEditingSide && index === exchangeEditingIndex && itemIndex === exchangeEditingItemIndex)
            exchangeNameInput.addClass("invalid");
        console.log("Failed to load exchange item --", e);
        return undefined;
    }
}

function getExchangeQuantity(quantityText)
{
    const trimmedQuantity = String(quantityText).trim();
    if(!trimmedQuantity.length)
        return 1;
    if(trimmedQuantity === INFINITY_QUANTITY || trimmedQuantity.toLowerCase() === "infinity")
        return INFINITY_QUANTITY;

    try
    {
        const quantity = Math.floor(math.evaluate(trimmedQuantity));
        return Number.isFinite(quantity) && quantity > 0 ? quantity : undefined;
    }
    catch(e)
    {
        console.log("Unable to evaluate exchange quantity --", e);
        return undefined;
    }
}

function getExchangeHasItems()
{
    return exchangeRows.have.some(row => row.some(entry => formatItemName(entry.name ?? "").length)) ||
        exchangeRows.want.some(row => row.some(entry => formatItemName(entry.name ?? "").length));
}

async function updateExchangeDisplay()
{
    const token = ++exchangeUpdateToken;
    clearExchangeInvalidState();
    updateScreenshotEmptyState();

    const haveItemPromises = exchangeRows.have.map((rowEntries, i) => Promise.all(rowEntries.map((entry, itemIndex) => getExchangeItemFromEntry(entry, "have", i, itemIndex))));
    const wantItemPromises = exchangeRows.want.map((rowEntries, i) => Promise.all(rowEntries.map((entry, itemIndex) => getExchangeItemFromEntry(entry, "want", i, itemIndex))));
    const [haveItems, wantItems] = await Promise.all([
        Promise.all(haveItemPromises),
        Promise.all(wantItemPromises)
    ]);

    if(token !== exchangeUpdateToken)
        return;

    updateScreenshotEmptyState();

    exchangeDisplay.empty().append(createExchangeRowsScreen(haveItems, wantItems));
    renderLucideIcons();
    rescaleScreenshotRegion();
}

function createExchangeRowsScreen(haveItems, wantItems)
{
    const screen = document.createElement("div");
    screen.classList.add("exchangeRowsScreen");
    screen.classList.add(`exchangeItemsPerLine${exchangeItemsPerLine}`);

    const header = document.createElement("div");
    header.classList.add("exchangeRowsHeader");

    const haveHeading = document.createElement("h3");
    haveHeading.innerText = "What I Have";
    header.appendChild(haveHeading);

    const arrowHeading = document.createElement("span");
    arrowHeading.classList.add("exchangeHeaderArrow");
    arrowHeading.innerHTML = '<i data-lucide="move-right"></i>';
    header.appendChild(arrowHeading);

    const wantHeading = document.createElement("h3");
    wantHeading.innerText = "What I Want";
    header.appendChild(wantHeading);

    const ratioHeading = document.createElement("h3");
    ratioHeading.innerText = "Ratio";
    header.appendChild(ratioHeading);

    screen.appendChild(header);

    const rowCount = Math.max(EXCHANGE_DEFAULT_ROW_COUNT, exchangeEditorRowCount, exchangeRows.have.length, exchangeRows.want.length);
    for(let i = 0; i < rowCount; i++)
        screen.appendChild(createExchangePreviewRow(haveItems[i], wantItems[i], i));

    return screen;
}

function createExchangePreviewRow(haveItems, wantItems, index)
{
    haveItems = (haveItems ?? []).filter(Boolean);
    wantItems = (wantItems ?? []).filter(Boolean);
    const rowBlock = document.createElement("div");
    rowBlock.classList.add("tradeRowBlock", "exchangeRowBlock");
    if(!haveItems.length && !wantItems.length)
        rowBlock.classList.add("exchangeSkeletonRow");
    rowBlock.dataset.index = index;

    rowBlock.appendChild(createExchangeSideCell("have", index, haveItems));

    const direction = document.createElement("p");
    direction.innerHTML = '<i data-lucide="move-right"></i>';
    direction.classList.add("tradeDirection", "exchangeDirection");
    rowBlock.appendChild(direction);

    rowBlock.appendChild(createExchangeSideCell("want", index, wantItems));

    const ratioBadge = document.createElement("p");
    ratioBadge.innerText = haveItems.length || wantItems.length ? getExchangeRatioText(haveItems, wantItems) : "";
    ratioBadge.classList.add("tradeRatioBadge");
    rowBlock.appendChild(ratioBadge);

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.classList.add("exchangeRowDeleteButton");
    deleteButton.dataset.index = index;
    deleteButton.title = "Remove row";
    deleteButton.setAttribute("aria-label", "Remove exchange row");
    deleteButton.innerHTML = '<i data-lucide="trash-2"></i>';
    rowBlock.appendChild(deleteButton);

    return rowBlock;
}

function createExchangeSideCell(sideName, index, items)
{
    const side = document.createElement("div");
    side.classList.add("exchangeSideCell");
    if(exchangeEditingSide === sideName && exchangeEditingIndex === index)
        side.classList.add("selected");

    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.classList.add("exchangeSideAddButton");
    addButton.dataset.side = sideName;
    addButton.dataset.index = index;
    addButton.title = `Add ${sideName === "have" ? "Have" : "Want"} item`;
    addButton.setAttribute("aria-label", addButton.title);
    addButton.innerHTML = items.length ? '<i data-lucide="plus"></i>' : `<i data-lucide="plus"></i>${sideName === "have" ? "What I Have" : "What I Want"}`;

    if(items.length)
    {
        side.classList.add("hasItem");
        if(items.length > exchangeItemsPerLine)
            side.classList.add("exchangeSideWrapped");
        const itemList = document.createElement("div");
        itemList.classList.add("exchangeSideItems");
        for(const item of items)
            itemList.appendChild(createTradeCard(item, () => setExchangeInlineEditor(sideName, index, false, item.exchangeItemIndex)));
        side.appendChild(itemList);
        if(items.length > exchangeItemsPerLine)
            side.appendChild(addButton);
        else
            itemList.appendChild(addButton);
    }
    else
        side.appendChild(addButton);
    return side;
}

function setExchangeInlineEditor(sideName, index, shouldStartBlank = false, itemIndex = undefined)
{
    exchangeEditingSide = sideName;
    exchangeEditingIndex = index;
    exchangeEditingItemIndex = shouldStartBlank ? undefined : itemIndex;
    exchangeEditorRowCount = Math.max(exchangeEditorRowCount, index + 1, EXCHANGE_DEFAULT_ROW_COUNT);
    syncExchangeTopEditorFields();
    if(shouldStartBlank)
    {
        exchangeNameInput.val("").removeClass("invalid");
        exchangeQuantityInput.val("").removeClass("invalid");
        exchangeRemoveItemButton.prop("disabled", true);
    }
    saveExchangeRowsToLocalStorage();
    updateExchangeDisplay();
    setTimeout(() =>
    {
        exchangeNameInput.trigger("focus");
        exchangeNameInput[0]?.setSelectionRange(0, 0);
    }, 0);
}

function getExchangeSelectedRowIndex()
{
    const rowNumber = Math.floor(Number(exchangeRowInput.val()));
    return Number.isFinite(rowNumber) && rowNumber > 0 ? rowNumber - 1 : 0;
}

function syncExchangeTopEditorFields()
{
    if(!exchangeSideInput?.length)
        return;

    const side = ["have", "want"].includes(exchangeEditingSide) ? exchangeEditingSide : "have";
    const index = Number.isInteger(exchangeEditingIndex) && exchangeEditingIndex >= 0 ? exchangeEditingIndex : 0;
    const rowEntries = getExchangeRowEntries(side, index);
    const entry = Number.isInteger(exchangeEditingItemIndex) ? rowEntries[exchangeEditingItemIndex] ?? {name: "", quantity: ""} : {name: "", quantity: ""};
    exchangeSideInput.val(side);
    exchangeRowInput.val(index + 1);
    exchangeNameInput.val(entry.name ?? "");
    exchangeQuantityInput.val(entry.quantity ?? "");
    exchangeRemoveItemButton.prop("disabled", !Number.isInteger(exchangeEditingItemIndex) || !formatItemName(entry.name ?? "").length);
    exchangeRemoveRowButton.prop("disabled", index < 0);
}

function persistExchangeTopEditorDraft()
{
    if(!exchangeSideInput?.length)
        return;

    const side = exchangeSideInput.val();
    const index = getExchangeSelectedRowIndex();
    exchangeEditingSide = side;
    exchangeEditingIndex = index;
    exchangeEditorRowCount = Math.max(exchangeEditorRowCount, index + 1, EXCHANGE_DEFAULT_ROW_COUNT);
    exchangeRemoveItemButton.prop("disabled", !Number.isInteger(exchangeEditingItemIndex));
    updateScreenshotEmptyState();
}

function saveExchangeTopEditor()
{
    const side = exchangeSideInput.val();
    const index = getExchangeSelectedRowIndex();
    const entry = {
        name: exchangeNameInput.val().trim(),
        quantity: exchangeQuantityInput.val().trim()
    };

    exchangeNameInput.removeClass("invalid");
    exchangeQuantityInput.removeClass("invalid");
    if(!formatItemName(entry.name).length)
    {
        exchangeNameInput.addClass("invalid");
        return;
    }
    if(getExchangeQuantity(entry.quantity) === undefined)
    {
        exchangeQuantityInput.addClass("invalid");
        return;
    }

    const rowEntries = getExchangeRowEntries(side, index);
    if(Number.isInteger(exchangeEditingItemIndex) && exchangeEditingItemIndex >= 0 && exchangeEditingItemIndex < rowEntries.length)
        rowEntries[exchangeEditingItemIndex] = entry;
    else
        rowEntries.push(entry);
    exchangeEditingSide = side;
    exchangeEditingIndex = index;
    exchangeEditingItemIndex = undefined;
    exchangeEditorRowCount = Math.max(exchangeEditorRowCount, index + 1, EXCHANGE_DEFAULT_ROW_COUNT);
    saveExchangeRowsToLocalStorage();
    updateExchangeDisplay();
    exchangeNameInput.val("");
    exchangeQuantityInput.val("");
    exchangeRemoveItemButton.prop("disabled", true);
    exchangeNameInput.trigger("focus");
    exchangeNameInput[0]?.setSelectionRange(0, 0);
}

function removeExchangeTopEditorItem()
{
    const side = exchangeSideInput.val();
    const index = getExchangeSelectedRowIndex();
    const rowEntries = getExchangeRowEntries(side, index);
    if(Number.isInteger(exchangeEditingItemIndex))
        rowEntries.splice(exchangeEditingItemIndex, 1);
    exchangeNameInput.val("");
    exchangeQuantityInput.val("");
    exchangeRemoveItemButton.prop("disabled", true);
    exchangeEditingSide = side;
    exchangeEditingIndex = index;
    exchangeEditingItemIndex = undefined;
    saveExchangeRowsToLocalStorage();
    updateExchangeDisplay();
    exchangeNameInput.trigger("focus");
    exchangeNameInput[0]?.setSelectionRange(0, 0);
}

function removeExchangeRow(index)
{
    if(index < 0)
        return;

    exchangeRows.have.splice(index, 1);
    exchangeRows.want.splice(index, 1);
    exchangeEditorRowCount = Math.max(EXCHANGE_DEFAULT_ROW_COUNT, exchangeRows.have.length, exchangeRows.want.length);
    if(exchangeEditingIndex === index)
    {
        exchangeEditingSide = undefined;
        exchangeEditingIndex = undefined;
        exchangeEditingItemIndex = undefined;
    }
    else if(exchangeEditingIndex > index)
        exchangeEditingIndex--;

    syncExchangeTopEditorFields();
    saveExchangeRowsToLocalStorage();
    updateExchangeDisplay();
}

function getExchangeRatioText(haveItems, wantItems)
{
    return `${formatExchangeRatioSide(haveItems)}:${formatExchangeRatioSide(wantItems)}`;
}

function formatExchangeRatioSide(items)
{
    if(items.some(item => getIsInfiniteQuantity(item.quantity)))
        return INFINITY_QUANTITY;

    return formatTradeRatioNumber(items.reduce((total, item) => total + getTradeRatioQuantity(item), 0));
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

function getTradeRatioValues(offerItems, wantItems)
{
    const offerSetCount = getTradeSetCount(offerItems);
    const wantSetCount = getTradeSetCount(wantItems);
    const offerTotal = getTradeSideRatioTotal(offerItems);
    const wantTotal = getTradeSideRatioTotal(wantItems);

    if(wantSetCount > 0 && wantSetCount === getTradeSideQuantityTotal(wantItems))
        return [offerTotal / wantSetCount, 89];

    if(offerSetCount > 0 && offerSetCount === getTradeSideQuantityTotal(offerItems))
        return [89, wantTotal / offerSetCount];

    return [offerTotal, wantTotal];
}

function getTradeRatioText(offerItems, wantItems, shouldReduceRatio = false)
{
    let [offerRatio, wantRatio] = getTradeRatioValues(offerItems, wantItems);
    if(shouldReduceRatio)
        [offerRatio, wantRatio] = reduceTradeRatioValues(offerRatio, wantRatio);

    return `${formatTradeRatioNumber(offerRatio)}:${formatTradeRatioNumber(wantRatio)}`;
}

function reduceTradeRatioValues(offerRatio, wantRatio)
{
    if(!Number.isFinite(offerRatio) || !Number.isFinite(wantRatio) || offerRatio <= 0)
        return [offerRatio, wantRatio];

    return [1, wantRatio / offerRatio];
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
const localImageItemNames = new Set(customItemNames);
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
    normalItemsPlaceholder.prop("hidden", !!items.size || getIsInTradeLikeView());
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

        if(getIsInPriceCalculationMode() || !getIsInTradeLikeView())
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
    if(getIsInTradeLikeView())
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
    totalSelectedPriceArea.prop("hidden", getIsInTradeLikeView() || !getIsInPriceCalculationMode() || (!shouldShowEquation && !shouldShowMessage));
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
            itemInput.trigger("input");

            if(itemInput === priceCalculationItemInput)
                itemInput.trigger("change");

            if(!customParams || !customParams.usedKeyboard)

                $("*").one("mouseup.fuzzyMatchClick", (e) =>
                {
                    const quantityInput = getQuantityInputForAutocomplete(itemInput);
                    if(quantityInput?.length)
                        quantityInput.trigger("select");
                    else if(shouldFocusQuantityOnAutocomplete && itemInput === itemNameInput)
                        itemQuantityInput.trigger("select");
                    else
                        itemInput.trigger("focus");
                    e.stopPropagation();

                    $("*").off(".fuzzyMatchClick");
                });
            else
            {
                const quantityInput = getQuantityInputForAutocomplete(itemInput);
                if(quantityInput?.length)
                    quantityInput.trigger("select");
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
