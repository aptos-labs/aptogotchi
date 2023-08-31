import React from "react";
import { AppleWebAppMeta, FormatDetectionMeta, ItunesMeta, BasicMetadata, VerificationMeta } from "./generate/basic";
import { AlternatesMetadata } from "./generate/alternate";
import { OpenGraphMetadata, TwitterMetadata, AppLinksMeta } from "./generate/opengraph";
import { IconsMetadata } from "./generate/icons";
import { accumulateMetadata, resolveMetadata } from "./resolve-metadata";
import { MetaFilter } from "./generate/meta";
import { createDefaultMetadata } from "./default-metadata";
// Generate the actual React elements from the resolved metadata.
export async function MetadataTree({ tree , pathname , searchParams , getDynamicParamFromSegment , appUsingSizeAdjust , errorType  }) {
    const metadataContext = {
        pathname
    };
    const resolvedMetadata = await resolveMetadata({
        tree,
        parentParams: {},
        metadataItems: [],
        searchParams,
        getDynamicParamFromSegment,
        errorConvention: errorType === "redirect" ? undefined : errorType
    });
    let metadata = undefined;
    const defaultMetadata = createDefaultMetadata();
    // Skip for redirect case as for the temporary redirect case we don't need the metadata on client
    if (errorType === "redirect") {
        metadata = defaultMetadata;
    } else {
        metadata = await accumulateMetadata(resolvedMetadata, metadataContext);
    }
    const elements = MetaFilter([
        BasicMetadata({
            metadata
        }),
        AlternatesMetadata({
            alternates: metadata.alternates
        }),
        ItunesMeta({
            itunes: metadata.itunes
        }),
        FormatDetectionMeta({
            formatDetection: metadata.formatDetection
        }),
        VerificationMeta({
            verification: metadata.verification
        }),
        AppleWebAppMeta({
            appleWebApp: metadata.appleWebApp
        }),
        OpenGraphMetadata({
            openGraph: metadata.openGraph
        }),
        TwitterMetadata({
            twitter: metadata.twitter
        }),
        AppLinksMeta({
            appLinks: metadata.appLinks
        }),
        IconsMetadata({
            icons: metadata.icons
        })
    ]);
    if (appUsingSizeAdjust) elements.push(/*#__PURE__*/ React.createElement("meta", {
        name: "next-size-adjust"
    }));
    return /*#__PURE__*/ React.createElement(React.Fragment, null, elements.map((el, index)=>{
        return /*#__PURE__*/ React.cloneElement(el, {
            key: index
        });
    }));
}

//# sourceMappingURL=metadata.js.map