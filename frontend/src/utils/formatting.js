export function formatPriceValue(price) {
    if (price !== null && price !== undefined && !isNaN(price)) {
        return parseInt(String(price)).toLocaleString("de-DE", { useGrouping: true })
    }
    return "";
}


export const getFloorValue = (floor, t = (key) => key) => {
    if (floor === null || floor === undefined) {
        return t("propertyDetails.floorValue.na");
    } else if (floor < 0) {
        return t("propertyDetails.floorValue.basement");
    } else if (floor === 0) {
        return t("propertyDetails.floorValue.ground");
    } else {
        let suffixKey;
        if (floor === 1) {
            suffixKey = "propertyDetails.floorValue.first";
        } else if (floor === 2) {
            suffixKey = "propertyDetails.floorValue.second";
        } else if (floor === 3) {
            suffixKey = "propertyDetails.floorValue.third";
        } else {
            suffixKey = "propertyDetails.floorValue.th";
        }

        return (
            <>
                {floor}
                <sup>{t(suffixKey)}</sup>
            </>
        );
    }
};