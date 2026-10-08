// Composición de contenidos: explicación práctica y gama de accesorios Ajax.
export {technicalSources,serviceKnowledge} from './security-core.mjs';
import {homeKnowledge as practicalHome,ajaxKnowledge as practicalAjax} from './security-core.mjs';
import {ajaxRange} from './ajax-range.mjs';
export const homeKnowledge=()=>practicalHome()+ajaxRange();
export const ajaxKnowledge=()=>practicalAjax()+ajaxRange();
