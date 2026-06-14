let itemsPerRow = 8;
let tradeRowsPerRow = 2;
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
