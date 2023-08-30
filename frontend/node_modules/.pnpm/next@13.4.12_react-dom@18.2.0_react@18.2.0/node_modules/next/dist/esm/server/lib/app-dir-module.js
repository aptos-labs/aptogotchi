export async function getLayoutOrPageModule(loaderTree) {
    const { layout , page , defaultPage  } = loaderTree[2];
    const isLayout = typeof layout !== "undefined";
    const isPage = typeof page !== "undefined";
    const isDefaultPage = typeof defaultPage !== "undefined" && loaderTree[0] === "__DEFAULT__";
    let value = undefined;
    let modType = undefined;
    if (isLayout) {
        value = await layout[0]();
        modType = "layout";
    } else if (isPage) {
        value = await page[0]();
        modType = "page";
    } else if (isDefaultPage) {
        value = await defaultPage[0]();
        modType = "page";
    }
    return [
        value,
        modType
    ];
}
// First check not-found, if it doesn't exist then pick layout
export async function getErrorOrLayoutModule(loaderTree, errorType) {
    const { [errorType]: error , layout  } = loaderTree[2];
    if (typeof error !== "undefined") {
        return await error[0]();
    } else if (typeof layout !== "undefined") {
        return await layout[0]();
    }
    return undefined;
}

//# sourceMappingURL=app-dir-module.js.map