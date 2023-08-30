import type { GetDynamicParamFromSegment } from '../../server/app-render/app-render';
import type { LoaderTree } from '../../server/lib/app-dir-module';
import React from 'react';
export declare function MetadataTree({ tree, pathname, searchParams, getDynamicParamFromSegment, appUsingSizeAdjust, errorType, }: {
    tree: LoaderTree;
    pathname: string;
    searchParams: {
        [key: string]: any;
    };
    getDynamicParamFromSegment: GetDynamicParamFromSegment;
    appUsingSizeAdjust: boolean;
    errorType?: 'not-found' | 'redirect';
}): Promise<React.JSX.Element>;
