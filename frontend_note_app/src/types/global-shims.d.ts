/**
 * Minimal ambient declarations for globals used in the browser to satisfy ESLint/TS
 * in environments where the linter may not inject DOM libs.
 */
declare const window: any;
declare const document: any;
declare const navigator: any;
declare const localStorage: any;
declare const crypto: any;
declare const process: any;
declare const importMeta: any;
