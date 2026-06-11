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
