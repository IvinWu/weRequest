/*! *****************************************************************************
Copyright (c) 2018 Tencent, Inc. All rights reserved. 

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
***************************************************************************** */

/// <reference path="./lib.wx.app.d.ts" />
/// <reference path="./lib.wx.page.d.ts" />
/// <reference path="./lib.wx.api.d.ts" />
/// <reference path="./lib.wx.cloud.d.ts" />

declare type IAnyObject = Record<string, any>;

declare type KVInfer<T> = { [K in keyof T]: T[K] };

declare type Void<T> = T | undefined | null;

type PartialOptional<T, K extends keyof T> = Partial<Pick<T, K>> &
  Pick<T, Exclude<keyof T, K>>;

/**
 * Make all properties in T required
 */
// type Required<T> = {
//   [P in keyof T]-?: T[P];
// };

/**
 * Exclude from T those types that are assignable to U
 */
// type Exclude<T, U> = T extends U ? never : T;

/**
 * Extract from T those types that are assignable to U
 */
// type Extract<T, U> = T extends U ? T : never;

/**
 * Exclude null and undefined from T
 */
// type NonNullable<T> = T extends null | undefined ? never : T;

/**
 * Obtain the return type of a function type
 */
// type ReturnType<T extends (...args: any[]) => any> = T extends (...args: any[]) => infer R ? R : any;

/**
 * Obtain the return type of a constructor function type
 */
// type InstanceType<T extends new (...args: any[]) => any> = T extends new (...args: any[]) => infer R ? R : any;

type Optional<T> = { [K in keyof T]+?: T[K] };

// 临时解决ts，后续小程序工具会更新
declare function Component(...args: any[]): any;
declare function requirePlugin(pluginName: string): any;
declare function require(pluginName: string): any;
type TODO = any;
