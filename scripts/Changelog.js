function setChangelogOverlayVisible(shouldShow)
{
    changelogOverlay.overlay.prop("hidden", !shouldShow);
    $("html, body").css("overflow-y", shouldShow ? "hidden" : "visible");
    screenshotRegion.css("margin-right", shouldShow ? "calc(100vw - 100%)" : "unset");
    if(shouldShow)
        renderLucideIcons();
}
