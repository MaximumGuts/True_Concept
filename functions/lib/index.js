import { createRequire as __bannerCrReq } from 'node:module';
import __bannerPath from 'node:path';
import __bannerUrl from 'node:url';
globalThis.require = __bannerCrReq(import.meta.url);
globalThis.__filename = __bannerUrl.fileURLToPath(import.meta.url);
globalThis.__dirname = __bannerPath.dirname(globalThis.__filename);
var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/routes/auth.ts
import { onRequest } from "firebase-functions/v2/https";

// ../lib/db/dist/index.js
import { initializeApp, cert, getApps, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

// ../node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/external.js
var external_exports = {};
__export(external_exports, {
  BRAND: () => BRAND,
  DIRTY: () => DIRTY,
  EMPTY_PATH: () => EMPTY_PATH,
  INVALID: () => INVALID,
  NEVER: () => NEVER,
  OK: () => OK,
  ParseStatus: () => ParseStatus,
  Schema: () => ZodType,
  ZodAny: () => ZodAny,
  ZodArray: () => ZodArray,
  ZodBigInt: () => ZodBigInt,
  ZodBoolean: () => ZodBoolean,
  ZodBranded: () => ZodBranded,
  ZodCatch: () => ZodCatch,
  ZodDate: () => ZodDate,
  ZodDefault: () => ZodDefault,
  ZodDiscriminatedUnion: () => ZodDiscriminatedUnion,
  ZodEffects: () => ZodEffects,
  ZodEnum: () => ZodEnum,
  ZodError: () => ZodError,
  ZodFirstPartyTypeKind: () => ZodFirstPartyTypeKind,
  ZodFunction: () => ZodFunction,
  ZodIntersection: () => ZodIntersection,
  ZodIssueCode: () => ZodIssueCode,
  ZodLazy: () => ZodLazy,
  ZodLiteral: () => ZodLiteral,
  ZodMap: () => ZodMap,
  ZodNaN: () => ZodNaN,
  ZodNativeEnum: () => ZodNativeEnum,
  ZodNever: () => ZodNever,
  ZodNull: () => ZodNull,
  ZodNullable: () => ZodNullable,
  ZodNumber: () => ZodNumber,
  ZodObject: () => ZodObject,
  ZodOptional: () => ZodOptional,
  ZodParsedType: () => ZodParsedType,
  ZodPipeline: () => ZodPipeline,
  ZodPromise: () => ZodPromise,
  ZodReadonly: () => ZodReadonly,
  ZodRecord: () => ZodRecord,
  ZodSchema: () => ZodType,
  ZodSet: () => ZodSet,
  ZodString: () => ZodString,
  ZodSymbol: () => ZodSymbol,
  ZodTransformer: () => ZodEffects,
  ZodTuple: () => ZodTuple,
  ZodType: () => ZodType,
  ZodUndefined: () => ZodUndefined,
  ZodUnion: () => ZodUnion,
  ZodUnknown: () => ZodUnknown,
  ZodVoid: () => ZodVoid,
  addIssueToContext: () => addIssueToContext,
  any: () => anyType,
  array: () => arrayType,
  bigint: () => bigIntType,
  boolean: () => booleanType,
  coerce: () => coerce,
  custom: () => custom,
  date: () => dateType,
  datetimeRegex: () => datetimeRegex,
  defaultErrorMap: () => en_default,
  discriminatedUnion: () => discriminatedUnionType,
  effect: () => effectsType,
  enum: () => enumType,
  function: () => functionType,
  getErrorMap: () => getErrorMap,
  getParsedType: () => getParsedType,
  instanceof: () => instanceOfType,
  intersection: () => intersectionType,
  isAborted: () => isAborted,
  isAsync: () => isAsync,
  isDirty: () => isDirty,
  isValid: () => isValid,
  late: () => late,
  lazy: () => lazyType,
  literal: () => literalType,
  makeIssue: () => makeIssue,
  map: () => mapType,
  nan: () => nanType,
  nativeEnum: () => nativeEnumType,
  never: () => neverType,
  null: () => nullType,
  nullable: () => nullableType,
  number: () => numberType,
  object: () => objectType,
  objectUtil: () => objectUtil,
  oboolean: () => oboolean,
  onumber: () => onumber,
  optional: () => optionalType,
  ostring: () => ostring,
  pipeline: () => pipelineType,
  preprocess: () => preprocessType,
  promise: () => promiseType,
  quotelessJson: () => quotelessJson,
  record: () => recordType,
  set: () => setType,
  setErrorMap: () => setErrorMap,
  strictObject: () => strictObjectType,
  string: () => stringType,
  symbol: () => symbolType,
  transformer: () => effectsType,
  tuple: () => tupleType,
  undefined: () => undefinedType,
  union: () => unionType,
  unknown: () => unknownType,
  util: () => util,
  void: () => voidType
});

// ../node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/helpers/util.js
var util;
(function(util2) {
  util2.assertEqual = (_) => {
  };
  function assertIs(_arg) {
  }
  util2.assertIs = assertIs;
  function assertNever(_x) {
    throw new Error();
  }
  util2.assertNever = assertNever;
  util2.arrayToEnum = (items) => {
    const obj = {};
    for (const item of items) {
      obj[item] = item;
    }
    return obj;
  };
  util2.getValidEnumValues = (obj) => {
    const validKeys = util2.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
    const filtered = {};
    for (const k of validKeys) {
      filtered[k] = obj[k];
    }
    return util2.objectValues(filtered);
  };
  util2.objectValues = (obj) => {
    return util2.objectKeys(obj).map(function(e) {
      return obj[e];
    });
  };
  util2.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object) => {
    const keys = [];
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        keys.push(key);
      }
    }
    return keys;
  };
  util2.find = (arr, checker) => {
    for (const item of arr) {
      if (checker(item))
        return item;
    }
    return void 0;
  };
  util2.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && Number.isFinite(val) && Math.floor(val) === val;
  function joinValues(array, separator = " | ") {
    return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
  }
  util2.joinValues = joinValues;
  util2.jsonStringifyReplacer = (_, value) => {
    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  };
})(util || (util = {}));
var objectUtil;
(function(objectUtil2) {
  objectUtil2.mergeShapes = (first, second) => {
    return {
      ...first,
      ...second
      // second overwrites first
    };
  };
})(objectUtil || (objectUtil = {}));
var ZodParsedType = util.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]);
var getParsedType = (data) => {
  const t = typeof data;
  switch (t) {
    case "undefined":
      return ZodParsedType.undefined;
    case "string":
      return ZodParsedType.string;
    case "number":
      return Number.isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
    case "boolean":
      return ZodParsedType.boolean;
    case "function":
      return ZodParsedType.function;
    case "bigint":
      return ZodParsedType.bigint;
    case "symbol":
      return ZodParsedType.symbol;
    case "object":
      if (Array.isArray(data)) {
        return ZodParsedType.array;
      }
      if (data === null) {
        return ZodParsedType.null;
      }
      if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
        return ZodParsedType.promise;
      }
      if (typeof Map !== "undefined" && data instanceof Map) {
        return ZodParsedType.map;
      }
      if (typeof Set !== "undefined" && data instanceof Set) {
        return ZodParsedType.set;
      }
      if (typeof Date !== "undefined" && data instanceof Date) {
        return ZodParsedType.date;
      }
      return ZodParsedType.object;
    default:
      return ZodParsedType.unknown;
  }
};

// ../node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/ZodError.js
var ZodIssueCode = util.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]);
var quotelessJson = (obj) => {
  const json = JSON.stringify(obj, null, 2);
  return json.replace(/"([^"]+)":/g, "$1:");
};
var ZodError = class _ZodError extends Error {
  get errors() {
    return this.issues;
  }
  constructor(issues) {
    super();
    this.issues = [];
    this.addIssue = (sub) => {
      this.issues = [...this.issues, sub];
    };
    this.addIssues = (subs = []) => {
      this.issues = [...this.issues, ...subs];
    };
    const actualProto = new.target.prototype;
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      this.__proto__ = actualProto;
    }
    this.name = "ZodError";
    this.issues = issues;
  }
  format(_mapper) {
    const mapper = _mapper || function(issue) {
      return issue.message;
    };
    const fieldErrors = { _errors: [] };
    const processError = (error) => {
      for (const issue of error.issues) {
        if (issue.code === "invalid_union") {
          issue.unionErrors.map(processError);
        } else if (issue.code === "invalid_return_type") {
          processError(issue.returnTypeError);
        } else if (issue.code === "invalid_arguments") {
          processError(issue.argumentsError);
        } else if (issue.path.length === 0) {
          fieldErrors._errors.push(mapper(issue));
        } else {
          let curr = fieldErrors;
          let i = 0;
          while (i < issue.path.length) {
            const el = issue.path[i];
            const terminal = i === issue.path.length - 1;
            if (!terminal) {
              curr[el] = curr[el] || { _errors: [] };
            } else {
              curr[el] = curr[el] || { _errors: [] };
              curr[el]._errors.push(mapper(issue));
            }
            curr = curr[el];
            i++;
          }
        }
      }
    };
    processError(this);
    return fieldErrors;
  }
  static assert(value) {
    if (!(value instanceof _ZodError)) {
      throw new Error(`Not a ZodError: ${value}`);
    }
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(mapper = (issue) => issue.message) {
    const fieldErrors = {};
    const formErrors = [];
    for (const sub of this.issues) {
      if (sub.path.length > 0) {
        const firstEl = sub.path[0];
        fieldErrors[firstEl] = fieldErrors[firstEl] || [];
        fieldErrors[firstEl].push(mapper(sub));
      } else {
        formErrors.push(mapper(sub));
      }
    }
    return { formErrors, fieldErrors };
  }
  get formErrors() {
    return this.flatten();
  }
};
ZodError.create = (issues) => {
  const error = new ZodError(issues);
  return error;
};

// ../node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/locales/en.js
var errorMap = (issue, _ctx) => {
  let message;
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined) {
        message = "Required";
      } else {
        message = `Expected ${issue.expected}, received ${issue.received}`;
      }
      break;
    case ZodIssueCode.invalid_literal:
      message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
      break;
    case ZodIssueCode.unrecognized_keys:
      message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
      break;
    case ZodIssueCode.invalid_union:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_union_discriminator:
      message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
      break;
    case ZodIssueCode.invalid_enum_value:
      message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
      break;
    case ZodIssueCode.invalid_arguments:
      message = `Invalid function arguments`;
      break;
    case ZodIssueCode.invalid_return_type:
      message = `Invalid function return type`;
      break;
    case ZodIssueCode.invalid_date:
      message = `Invalid date`;
      break;
    case ZodIssueCode.invalid_string:
      if (typeof issue.validation === "object") {
        if ("includes" in issue.validation) {
          message = `Invalid input: must include "${issue.validation.includes}"`;
          if (typeof issue.validation.position === "number") {
            message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
          }
        } else if ("startsWith" in issue.validation) {
          message = `Invalid input: must start with "${issue.validation.startsWith}"`;
        } else if ("endsWith" in issue.validation) {
          message = `Invalid input: must end with "${issue.validation.endsWith}"`;
        } else {
          util.assertNever(issue.validation);
        }
      } else if (issue.validation !== "regex") {
        message = `Invalid ${issue.validation}`;
      } else {
        message = "Invalid";
      }
      break;
    case ZodIssueCode.too_small:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "bigint")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.too_big:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "bigint")
        message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.custom:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_intersection_types:
      message = `Intersection results could not be merged`;
      break;
    case ZodIssueCode.not_multiple_of:
      message = `Number must be a multiple of ${issue.multipleOf}`;
      break;
    case ZodIssueCode.not_finite:
      message = "Number must be finite";
      break;
    default:
      message = _ctx.defaultError;
      util.assertNever(issue);
  }
  return { message };
};
var en_default = errorMap;

// ../node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/errors.js
var overrideErrorMap = en_default;
function setErrorMap(map) {
  overrideErrorMap = map;
}
function getErrorMap() {
  return overrideErrorMap;
}

// ../node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/helpers/parseUtil.js
var makeIssue = (params) => {
  const { data, path, errorMaps, issueData } = params;
  const fullPath = [...path, ...issueData.path || []];
  const fullIssue = {
    ...issueData,
    path: fullPath
  };
  if (issueData.message !== void 0) {
    return {
      ...issueData,
      path: fullPath,
      message: issueData.message
    };
  }
  let errorMessage = "";
  const maps = errorMaps.filter((m) => !!m).slice().reverse();
  for (const map of maps) {
    errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
  }
  return {
    ...issueData,
    path: fullPath,
    message: errorMessage
  };
};
var EMPTY_PATH = [];
function addIssueToContext(ctx, issueData) {
  const overrideMap = getErrorMap();
  const issue = makeIssue({
    issueData,
    data: ctx.data,
    path: ctx.path,
    errorMaps: [
      ctx.common.contextualErrorMap,
      // contextual error map is first priority
      ctx.schemaErrorMap,
      // then schema-bound map if available
      overrideMap,
      // then global override map
      overrideMap === en_default ? void 0 : en_default
      // then global default map
    ].filter((x) => !!x)
  });
  ctx.common.issues.push(issue);
}
var ParseStatus = class _ParseStatus {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    if (this.value === "valid")
      this.value = "dirty";
  }
  abort() {
    if (this.value !== "aborted")
      this.value = "aborted";
  }
  static mergeArray(status, results) {
    const arrayValue = [];
    for (const s of results) {
      if (s.status === "aborted")
        return INVALID;
      if (s.status === "dirty")
        status.dirty();
      arrayValue.push(s.value);
    }
    return { status: status.value, value: arrayValue };
  }
  static async mergeObjectAsync(status, pairs) {
    const syncPairs = [];
    for (const pair of pairs) {
      const key = await pair.key;
      const value = await pair.value;
      syncPairs.push({
        key,
        value
      });
    }
    return _ParseStatus.mergeObjectSync(status, syncPairs);
  }
  static mergeObjectSync(status, pairs) {
    const finalObject = {};
    for (const pair of pairs) {
      const { key, value } = pair;
      if (key.status === "aborted")
        return INVALID;
      if (value.status === "aborted")
        return INVALID;
      if (key.status === "dirty")
        status.dirty();
      if (value.status === "dirty")
        status.dirty();
      if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
        finalObject[key.value] = value.value;
      }
    }
    return { status: status.value, value: finalObject };
  }
};
var INVALID = Object.freeze({
  status: "aborted"
});
var DIRTY = (value) => ({ status: "dirty", value });
var OK = (value) => ({ status: "valid", value });
var isAborted = (x) => x.status === "aborted";
var isDirty = (x) => x.status === "dirty";
var isValid = (x) => x.status === "valid";
var isAsync = (x) => typeof Promise !== "undefined" && x instanceof Promise;

// ../node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/helpers/errorUtil.js
var errorUtil;
(function(errorUtil2) {
  errorUtil2.errToObj = (message) => typeof message === "string" ? { message } : message || {};
  errorUtil2.toString = (message) => typeof message === "string" ? message : message?.message;
})(errorUtil || (errorUtil = {}));

// ../node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/types.js
var ParseInputLazyPath = class {
  constructor(parent, value, path, key) {
    this._cachedPath = [];
    this.parent = parent;
    this.data = value;
    this._path = path;
    this._key = key;
  }
  get path() {
    if (!this._cachedPath.length) {
      if (Array.isArray(this._key)) {
        this._cachedPath.push(...this._path, ...this._key);
      } else {
        this._cachedPath.push(...this._path, this._key);
      }
    }
    return this._cachedPath;
  }
};
var handleResult = (ctx, result) => {
  if (isValid(result)) {
    return { success: true, data: result.value };
  } else {
    if (!ctx.common.issues.length) {
      throw new Error("Validation failed but no issues detected.");
    }
    return {
      success: false,
      get error() {
        if (this._error)
          return this._error;
        const error = new ZodError(ctx.common.issues);
        this._error = error;
        return this._error;
      }
    };
  }
};
function processCreateParams(params) {
  if (!params)
    return {};
  const { errorMap: errorMap2, invalid_type_error, required_error, description } = params;
  if (errorMap2 && (invalid_type_error || required_error)) {
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  }
  if (errorMap2)
    return { errorMap: errorMap2, description };
  const customMap = (iss, ctx) => {
    const { message } = params;
    if (iss.code === "invalid_enum_value") {
      return { message: message ?? ctx.defaultError };
    }
    if (typeof ctx.data === "undefined") {
      return { message: message ?? required_error ?? ctx.defaultError };
    }
    if (iss.code !== "invalid_type")
      return { message: ctx.defaultError };
    return { message: message ?? invalid_type_error ?? ctx.defaultError };
  };
  return { errorMap: customMap, description };
}
var ZodType = class {
  get description() {
    return this._def.description;
  }
  _getType(input) {
    return getParsedType(input.data);
  }
  _getOrReturnCtx(input, ctx) {
    return ctx || {
      common: input.parent.common,
      data: input.data,
      parsedType: getParsedType(input.data),
      schemaErrorMap: this._def.errorMap,
      path: input.path,
      parent: input.parent
    };
  }
  _processInputParams(input) {
    return {
      status: new ParseStatus(),
      ctx: {
        common: input.parent.common,
        data: input.data,
        parsedType: getParsedType(input.data),
        schemaErrorMap: this._def.errorMap,
        path: input.path,
        parent: input.parent
      }
    };
  }
  _parseSync(input) {
    const result = this._parse(input);
    if (isAsync(result)) {
      throw new Error("Synchronous parse encountered promise.");
    }
    return result;
  }
  _parseAsync(input) {
    const result = this._parse(input);
    return Promise.resolve(result);
  }
  parse(data, params) {
    const result = this.safeParse(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  safeParse(data, params) {
    const ctx = {
      common: {
        issues: [],
        async: params?.async ?? false,
        contextualErrorMap: params?.errorMap
      },
      path: params?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const result = this._parseSync({ data, path: ctx.path, parent: ctx });
    return handleResult(ctx, result);
  }
  "~validate"(data) {
    const ctx = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    if (!this["~standard"].async) {
      try {
        const result = this._parseSync({ data, path: [], parent: ctx });
        return isValid(result) ? {
          value: result.value
        } : {
          issues: ctx.common.issues
        };
      } catch (err) {
        if (err?.message?.toLowerCase()?.includes("encountered")) {
          this["~standard"].async = true;
        }
        ctx.common = {
          issues: [],
          async: true
        };
      }
    }
    return this._parseAsync({ data, path: [], parent: ctx }).then((result) => isValid(result) ? {
      value: result.value
    } : {
      issues: ctx.common.issues
    });
  }
  async parseAsync(data, params) {
    const result = await this.safeParseAsync(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  async safeParseAsync(data, params) {
    const ctx = {
      common: {
        issues: [],
        contextualErrorMap: params?.errorMap,
        async: true
      },
      path: params?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
    const result = await (isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
    return handleResult(ctx, result);
  }
  refine(check, message) {
    const getIssueProperties = (val) => {
      if (typeof message === "string" || typeof message === "undefined") {
        return { message };
      } else if (typeof message === "function") {
        return message(val);
      } else {
        return message;
      }
    };
    return this._refinement((val, ctx) => {
      const result = check(val);
      const setError = () => ctx.addIssue({
        code: ZodIssueCode.custom,
        ...getIssueProperties(val)
      });
      if (typeof Promise !== "undefined" && result instanceof Promise) {
        return result.then((data) => {
          if (!data) {
            setError();
            return false;
          } else {
            return true;
          }
        });
      }
      if (!result) {
        setError();
        return false;
      } else {
        return true;
      }
    });
  }
  refinement(check, refinementData) {
    return this._refinement((val, ctx) => {
      if (!check(val)) {
        ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
        return false;
      } else {
        return true;
      }
    });
  }
  _refinement(refinement) {
    return new ZodEffects({
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "refinement", refinement }
    });
  }
  superRefine(refinement) {
    return this._refinement(refinement);
  }
  constructor(def) {
    this.spa = this.safeParseAsync;
    this._def = def;
    this.parse = this.parse.bind(this);
    this.safeParse = this.safeParse.bind(this);
    this.parseAsync = this.parseAsync.bind(this);
    this.safeParseAsync = this.safeParseAsync.bind(this);
    this.spa = this.spa.bind(this);
    this.refine = this.refine.bind(this);
    this.refinement = this.refinement.bind(this);
    this.superRefine = this.superRefine.bind(this);
    this.optional = this.optional.bind(this);
    this.nullable = this.nullable.bind(this);
    this.nullish = this.nullish.bind(this);
    this.array = this.array.bind(this);
    this.promise = this.promise.bind(this);
    this.or = this.or.bind(this);
    this.and = this.and.bind(this);
    this.transform = this.transform.bind(this);
    this.brand = this.brand.bind(this);
    this.default = this.default.bind(this);
    this.catch = this.catch.bind(this);
    this.describe = this.describe.bind(this);
    this.pipe = this.pipe.bind(this);
    this.readonly = this.readonly.bind(this);
    this.isNullable = this.isNullable.bind(this);
    this.isOptional = this.isOptional.bind(this);
    this["~standard"] = {
      version: 1,
      vendor: "zod",
      validate: (data) => this["~validate"](data)
    };
  }
  optional() {
    return ZodOptional.create(this, this._def);
  }
  nullable() {
    return ZodNullable.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return ZodArray.create(this);
  }
  promise() {
    return ZodPromise.create(this, this._def);
  }
  or(option) {
    return ZodUnion.create([this, option], this._def);
  }
  and(incoming) {
    return ZodIntersection.create(this, incoming, this._def);
  }
  transform(transform) {
    return new ZodEffects({
      ...processCreateParams(this._def),
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "transform", transform }
    });
  }
  default(def) {
    const defaultValueFunc = typeof def === "function" ? def : () => def;
    return new ZodDefault({
      ...processCreateParams(this._def),
      innerType: this,
      defaultValue: defaultValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodDefault
    });
  }
  brand() {
    return new ZodBranded({
      typeName: ZodFirstPartyTypeKind.ZodBranded,
      type: this,
      ...processCreateParams(this._def)
    });
  }
  catch(def) {
    const catchValueFunc = typeof def === "function" ? def : () => def;
    return new ZodCatch({
      ...processCreateParams(this._def),
      innerType: this,
      catchValue: catchValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodCatch
    });
  }
  describe(description) {
    const This = this.constructor;
    return new This({
      ...this._def,
      description
    });
  }
  pipe(target) {
    return ZodPipeline.create(this, target);
  }
  readonly() {
    return ZodReadonly.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
};
var cuidRegex = /^c[^\s-]{8,}$/i;
var cuid2Regex = /^[0-9a-z]+$/;
var ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
var uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
var nanoidRegex = /^[a-z0-9_-]{21}$/i;
var jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
var durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
var emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
var _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
var emojiRegex;
var ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
var ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
var ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
var base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
var base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
var dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
var dateRegex = new RegExp(`^${dateRegexSource}$`);
function timeRegexSource(args) {
  let secondsRegexSource = `[0-5]\\d`;
  if (args.precision) {
    secondsRegexSource = `${secondsRegexSource}\\.\\d{${args.precision}}`;
  } else if (args.precision == null) {
    secondsRegexSource = `${secondsRegexSource}(\\.\\d+)?`;
  }
  const secondsQuantifier = args.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${secondsRegexSource})${secondsQuantifier}`;
}
function timeRegex(args) {
  return new RegExp(`^${timeRegexSource(args)}$`);
}
function datetimeRegex(args) {
  let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
  const opts = [];
  opts.push(args.local ? `Z?` : `Z`);
  if (args.offset)
    opts.push(`([+-]\\d{2}:?\\d{2})`);
  regex = `${regex}(${opts.join("|")})`;
  return new RegExp(`^${regex}$`);
}
function isValidIP(ip, version) {
  if ((version === "v4" || !version) && ipv4Regex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6Regex.test(ip)) {
    return true;
  }
  return false;
}
function isValidJWT(jwt2, alg) {
  if (!jwtRegex.test(jwt2))
    return false;
  try {
    const [header] = jwt2.split(".");
    if (!header)
      return false;
    const base64 = header.replace(/-/g, "+").replace(/_/g, "/").padEnd(header.length + (4 - header.length % 4) % 4, "=");
    const decoded = JSON.parse(atob(base64));
    if (typeof decoded !== "object" || decoded === null)
      return false;
    if ("typ" in decoded && decoded?.typ !== "JWT")
      return false;
    if (!decoded.alg)
      return false;
    if (alg && decoded.alg !== alg)
      return false;
    return true;
  } catch {
    return false;
  }
}
function isValidCidr(ip, version) {
  if ((version === "v4" || !version) && ipv4CidrRegex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6CidrRegex.test(ip)) {
    return true;
  }
  return false;
}
var ZodString = class _ZodString extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = String(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.string) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.length < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.length > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "length") {
        const tooBig = input.data.length > check.value;
        const tooSmall = input.data.length < check.value;
        if (tooBig || tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          if (tooBig) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          } else if (tooSmall) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          }
          status.dirty();
        }
      } else if (check.kind === "email") {
        if (!emailRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "email",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "emoji") {
        if (!emojiRegex) {
          emojiRegex = new RegExp(_emojiRegex, "u");
        }
        if (!emojiRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "emoji",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "uuid") {
        if (!uuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "uuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "nanoid") {
        if (!nanoidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "nanoid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid") {
        if (!cuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid2") {
        if (!cuid2Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid2",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ulid") {
        if (!ulidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ulid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "url") {
        try {
          new URL(input.data);
        } catch {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "regex") {
        check.regex.lastIndex = 0;
        const testResult = check.regex.test(input.data);
        if (!testResult) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "regex",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "trim") {
        input.data = input.data.trim();
      } else if (check.kind === "includes") {
        if (!input.data.includes(check.value, check.position)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { includes: check.value, position: check.position },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "toLowerCase") {
        input.data = input.data.toLowerCase();
      } else if (check.kind === "toUpperCase") {
        input.data = input.data.toUpperCase();
      } else if (check.kind === "startsWith") {
        if (!input.data.startsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { startsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "endsWith") {
        if (!input.data.endsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { endsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "datetime") {
        const regex = datetimeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "datetime",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "date") {
        const regex = dateRegex;
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "date",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "time") {
        const regex = timeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "time",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "duration") {
        if (!durationRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "duration",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ip") {
        if (!isValidIP(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ip",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "jwt") {
        if (!isValidJWT(input.data, check.alg)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "jwt",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cidr") {
        if (!isValidCidr(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cidr",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64") {
        if (!base64Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64url") {
        if (!base64urlRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _regex(regex, validation, message) {
    return this.refinement((data) => regex.test(data), {
      validation,
      code: ZodIssueCode.invalid_string,
      ...errorUtil.errToObj(message)
    });
  }
  _addCheck(check) {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  email(message) {
    return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) });
  }
  url(message) {
    return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) });
  }
  emoji(message) {
    return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message) });
  }
  uuid(message) {
    return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) });
  }
  nanoid(message) {
    return this._addCheck({ kind: "nanoid", ...errorUtil.errToObj(message) });
  }
  cuid(message) {
    return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) });
  }
  cuid2(message) {
    return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) });
  }
  ulid(message) {
    return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message) });
  }
  base64(message) {
    return this._addCheck({ kind: "base64", ...errorUtil.errToObj(message) });
  }
  base64url(message) {
    return this._addCheck({
      kind: "base64url",
      ...errorUtil.errToObj(message)
    });
  }
  jwt(options) {
    return this._addCheck({ kind: "jwt", ...errorUtil.errToObj(options) });
  }
  ip(options) {
    return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options) });
  }
  cidr(options) {
    return this._addCheck({ kind: "cidr", ...errorUtil.errToObj(options) });
  }
  datetime(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "datetime",
        precision: null,
        offset: false,
        local: false,
        message: options
      });
    }
    return this._addCheck({
      kind: "datetime",
      precision: typeof options?.precision === "undefined" ? null : options?.precision,
      offset: options?.offset ?? false,
      local: options?.local ?? false,
      ...errorUtil.errToObj(options?.message)
    });
  }
  date(message) {
    return this._addCheck({ kind: "date", message });
  }
  time(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "time",
        precision: null,
        message: options
      });
    }
    return this._addCheck({
      kind: "time",
      precision: typeof options?.precision === "undefined" ? null : options?.precision,
      ...errorUtil.errToObj(options?.message)
    });
  }
  duration(message) {
    return this._addCheck({ kind: "duration", ...errorUtil.errToObj(message) });
  }
  regex(regex, message) {
    return this._addCheck({
      kind: "regex",
      regex,
      ...errorUtil.errToObj(message)
    });
  }
  includes(value, options) {
    return this._addCheck({
      kind: "includes",
      value,
      position: options?.position,
      ...errorUtil.errToObj(options?.message)
    });
  }
  startsWith(value, message) {
    return this._addCheck({
      kind: "startsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  endsWith(value, message) {
    return this._addCheck({
      kind: "endsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  min(minLength, message) {
    return this._addCheck({
      kind: "min",
      value: minLength,
      ...errorUtil.errToObj(message)
    });
  }
  max(maxLength, message) {
    return this._addCheck({
      kind: "max",
      value: maxLength,
      ...errorUtil.errToObj(message)
    });
  }
  length(len, message) {
    return this._addCheck({
      kind: "length",
      value: len,
      ...errorUtil.errToObj(message)
    });
  }
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(message) {
    return this.min(1, errorUtil.errToObj(message));
  }
  trim() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((ch) => ch.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((ch) => ch.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((ch) => ch.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((ch) => ch.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((ch) => ch.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((ch) => ch.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((ch) => ch.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((ch) => ch.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((ch) => ch.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((ch) => ch.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((ch) => ch.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((ch) => ch.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((ch) => ch.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((ch) => ch.kind === "base64url");
  }
  get minLength() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxLength() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
ZodString.create = (params) => {
  return new ZodString({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodString,
    coerce: params?.coerce ?? false,
    ...processCreateParams(params)
  });
};
function floatSafeRemainder(val, step) {
  const valDecCount = (val.toString().split(".")[1] || "").length;
  const stepDecCount = (step.toString().split(".")[1] || "").length;
  const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  const valInt = Number.parseInt(val.toFixed(decCount).replace(".", ""));
  const stepInt = Number.parseInt(step.toFixed(decCount).replace(".", ""));
  return valInt % stepInt / 10 ** decCount;
}
var ZodNumber = class _ZodNumber extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
    this.step = this.multipleOf;
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = Number(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.number) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.number,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "int") {
        if (!util.isInteger(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: "integer",
            received: "float",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (floatSafeRemainder(input.data, check.value) !== 0) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_finite,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new _ZodNumber({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new _ZodNumber({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  int(message) {
    return this._addCheck({
      kind: "int",
      message: errorUtil.toString(message)
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  finite(message) {
    return this._addCheck({
      kind: "finite",
      message: errorUtil.toString(message)
    });
  }
  safe(message) {
    return this._addCheck({
      kind: "min",
      inclusive: true,
      value: Number.MIN_SAFE_INTEGER,
      message: errorUtil.toString(message)
    })._addCheck({
      kind: "max",
      inclusive: true,
      value: Number.MAX_SAFE_INTEGER,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
  get isInt() {
    return !!this._def.checks.find((ch) => ch.kind === "int" || ch.kind === "multipleOf" && util.isInteger(ch.value));
  }
  get isFinite() {
    let max = null;
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
        return true;
      } else if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      } else if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return Number.isFinite(min) && Number.isFinite(max);
  }
};
ZodNumber.create = (params) => {
  return new ZodNumber({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodNumber,
    coerce: params?.coerce || false,
    ...processCreateParams(params)
  });
};
var ZodBigInt = class _ZodBigInt extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
  }
  _parse(input) {
    if (this._def.coerce) {
      try {
        input.data = BigInt(input.data);
      } catch {
        return this._getInvalidInput(input);
      }
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.bigint) {
      return this._getInvalidInput(input);
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            type: "bigint",
            minimum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            type: "bigint",
            maximum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (input.data % check.value !== BigInt(0)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _getInvalidInput(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.bigint,
      received: ctx.parsedType
    });
    return INVALID;
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new _ZodBigInt({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new _ZodBigInt({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
ZodBigInt.create = (params) => {
  return new ZodBigInt({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodBigInt,
    coerce: params?.coerce ?? false,
    ...processCreateParams(params)
  });
};
var ZodBoolean = class extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = Boolean(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.boolean) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.boolean,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodBoolean.create = (params) => {
  return new ZodBoolean({
    typeName: ZodFirstPartyTypeKind.ZodBoolean,
    coerce: params?.coerce || false,
    ...processCreateParams(params)
  });
};
var ZodDate = class _ZodDate extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = new Date(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.date) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.date,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    if (Number.isNaN(input.data.getTime())) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_date
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.getTime() < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            message: check.message,
            inclusive: true,
            exact: false,
            minimum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.getTime() > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            message: check.message,
            inclusive: true,
            exact: false,
            maximum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return {
      status: status.value,
      value: new Date(input.data.getTime())
    };
  }
  _addCheck(check) {
    return new _ZodDate({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  min(minDate, message) {
    return this._addCheck({
      kind: "min",
      value: minDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  max(maxDate, message) {
    return this._addCheck({
      kind: "max",
      value: maxDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  get minDate() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min != null ? new Date(min) : null;
  }
  get maxDate() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max != null ? new Date(max) : null;
  }
};
ZodDate.create = (params) => {
  return new ZodDate({
    checks: [],
    coerce: params?.coerce || false,
    typeName: ZodFirstPartyTypeKind.ZodDate,
    ...processCreateParams(params)
  });
};
var ZodSymbol = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.symbol) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.symbol,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodSymbol.create = (params) => {
  return new ZodSymbol({
    typeName: ZodFirstPartyTypeKind.ZodSymbol,
    ...processCreateParams(params)
  });
};
var ZodUndefined = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.undefined,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodUndefined.create = (params) => {
  return new ZodUndefined({
    typeName: ZodFirstPartyTypeKind.ZodUndefined,
    ...processCreateParams(params)
  });
};
var ZodNull = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.null) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.null,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodNull.create = (params) => {
  return new ZodNull({
    typeName: ZodFirstPartyTypeKind.ZodNull,
    ...processCreateParams(params)
  });
};
var ZodAny = class extends ZodType {
  constructor() {
    super(...arguments);
    this._any = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
ZodAny.create = (params) => {
  return new ZodAny({
    typeName: ZodFirstPartyTypeKind.ZodAny,
    ...processCreateParams(params)
  });
};
var ZodUnknown = class extends ZodType {
  constructor() {
    super(...arguments);
    this._unknown = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
ZodUnknown.create = (params) => {
  return new ZodUnknown({
    typeName: ZodFirstPartyTypeKind.ZodUnknown,
    ...processCreateParams(params)
  });
};
var ZodNever = class extends ZodType {
  _parse(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.never,
      received: ctx.parsedType
    });
    return INVALID;
  }
};
ZodNever.create = (params) => {
  return new ZodNever({
    typeName: ZodFirstPartyTypeKind.ZodNever,
    ...processCreateParams(params)
  });
};
var ZodVoid = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.void,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodVoid.create = (params) => {
  return new ZodVoid({
    typeName: ZodFirstPartyTypeKind.ZodVoid,
    ...processCreateParams(params)
  });
};
var ZodArray = class _ZodArray extends ZodType {
  _parse(input) {
    const { ctx, status } = this._processInputParams(input);
    const def = this._def;
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (def.exactLength !== null) {
      const tooBig = ctx.data.length > def.exactLength.value;
      const tooSmall = ctx.data.length < def.exactLength.value;
      if (tooBig || tooSmall) {
        addIssueToContext(ctx, {
          code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
          minimum: tooSmall ? def.exactLength.value : void 0,
          maximum: tooBig ? def.exactLength.value : void 0,
          type: "array",
          inclusive: true,
          exact: true,
          message: def.exactLength.message
        });
        status.dirty();
      }
    }
    if (def.minLength !== null) {
      if (ctx.data.length < def.minLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.minLength.message
        });
        status.dirty();
      }
    }
    if (def.maxLength !== null) {
      if (ctx.data.length > def.maxLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.maxLength.message
        });
        status.dirty();
      }
    }
    if (ctx.common.async) {
      return Promise.all([...ctx.data].map((item, i) => {
        return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
      })).then((result2) => {
        return ParseStatus.mergeArray(status, result2);
      });
    }
    const result = [...ctx.data].map((item, i) => {
      return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
    });
    return ParseStatus.mergeArray(status, result);
  }
  get element() {
    return this._def.type;
  }
  min(minLength, message) {
    return new _ZodArray({
      ...this._def,
      minLength: { value: minLength, message: errorUtil.toString(message) }
    });
  }
  max(maxLength, message) {
    return new _ZodArray({
      ...this._def,
      maxLength: { value: maxLength, message: errorUtil.toString(message) }
    });
  }
  length(len, message) {
    return new _ZodArray({
      ...this._def,
      exactLength: { value: len, message: errorUtil.toString(message) }
    });
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
ZodArray.create = (schema, params) => {
  return new ZodArray({
    type: schema,
    minLength: null,
    maxLength: null,
    exactLength: null,
    typeName: ZodFirstPartyTypeKind.ZodArray,
    ...processCreateParams(params)
  });
};
function deepPartialify(schema) {
  if (schema instanceof ZodObject) {
    const newShape = {};
    for (const key in schema.shape) {
      const fieldSchema = schema.shape[key];
      newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
    }
    return new ZodObject({
      ...schema._def,
      shape: () => newShape
    });
  } else if (schema instanceof ZodArray) {
    return new ZodArray({
      ...schema._def,
      type: deepPartialify(schema.element)
    });
  } else if (schema instanceof ZodOptional) {
    return ZodOptional.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodNullable) {
    return ZodNullable.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodTuple) {
    return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
  } else {
    return schema;
  }
}
var ZodObject = class _ZodObject extends ZodType {
  constructor() {
    super(...arguments);
    this._cached = null;
    this.nonstrict = this.passthrough;
    this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const shape = this._def.shape();
    const keys = util.objectKeys(shape);
    this._cached = { shape, keys };
    return this._cached;
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.object) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const { status, ctx } = this._processInputParams(input);
    const { shape, keys: shapeKeys } = this._getCached();
    const extraKeys = [];
    if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
      for (const key in ctx.data) {
        if (!shapeKeys.includes(key)) {
          extraKeys.push(key);
        }
      }
    }
    const pairs = [];
    for (const key of shapeKeys) {
      const keyValidator = shape[key];
      const value = ctx.data[key];
      pairs.push({
        key: { status: "valid", value: key },
        value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (this._def.catchall instanceof ZodNever) {
      const unknownKeys = this._def.unknownKeys;
      if (unknownKeys === "passthrough") {
        for (const key of extraKeys) {
          pairs.push({
            key: { status: "valid", value: key },
            value: { status: "valid", value: ctx.data[key] }
          });
        }
      } else if (unknownKeys === "strict") {
        if (extraKeys.length > 0) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.unrecognized_keys,
            keys: extraKeys
          });
          status.dirty();
        }
      } else if (unknownKeys === "strip") {
      } else {
        throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
      }
    } else {
      const catchall = this._def.catchall;
      for (const key of extraKeys) {
        const value = ctx.data[key];
        pairs.push({
          key: { status: "valid", value: key },
          value: catchall._parse(
            new ParseInputLazyPath(ctx, value, ctx.path, key)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: key in ctx.data
        });
      }
    }
    if (ctx.common.async) {
      return Promise.resolve().then(async () => {
        const syncPairs = [];
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          syncPairs.push({
            key,
            value,
            alwaysSet: pair.alwaysSet
          });
        }
        return syncPairs;
      }).then((syncPairs) => {
        return ParseStatus.mergeObjectSync(status, syncPairs);
      });
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get shape() {
    return this._def.shape();
  }
  strict(message) {
    errorUtil.errToObj;
    return new _ZodObject({
      ...this._def,
      unknownKeys: "strict",
      ...message !== void 0 ? {
        errorMap: (issue, ctx) => {
          const defaultError = this._def.errorMap?.(issue, ctx).message ?? ctx.defaultError;
          if (issue.code === "unrecognized_keys")
            return {
              message: errorUtil.errToObj(message).message ?? defaultError
            };
          return {
            message: defaultError
          };
        }
      } : {}
    });
  }
  strip() {
    return new _ZodObject({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new _ZodObject({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(augmentation) {
    return new _ZodObject({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...augmentation
      })
    });
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(merging) {
    const merged = new _ZodObject({
      unknownKeys: merging._def.unknownKeys,
      catchall: merging._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...merging._def.shape()
      }),
      typeName: ZodFirstPartyTypeKind.ZodObject
    });
    return merged;
  }
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(key, schema) {
    return this.augment({ [key]: schema });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(index) {
    return new _ZodObject({
      ...this._def,
      catchall: index
    });
  }
  pick(mask) {
    const shape = {};
    for (const key of util.objectKeys(mask)) {
      if (mask[key] && this.shape[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  omit(mask) {
    const shape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (!mask[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return deepPartialify(this);
  }
  partial(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      const fieldSchema = this.shape[key];
      if (mask && !mask[key]) {
        newShape[key] = fieldSchema;
      } else {
        newShape[key] = fieldSchema.optional();
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  required(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (mask && !mask[key]) {
        newShape[key] = this.shape[key];
      } else {
        const fieldSchema = this.shape[key];
        let newField = fieldSchema;
        while (newField instanceof ZodOptional) {
          newField = newField._def.innerType;
        }
        newShape[key] = newField;
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  keyof() {
    return createZodEnum(util.objectKeys(this.shape));
  }
};
ZodObject.create = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.strictCreate = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strict",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.lazycreate = (shape, params) => {
  return new ZodObject({
    shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
var ZodUnion = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const options = this._def.options;
    function handleResults(results) {
      for (const result of results) {
        if (result.result.status === "valid") {
          return result.result;
        }
      }
      for (const result of results) {
        if (result.result.status === "dirty") {
          ctx.common.issues.push(...result.ctx.common.issues);
          return result.result;
        }
      }
      const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return Promise.all(options.map(async (option) => {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await option._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: childCtx
          }),
          ctx: childCtx
        };
      })).then(handleResults);
    } else {
      let dirty = void 0;
      const issues = [];
      for (const option of options) {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        const result = option._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: childCtx
        });
        if (result.status === "valid") {
          return result;
        } else if (result.status === "dirty" && !dirty) {
          dirty = { result, ctx: childCtx };
        }
        if (childCtx.common.issues.length) {
          issues.push(childCtx.common.issues);
        }
      }
      if (dirty) {
        ctx.common.issues.push(...dirty.ctx.common.issues);
        return dirty.result;
      }
      const unionErrors = issues.map((issues2) => new ZodError(issues2));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
  }
  get options() {
    return this._def.options;
  }
};
ZodUnion.create = (types, params) => {
  return new ZodUnion({
    options: types,
    typeName: ZodFirstPartyTypeKind.ZodUnion,
    ...processCreateParams(params)
  });
};
var getDiscriminator = (type) => {
  if (type instanceof ZodLazy) {
    return getDiscriminator(type.schema);
  } else if (type instanceof ZodEffects) {
    return getDiscriminator(type.innerType());
  } else if (type instanceof ZodLiteral) {
    return [type.value];
  } else if (type instanceof ZodEnum) {
    return type.options;
  } else if (type instanceof ZodNativeEnum) {
    return util.objectValues(type.enum);
  } else if (type instanceof ZodDefault) {
    return getDiscriminator(type._def.innerType);
  } else if (type instanceof ZodUndefined) {
    return [void 0];
  } else if (type instanceof ZodNull) {
    return [null];
  } else if (type instanceof ZodOptional) {
    return [void 0, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodNullable) {
    return [null, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodBranded) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodReadonly) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodCatch) {
    return getDiscriminator(type._def.innerType);
  } else {
    return [];
  }
};
var ZodDiscriminatedUnion = class _ZodDiscriminatedUnion extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const discriminator = this.discriminator;
    const discriminatorValue = ctx.data[discriminator];
    const option = this.optionsMap.get(discriminatorValue);
    if (!option) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union_discriminator,
        options: Array.from(this.optionsMap.keys()),
        path: [discriminator]
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return option._parseAsync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    } else {
      return option._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    }
  }
  get discriminator() {
    return this._def.discriminator;
  }
  get options() {
    return this._def.options;
  }
  get optionsMap() {
    return this._def.optionsMap;
  }
  /**
   * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
   * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
   * have a different value for each object in the union.
   * @param discriminator the name of the discriminator property
   * @param types an array of object schemas
   * @param params
   */
  static create(discriminator, options, params) {
    const optionsMap = /* @__PURE__ */ new Map();
    for (const type of options) {
      const discriminatorValues = getDiscriminator(type.shape[discriminator]);
      if (!discriminatorValues.length) {
        throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
      }
      for (const value of discriminatorValues) {
        if (optionsMap.has(value)) {
          throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
        }
        optionsMap.set(value, type);
      }
    }
    return new _ZodDiscriminatedUnion({
      typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
      discriminator,
      options,
      optionsMap,
      ...processCreateParams(params)
    });
  }
};
function mergeValues(a, b) {
  const aType = getParsedType(a);
  const bType = getParsedType(b);
  if (a === b) {
    return { valid: true, data: a };
  } else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
    const bKeys = util.objectKeys(b);
    const sharedKeys = util.objectKeys(a).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a, ...b };
    for (const key of sharedKeys) {
      const sharedValue = mergeValues(a[key], b[key]);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
    if (a.length !== b.length) {
      return { valid: false };
    }
    const newArray = [];
    for (let index = 0; index < a.length; index++) {
      const itemA = a[index];
      const itemB = b[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  } else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a === +b) {
    return { valid: true, data: a };
  } else {
    return { valid: false };
  }
}
var ZodIntersection = class extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const handleParsed = (parsedLeft, parsedRight) => {
      if (isAborted(parsedLeft) || isAborted(parsedRight)) {
        return INVALID;
      }
      const merged = mergeValues(parsedLeft.value, parsedRight.value);
      if (!merged.valid) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_intersection_types
        });
        return INVALID;
      }
      if (isDirty(parsedLeft) || isDirty(parsedRight)) {
        status.dirty();
      }
      return { status: status.value, value: merged.data };
    };
    if (ctx.common.async) {
      return Promise.all([
        this._def.left._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }),
        this._def.right._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        })
      ]).then(([left, right]) => handleParsed(left, right));
    } else {
      return handleParsed(this._def.left._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }), this._def.right._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }));
    }
  }
};
ZodIntersection.create = (left, right, params) => {
  return new ZodIntersection({
    left,
    right,
    typeName: ZodFirstPartyTypeKind.ZodIntersection,
    ...processCreateParams(params)
  });
};
var ZodTuple = class _ZodTuple extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (ctx.data.length < this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_small,
        minimum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      return INVALID;
    }
    const rest = this._def.rest;
    if (!rest && ctx.data.length > this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_big,
        maximum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      status.dirty();
    }
    const items = [...ctx.data].map((item, itemIndex) => {
      const schema = this._def.items[itemIndex] || this._def.rest;
      if (!schema)
        return null;
      return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
    }).filter((x) => !!x);
    if (ctx.common.async) {
      return Promise.all(items).then((results) => {
        return ParseStatus.mergeArray(status, results);
      });
    } else {
      return ParseStatus.mergeArray(status, items);
    }
  }
  get items() {
    return this._def.items;
  }
  rest(rest) {
    return new _ZodTuple({
      ...this._def,
      rest
    });
  }
};
ZodTuple.create = (schemas, params) => {
  if (!Array.isArray(schemas)) {
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  }
  return new ZodTuple({
    items: schemas,
    typeName: ZodFirstPartyTypeKind.ZodTuple,
    rest: null,
    ...processCreateParams(params)
  });
};
var ZodRecord = class _ZodRecord extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const pairs = [];
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    for (const key in ctx.data) {
      pairs.push({
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
        value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (ctx.common.async) {
      return ParseStatus.mergeObjectAsync(status, pairs);
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get element() {
    return this._def.valueType;
  }
  static create(first, second, third) {
    if (second instanceof ZodType) {
      return new _ZodRecord({
        keyType: first,
        valueType: second,
        typeName: ZodFirstPartyTypeKind.ZodRecord,
        ...processCreateParams(third)
      });
    }
    return new _ZodRecord({
      keyType: ZodString.create(),
      valueType: first,
      typeName: ZodFirstPartyTypeKind.ZodRecord,
      ...processCreateParams(second)
    });
  }
};
var ZodMap = class extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.map) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.map,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    const pairs = [...ctx.data.entries()].map(([key, value], index) => {
      return {
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
        value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"]))
      };
    });
    if (ctx.common.async) {
      const finalMap = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          if (key.status === "aborted" || value.status === "aborted") {
            return INVALID;
          }
          if (key.status === "dirty" || value.status === "dirty") {
            status.dirty();
          }
          finalMap.set(key.value, value.value);
        }
        return { status: status.value, value: finalMap };
      });
    } else {
      const finalMap = /* @__PURE__ */ new Map();
      for (const pair of pairs) {
        const key = pair.key;
        const value = pair.value;
        if (key.status === "aborted" || value.status === "aborted") {
          return INVALID;
        }
        if (key.status === "dirty" || value.status === "dirty") {
          status.dirty();
        }
        finalMap.set(key.value, value.value);
      }
      return { status: status.value, value: finalMap };
    }
  }
};
ZodMap.create = (keyType, valueType, params) => {
  return new ZodMap({
    valueType,
    keyType,
    typeName: ZodFirstPartyTypeKind.ZodMap,
    ...processCreateParams(params)
  });
};
var ZodSet = class _ZodSet extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.set) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.set,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const def = this._def;
    if (def.minSize !== null) {
      if (ctx.data.size < def.minSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.minSize.message
        });
        status.dirty();
      }
    }
    if (def.maxSize !== null) {
      if (ctx.data.size > def.maxSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.maxSize.message
        });
        status.dirty();
      }
    }
    const valueType = this._def.valueType;
    function finalizeSet(elements2) {
      const parsedSet = /* @__PURE__ */ new Set();
      for (const element of elements2) {
        if (element.status === "aborted")
          return INVALID;
        if (element.status === "dirty")
          status.dirty();
        parsedSet.add(element.value);
      }
      return { status: status.value, value: parsedSet };
    }
    const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
    if (ctx.common.async) {
      return Promise.all(elements).then((elements2) => finalizeSet(elements2));
    } else {
      return finalizeSet(elements);
    }
  }
  min(minSize, message) {
    return new _ZodSet({
      ...this._def,
      minSize: { value: minSize, message: errorUtil.toString(message) }
    });
  }
  max(maxSize, message) {
    return new _ZodSet({
      ...this._def,
      maxSize: { value: maxSize, message: errorUtil.toString(message) }
    });
  }
  size(size, message) {
    return this.min(size, message).max(size, message);
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
ZodSet.create = (valueType, params) => {
  return new ZodSet({
    valueType,
    minSize: null,
    maxSize: null,
    typeName: ZodFirstPartyTypeKind.ZodSet,
    ...processCreateParams(params)
  });
};
var ZodFunction = class _ZodFunction extends ZodType {
  constructor() {
    super(...arguments);
    this.validate = this.implement;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.function) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.function,
        received: ctx.parsedType
      });
      return INVALID;
    }
    function makeArgsIssue(args, error) {
      return makeIssue({
        data: args,
        path: ctx.path,
        errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_arguments,
          argumentsError: error
        }
      });
    }
    function makeReturnsIssue(returns, error) {
      return makeIssue({
        data: returns,
        path: ctx.path,
        errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_return_type,
          returnTypeError: error
        }
      });
    }
    const params = { errorMap: ctx.common.contextualErrorMap };
    const fn = ctx.data;
    if (this._def.returns instanceof ZodPromise) {
      const me = this;
      return OK(async function(...args) {
        const error = new ZodError([]);
        const parsedArgs = await me._def.args.parseAsync(args, params).catch((e) => {
          error.addIssue(makeArgsIssue(args, e));
          throw error;
        });
        const result = await Reflect.apply(fn, this, parsedArgs);
        const parsedReturns = await me._def.returns._def.type.parseAsync(result, params).catch((e) => {
          error.addIssue(makeReturnsIssue(result, e));
          throw error;
        });
        return parsedReturns;
      });
    } else {
      const me = this;
      return OK(function(...args) {
        const parsedArgs = me._def.args.safeParse(args, params);
        if (!parsedArgs.success) {
          throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
        }
        const result = Reflect.apply(fn, this, parsedArgs.data);
        const parsedReturns = me._def.returns.safeParse(result, params);
        if (!parsedReturns.success) {
          throw new ZodError([makeReturnsIssue(result, parsedReturns.error)]);
        }
        return parsedReturns.data;
      });
    }
  }
  parameters() {
    return this._def.args;
  }
  returnType() {
    return this._def.returns;
  }
  args(...items) {
    return new _ZodFunction({
      ...this._def,
      args: ZodTuple.create(items).rest(ZodUnknown.create())
    });
  }
  returns(returnType) {
    return new _ZodFunction({
      ...this._def,
      returns: returnType
    });
  }
  implement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  strictImplement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  static create(args, returns, params) {
    return new _ZodFunction({
      args: args ? args : ZodTuple.create([]).rest(ZodUnknown.create()),
      returns: returns || ZodUnknown.create(),
      typeName: ZodFirstPartyTypeKind.ZodFunction,
      ...processCreateParams(params)
    });
  }
};
var ZodLazy = class extends ZodType {
  get schema() {
    return this._def.getter();
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const lazySchema = this._def.getter();
    return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
  }
};
ZodLazy.create = (getter, params) => {
  return new ZodLazy({
    getter,
    typeName: ZodFirstPartyTypeKind.ZodLazy,
    ...processCreateParams(params)
  });
};
var ZodLiteral = class extends ZodType {
  _parse(input) {
    if (input.data !== this._def.value) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_literal,
        expected: this._def.value
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
  get value() {
    return this._def.value;
  }
};
ZodLiteral.create = (value, params) => {
  return new ZodLiteral({
    value,
    typeName: ZodFirstPartyTypeKind.ZodLiteral,
    ...processCreateParams(params)
  });
};
function createZodEnum(values, params) {
  return new ZodEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodEnum,
    ...processCreateParams(params)
  });
}
var ZodEnum = class _ZodEnum extends ZodType {
  _parse(input) {
    if (typeof input.data !== "string") {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(this._def.values);
    }
    if (!this._cache.has(input.data)) {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Values() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  extract(values, newDef = this._def) {
    return _ZodEnum.create(values, {
      ...this._def,
      ...newDef
    });
  }
  exclude(values, newDef = this._def) {
    return _ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
      ...this._def,
      ...newDef
    });
  }
};
ZodEnum.create = createZodEnum;
var ZodNativeEnum = class extends ZodType {
  _parse(input) {
    const nativeEnumValues = util.getValidEnumValues(this._def.values);
    const ctx = this._getOrReturnCtx(input);
    if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(util.getValidEnumValues(this._def.values));
    }
    if (!this._cache.has(input.data)) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get enum() {
    return this._def.values;
  }
};
ZodNativeEnum.create = (values, params) => {
  return new ZodNativeEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
    ...processCreateParams(params)
  });
};
var ZodPromise = class extends ZodType {
  unwrap() {
    return this._def.type;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.promise,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
    return OK(promisified.then((data) => {
      return this._def.type.parseAsync(data, {
        path: ctx.path,
        errorMap: ctx.common.contextualErrorMap
      });
    }));
  }
};
ZodPromise.create = (schema, params) => {
  return new ZodPromise({
    type: schema,
    typeName: ZodFirstPartyTypeKind.ZodPromise,
    ...processCreateParams(params)
  });
};
var ZodEffects = class extends ZodType {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const effect = this._def.effect || null;
    const checkCtx = {
      addIssue: (arg) => {
        addIssueToContext(ctx, arg);
        if (arg.fatal) {
          status.abort();
        } else {
          status.dirty();
        }
      },
      get path() {
        return ctx.path;
      }
    };
    checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
    if (effect.type === "preprocess") {
      const processed = effect.transform(ctx.data, checkCtx);
      if (ctx.common.async) {
        return Promise.resolve(processed).then(async (processed2) => {
          if (status.value === "aborted")
            return INVALID;
          const result = await this._def.schema._parseAsync({
            data: processed2,
            path: ctx.path,
            parent: ctx
          });
          if (result.status === "aborted")
            return INVALID;
          if (result.status === "dirty")
            return DIRTY(result.value);
          if (status.value === "dirty")
            return DIRTY(result.value);
          return result;
        });
      } else {
        if (status.value === "aborted")
          return INVALID;
        const result = this._def.schema._parseSync({
          data: processed,
          path: ctx.path,
          parent: ctx
        });
        if (result.status === "aborted")
          return INVALID;
        if (result.status === "dirty")
          return DIRTY(result.value);
        if (status.value === "dirty")
          return DIRTY(result.value);
        return result;
      }
    }
    if (effect.type === "refinement") {
      const executeRefinement = (acc) => {
        const result = effect.refinement(acc, checkCtx);
        if (ctx.common.async) {
          return Promise.resolve(result);
        }
        if (result instanceof Promise) {
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        }
        return acc;
      };
      if (ctx.common.async === false) {
        const inner = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inner.status === "aborted")
          return INVALID;
        if (inner.status === "dirty")
          status.dirty();
        executeRefinement(inner.value);
        return { status: status.value, value: inner.value };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
          if (inner.status === "aborted")
            return INVALID;
          if (inner.status === "dirty")
            status.dirty();
          return executeRefinement(inner.value).then(() => {
            return { status: status.value, value: inner.value };
          });
        });
      }
    }
    if (effect.type === "transform") {
      if (ctx.common.async === false) {
        const base = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (!isValid(base))
          return INVALID;
        const result = effect.transform(base.value, checkCtx);
        if (result instanceof Promise) {
          throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
        }
        return { status: status.value, value: result };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
          if (!isValid(base))
            return INVALID;
          return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({
            status: status.value,
            value: result
          }));
        });
      }
    }
    util.assertNever(effect);
  }
};
ZodEffects.create = (schema, effect, params) => {
  return new ZodEffects({
    schema,
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    effect,
    ...processCreateParams(params)
  });
};
ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
  return new ZodEffects({
    schema,
    effect: { type: "preprocess", transform: preprocess },
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    ...processCreateParams(params)
  });
};
var ZodOptional = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.undefined) {
      return OK(void 0);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodOptional.create = (type, params) => {
  return new ZodOptional({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodOptional,
    ...processCreateParams(params)
  });
};
var ZodNullable = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.null) {
      return OK(null);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodNullable.create = (type, params) => {
  return new ZodNullable({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodNullable,
    ...processCreateParams(params)
  });
};
var ZodDefault = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    let data = ctx.data;
    if (ctx.parsedType === ZodParsedType.undefined) {
      data = this._def.defaultValue();
    }
    return this._def.innerType._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
};
ZodDefault.create = (type, params) => {
  return new ZodDefault({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodDefault,
    defaultValue: typeof params.default === "function" ? params.default : () => params.default,
    ...processCreateParams(params)
  });
};
var ZodCatch = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const newCtx = {
      ...ctx,
      common: {
        ...ctx.common,
        issues: []
      }
    };
    const result = this._def.innerType._parse({
      data: newCtx.data,
      path: newCtx.path,
      parent: {
        ...newCtx
      }
    });
    if (isAsync(result)) {
      return result.then((result2) => {
        return {
          status: "valid",
          value: result2.status === "valid" ? result2.value : this._def.catchValue({
            get error() {
              return new ZodError(newCtx.common.issues);
            },
            input: newCtx.data
          })
        };
      });
    } else {
      return {
        status: "valid",
        value: result.status === "valid" ? result.value : this._def.catchValue({
          get error() {
            return new ZodError(newCtx.common.issues);
          },
          input: newCtx.data
        })
      };
    }
  }
  removeCatch() {
    return this._def.innerType;
  }
};
ZodCatch.create = (type, params) => {
  return new ZodCatch({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodCatch,
    catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
    ...processCreateParams(params)
  });
};
var ZodNaN = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.nan) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.nan,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
};
ZodNaN.create = (params) => {
  return new ZodNaN({
    typeName: ZodFirstPartyTypeKind.ZodNaN,
    ...processCreateParams(params)
  });
};
var BRAND = /* @__PURE__ */ Symbol("zod_brand");
var ZodBranded = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const data = ctx.data;
    return this._def.type._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  unwrap() {
    return this._def.type;
  }
};
var ZodPipeline = class _ZodPipeline extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.common.async) {
      const handleAsync = async () => {
        const inResult = await this._def.in._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inResult.status === "aborted")
          return INVALID;
        if (inResult.status === "dirty") {
          status.dirty();
          return DIRTY(inResult.value);
        } else {
          return this._def.out._parseAsync({
            data: inResult.value,
            path: ctx.path,
            parent: ctx
          });
        }
      };
      return handleAsync();
    } else {
      const inResult = this._def.in._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
      if (inResult.status === "aborted")
        return INVALID;
      if (inResult.status === "dirty") {
        status.dirty();
        return {
          status: "dirty",
          value: inResult.value
        };
      } else {
        return this._def.out._parseSync({
          data: inResult.value,
          path: ctx.path,
          parent: ctx
        });
      }
    }
  }
  static create(a, b) {
    return new _ZodPipeline({
      in: a,
      out: b,
      typeName: ZodFirstPartyTypeKind.ZodPipeline
    });
  }
};
var ZodReadonly = class extends ZodType {
  _parse(input) {
    const result = this._def.innerType._parse(input);
    const freeze = (data) => {
      if (isValid(data)) {
        data.value = Object.freeze(data.value);
      }
      return data;
    };
    return isAsync(result) ? result.then((data) => freeze(data)) : freeze(result);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodReadonly.create = (type, params) => {
  return new ZodReadonly({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodReadonly,
    ...processCreateParams(params)
  });
};
function cleanParams(params, data) {
  const p = typeof params === "function" ? params(data) : typeof params === "string" ? { message: params } : params;
  const p2 = typeof p === "string" ? { message: p } : p;
  return p2;
}
function custom(check, _params = {}, fatal) {
  if (check)
    return ZodAny.create().superRefine((data, ctx) => {
      const r = check(data);
      if (r instanceof Promise) {
        return r.then((r2) => {
          if (!r2) {
            const params = cleanParams(_params, data);
            const _fatal = params.fatal ?? fatal ?? true;
            ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
          }
        });
      }
      if (!r) {
        const params = cleanParams(_params, data);
        const _fatal = params.fatal ?? fatal ?? true;
        ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
      }
      return;
    });
  return ZodAny.create();
}
var late = {
  object: ZodObject.lazycreate
};
var ZodFirstPartyTypeKind;
(function(ZodFirstPartyTypeKind2) {
  ZodFirstPartyTypeKind2["ZodString"] = "ZodString";
  ZodFirstPartyTypeKind2["ZodNumber"] = "ZodNumber";
  ZodFirstPartyTypeKind2["ZodNaN"] = "ZodNaN";
  ZodFirstPartyTypeKind2["ZodBigInt"] = "ZodBigInt";
  ZodFirstPartyTypeKind2["ZodBoolean"] = "ZodBoolean";
  ZodFirstPartyTypeKind2["ZodDate"] = "ZodDate";
  ZodFirstPartyTypeKind2["ZodSymbol"] = "ZodSymbol";
  ZodFirstPartyTypeKind2["ZodUndefined"] = "ZodUndefined";
  ZodFirstPartyTypeKind2["ZodNull"] = "ZodNull";
  ZodFirstPartyTypeKind2["ZodAny"] = "ZodAny";
  ZodFirstPartyTypeKind2["ZodUnknown"] = "ZodUnknown";
  ZodFirstPartyTypeKind2["ZodNever"] = "ZodNever";
  ZodFirstPartyTypeKind2["ZodVoid"] = "ZodVoid";
  ZodFirstPartyTypeKind2["ZodArray"] = "ZodArray";
  ZodFirstPartyTypeKind2["ZodObject"] = "ZodObject";
  ZodFirstPartyTypeKind2["ZodUnion"] = "ZodUnion";
  ZodFirstPartyTypeKind2["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
  ZodFirstPartyTypeKind2["ZodIntersection"] = "ZodIntersection";
  ZodFirstPartyTypeKind2["ZodTuple"] = "ZodTuple";
  ZodFirstPartyTypeKind2["ZodRecord"] = "ZodRecord";
  ZodFirstPartyTypeKind2["ZodMap"] = "ZodMap";
  ZodFirstPartyTypeKind2["ZodSet"] = "ZodSet";
  ZodFirstPartyTypeKind2["ZodFunction"] = "ZodFunction";
  ZodFirstPartyTypeKind2["ZodLazy"] = "ZodLazy";
  ZodFirstPartyTypeKind2["ZodLiteral"] = "ZodLiteral";
  ZodFirstPartyTypeKind2["ZodEnum"] = "ZodEnum";
  ZodFirstPartyTypeKind2["ZodEffects"] = "ZodEffects";
  ZodFirstPartyTypeKind2["ZodNativeEnum"] = "ZodNativeEnum";
  ZodFirstPartyTypeKind2["ZodOptional"] = "ZodOptional";
  ZodFirstPartyTypeKind2["ZodNullable"] = "ZodNullable";
  ZodFirstPartyTypeKind2["ZodDefault"] = "ZodDefault";
  ZodFirstPartyTypeKind2["ZodCatch"] = "ZodCatch";
  ZodFirstPartyTypeKind2["ZodPromise"] = "ZodPromise";
  ZodFirstPartyTypeKind2["ZodBranded"] = "ZodBranded";
  ZodFirstPartyTypeKind2["ZodPipeline"] = "ZodPipeline";
  ZodFirstPartyTypeKind2["ZodReadonly"] = "ZodReadonly";
})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
var instanceOfType = (cls, params = {
  message: `Input not instance of ${cls.name}`
}) => custom((data) => data instanceof cls, params);
var stringType = ZodString.create;
var numberType = ZodNumber.create;
var nanType = ZodNaN.create;
var bigIntType = ZodBigInt.create;
var booleanType = ZodBoolean.create;
var dateType = ZodDate.create;
var symbolType = ZodSymbol.create;
var undefinedType = ZodUndefined.create;
var nullType = ZodNull.create;
var anyType = ZodAny.create;
var unknownType = ZodUnknown.create;
var neverType = ZodNever.create;
var voidType = ZodVoid.create;
var arrayType = ZodArray.create;
var objectType = ZodObject.create;
var strictObjectType = ZodObject.strictCreate;
var unionType = ZodUnion.create;
var discriminatedUnionType = ZodDiscriminatedUnion.create;
var intersectionType = ZodIntersection.create;
var tupleType = ZodTuple.create;
var recordType = ZodRecord.create;
var mapType = ZodMap.create;
var setType = ZodSet.create;
var functionType = ZodFunction.create;
var lazyType = ZodLazy.create;
var literalType = ZodLiteral.create;
var enumType = ZodEnum.create;
var nativeEnumType = ZodNativeEnum.create;
var promiseType = ZodPromise.create;
var effectsType = ZodEffects.create;
var optionalType = ZodOptional.create;
var nullableType = ZodNullable.create;
var preprocessType = ZodEffects.createWithPreprocess;
var pipelineType = ZodPipeline.create;
var ostring = () => stringType().optional();
var onumber = () => numberType().optional();
var oboolean = () => booleanType().optional();
var coerce = {
  string: ((arg) => ZodString.create({ ...arg, coerce: true })),
  number: ((arg) => ZodNumber.create({ ...arg, coerce: true })),
  boolean: ((arg) => ZodBoolean.create({
    ...arg,
    coerce: true
  })),
  bigint: ((arg) => ZodBigInt.create({ ...arg, coerce: true })),
  date: ((arg) => ZodDate.create({ ...arg, coerce: true }))
};
var NEVER = INVALID;

// ../lib/db/dist/schema/students.js
var insertStudentSchema = external_exports.object({
  phone: external_exports.string(),
  name: external_exports.string(),
  classLevel: external_exports.enum(["Class IX", "Class X"]),
  medium: external_exports.enum(["Assamese", "English"]),
  board: external_exports.enum(["SEBA", "CBSE"])
});
var studentSchema = insertStudentSchema.extend({
  id: external_exports.string(),
  createdAt: external_exports.date().default(() => /* @__PURE__ */ new Date()),
  lastLogin: external_exports.date().default(() => /* @__PURE__ */ new Date())
});

// ../lib/db/dist/schema/subjects.js
var insertSubjectSchema = external_exports.object({
  name: external_exports.string(),
  description: external_exports.string(),
  icon: external_exports.string().default("BookOpen"),
  classLevels: external_exports.array(external_exports.string()),
  color: external_exports.string().default("#1e3a8a")
});
var subjectSchema = insertSubjectSchema.extend({
  id: external_exports.string(),
  createdAt: external_exports.date().default(() => /* @__PURE__ */ new Date())
});

// ../lib/db/dist/schema/chapters.js
var insertChapterSchema = external_exports.object({
  subjectId: external_exports.string(),
  classLevel: external_exports.enum(["Class IX", "Class X"]),
  medium: external_exports.enum(["Assamese", "English", "Both"]).default("Both"),
  title: external_exports.string(),
  chapterNumber: external_exports.number(),
  description: external_exports.string()
});
var chapterSchema = insertChapterSchema.extend({
  id: external_exports.string(),
  createdAt: external_exports.date().default(() => /* @__PURE__ */ new Date())
});

// ../lib/db/dist/schema/videos.js
var insertVideoSchema = external_exports.object({
  chapterId: external_exports.string(),
  youtubeId: external_exports.string(),
  title: external_exports.string(),
  description: external_exports.string()
});
var videoSchema = insertVideoSchema.extend({
  id: external_exports.string(),
  createdAt: external_exports.date().default(() => /* @__PURE__ */ new Date())
});

// ../lib/db/dist/schema/notes.js
var insertNoteSchema = external_exports.object({
  chapterId: external_exports.string(),
  title: external_exports.string(),
  content: external_exports.string(),
  type: external_exports.enum(["text", "pdf", "image"]).default("text"),
  fileUrl: external_exports.string().nullable().optional(),
  youtubeId: external_exports.string().nullable().optional(),
  order: external_exports.number().default(0)
});
var noteSchema = insertNoteSchema.extend({
  id: external_exports.string(),
  createdAt: external_exports.date().default(() => /* @__PURE__ */ new Date())
});

// ../lib/db/dist/schema/mcqs.js
var insertMcqSchema = external_exports.object({
  chapterId: external_exports.string(),
  question: external_exports.string(),
  options: external_exports.array(external_exports.string()),
  correctIndex: external_exports.number(),
  explanation: external_exports.string(),
  order: external_exports.number().default(0)
});
var mcqSchema = insertMcqSchema.extend({
  id: external_exports.string(),
  createdAt: external_exports.date().default(() => /* @__PURE__ */ new Date())
});

// ../lib/db/dist/schema/qa.js
var insertQaSchema = external_exports.object({
  chapterId: external_exports.string(),
  question: external_exports.string(),
  answer: external_exports.string(),
  explanation: external_exports.string(),
  youtubeId: external_exports.string().nullable().optional(),
  isImportant: external_exports.boolean().default(false),
  order: external_exports.number().default(0)
});
var qaSchema = insertQaSchema.extend({
  id: external_exports.string(),
  createdAt: external_exports.date().default(() => /* @__PURE__ */ new Date())
});

// ../lib/db/dist/schema/users.js
var insertUserSchema = external_exports.object({
  username: external_exports.string(),
  password: external_exports.string(),
  name: external_exports.string(),
  role: external_exports.enum(["admin", "student"]).default("student")
});
var userSchema = insertUserSchema.extend({
  id: external_exports.string(),
  createdAt: external_exports.date().default(() => /* @__PURE__ */ new Date())
});

// ../lib/db/dist/schema/progress.js
var insertProgressSchema = external_exports.object({
  userId: external_exports.string(),
  chapterId: external_exports.string(),
  mcqScore: external_exports.number().nullable().optional(),
  mcqTotal: external_exports.number().nullable().optional(),
  visited: external_exports.boolean().default(false)
});
var progressSchema = insertProgressSchema.extend({
  id: external_exports.string(),
  lastAccessedAt: external_exports.date().default(() => /* @__PURE__ */ new Date())
});

// ../lib/db/dist/schema/experiments.js
var SIM_TYPES = [
  "distance-time",
  "velocity-time",
  "free-fall",
  "motion-accel",
  "gravitation",
  "archimedes",
  "density",
  "kinetic-energy",
  "potential-energy",
  "pendulum",
  "reflection",
  "plane-mirror",
  "convex-lens",
  "refraction",
  "power-of-lens",
  "ohms-law",
  "series-circuit",
  "parallel-circuit",
  "heating-effect",
  "sound-wave",
  "pitch",
  "echo",
  "filtration",
  "crystallization",
  "ph-testing",
  "light-reflection",
  "light-refraction",
  "electric-circuit",
  "lens",
  "magnet",
  "custom"
];
var insertExperimentSchema = external_exports.object({
  subject: external_exports.enum(["Physics", "Chemistry"]).default("Physics"),
  classLevel: external_exports.enum(["Class IX", "Class X"]),
  title: external_exports.string(),
  objective: external_exports.string(),
  theory: external_exports.string().default(""),
  apparatus: external_exports.string().default(""),
  procedure: external_exports.string(),
  expectedResult: external_exports.string(),
  explanation: external_exports.string(),
  videoUrl: external_exports.string().nullable().optional(),
  hints: external_exports.string().nullable().optional(),
  summary: external_exports.string().nullable().optional(),
  type: external_exports.enum(SIM_TYPES),
  difficulty: external_exports.enum(["easy", "medium", "hard"]).default("medium")
});
var experimentSchema = insertExperimentSchema.extend({
  id: external_exports.string(),
  createdAt: external_exports.date().default(() => /* @__PURE__ */ new Date())
});

// ../lib/db/dist/index.js
if (getApps().length === 0) {
  const credential = process.env.TRUE_CONCEPT_SERVICE_KEY ? cert(JSON.parse(Buffer.from(process.env.TRUE_CONCEPT_SERVICE_KEY, "base64").toString("utf8"))) : applicationDefault();
  initializeApp({ credential });
}
var db = getFirestore();
var firebaseAuth = getAuth();

// src/utils/cors.ts
function handleCors(req, res) {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.set("Access-Control-Max-Age", "3600");
  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return true;
  }
  return false;
}

// src/utils/router.ts
function getSubPath(req, prefix) {
  const url = req.url || req.path || "";
  const pathOnly = url.split("?")[0];
  if (pathOnly.startsWith(prefix)) {
    return pathOnly.slice(prefix.length) || "/";
  }
  return pathOnly || "/";
}
function extractParam(subPath) {
  const clean = subPath.startsWith("/") ? subPath.slice(1) : subPath;
  if (clean && !clean.includes("/")) return clean;
  return null;
}

// src/middleware/auth.ts
import jwt from "jsonwebtoken";
var JWT_SECRET = process.env.SESSION_SECRET ?? "trueconcept-secret-2024";
function signToken(user) {
  return jwt.sign(user, JWT_SECRET, { expiresIn: "180d" });
}
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}
function extractAuthUser(req) {
  const auth2 = req.headers.authorization;
  if (!auth2 || !auth2.startsWith("Bearer ")) return null;
  return verifyToken(auth2.slice(7));
}
function requireAuth(req) {
  const user = extractAuthUser(req);
  if (!user) {
    const err = { status: 401, error: "Unauthorized" };
    throw err;
  }
  return user;
}
function requireAdmin(req) {
  const user = requireAuth(req);
  if (user.role !== "admin") {
    const err = { status: 403, error: "Admin access required" };
    throw err;
  }
  return user;
}

// src/routes/auth.ts
var auth = onRequest({ region: "asia-south1", invoker: "public" }, async (req, res) => {
  if (handleCors(req, res)) return;
  const subPath = getSubPath(req, "/api/auth");
  try {
    if (req.method === "POST" && subPath === "/login") {
      const { username, password } = req.body;
      if (!username || !password) {
        res.status(400).json({ error: "Username and password required" });
        return;
      }
      const usersSnap = await db.collection("users").where("username", "==", username).get();
      if (usersSnap.empty) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }
      const userDoc = usersSnap.docs[0];
      const user = userDoc.data();
      if (user.password !== password) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }
      const authUser = {
        id: userDoc.id,
        username: user.username,
        role: user.role,
        name: user.name
      };
      const token = signToken(authUser);
      res.json({ user: authUser, token });
      return;
    }
    if (req.method === "POST" && subPath === "/phone-login") {
      const { idToken, intent, name, phone: formPhone, classLevel, medium, board } = req.body;
      if (!idToken) {
        res.status(400).json({ error: "Firebase ID token required" });
        return;
      }
      let decoded;
      try {
        decoded = await firebaseAuth.verifyIdToken(idToken);
      } catch (err) {
        const code = err?.code ?? "unknown";
        const message = err?.message ?? "Token verification failed";
        res.status(401).json({ error: "Invalid or expired token", code, detail: message });
        return;
      }
      const { uid, phone_number: phone } = decoded;
      const studentRef = db.collection("students").doc(uid);
      const studentSnap = await studentRef.get();
      if (intent === "login" && !studentSnap.exists) {
        res.status(404).json({ error: "not_registered", message: "No account found for this phone number. Please register first." });
        return;
      }
      if (intent === "register" && studentSnap.exists) {
        await studentRef.update({ lastLogin: /* @__PURE__ */ new Date() });
      } else if (!studentSnap.exists) {
        if (!name || !classLevel || !medium || !board) {
          res.status(400).json({ error: "missing_profile", message: "Name, class, medium, and board are required for registration." });
          return;
        }
        await studentRef.set({
          phone: phone ?? formPhone ?? "",
          name,
          classLevel,
          medium,
          board,
          authMethod: "phone",
          createdAt: /* @__PURE__ */ new Date(),
          lastLogin: /* @__PURE__ */ new Date()
        });
      } else {
        await studentRef.update({ lastLogin: /* @__PURE__ */ new Date() });
      }
      const profile = studentSnap.exists ? studentSnap.data() : { name, classLevel, medium, board };
      const authUser = {
        id: uid,
        username: phone ?? uid,
        role: "student",
        name: profile.name
      };
      const token = signToken(authUser);
      res.json({ user: authUser, token, classLevel: profile.classLevel ?? null, medium: profile.medium ?? null });
      return;
    }
    if (req.method === "POST" && subPath === "/google-login") {
      const { idToken, intent, name, phone, classLevel, medium, board } = req.body;
      if (!idToken) {
        res.status(400).json({ error: "Google ID token required" });
        return;
      }
      let decoded;
      try {
        decoded = await firebaseAuth.verifyIdToken(idToken);
      } catch (err) {
        const code = err?.code ?? "unknown";
        const message = err?.message ?? "Token verification failed";
        res.status(401).json({ error: "Invalid or expired token", code, detail: message });
        return;
      }
      const { uid, email, name: displayName } = decoded;
      const studentRef = db.collection("students").doc(uid);
      const studentSnap = await studentRef.get();
      if (intent === "login" && !studentSnap.exists) {
        res.status(404).json({
          error: "not_registered",
          message: "No account found for this Google account. Please register first.",
          prefill: { name: displayName ?? "", email: email ?? "" }
        });
        return;
      }
      if (!studentSnap.exists) {
        if (!name || !phone || !classLevel || !medium || !board) {
          res.status(400).json({
            error: "missing_profile",
            message: "Name, phone, class, medium, and board are required for registration.",
            prefill: { name: displayName ?? "", email: email ?? "" }
          });
          return;
        }
        await studentRef.set({
          email: email ?? "",
          name: name ?? displayName ?? "",
          phone: phone ?? "",
          classLevel,
          medium,
          board,
          authMethod: "google",
          createdAt: /* @__PURE__ */ new Date(),
          lastLogin: /* @__PURE__ */ new Date()
        });
      } else {
        await studentRef.update({ lastLogin: /* @__PURE__ */ new Date() });
      }
      const profile = studentSnap.exists ? studentSnap.data() : { name: name ?? displayName ?? "", classLevel, medium, board };
      const authUser = {
        id: uid,
        username: email ?? uid,
        role: "student",
        name: profile.name
      };
      const token = signToken(authUser);
      res.json({ user: authUser, token, classLevel: profile.classLevel ?? null, medium: profile.medium ?? null });
      return;
    }
    if (req.method === "PATCH" && subPath === "/credentials") {
      const me = requireAuth(req);
      if (me.role !== "admin") {
        res.status(403).json({ error: "Only admins can change credentials here" });
        return;
      }
      const { currentPassword, newUsername, newPassword } = req.body ?? {};
      if (!currentPassword || typeof currentPassword !== "string") {
        res.status(400).json({ error: "currentPassword is required" });
        return;
      }
      const trimmedUsername = typeof newUsername === "string" ? newUsername.trim() : "";
      const hasNewUsername = trimmedUsername.length > 0 && trimmedUsername !== me.username;
      const hasNewPassword = typeof newPassword === "string" && newPassword.length > 0;
      if (!hasNewUsername && !hasNewPassword) {
        res.status(400).json({ error: "Provide a new username or new password" });
        return;
      }
      if (hasNewPassword && newPassword.length < 6) {
        res.status(400).json({ error: "New password must be at least 6 characters" });
        return;
      }
      const userRef = db.collection("users").doc(me.id);
      const userSnap = await userRef.get();
      if (!userSnap.exists) {
        res.status(404).json({ error: "Admin user not found" });
        return;
      }
      const stored = userSnap.data() ?? {};
      if (stored.password !== currentPassword) {
        res.status(401).json({ error: "Current password is incorrect" });
        return;
      }
      if (hasNewUsername) {
        const dupSnap = await db.collection("users").where("username", "==", trimmedUsername).get();
        const conflict = dupSnap.docs.find((d) => d.id !== me.id);
        if (conflict) {
          res.status(409).json({ error: "That username is already taken" });
          return;
        }
      }
      const updates = {};
      if (hasNewUsername) updates.username = trimmedUsername;
      if (hasNewPassword) updates.password = newPassword;
      await userRef.update(updates);
      const updatedUser = {
        id: me.id,
        username: hasNewUsername ? trimmedUsername : me.username,
        role: me.role,
        name: me.name
      };
      const token = signToken(updatedUser);
      res.json({ user: updatedUser, token });
      return;
    }
    if (req.method === "POST" && subPath === "/logout") {
      res.json({ ok: true });
      return;
    }
    if (req.method === "GET" && subPath === "/me") {
      const user = requireAuth(req);
      res.json(user);
      return;
    }
    res.status(404).json({ error: "Not found" });
  } catch (err) {
    const authErr = err;
    if (authErr.status && authErr.error) {
      res.status(authErr.status).json({ error: authErr.error });
      return;
    }
    console.error("Auth error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// src/routes/subjects.ts
import { onRequest as onRequest2 } from "firebase-functions/v2/https";
var subjects = onRequest2({ region: "asia-south1", invoker: "public" }, async (req, res) => {
  if (handleCors(req, res)) return;
  const subPath = getSubPath(req, "/api/subjects");
  try {
    if (req.method === "GET" && (subPath === "/" || subPath === "")) {
      const subjectsSnap = await db.collection("subjects").get();
      const subjectsList = subjectsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const withCounts = await Promise.all(subjectsList.map(async (s) => {
        const chaptersSnap = await db.collection("chapters").where("subjectId", "==", s.id).count().get();
        return { ...s, chapterCount: chaptersSnap.data().count };
      }));
      const seen = /* @__PURE__ */ new Map();
      for (const s of withCounts) {
        const key = s.name.trim().toLowerCase();
        const existing = seen.get(key);
        if (!existing || s.chapterCount > existing.chapterCount) {
          seen.set(key, s);
        }
      }
      res.json([...seen.values()]);
      return;
    }
    if (req.method === "POST" && subPath === "/cleanup-duplicates") {
      requireAdmin(req);
      const subjectsSnap = await db.collection("subjects").get();
      const subjectsList = subjectsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const withCounts = await Promise.all(subjectsList.map(async (s) => {
        const chaptersSnap = await db.collection("chapters").where("subjectId", "==", s.id).count().get();
        return { ...s, chapterCount: chaptersSnap.data().count };
      }));
      const groups = /* @__PURE__ */ new Map();
      for (const s of withCounts) {
        const key = s.name.trim().toLowerCase();
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(s);
      }
      let merged = 0;
      let deleted = 0;
      for (const group of groups.values()) {
        if (group.length <= 1) continue;
        group.sort((a, b) => {
          if (b.chapterCount !== a.chapterCount) return b.chapterCount - a.chapterCount;
          const ta = a.createdAt?.toMillis?.() ?? 0;
          const tb = b.createdAt?.toMillis?.() ?? 0;
          return ta - tb;
        });
        const canonical = group[0];
        const duplicates = group.slice(1);
        for (const dup of duplicates) {
          const chapSnap = await db.collection("chapters").where("subjectId", "==", dup.id).get();
          const batch = db.batch();
          for (const ch of chapSnap.docs) {
            batch.update(ch.ref, { subjectId: canonical.id });
          }
          await batch.commit();
          merged += chapSnap.size;
          await db.collection("subjects").doc(dup.id).delete();
          deleted++;
        }
      }
      res.json({ ok: true, duplicatesDeleted: deleted, chaptersMigrated: merged });
      return;
    }
    if (req.method === "POST" && (subPath === "/" || subPath === "")) {
      requireAdmin(req);
      const { name, description, icon, classLevels, color } = req.body;
      if (!name || !description || !icon || !classLevels || !color) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }
      const newRef = db.collection("subjects").doc();
      const newSubject = { name, description, icon, classLevels, color, createdAt: /* @__PURE__ */ new Date() };
      await newRef.set(newSubject);
      res.status(201).json({ id: newRef.id, ...newSubject, chapterCount: 0 });
      return;
    }
    const paramId = extractParam(subPath);
    if (req.method === "GET" && paramId) {
      const docSnap = await db.collection("subjects").doc(paramId).get();
      if (!docSnap.exists) {
        res.status(404).json({ error: "Subject not found" });
        return;
      }
      const countSnap = await db.collection("chapters").where("subjectId", "==", paramId).count().get();
      res.json({ id: docSnap.id, ...docSnap.data(), chapterCount: countSnap.data().count });
      return;
    }
    if (req.method === "PUT" && paramId) {
      requireAdmin(req);
      const { name, description, icon, classLevels, color } = req.body;
      const docRef = db.collection("subjects").doc(paramId);
      const docSnap = await docRef.get();
      if (!docSnap.exists) {
        res.status(404).json({ error: "Subject not found" });
        return;
      }
      const updates = { name, description, icon, classLevels, color };
      await docRef.update(updates);
      const countSnap = await db.collection("chapters").where("subjectId", "==", paramId).count().get();
      res.json({ id: paramId, ...docSnap.data(), ...updates, chapterCount: countSnap.data().count });
      return;
    }
    if (req.method === "DELETE" && paramId) {
      requireAdmin(req);
      const docRef = db.collection("subjects").doc(paramId);
      const docSnap = await docRef.get();
      if (!docSnap.exists) {
        res.status(404).json({ error: "Subject not found" });
        return;
      }
      await docRef.delete();
      res.status(204).send("");
      return;
    }
    res.status(404).json({ error: "Not found" });
  } catch (err) {
    const authErr = err;
    if (authErr.status && authErr.error) {
      res.status(authErr.status).json({ error: authErr.error });
      return;
    }
    console.error("Subjects error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// src/routes/chapters.ts
import { onRequest as onRequest3 } from "firebase-functions/v2/https";
async function enrichChapters(chapters2) {
  if (chapters2.length === 0) return [];
  const subjectsSnap = await db.collection("subjects").get();
  const subjectMap = new Map(subjectsSnap.docs.map((d) => [d.id, d.data().name]));
  return await Promise.all(chapters2.map(async (c) => {
    const [notesSnap, mcqsSnap, qaSnap, videosSnap] = await Promise.all([
      db.collection("notes").where("chapterId", "==", c.id).limit(1).get(),
      db.collection("mcqs").where("chapterId", "==", c.id).limit(1).get(),
      db.collection("qa").where("chapterId", "==", c.id).limit(1).get(),
      db.collection("videos").where("chapterId", "==", c.id).limit(1).get()
    ]);
    return {
      ...c,
      subjectName: subjectMap.get(c.subjectId) ?? "",
      hasNotes: !notesSnap.empty,
      hasMcqs: !mcqsSnap.empty,
      hasQa: !qaSnap.empty,
      hasVideo: !videosSnap.empty
    };
  }));
}
var chapters = onRequest3({ region: "asia-south1", invoker: "public" }, async (req, res) => {
  if (handleCors(req, res)) return;
  const subPath = getSubPath(req, "/api/chapters");
  try {
    if (req.method === "GET" && (subPath === "/" || subPath === "")) {
      const { subjectId, classLevel } = req.query;
      let query = db.collection("chapters");
      if (subjectId) query = query.where("subjectId", "==", subjectId);
      if (classLevel) query = query.where("classLevel", "==", classLevel);
      const snap = await query.get();
      let chaptersList = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      chaptersList.sort((a, b) => a.chapterNumber - b.chapterNumber);
      res.json(await enrichChapters(chaptersList));
      return;
    }
    if (req.method === "POST" && (subPath === "/" || subPath === "")) {
      requireAdmin(req);
      const { subjectId, classLevel, medium, title, chapterNumber, description } = req.body;
      if (!subjectId || !classLevel || !title) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }
      const newRef = db.collection("chapters").doc();
      const data = {
        subjectId,
        classLevel,
        medium: medium ?? "Both",
        title,
        chapterNumber: chapterNumber ?? 1,
        description,
        createdAt: /* @__PURE__ */ new Date()
      };
      await newRef.set(data);
      const enriched = await enrichChapters([{ id: newRef.id, ...data }]);
      res.status(201).json(enriched[0]);
      return;
    }
    const paramId = extractParam(subPath);
    if (req.method === "GET" && paramId) {
      const docSnap = await db.collection("chapters").doc(paramId).get();
      if (!docSnap.exists) {
        res.status(404).json({ error: "Chapter not found" });
        return;
      }
      const enriched = await enrichChapters([{ id: docSnap.id, ...docSnap.data() }]);
      res.json(enriched[0]);
      return;
    }
    if (req.method === "PUT" && paramId) {
      requireAdmin(req);
      const { subjectId, classLevel, medium, title, chapterNumber, description } = req.body;
      const docRef = db.collection("chapters").doc(paramId);
      const docSnap = await docRef.get();
      if (!docSnap.exists) {
        res.status(404).json({ error: "Chapter not found" });
        return;
      }
      const updates = { subjectId, classLevel, medium: medium ?? "Both", title, chapterNumber, description };
      await docRef.update(updates);
      const enriched = await enrichChapters([{ id: paramId, ...docSnap.data(), ...updates }]);
      res.json(enriched[0]);
      return;
    }
    if (req.method === "DELETE" && paramId) {
      requireAdmin(req);
      await db.collection("chapters").doc(paramId).delete();
      res.status(204).send("");
      return;
    }
    res.status(404).json({ error: "Not found" });
  } catch (err) {
    const authErr = err;
    if (authErr.status && authErr.error) {
      res.status(authErr.status).json({ error: authErr.error });
      return;
    }
    console.error("Chapters error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// src/routes/content.ts
import { onRequest as onRequest4 } from "firebase-functions/v2/https";

// src/lib/notifications.ts
async function emitNotification(rec) {
  try {
    const clean = { createdAt: /* @__PURE__ */ new Date() };
    for (const [k, v] of Object.entries(rec)) {
      if (v !== void 0 && v !== null) clean[k] = v;
    }
    await db.collection("notifications").add(clean);
  } catch (err) {
    console.error("[notifications] emit failed:", err);
  }
}
async function emitContentNotification(args) {
  let chapterTitle;
  let subjectId;
  let subjectName;
  let classLevel = null;
  let medium = "Both";
  try {
    const chapterSnap = await db.collection("chapters").doc(args.chapterId).get();
    if (chapterSnap.exists) {
      const data = chapterSnap.data();
      chapterTitle = data?.title;
      subjectId = data?.subjectId;
      classLevel = data?.classLevel ?? null;
      medium = data?.medium ?? "Both";
      if (subjectId) {
        const subjSnap = await db.collection("subjects").doc(subjectId).get();
        subjectName = subjSnap.data()?.name;
      }
    }
  } catch {
  }
  const kindLabel = {
    new_note: "\u{1F4DD} New Note",
    new_mcq: "\u{1F3AF} New Quiz",
    new_qa: "\u2753 New Q&A",
    new_video: "\u{1F3AC} New Video",
    new_paper: "\u{1F4DC} New Paper",
    content_updated: "\u270F\uFE0F Content Updated"
  }[args.type] ?? "\u{1F514} New";
  await emitNotification({
    type: args.type,
    title: `${kindLabel}: ${args.refTitle}`,
    body: chapterTitle ? `In ${chapterTitle}${subjectName ? ` (${subjectName})` : ""}` : "Open to read",
    refId: args.refId,
    refKind: args.refKind,
    chapterId: args.chapterId,
    chapterTitle,
    subjectId,
    subjectName,
    classLevel,
    medium
  });
}

// src/routes/content.ts
function getContentType(url) {
  const path = url.split("?")[0];
  if (path.startsWith("/api/papers/sets")) {
    const rest = path.slice("/api/papers/sets".length);
    if (!rest || rest === "/") return { type: "paperSets", id: null };
    const id = rest.startsWith("/") ? rest.slice(1) : rest;
    if (id && !id.includes("/")) return { type: "paperSets", id };
  }
  const patterns = ["notes", "mcqs", "qa", "videos", "papers"];
  for (const p of patterns) {
    const prefix = `/api/${p}`;
    if (path.startsWith(prefix)) {
      const rest = path.slice(prefix.length);
      if (!rest || rest === "/") return { type: p, id: null };
      const id = rest.startsWith("/") ? rest.slice(1) : rest;
      if (id && !id.includes("/")) return { type: p, id };
    }
  }
  return { type: "", id: null };
}
var content = onRequest4({ region: "asia-south1", invoker: "public" }, async (req, res) => {
  if (handleCors(req, res)) return;
  const { type, id } = getContentType(req.url || req.path || "");
  if (!type) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  try {
    if (type === "notes") {
      if (req.method === "GET" && !id) {
        const chapterId = req.query.chapterId;
        if (!chapterId) {
          res.status(400).json({ error: "chapterId required" });
          return;
        }
        const snap = await db.collection("notes").where("chapterId", "==", chapterId).get();
        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        docs.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        res.json(docs);
        return;
      }
      if (req.method === "POST" && !id) {
        requireAdmin(req);
        const { chapterId, title, content: noteContent, type: noteType, fileUrl, youtubeId, youtubeIds, order } = req.body;
        if (!chapterId || !title || noteContent == null || !noteType) {
          res.status(400).json({ error: "Missing required fields" });
          return;
        }
        const newRef = db.collection("notes").doc();
        const ytArray = Array.isArray(youtubeIds) ? youtubeIds.filter(Boolean) : youtubeId ? [youtubeId] : [];
        const data = {
          chapterId,
          title,
          content: noteContent,
          type: noteType,
          fileUrl: fileUrl || null,
          youtubeId: ytArray[0] ?? null,
          // legacy field
          youtubeIds: ytArray,
          // new array field
          order: order ?? 0,
          createdAt: /* @__PURE__ */ new Date()
        };
        await newRef.set(data);
        void emitContentNotification({
          type: "new_note",
          refId: newRef.id,
          refKind: "note",
          refTitle: title,
          chapterId
        });
        res.status(201).json({ id: newRef.id, ...data });
        return;
      }
      if (req.method === "PUT" && id) {
        requireAdmin(req);
        const { chapterId, title, content: noteContent, type: noteType, fileUrl, youtubeId, youtubeIds, order } = req.body;
        const docRef = db.collection("notes").doc(id);
        const docSnap = await docRef.get();
        if (!docSnap.exists) {
          res.status(404).json({ error: "Note not found" });
          return;
        }
        const ytArray = Array.isArray(youtubeIds) ? youtubeIds.filter(Boolean) : youtubeId ? [youtubeId] : [];
        const updates = {
          chapterId,
          title,
          content: noteContent,
          type: noteType,
          fileUrl: fileUrl || null,
          youtubeId: ytArray[0] ?? null,
          youtubeIds: ytArray,
          order
        };
        await docRef.update(updates);
        res.json({ id, ...docSnap.data(), ...updates });
        return;
      }
      if (req.method === "DELETE" && id) {
        requireAdmin(req);
        await db.collection("notes").doc(id).delete();
        res.status(204).send("");
        return;
      }
    }
    if (type === "mcqs") {
      if (req.method === "GET" && !id) {
        const chapterId = req.query.chapterId;
        if (!chapterId) {
          res.status(400).json({ error: "chapterId required" });
          return;
        }
        const snap = await db.collection("mcqs").where("chapterId", "==", chapterId).get();
        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        docs.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        res.json(docs);
        return;
      }
      if (req.method === "POST" && !id) {
        requireAdmin(req);
        const { chapterId, question, options, correctIndex, explanation, order, setNumber } = req.body;
        if (!chapterId || !question || !options || correctIndex == null || !explanation) {
          res.status(400).json({ error: "Missing required fields" });
          return;
        }
        const newRef = db.collection("mcqs").doc();
        const data = {
          chapterId,
          question,
          options,
          correctIndex,
          explanation,
          order: order ?? 0,
          setNumber: Number.isFinite(setNumber) && setNumber >= 1 ? Math.floor(setNumber) : 1,
          createdAt: /* @__PURE__ */ new Date()
        };
        await newRef.set(data);
        void emitContentNotification({
          type: "new_mcq",
          refId: newRef.id,
          refKind: "mcq",
          refTitle: "New MCQ added",
          chapterId
        });
        res.status(201).json({ id: newRef.id, ...data });
        return;
      }
      if (req.method === "PUT" && id) {
        requireAdmin(req);
        const { chapterId, question, options, correctIndex, explanation, order, setNumber } = req.body;
        const docRef = db.collection("mcqs").doc(id);
        const docSnap = await docRef.get();
        if (!docSnap.exists) {
          res.status(404).json({ error: "MCQ not found" });
          return;
        }
        const updates = {
          chapterId,
          question,
          options,
          correctIndex,
          explanation,
          order,
          setNumber: Number.isFinite(setNumber) && setNumber >= 1 ? Math.floor(setNumber) : 1
        };
        await docRef.update(updates);
        res.json({ id, ...docSnap.data(), ...updates });
        return;
      }
      if (req.method === "DELETE" && id) {
        requireAdmin(req);
        await db.collection("mcqs").doc(id).delete();
        res.status(204).send("");
        return;
      }
    }
    if (type === "qa") {
      if (req.method === "GET" && !id) {
        const chapterId = req.query.chapterId;
        if (!chapterId) {
          res.status(400).json({ error: "chapterId required" });
          return;
        }
        const snap = await db.collection("qa").where("chapterId", "==", chapterId).get();
        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        docs.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        res.json(docs);
        return;
      }
      if (req.method === "POST" && !id) {
        requireAdmin(req);
        const { chapterId, title, content: content2, question, answer, explanation, youtubeId, youtubeIds, isImportant, order } = req.body;
        const effectiveTitle = typeof title === "string" && title.trim() ? title : question;
        const effectiveBody = typeof content2 === "string" && content2.length > 0 ? content2 : answer;
        if (!chapterId || !effectiveTitle || !effectiveBody) {
          res.status(400).json({ error: "Missing required fields (need chapterId + title|question + content|answer)" });
          return;
        }
        const ytArray = Array.isArray(youtubeIds) ? youtubeIds.filter(Boolean) : youtubeId ? [youtubeId] : [];
        const newRef = db.collection("qa").doc();
        const data = {
          chapterId,
          // New (note-style) fields
          title: effectiveTitle,
          content: effectiveBody,
          // Legacy fields — kept populated so older student clients keep rendering
          question: effectiveTitle,
          answer: effectiveBody,
          explanation: explanation ?? "",
          youtubeId: ytArray[0] ?? null,
          youtubeIds: ytArray,
          isImportant: isImportant ?? false,
          order: order ?? 0,
          createdAt: /* @__PURE__ */ new Date()
        };
        await newRef.set(data);
        void emitContentNotification({
          type: "new_qa",
          refId: newRef.id,
          refKind: "qa",
          refTitle: effectiveTitle.length > 60 ? effectiveTitle.slice(0, 60) + "\u2026" : effectiveTitle,
          chapterId
        });
        res.status(201).json({ id: newRef.id, ...data });
        return;
      }
      if (req.method === "PUT" && id) {
        requireAdmin(req);
        const { chapterId, title, content: content2, question, answer, explanation, youtubeId, youtubeIds, isImportant, order } = req.body;
        const effectiveTitle = typeof title === "string" && title.trim() ? title : question;
        const effectiveBody = typeof content2 === "string" && content2.length > 0 ? content2 : answer;
        const docRef = db.collection("qa").doc(id);
        const docSnap = await docRef.get();
        if (!docSnap.exists) {
          res.status(404).json({ error: "Q&A not found" });
          return;
        }
        const ytArray = Array.isArray(youtubeIds) ? youtubeIds.filter(Boolean) : youtubeId ? [youtubeId] : [];
        const updates = {
          chapterId,
          youtubeId: ytArray[0] ?? null,
          youtubeIds: ytArray,
          order
        };
        if (effectiveTitle !== void 0) {
          updates.title = effectiveTitle;
          updates.question = effectiveTitle;
        }
        if (effectiveBody !== void 0) {
          updates.content = effectiveBody;
          updates.answer = effectiveBody;
        }
        if (explanation !== void 0) updates.explanation = explanation;
        if (isImportant !== void 0) updates.isImportant = isImportant;
        await docRef.update(updates);
        res.json({ id, ...docSnap.data(), ...updates });
        return;
      }
      if (req.method === "DELETE" && id) {
        requireAdmin(req);
        await db.collection("qa").doc(id).delete();
        res.status(204).send("");
        return;
      }
    }
    if (type === "videos") {
      if (req.method === "GET" && !id) {
        const chapterId = req.query.chapterId;
        if (!chapterId) {
          res.status(400).json({ error: "chapterId required" });
          return;
        }
        const snap = await db.collection("videos").where("chapterId", "==", chapterId).get();
        res.json(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        return;
      }
      if (req.method === "POST" && !id) {
        requireAdmin(req);
        const { chapterId, youtubeId, title, description } = req.body;
        if (!chapterId || !youtubeId || !title || !description) {
          res.status(400).json({ error: "Missing required fields" });
          return;
        }
        const newRef = db.collection("videos").doc();
        const data = { chapterId, youtubeId, title, description, createdAt: /* @__PURE__ */ new Date() };
        await newRef.set(data);
        void emitContentNotification({
          type: "new_video",
          refId: newRef.id,
          refKind: "note",
          // video relates to chapter context — use chapter route on click
          refTitle: title,
          chapterId
        });
        res.status(201).json({ id: newRef.id, ...data });
        return;
      }
      if (req.method === "PUT" && id) {
        requireAdmin(req);
        const { chapterId, youtubeId, title, description } = req.body;
        const docRef = db.collection("videos").doc(id);
        const docSnap = await docRef.get();
        if (!docSnap.exists) {
          res.status(404).json({ error: "Video not found" });
          return;
        }
        const updates = { chapterId, youtubeId, title, description };
        await docRef.update(updates);
        res.json({ id, ...docSnap.data(), ...updates });
        return;
      }
      if (req.method === "DELETE" && id) {
        requireAdmin(req);
        await db.collection("videos").doc(id).delete();
        res.status(204).send("");
        return;
      }
    }
    if (type === "paperSets") {
      if (req.method === "GET" && !id) {
        const classFilter = req.query.classLevel;
        let q = db.collection("paperSets");
        if (classFilter && classFilter !== "All") {
          const [matching, both] = await Promise.all([
            db.collection("paperSets").where("classLevel", "==", classFilter).get(),
            db.collection("paperSets").where("classLevel", "==", "Both").get()
          ]);
          const docs2 = [...matching.docs, ...both.docs].map((d) => ({ id: d.id, ...d.data() })).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
          res.json(docs2);
          return;
        }
        const snap = await q.get();
        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        res.json(docs);
        return;
      }
      if (req.method === "GET" && id) {
        const docSnap = await db.collection("paperSets").doc(id).get();
        if (!docSnap.exists) {
          res.status(404).json({ error: "Paper set not found" });
          return;
        }
        res.json({ id, ...docSnap.data() });
        return;
      }
      if (req.method === "POST" && !id) {
        requireAdmin(req);
        const { name, description, classLevel, order } = req.body;
        if (!name) {
          res.status(400).json({ error: "name required" });
          return;
        }
        const allowedClasses = /* @__PURE__ */ new Set(["Class IX", "Class X", "Both"]);
        const safeClass = allowedClasses.has(classLevel) ? classLevel : "Both";
        const newRef = db.collection("paperSets").doc();
        const data = {
          name,
          description: description ?? "",
          classLevel: safeClass,
          order: order ?? 0,
          createdAt: /* @__PURE__ */ new Date()
        };
        await newRef.set(data);
        res.status(201).json({ id: newRef.id, ...data });
        return;
      }
      if (req.method === "PUT" && id) {
        requireAdmin(req);
        const { name, description, classLevel, order } = req.body;
        const docRef = db.collection("paperSets").doc(id);
        const docSnap = await docRef.get();
        if (!docSnap.exists) {
          res.status(404).json({ error: "Paper set not found" });
          return;
        }
        const allowedClasses = /* @__PURE__ */ new Set(["Class IX", "Class X", "Both"]);
        const updates = {};
        if (name !== void 0) updates.name = name;
        if (description !== void 0) updates.description = description;
        if (classLevel !== void 0 && allowedClasses.has(classLevel)) updates.classLevel = classLevel;
        if (order !== void 0) updates.order = order;
        await docRef.update(updates);
        res.json({ id, ...docSnap.data(), ...updates });
        return;
      }
      if (req.method === "DELETE" && id) {
        requireAdmin(req);
        const papersSnap = await db.collection("papers").where("setId", "==", id).get();
        const batch = db.batch();
        papersSnap.docs.forEach((d) => batch.delete(d.ref));
        batch.delete(db.collection("paperSets").doc(id));
        await batch.commit();
        res.status(204).send("");
        return;
      }
    }
    if (type === "papers") {
      if (req.method === "GET" && !id) {
        const setId = req.query.setId;
        if (!setId) {
          res.status(400).json({ error: "setId query required" });
          return;
        }
        const snap = await db.collection("papers").where("setId", "==", setId).get();
        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        res.json(docs);
        return;
      }
      if (req.method === "GET" && id) {
        const docSnap = await db.collection("papers").doc(id).get();
        if (!docSnap.exists) {
          res.status(404).json({ error: "Paper not found" });
          return;
        }
        res.json({ id, ...docSnap.data() });
        return;
      }
      if (req.method === "POST" && !id) {
        requireAdmin(req);
        const { setId, title, content: body, youtubeIds, order } = req.body;
        if (!setId || !title) {
          res.status(400).json({ error: "setId + title required" });
          return;
        }
        const setSnap = await db.collection("paperSets").doc(setId).get();
        if (!setSnap.exists) {
          res.status(404).json({ error: "Parent paper set not found" });
          return;
        }
        const ytArray = Array.isArray(youtubeIds) ? youtubeIds.filter(Boolean) : [];
        const newRef = db.collection("papers").doc();
        const data = {
          setId,
          title,
          content: body ?? "",
          youtubeIds: ytArray,
          order: order ?? 0,
          createdAt: /* @__PURE__ */ new Date()
        };
        await newRef.set(data);
        const setData = setSnap.data();
        void emitNotification({
          type: "new_paper",
          title: `\u{1F4DC} New Paper: ${title}`,
          body: `In ${setData?.name ?? "Full Length Papers"}`,
          refId: newRef.id,
          refKind: "paper",
          chapterId: setId,
          // synthetic — points at the paperSet for routing
          chapterTitle: setData?.name,
          subjectName: "Full Length Papers",
          classLevel: setData?.classLevel ?? null,
          medium: "Both"
        });
        res.status(201).json({ id: newRef.id, ...data });
        return;
      }
      if (req.method === "PUT" && id) {
        requireAdmin(req);
        const { setId, title, content: body, youtubeIds, order } = req.body;
        const docRef = db.collection("papers").doc(id);
        const docSnap = await docRef.get();
        if (!docSnap.exists) {
          res.status(404).json({ error: "Paper not found" });
          return;
        }
        const ytArray = Array.isArray(youtubeIds) ? youtubeIds.filter(Boolean) : [];
        const updates = { youtubeIds: ytArray };
        if (setId !== void 0) updates.setId = setId;
        if (title !== void 0) updates.title = title;
        if (body !== void 0) updates.content = body;
        if (order !== void 0) updates.order = order;
        await docRef.update(updates);
        res.json({ id, ...docSnap.data(), ...updates });
        return;
      }
      if (req.method === "DELETE" && id) {
        requireAdmin(req);
        await db.collection("papers").doc(id).delete();
        res.status(204).send("");
        return;
      }
    }
    res.status(404).json({ error: "Not found" });
  } catch (err) {
    const authErr = err;
    if (authErr.status && authErr.error) {
      res.status(authErr.status).json({ error: authErr.error });
      return;
    }
    console.error("Content error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// src/routes/experiments.ts
import { onRequest as onRequest5 } from "firebase-functions/v2/https";
var FIELDS = [
  "subject",
  "classLevel",
  "title",
  "objective",
  "theory",
  "apparatus",
  "procedure",
  "expectedResult",
  "explanation",
  "videoUrl",
  "hints",
  "summary",
  "type",
  "difficulty"
];
function pick(body) {
  const out = {};
  for (const f of FIELDS) {
    if (body[f] !== void 0) out[f] = body[f];
  }
  return out;
}
var experiments = onRequest5({ region: "asia-south1", invoker: "public" }, async (req, res) => {
  if (handleCors(req, res)) return;
  const subPath = getSubPath(req, "/api/experiments");
  try {
    if (req.method === "GET" && (subPath === "/" || subPath === "")) {
      const { classLevel } = req.query;
      let query = db.collection("experiments");
      if (classLevel) {
        query = query.where("classLevel", "==", classLevel);
      }
      const snap = await query.get();
      const exps = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      res.json(exps);
      return;
    }
    if (req.method === "POST" && (subPath === "/" || subPath === "")) {
      requireAdmin(req);
      const data = pick(req.body);
      const required = ["subject", "classLevel", "title", "objective", "procedure", "expectedResult", "explanation", "type"];
      for (const f of required) {
        if (!data[f]) {
          res.status(400).json({ error: `Missing field: ${f}` });
          return;
        }
      }
      if (!data.difficulty) data.difficulty = "medium";
      const newRef = db.collection("experiments").doc();
      const newData = { ...data, createdAt: /* @__PURE__ */ new Date() };
      await newRef.set(newData);
      res.status(201).json({ id: newRef.id, ...newData });
      return;
    }
    if (req.method === "DELETE" && subPath === "/delete-by-subject") {
      requireAdmin(req);
      const subject = req.query.subject;
      if (!subject) {
        res.status(400).json({ error: "subject query param required" });
        return;
      }
      const snap = await db.collection("experiments").where("subject", "==", subject).get();
      const batch = db.batch();
      snap.docs.forEach((d) => batch.delete(d.ref));
      await batch.commit();
      res.json({ deleted: snap.size });
      return;
    }
    const paramId = extractParam(subPath);
    if (req.method === "GET" && paramId) {
      const docSnap = await db.collection("experiments").doc(paramId).get();
      if (!docSnap.exists) {
        res.status(404).json({ error: "Experiment not found" });
        return;
      }
      res.json({ id: docSnap.id, ...docSnap.data() });
      return;
    }
    if (req.method === "PUT" && paramId) {
      requireAdmin(req);
      const data = pick(req.body);
      const docRef = db.collection("experiments").doc(paramId);
      const docSnap = await docRef.get();
      if (!docSnap.exists) {
        res.status(404).json({ error: "Experiment not found" });
        return;
      }
      await docRef.update(data);
      res.json({ id: paramId, ...docSnap.data(), ...data });
      return;
    }
    if (req.method === "DELETE" && paramId) {
      requireAdmin(req);
      await db.collection("experiments").doc(paramId).delete();
      res.status(204).send("");
      return;
    }
    res.status(404).json({ error: "Not found" });
  } catch (err) {
    const authErr = err;
    if (authErr.status && authErr.error) {
      res.status(authErr.status).json({ error: authErr.error });
      return;
    }
    console.error("Experiments error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// src/routes/progress.ts
import { onRequest as onRequest6 } from "firebase-functions/v2/https";
var progress = onRequest6({ region: "asia-south1", invoker: "public" }, async (req, res) => {
  if (handleCors(req, res)) return;
  const subPath = getSubPath(req, "/api/progress");
  try {
    if (req.method === "GET" && (subPath === "/" || subPath === "")) {
      const user = requireAuth(req);
      const [masterySnap, chaptersSnap, subjectsSnap] = await Promise.all([
        db.collection("studentProgress").doc(user.id).collection("chapterMastery").get(),
        db.collection("chapters").get(),
        db.collection("subjects").get()
      ]);
      const chapterMap = new Map(chaptersSnap.docs.map((d) => [d.id, d.data()]));
      const subjectMap = new Map(subjectsSnap.docs.map((d) => [d.id, d.data()]));
      const rows = masterySnap.docs.map((doc) => {
        const m = doc.data();
        const c = chapterMap.get(m.chapterId) || {};
        const s = subjectMap.get(m.subjectId || c.subjectId) || {};
        return {
          id: doc.id,
          userId: user.id,
          chapterId: m.chapterId,
          chapterTitle: m.chapterTitle || c.title || "",
          subjectName: m.subjectName || s.name || "",
          subjectId: m.subjectId || c.subjectId || "",
          // Keep legacy field names for API client compatibility
          mcqScore: m.mcqTotalCorrect ?? null,
          mcqTotal: m.mcqTotalAttempted ?? null,
          mcqBestScore: m.mcqBestScore ?? null,
          mcqAccuracy: m.mcqAccuracy ?? null,
          masteryScore: m.masteryScore ?? 0,
          masteryStatus: m.masteryStatus ?? "not_started",
          visited: m.masteryStatus !== "not_started",
          notesCompleted: m.notesCompleted ?? 0,
          lastAccessedAt: m.lastStudiedAt?.toDate?.()?.toISOString() ?? null
        };
      }).sort(
        (a, b) => new Date(b.lastAccessedAt ?? 0).getTime() - new Date(a.lastAccessedAt ?? 0).getTime()
      );
      res.json(rows);
      return;
    }
    if (req.method === "POST" && subPath === "/mcq-score") {
      const user = requireAuth(req);
      const { chapterId, score, total } = req.body;
      if (!chapterId || score == null || total == null) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }
      const existingSnap = await db.collection("progress").where("userId", "==", user.id).where("chapterId", "==", chapterId).limit(1).get();
      let pId;
      let pData;
      if (!existingSnap.empty) {
        const docRef = existingSnap.docs[0].ref;
        pId = docRef.id;
        await docRef.update({ mcqScore: score, mcqTotal: total, lastAccessedAt: /* @__PURE__ */ new Date() });
        pData = { ...existingSnap.docs[0].data(), mcqScore: score, mcqTotal: total };
      } else {
        const newRef = db.collection("progress").doc();
        pId = newRef.id;
        pData = { userId: user.id, chapterId, mcqScore: score, mcqTotal: total, visited: true, lastAccessedAt: /* @__PURE__ */ new Date() };
        await newRef.set(pData);
      }
      res.json([{ id: pId, ...pData, lastAccessedAt: (/* @__PURE__ */ new Date()).toISOString() }]);
      return;
    }
    if (req.method === "POST" && subPath === "/mark-chapter") {
      const user = requireAuth(req);
      const { chapterId } = req.body;
      if (!chapterId) {
        res.status(400).json({ error: "chapterId required" });
        return;
      }
      const existingSnap = await db.collection("progress").where("userId", "==", user.id).where("chapterId", "==", chapterId).limit(1).get();
      if (!existingSnap.empty) {
        await existingSnap.docs[0].ref.update({ visited: true, lastAccessedAt: /* @__PURE__ */ new Date() });
      } else {
        await db.collection("progress").add({ userId: user.id, chapterId, visited: true, lastAccessedAt: /* @__PURE__ */ new Date() });
      }
      res.json({ ok: true });
      return;
    }
    res.status(404).json({ error: "Not found" });
  } catch (err) {
    const authErr = err;
    if (authErr.status && authErr.error) {
      res.status(authErr.status).json({ error: authErr.error });
      return;
    }
    console.error("Progress error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// src/routes/dashboard.ts
import { onRequest as onRequest7 } from "firebase-functions/v2/https";
var dashboard = onRequest7({ region: "asia-south1", invoker: "public" }, async (req, res) => {
  if (handleCors(req, res)) return;
  const subPath = getSubPath(req, "/api/dashboard");
  try {
    if (req.method === "GET" && subPath === "/summary") {
      const user = requireAuth(req);
      const classLevel = req.query.classLevel?.trim() || null;
      const medium = req.query.medium?.trim() || null;
      const [statsSnap, chaptersSnap, subjectsSnap, masterySnap] = await Promise.all([
        db.collection("studentProgress").doc(user.id).get(),
        db.collection("chapters").get(),
        db.collection("subjects").get(),
        db.collection("studentProgress").doc(user.id).collection("chapterMastery").orderBy("lastStudiedAt", "desc").limit(5).get()
      ]);
      const stats = statsSnap.exists ? statsSnap.data() : {};
      const trackChapters = chaptersSnap.docs.filter((c) => {
        const d = c.data();
        if (classLevel && d.classLevel && d.classLevel !== classLevel) return false;
        if (medium && d.medium && d.medium !== "Both" && d.medium !== medium) return false;
        return true;
      });
      const trackChapterIds = new Set(trackChapters.map((c) => c.id));
      const totalChapters = trackChapters.length;
      const allMasterySnap = await db.collection("studentProgress").doc(user.id).collection("chapterMastery").get();
      const visitedChapters = allMasterySnap.docs.filter((d) => {
        const data = d.data();
        if (data.masteryStatus === "not_started") return false;
        if (classLevel || medium) {
          const cl = data.classLevel ?? null;
          const md = data.medium ?? null;
          if (cl || md) {
            if (classLevel && cl && cl !== classLevel) return false;
            if (medium && md && md !== "Both" && md !== medium) return false;
            return true;
          }
          return trackChapterIds.has(data.chapterId);
        }
        return true;
      }).length;
      const totalMcqAttempted = stats.totalMcqsAttempted ?? 0;
      const totalMcqCorrect = stats.totalMcqsCorrect ?? 0;
      const averageScore = totalMcqAttempted > 0 ? Math.round(totalMcqCorrect / totalMcqAttempted * 100 * 10) / 10 : 0;
      const subjectMap = new Map(subjectsSnap.docs.map((d) => [d.id, d.data()]));
      const recentChapters = masterySnap.docs.map((doc) => {
        const m = doc.data();
        const s = subjectMap.get(m.subjectId) || {};
        return {
          chapterId: m.chapterId,
          chapterTitle: m.chapterTitle || "",
          subjectName: m.subjectName || s.name || "",
          mcqScore: m.mcqTotalCorrect ?? null,
          mcqTotal: m.mcqTotalAttempted ?? null,
          mcqBestScore: m.mcqBestScore ?? null,
          masteryScore: m.masteryScore ?? 0,
          masteryStatus: m.masteryStatus ?? "not_started",
          visited: true,
          lastAccessedAt: m.lastStudiedAt?.toDate?.()?.toISOString() ?? null
        };
      });
      const subjectIdsInTrack = new Set(trackChapters.map((c) => c.data().subjectId));
      const subjectProgressMap = /* @__PURE__ */ new Map();
      for (const s of subjectsSnap.docs) {
        if (!subjectIdsInTrack.has(s.id)) continue;
        subjectProgressMap.set(s.id, {
          subjectId: s.id,
          subjectName: s.data().name,
          chaptersTotal: 0,
          chaptersVisited: 0,
          // New fields from studentProgress stats doc
          notesRead: stats.subjectProgress?.[s.id]?.notesRead ?? 0,
          mcqsAttempted: stats.subjectProgress?.[s.id]?.mcqsAttempted ?? 0,
          mcqsCorrect: stats.subjectProgress?.[s.id]?.mcqsCorrect ?? 0
        });
      }
      for (const c of trackChapters) {
        const data = c.data();
        if (subjectProgressMap.has(data.subjectId)) {
          subjectProgressMap.get(data.subjectId).chaptersTotal++;
        }
      }
      for (const doc of allMasterySnap.docs) {
        const m = doc.data();
        if (m.masteryStatus === "not_started") continue;
        if (!subjectProgressMap.has(m.subjectId)) continue;
        const inTrack = trackChapterIds.has(m.chapterId) || classLevel == null && medium == null;
        if (!inTrack) continue;
        subjectProgressMap.get(m.subjectId).chaptersVisited++;
      }
      res.json({
        // Legacy fields (API client compatibility)
        totalChapters,
        visitedChapters,
        totalMcqAttempts: totalMcqAttempted,
        averageScore,
        recentChapters,
        subjectProgress: Array.from(subjectProgressMap.values()),
        // New enriched fields
        totalNotesRead: stats.totalNotesRead ?? 0,
        totalMcqsCorrect: totalMcqCorrect,
        accuracyPercent: averageScore,
        currentStreak: stats.currentStreak ?? 0,
        longestStreak: stats.longestStreak ?? 0,
        experimentsCompleted: stats.totalExperimentsCompleted ?? 0,
        lastStudiedChapterId: stats.lastStudiedChapterId ?? null,
        lastStudiedChapterTitle: stats.lastStudiedChapterTitle ?? null
      });
      return;
    }
    res.status(404).json({ error: "Not found" });
  } catch (err) {
    const authErr = err;
    if (authErr.status && authErr.error) {
      res.status(authErr.status).json({ error: authErr.error });
      return;
    }
    console.error("Dashboard error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// src/routes/search.ts
import { onRequest as onRequest8 } from "firebase-functions/v2/https";
var CACHE = null;
var CACHE_TTL_MS = 5 * 60 * 1e3;
var STOP_WORDS = /* @__PURE__ */ new Set([
  "a",
  "an",
  "the",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "am",
  "do",
  "does",
  "did",
  "doing",
  "done",
  "have",
  "has",
  "had",
  "having",
  "can",
  "could",
  "will",
  "would",
  "should",
  "shall",
  "may",
  "might",
  "must",
  "what",
  "why",
  "how",
  "when",
  "where",
  "who",
  "whom",
  "which",
  "whose",
  "of",
  "in",
  "on",
  "at",
  "by",
  "for",
  "with",
  "from",
  "to",
  "into",
  "over",
  "under",
  "and",
  "or",
  "but",
  "not",
  "no",
  "yes",
  "so",
  "if",
  "then",
  "than",
  "that",
  "this",
  "these",
  "those",
  "it",
  "its",
  "i",
  "you",
  "he",
  "she",
  "they",
  "we",
  "my",
  "your",
  "his",
  "her",
  "their",
  "our",
  "me",
  "us",
  "him",
  "them",
  "about",
  "as",
  "like",
  "very",
  "really",
  "just",
  "more",
  "most",
  "much",
  "many",
  "some",
  "any",
  "all",
  "each",
  "every",
  "other",
  "another"
]);
var SYNONYMS = {
  "ohms law": ["v=ir", "voltage current resistance", "ohm law"],
  "myopia": ["short sighted", "shortsightedness", "nearsighted", "cannot see far"],
  "hypermetropia": ["far sighted", "farsightedness", "long sighted", "cannot see near"],
  "presbyopia": ["old age sight", "age related vision"],
  "reflection": ["mirror", "bouncing light"],
  "refraction": ["bending light", "snells law"],
  "dispersion": ["splitting of light", "rainbow", "prism"],
  "joule heating": ["wire becomes hot", "heating effect of current", "heating wire"],
  "photosynthesis": ["plants make food", "leaves food", "chlorophyll glucose"],
  "respiration": ["breathing", "oxygen energy", "cellular respiration"],
  "mitochondria": ["powerhouse of cell", "energy organelle"],
  "newton second law": ["f=ma", "force mass acceleration"],
  "newton third law": ["action reaction", "equal opposite"],
  "gravitation": ["gravity", "free fall", "weight"],
  "electromagnet": ["electromagnetism", "magnetic effect current", "solenoid"],
  "acid": ["acidic", "ph below 7", "sour"],
  "base": ["basic", "alkali", "alkaline", "ph above 7"],
  "salt": ["neutralization product"],
  "ph": ["acidity", "ph scale", "ph value"],
  "atom": ["atomic", "element particle"],
  "molecule": ["molecular", "compound"],
  "electron": ["electrons", "negative charge"],
  "proton": ["protons", "positive charge"],
  "neutron": ["neutrons", "neutral particle"],
  "valency": ["combining capacity", "valence"],
  "mole": ["avogadro number", "molar mass"],
  "tissue": ["tissues", "group of cells"],
  "cell": ["cells", "basic unit life"],
  "evolution": ["natural selection", "darwin", "species change"],
  "heredity": ["inheritance", "genes", "dna"],
  "polynomial": ["polynomials", "algebraic expression"],
  "quadratic": ["x squared", "ax2 bx c"],
  "trigonometry": ["sin cos tan", "trig ratios"],
  "circle": ["circles", "circumference area"],
  "triangle": ["triangles", "pythagoras"],
  "probability": ["chance", "likelihood"],
  "statistics": ["mean median mode", "data analysis"],
  "circuit": ["electric circuit", "wiring", "components"],
  "current": ["electric current", "amperes", "flow of charge"],
  "voltage": ["potential difference", "volts", "emf"],
  "resistance": ["resistor", "ohms", "opposition to current"],
  "magnetic field": ["magnet field", "lines of force"],
  "sound": ["audio", "vibration", "waves"],
  "echo": ["reflection of sound", "sound returning"],
  "force": ["push pull", "newtons"],
  "motion": ["movement", "speed velocity"],
  "speed": ["fast slow", "distance per time"],
  "velocity": ["speed direction", "vector speed"],
  "acceleration": ["rate of change velocity", "speeding up"],
  "energy": ["work done", "joules"],
  "work": ["energy transfer", "force times distance"],
  "power": ["rate of work", "watts"]
};
var SYNONYM_LOOKUP = (() => {
  const m = /* @__PURE__ */ new Map();
  for (const [key, vals] of Object.entries(SYNONYMS)) {
    const allTerms = [key, ...vals];
    for (const term of allTerms) {
      const others = allTerms.filter((t) => t !== term);
      const existing = m.get(term) ?? [];
      m.set(term, [.../* @__PURE__ */ new Set([...existing, ...others])]);
    }
  }
  return m;
})();
function normalizeText(s) {
  return s.toLowerCase().replace(/[^\p{L}\p{N}\s=]+/gu, " ").replace(/\s+/g, " ").trim();
}
function extractKeywords(query) {
  const normalized = normalizeText(query);
  if (!normalized) return [];
  const words = normalized.split(" ").filter((w) => w.length >= 2 && !STOP_WORDS.has(w));
  return [...new Set(words)];
}
function getSynonymExpansions(keywords, rawQuery) {
  const out = /* @__PURE__ */ new Set();
  const normalizedQuery = normalizeText(rawQuery);
  for (const [term, expansions] of SYNONYM_LOOKUP) {
    if (term.includes(" ") && normalizedQuery.includes(term)) {
      for (const exp of expansions) out.add(exp);
    }
  }
  for (const kw of keywords) {
    const expansions = SYNONYM_LOOKUP.get(kw);
    if (expansions) {
      for (const exp of expansions) out.add(exp);
    }
  }
  for (const kw of keywords) out.delete(kw);
  return [...out];
}
var MIN_SCORE_THRESHOLD = 10;
function scoreDoc(doc, ctx) {
  const title = doc.title.toLowerCase();
  const text = doc.searchableText;
  let score = 0;
  if (ctx.normalizedQuery.length >= 3 && title.includes(ctx.normalizedQuery)) {
    score += 100;
  }
  if (ctx.normalizedQuery.length >= 3 && text.includes(ctx.normalizedQuery)) {
    score += 20;
  }
  for (const kw of ctx.rawKeywords) {
    if (title.includes(kw)) score += 15;
    else if (text.includes(kw)) score += 6;
  }
  for (const exp of ctx.synonymExpansions) {
    if (text.includes(exp)) {
      score += exp.includes(" ") ? 5 : 3;
    }
  }
  const typeBoost = {
    note: 3,
    chapter: 2,
    mcq: 1,
    qa: 1,
    lab: 2,
    paper: 1
  };
  score += typeBoost[doc.type] ?? 0;
  return score;
}
async function buildIndex() {
  const [chaptersSnap, subjectsSnap, notesSnap, mcqsSnap, qaSnap, experimentsSnap, papersSnap, paperSetsSnap] = await Promise.all([
    db.collection("chapters").get(),
    db.collection("subjects").get(),
    db.collection("notes").get(),
    db.collection("mcqs").get(),
    db.collection("qa").get(),
    db.collection("experiments").get(),
    db.collection("papers").get(),
    db.collection("paperSets").get()
  ]);
  const subjectMap = new Map(
    subjectsSnap.docs.map((d) => [d.id, d.data().name ?? ""])
  );
  const chapterMetaMap = /* @__PURE__ */ new Map();
  chaptersSnap.docs.forEach((d) => {
    const data = d.data();
    chapterMetaMap.set(d.id, {
      classLevel: data.classLevel ?? null,
      medium: data.medium ?? "Both",
      subjectId: data.subjectId,
      subjectName: subjectMap.get(data.subjectId) ?? "",
      chapterNumber: data.chapterNumber,
      title: data.title
    });
  });
  const paperSetMap = new Map(
    paperSetsSnap.docs.map((d) => [d.id, { title: d.data().title ?? "", subjectId: d.data().subjectId }])
  );
  const docs = [];
  for (const d of chaptersSnap.docs) {
    const data = d.data();
    const meta = chapterMetaMap.get(d.id);
    const title = data.title ?? "";
    const body = data.description ?? "";
    docs.push({
      id: d.id,
      type: "chapter",
      title,
      body,
      subjectId: meta.subjectId,
      subjectName: meta.subjectName,
      chapterNumber: meta.chapterNumber,
      classLevel: meta.classLevel,
      medium: meta.medium,
      href: `/chapters/${d.id}`,
      searchableText: normalizeText(`${title} ${body} ${meta.subjectName}`)
    });
  }
  for (const d of notesSnap.docs) {
    const data = d.data();
    const meta = chapterMetaMap.get(data.chapterId);
    if (!meta) continue;
    const title = data.title ?? "";
    const body = (data.content ?? "").slice(0, 500);
    docs.push({
      id: d.id,
      type: "note",
      title,
      body,
      chapterId: data.chapterId,
      subjectId: meta.subjectId,
      subjectName: meta.subjectName,
      classLevel: meta.classLevel,
      medium: meta.medium,
      href: `/chapters/${data.chapterId}?tab=notes&open=${d.id}`,
      searchableText: normalizeText(`${title} ${body} ${meta.title}`)
    });
  }
  for (const d of mcqsSnap.docs) {
    const data = d.data();
    const meta = chapterMetaMap.get(data.chapterId);
    if (!meta) continue;
    const title = data.question ?? "";
    const body = (Array.isArray(data.options) ? data.options.join(" ") : "") + " " + (data.explanation ?? "");
    docs.push({
      id: d.id,
      type: "mcq",
      title,
      body,
      chapterId: data.chapterId,
      subjectId: meta.subjectId,
      subjectName: meta.subjectName,
      classLevel: meta.classLevel,
      medium: meta.medium,
      href: `/chapters/${data.chapterId}?tab=mcq`,
      searchableText: normalizeText(`${title} ${body} ${meta.title}`),
      extra: { setNumber: data.setNumber ?? 1 }
    });
  }
  for (const d of qaSnap.docs) {
    const data = d.data();
    const meta = chapterMetaMap.get(data.chapterId);
    if (!meta) continue;
    const title = data.title ?? data.question ?? "";
    const body = data.content ?? data.answer ?? "";
    docs.push({
      id: d.id,
      type: "qa",
      title,
      body,
      chapterId: data.chapterId,
      subjectId: meta.subjectId,
      subjectName: meta.subjectName,
      classLevel: meta.classLevel,
      medium: meta.medium,
      href: `/chapters/${data.chapterId}?tab=qa`,
      searchableText: normalizeText(`${title} ${body} ${meta.title} ${data.explanation ?? ""}`)
    });
  }
  for (const d of experimentsSnap.docs) {
    const data = d.data();
    const title = data.title ?? "";
    const body = data.description ?? "";
    const slug = data.slug ?? d.id;
    docs.push({
      id: d.id,
      type: "lab",
      title,
      body,
      classLevel: data.classLevel ?? null,
      medium: null,
      // labs are not bound to a single medium
      href: `/virtual-lab/${slug}`,
      searchableText: normalizeText(`${title} ${body} ${data.subject ?? ""} lab experiment`)
    });
  }
  for (const d of papersSnap.docs) {
    const data = d.data();
    const set = paperSetMap.get(data.setId);
    const title = data.title ?? "";
    const body = (data.content ?? "").slice(0, 400);
    docs.push({
      id: d.id,
      type: "paper",
      title,
      body,
      subjectId: set?.subjectId,
      subjectName: set ? set.title : "",
      classLevel: data.classLevel ?? null,
      medium: data.medium ?? null,
      href: `/papers/${data.setId}/${d.id}`,
      searchableText: normalizeText(`${title} ${body} ${set?.title ?? ""} paper`)
    });
  }
  return docs;
}
async function getIndex() {
  const now = Date.now();
  if (CACHE && now - CACHE.loadedAt < CACHE_TTL_MS) return CACHE.docs;
  const docs = await buildIndex();
  CACHE = { docs, loadedAt: now };
  return docs;
}
var MAX_PER_CATEGORY = 8;
var search = onRequest8({ region: "asia-south1", invoker: "public" }, async (req, res) => {
  if (handleCors(req, res)) return;
  try {
    if (req.method !== "GET") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }
    const rawQuery = (req.query.q ?? "").trim();
    if (rawQuery.length < 2) {
      res.json({ chapters: [], notes: [], mcqs: [], qa: [], labs: [], papers: [], questions: [] });
      return;
    }
    const normalizedQuery = normalizeText(rawQuery);
    let rawKeywords = extractKeywords(rawQuery);
    if (rawKeywords.length === 0) rawKeywords = [normalizedQuery];
    const synonymExpansions = getSynonymExpansions(rawKeywords, rawQuery);
    const ctx = { rawKeywords, synonymExpansions, normalizedQuery };
    const docs = await getIndex();
    const scored = [];
    for (const doc of docs) {
      const s = scoreDoc(doc, ctx);
      if (s >= MIN_SCORE_THRESHOLD) scored.push({ doc, score: s });
    }
    scored.sort((a, b) => b.score - a.score);
    const buckets = {
      chapter: [],
      note: [],
      mcq: [],
      qa: [],
      lab: [],
      paper: []
    };
    for (const { doc } of scored) {
      const bucket = buckets[doc.type];
      if (bucket.length < MAX_PER_CATEGORY) bucket.push(doc);
    }
    res.json({
      chapters: buckets.chapter,
      notes: buckets.note,
      mcqs: buckets.mcq,
      qa: buckets.qa,
      labs: buckets.lab,
      papers: buckets.paper,
      // legacy
      questions: buckets.qa.map((q) => ({
        id: q.id,
        chapterId: q.chapterId,
        question: q.title,
        answer: q.body,
        classLevel: q.classLevel,
        medium: q.medium
      }))
    });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// src/routes/students.ts
import { onRequest as onRequest9 } from "firebase-functions/v2/https";
var students = onRequest9({ region: "asia-south1", invoker: "public" }, async (req, res) => {
  if (handleCors(req, res)) return;
  try {
    const path = (req.path || req.url.split("?")[0] || "").replace(/^\/+|\/+$/g, "");
    if (req.method === "PATCH" && (path === "api/students/me" || path === "students/me" || path === "me")) {
      const user = requireAuth(req);
      if (user.role !== "student") {
        res.status(403).json({ error: "Only students can update their own prefs" });
        return;
      }
      const { classLevel, medium } = req.body ?? {};
      const validClasses = /* @__PURE__ */ new Set(["Class IX", "Class X"]);
      const validMediums = /* @__PURE__ */ new Set(["Assamese", "English"]);
      const updates = {};
      if (classLevel !== void 0) {
        if (!validClasses.has(classLevel)) {
          res.status(400).json({ error: "Invalid classLevel" });
          return;
        }
        updates.classLevel = classLevel;
      }
      if (medium !== void 0) {
        if (!validMediums.has(medium)) {
          res.status(400).json({ error: "Invalid medium" });
          return;
        }
        updates.medium = medium;
      }
      if (Object.keys(updates).length === 0) {
        res.status(400).json({ error: "Nothing to update" });
        return;
      }
      const ref = db.collection("students").doc(user.id);
      const snap2 = await ref.get();
      if (!snap2.exists) {
        res.status(404).json({ error: "Student not found" });
        return;
      }
      await ref.update(updates);
      try {
        await db.collection("aiRecommendations").doc(user.id).delete();
      } catch {
      }
      try {
        const profileRef = db.collection("studentKnowledgeProfiles").doc(user.id);
        const profileSnap = await profileRef.get();
        if (profileSnap.exists) {
          const profileUpdates = {};
          if (updates.classLevel !== void 0) profileUpdates.classLevel = updates.classLevel;
          if (updates.medium !== void 0) profileUpdates.medium = updates.medium;
          if (Object.keys(profileUpdates).length > 0) {
            await profileRef.update(profileUpdates);
          }
        }
      } catch (err) {
        console.warn("[students PATCH] profile sync failed:", err);
      }
      res.json({ ok: true, classLevel: updates.classLevel ?? snap2.data()?.classLevel ?? null, medium: updates.medium ?? snap2.data()?.medium ?? null });
      return;
    }
    if (req.method === "GET" && (path === "api/students/me" || path === "students/me" || path === "me")) {
      const user = requireAuth(req);
      if (user.role !== "student") {
        res.status(403).json({ error: "Only students can read their own profile" });
        return;
      }
      const snap2 = await db.collection("students").doc(user.id).get();
      if (!snap2.exists) {
        res.status(404).json({ error: "Student not found" });
        return;
      }
      const data = snap2.data() ?? {};
      res.json({
        id: snap2.id,
        name: data.name ?? null,
        classLevel: data.classLevel ?? null,
        medium: data.medium ?? null,
        board: data.board ?? null
      });
      return;
    }
    if (req.method !== "GET") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }
    requireAdmin(req);
    const snap = await db.collection("students").orderBy("createdAt", "desc").get();
    const studentsList = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() ?? null,
      lastLogin: doc.data().lastLogin?.toDate?.()?.toISOString() ?? null
    }));
    res.json(studentsList);
  } catch (err) {
    const authErr = err;
    if (authErr.status && authErr.error) {
      res.status(authErr.status).json({ error: authErr.error });
      return;
    }
    console.error("Students error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// src/routes/storage.ts
import { onRequest as onRequest10 } from "firebase-functions/v2/https";
import { getStorage } from "firebase-admin/storage";
import { randomUUID } from "crypto";
var UPLOAD_PREFIX = "note-uploads";
var MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
function getBucketName() {
  if (process.env.STORAGE_BUCKET) return process.env.STORAGE_BUCKET;
  const projectId = process.env.GCLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT;
  if (projectId) return `${projectId}.firebasestorage.app`;
  throw new Error("Could not resolve storage bucket name");
}
var storage = onRequest10(
  { region: "asia-south1", invoker: "public", memory: "512MiB" },
  async (req, res) => {
    if (handleCors(req, res)) return;
    try {
      const path = (req.path || req.url.split("?")[0] || "").replace(/^\/+|\/+$/g, "");
      const bucket = getStorage().bucket(getBucketName());
      if (req.method === "POST" && /(?:^|\/)upload$/.test(path)) {
        requireAdmin(req);
        const body = req.rawBody;
        if (!body || body.length === 0) {
          res.status(400).json({ error: "Empty body" });
          return;
        }
        if (body.length > MAX_UPLOAD_BYTES) {
          res.status(413).json({ error: "File too large (max 10 MB)" });
          return;
        }
        const contentType = req.headers["content-type"] || "application/octet-stream";
        if (!contentType.toString().startsWith("image/")) {
          res.status(400).json({ error: "Only image/* uploads are allowed" });
          return;
        }
        const objectId = randomUUID();
        const file = bucket.file(`${UPLOAD_PREFIX}/${objectId}`);
        await file.save(body, {
          contentType: contentType.toString(),
          resumable: false,
          metadata: { cacheControl: "public, max-age=86400" }
        });
        res.json({ objectPath: `/objects/${objectId}` });
        return;
      }
      if (req.method === "GET") {
        const m = path.match(/(?:^|\/)objects\/([^/]+)$/);
        if (m) {
          const objectId = m[1];
          const file = bucket.file(`${UPLOAD_PREFIX}/${objectId}`);
          const [exists] = await file.exists();
          if (!exists) {
            res.status(404).json({ error: "Not found" });
            return;
          }
          const [metadata] = await file.getMetadata();
          res.set("Content-Type", String(metadata.contentType ?? "application/octet-stream"));
          res.set("Cache-Control", "public, max-age=86400");
          file.createReadStream().on("error", (e) => {
            console.error("[storage] stream error:", e);
            if (!res.headersSent) res.status(500).end();
          }).pipe(res);
          return;
        }
      }
      res.status(404).json({ error: "Not found" });
    } catch (err) {
      const authErr = err;
      if (authErr.status && authErr.error) {
        res.status(authErr.status).json({ error: authErr.error });
        return;
      }
      console.error("Storage error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// src/routes/health.ts
import { onRequest as onRequest11 } from "firebase-functions/v2/https";
var health = onRequest11({ region: "asia-south1", invoker: "public" }, async (req, res) => {
  if (handleCors(req, res)) return;
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  res.json({ status: "ok" });
});

// src/triggers/knowledge-profile.ts
import { onDocumentWritten } from "firebase-functions/v2/firestore";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
var rebuildKnowledgeProfile = onDocumentWritten(
  {
    document: "studentProgress/{uid}/chapterMastery/{chapterId}",
    region: "asia-south1"
  },
  async (event) => {
    const uid = event.params.uid;
    const profileRef = db.collection("studentKnowledgeProfiles").doc(uid);
    const profileSnap = await profileRef.get();
    const isCoolingDown = (() => {
      if (!profileSnap.exists) return false;
      const lastBuild = profileSnap.data()?.updatedAt;
      if (!lastBuild) return false;
      return Date.now() - lastBuild.toMillis() < 30 * 1e3;
    })();
    if (isCoolingDown) {
      try {
        await db.collection("aiRecommendations").doc(uid).delete();
      } catch (err) {
        console.warn("[rebuildKnowledgeProfile] cache delete during cooldown failed:", uid, err);
      }
      return;
    }
    await computeAndPersistProfile(uid);
  }
);
var WEAK_MASTERY_THRESHOLD = 40;
var STRONG_MASTERY_THRESHOLD = 75;
var MASTERY_LEARNED_MIN = 60;
var RETRY_ACCURACY_THRESHOLD = 50;
var PROFILE_VERSION = 1;
async function computeAndPersistProfile(uid) {
  try {
    const [masterySnap, questionSnap, sessionSnap, statsSnap, studentSnap] = await Promise.all([
      db.collection("studentProgress").doc(uid).collection("chapterMastery").get(),
      db.collection("studentProgress").doc(uid).collection("questionResults").get(),
      db.collection("studentProgress").doc(uid).collection("sessions").orderBy("startedAt", "desc").limit(30).get(),
      db.collection("studentProgress").doc(uid).get(),
      db.collection("students").doc(uid).get()
    ]);
    const masteries = masterySnap.docs.map((d) => d.data());
    const questions = questionSnap.docs.map((d) => d.data());
    const sessions = sessionSnap.docs.map((d) => d.data());
    const stats = statsSnap.exists ? statsSnap.data() : null;
    const student = studentSnap.exists ? studentSnap.data() : null;
    const masteryMap = {};
    const weakTopicMap = {};
    const strongTopicMap = {};
    const subjectGroups = {};
    for (const m of masteries) {
      masteryMap[m.chapterId] = m.masteryScore ?? 0;
      const lastMs = tsToMs(m.lastStudiedAt);
      const daysSinceStudy = lastMs ? Math.floor((Date.now() - lastMs) / 864e5) : 999;
      if ((m.masteryScore ?? 0) < WEAK_MASTERY_THRESHOLD && m.masteryStatus !== "not_started") {
        weakTopicMap[m.chapterId] = {
          chapterId: m.chapterId,
          chapterTitle: m.chapterTitle,
          subjectId: m.subjectId,
          subjectName: m.subjectName,
          masteryScore: m.masteryScore,
          mcqAccuracy: m.mcqAccuracy,
          daysSinceStudy,
          revisionCount: m.revisionCount ?? 0
        };
      }
      if ((m.masteryScore ?? 0) >= STRONG_MASTERY_THRESHOLD) {
        strongTopicMap[m.chapterId] = {
          chapterId: m.chapterId,
          chapterTitle: m.chapterTitle,
          subjectId: m.subjectId,
          subjectName: m.subjectName,
          masteryScore: m.masteryScore,
          mcqAccuracy: m.mcqAccuracy
        };
      }
      if (!subjectGroups[m.subjectId]) {
        subjectGroups[m.subjectId] = { sum: 0, count: 0, lastStudied: "", subjectName: m.subjectName ?? "" };
      }
      const g = subjectGroups[m.subjectId];
      g.sum += m.masteryScore ?? 0;
      g.count++;
      const dateStr = lastMs ? new Date(lastMs).toISOString().slice(0, 10) : "";
      if (dateStr > g.lastStudied) g.lastStudied = dateStr;
    }
    const subjectMastery = {};
    for (const [sid, g] of Object.entries(subjectGroups)) {
      const avg = g.count > 0 ? Math.round(g.sum / g.count) : 0;
      const subjectMasteries = masteries.filter((m) => m.subjectId === sid);
      const trend = computeSubjectTrend(subjectMasteries);
      subjectMastery[sid] = {
        subjectId: sid,
        subjectName: g.subjectName,
        masteryScore: avg,
        trend,
        chaptersStudied: g.count,
        lastStudied: g.lastStudied
      };
    }
    const dailyMap = {};
    const hourCounts = new Array(24).fill(0);
    const cutoff = Date.now() - 30 * 864e5;
    for (const s of sessions) {
      const startMs = tsToMs(s.startedAt);
      if (startMs < cutoff) continue;
      const date = s.date ?? new Date(startMs).toISOString().slice(0, 10);
      dailyMap[date] = (dailyMap[date] ?? 0) + (s.activeDurationMs ?? 0);
      const h = s.hourStarted ?? 0;
      if (h >= 0 && h < 24) hourCounts[h]++;
    }
    const dailyTotals = Object.values(dailyMap);
    const activeDays = dailyTotals.filter((ms) => ms > 0).length;
    const totalStudyMs = dailyTotals.reduce((a, b) => a + b, 0);
    const avgDailyMs = activeDays > 0 ? Math.round(totalStudyMs / activeDays) : 0;
    const preferredHour = hourCounts.indexOf(Math.max(...hourCounts, 0));
    const avgSessionMs = sessions.length > 0 ? Math.round(sessions.reduce((a, s) => a + (s.activeDurationMs ?? 0), 0) / sessions.length) : 0;
    const consistencyScore = Math.min(100, Math.round(activeDays / 30 * 100));
    const studyBehavior = {
      totalStudyTimeMs: totalStudyMs,
      avgDailyStudyTimeMs: avgDailyMs,
      preferredStudyHour: preferredHour,
      consistencyScore,
      currentStreak: stats?.currentStreak ?? 0,
      longestStreak: stats?.longestStreak ?? 0,
      activeDaysLast30: activeDays,
      avgSessionDurationMs: avgSessionMs,
      totalSessions: sessions.length
    };
    const studiedMasteries = masteries.filter((m) => m.masteryStatus !== "not_started");
    const avgMcqAcc = studiedMasteries.length > 0 ? Math.round(studiedMasteries.reduce((a, m) => a + (m.mcqAccuracy ?? 0), 0) / studiedMasteries.length) : 0;
    const avgNotesEng = studiedMasteries.length > 0 ? Math.round(studiedMasteries.reduce((a, m) => a + (m.notesEngagementScore ?? 0), 0) / studiedMasteries.length) : 0;
    const recentCutoff = Date.now() - 7 * 864e5;
    const masteredRecently = masteries.filter(
      (m) => (m.masteryScore ?? 0) >= MASTERY_LEARNED_MIN && tsToMs(m.lastStudiedAt) > recentCutoff
    ).length;
    const subjectScores = Object.entries(subjectMastery).map(([sid, entry]) => ({ sid, score: entry.masteryScore })).sort((a, b) => b.score - a.score);
    const strongestSubjectId = subjectScores[0]?.sid ?? null;
    const weakestSubjectId = subjectScores[subjectScores.length - 1]?.sid ?? null;
    const learningPattern = {
      averageMcqAccuracy: avgMcqAcc,
      averageNotesEngagement: avgNotesEng,
      improvementTrend: computeOverallTrend(masteries),
      learningVelocity: masteredRecently,
      strongestSubjectId,
      weakestSubjectId
    };
    const needsRevision = masteries.filter((m) => {
      if (m.masteryStatus === "not_started") return false;
      const lastMs = tsToMs(m.lastStudiedAt);
      return lastMs > 0 && Math.floor((Date.now() - lastMs) / 864e5) >= 7;
    }).map((m) => m.chapterId);
    const withRevision = masteries.filter((m) => (m.revisionCount ?? 0) > 0 && m.lastRevisedAt);
    const totalRevisions = masteries.reduce((a, m) => a + (m.revisionCount ?? 0), 0);
    const avgRevisionGap = withRevision.length > 0 ? Math.round(withRevision.reduce((a, m) => {
      const diff = Math.abs(tsToMs(m.lastStudiedAt) - tsToMs(m.lastRevisedAt));
      return a + Math.floor(diff / 864e5);
    }, 0) / withRevision.length) : 0;
    let latestRevisionMs = 0;
    for (const m of masteries) {
      const ms = tsToMs(m.lastRevisedAt);
      if (ms > latestRevisionMs) latestRevisionMs = ms;
    }
    const lastRevisionDate = latestRevisionMs ? new Date(latestRevisionMs).toISOString().slice(0, 10) : null;
    const revisionProfile = {
      chaptersNeedingRevision: needsRevision,
      avgRevisionGapDays: avgRevisionGap,
      lastRevisionDate,
      totalRevisions
    };
    const chapterMeta = {};
    for (const m of masteries) {
      chapterMeta[m.chapterId] = {
        chapterTitle: m.chapterTitle ?? "",
        subjectId: m.subjectId ?? "",
        subjectName: m.subjectName ?? ""
      };
    }
    const retryQuestions = questions.filter((q) => (q.totalAttempts ?? 0) >= 2 && (q.accuracy ?? 100) < RETRY_ACCURACY_THRESHOLD).sort((a, b) => (a.accuracy ?? 0) - (b.accuracy ?? 0)).slice(0, 20).map((q) => ({
      questionId: q.questionId,
      chapterId: q.chapterId,
      chapterTitle: chapterMeta[q.chapterId]?.chapterTitle ?? "",
      subjectId: q.subjectId,
      subjectName: chapterMeta[q.chapterId]?.subjectName ?? "",
      accuracy: q.accuracy ?? 0,
      totalAttempts: q.totalAttempts ?? 0,
      consecutiveWrong: q.consecutiveWrong ?? 0
    }));
    const avgMastery = masteries.length > 0 ? masteries.reduce((a, m) => a + (m.masteryScore ?? 0), 0) / masteries.length : 0;
    const examReadinessScore = Math.min(100, Math.round(
      avgMastery + Math.min((stats?.currentStreak ?? 0) * 2, 10) + consistencyScore * 0.1
    ));
    const confidenceScore = Math.min(100, Math.round(
      avgMcqAcc * 0.4 + Math.min((stats?.currentStreak ?? 0) * 3, 30) + Math.min(activeDays * 2, 30)
    ));
    await db.collection("studentKnowledgeProfiles").doc(uid).set({
      uid,
      classLevel: student?.classLevel ?? "",
      medium: student?.medium ?? "",
      masteryMap,
      subjectMastery,
      weakTopicMap,
      strongTopicMap,
      studyBehavior,
      learningPattern,
      revisionProfile,
      examReadinessScore,
      confidenceScore,
      suggestedRetryQuestions: retryQuestions,
      version: PROFILE_VERSION,
      updatedAt: FieldValue.serverTimestamp()
    });
    try {
      await db.collection("aiRecommendations").doc(uid).delete();
    } catch (cacheErr) {
      console.warn("[rebuildKnowledgeProfile] failed to bust aiRecommendations cache for uid:", uid, cacheErr);
    }
  } catch (err) {
    console.error("[rebuildKnowledgeProfile] failed for uid:", uid, err);
  }
}
function tsToMs(ts) {
  if (!ts) return 0;
  if (ts instanceof Timestamp) return ts.toMillis();
  const raw = ts;
  return (raw.seconds ?? 0) * 1e3;
}
function computeSubjectTrend(masteries) {
  const improving = masteries.filter((m) => m.trend === "improving").length;
  const declining = masteries.filter((m) => m.trend === "declining").length;
  if (improving > declining) return "improving";
  if (declining > improving) return "declining";
  if (masteries.length === 0) return "unknown";
  return "stable";
}
function computeOverallTrend(masteries) {
  const improving = masteries.filter((m) => m.trend === "improving").length;
  const declining = masteries.filter((m) => m.trend === "declining").length;
  if (improving > declining * 1.5) return "improving";
  if (declining > improving * 1.5) return "declining";
  return "stable";
}

// src/triggers/broadcast-recommendation.ts
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { defineSecret } from "firebase-functions/params";
import { FieldValue as FieldValue2 } from "firebase-admin/firestore";

// src/lib/gemini.ts
var GEMINI_MODEL = "gemini-2.5-flash";
var GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
async function callGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not set");
  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
        // bumped — 2.5 Flash needs headroom
        responseMimeType: "application/json",
        // Disable Gemini 2.5's "thinking mode" — it consumes tokens internally
        // before generating visible output, which was truncating our JSON.
        thinkingConfig: { thinkingBudget: 0 }
      }
    })
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${err}`);
  }
  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  if (!text) throw new Error("Gemini returned empty response");
  return text;
}
function parseGeminiJson(raw) {
  const cleaned = raw.replace(/^```json\s*/i, "").replace(/\s*```$/, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("[gemini] JSON parse failed. Raw response was:", cleaned);
    throw err;
  }
}

// src/triggers/broadcast-recommendation.ts
var GEMINI_API_KEY = defineSecret("GEMINI_API_KEY");
var typeLabels = {
  new_note: "Study Notes",
  new_mcq: "MCQ Practice Set",
  new_qa: "Q&A Revision Material",
  new_video: "Video Lecture",
  new_paper: "Full Length Question Paper"
};
var tabMap = {
  new_note: "notes",
  new_mcq: "mcq",
  new_qa: "qa",
  new_video: "notes",
  // Papers don't live under a chapter — the actionLink is overridden below
  // when type === "new_paper" to deep-link into /papers/:setId/:paperId instead.
  new_paper: "papers"
};
var broadcastNewContent = onDocumentCreated(
  {
    document: "notifications/{notifId}",
    region: "asia-south1",
    secrets: [GEMINI_API_KEY]
  },
  async (event) => {
    const notif = event.data?.data();
    if (!notif) return;
    const { type, chapterId, chapterTitle, subjectName, classLevel, medium } = notif;
    if (!["new_note", "new_mcq", "new_qa", "new_video", "new_paper"].includes(type)) return;
    const contentLabel = typeLabels[type] ?? "Content";
    const tab = tabMap[type] ?? "notes";
    const notifId = event.params.notifId;
    const targetMedium = medium ?? "Both";
    const needsEnglish = targetMedium !== "Assamese";
    const needsAssamese = targetMedium !== "English";
    const jsonShape = needsEnglish && needsAssamese ? `{
  "headline": "max 8 words English, exciting, mention chapter name",
  "message": "2 sentences English \u2014 why important for exams, what students will learn",
  "callToAction": "2-3 words English action button label",
  "headline_as": "same headline in Assamese script (\u0985\u09B8\u09AE\u09C0\u09AF\u09BC\u09BE)",
  "message_as": "same message in Assamese script (\u0985\u09B8\u09AE\u09C0\u09AF\u09BC\u09BE)",
  "callToAction_as": "same CTA in Assamese script (\u0985\u09B8\u09AE\u09C0\u09AF\u09BC\u09BE)",
  "urgency": "high"
}` : needsAssamese ? `{
  "headline": "max 8 words in Assamese script (\u0985\u09B8\u09AE\u09C0\u09AF\u09BC\u09BE), exciting, mention chapter name",
  "message": "2 sentences in Assamese script \u2014 why important for exams, what students will learn",
  "callToAction": "2-3 words Assamese action button label",
  "urgency": "high"
}` : `{
  "headline": "max 8 words English, exciting, mention chapter name",
  "message": "2 sentences English \u2014 why important for exams, what students will learn",
  "callToAction": "2-3 words English action button label",
  "urgency": "high"
}`;
    try {
      const prompt = `You are an AI for TRUE CONCEPT, an educational app for Class 9-10 students in Assam, India.

The admin just added new ${contentLabel} for the chapter "${chapterTitle}" (Subject: ${subjectName}).

Write a short, engaging announcement to motivate students to check it out immediately.

Return ONLY this JSON (no markdown):
${jsonShape}`;
      const raw = await callGemini(prompt);
      const aiData = parseGeminiJson(raw);
      const headline = needsEnglish ? aiData.headline : aiData.headline_as ?? aiData.headline;
      const message = needsEnglish ? aiData.message : aiData.message_as ?? aiData.message;
      const callToAction = needsEnglish ? aiData.callToAction : aiData.callToAction_as ?? aiData.callToAction;
      const broadcast = {
        notificationId: notifId,
        contentType: type,
        chapterId,
        chapterTitle,
        subjectName,
        targetClass: classLevel ?? null,
        targetMedium,
        headline,
        message,
        callToAction,
        ...needsAssamese && needsEnglish && {
          headline_as: aiData.headline_as,
          message_as: aiData.message_as,
          callToAction_as: aiData.callToAction_as
        },
        urgency: aiData.urgency ?? "medium",
        // Papers deep-link into the paper reader (chapterId here is the setId);
        // everything else routes back into the chapter tabs view.
        actionLink: type === "new_paper" ? `/papers/${chapterId}/${notif.refId ?? ""}` : `/chapters/${chapterId}?tab=${tab}`,
        createdAt: FieldValue2.serverTimestamp()
      };
      await db.collection("broadcastMessages").doc(notifId).set(broadcast);
    } catch (err) {
      console.error("[broadcastNewContent] Gemini call failed:", err);
    }
  }
);

// src/routes/ai-mentor.ts
import { onRequest as onRequest12 } from "firebase-functions/v2/https";
import { defineSecret as defineSecret2 } from "firebase-functions/params";
import { FieldValue as FieldValue4, Timestamp as Timestamp3 } from "firebase-admin/firestore";

// src/lib/next-recommendation.ts
import { FieldValue as FieldValue3, Timestamp as Timestamp2 } from "firebase-admin/firestore";

// src/lib/lab-chapter-registry.ts
var SUBJECT_NAME_BIOLOGY = { en: "Biology", as: "\u099C\u09C0\u09F1\u09AC\u09BF\u099C\u09CD\u099E\u09BE\u09A8" };
var SUBJECT_NAME_CHEMISTRY = { en: "Chemistry", as: "\u09F0\u09B8\u09BE\u09AF\u09BC\u09A8\u09AC\u09BF\u099C\u09CD\u099E\u09BE\u09A8" };
var CH_IX_05_FUND_UNIT = { en: "The Fundamental Unit of Life", as: "\u099C\u09C0\u09F1\u09A8\u09F0 \u09AE\u09CC\u09B2\u09BF\u0995 \u098F\u0995\u0995" };
var CH_X_01_CHEM_RXN = { en: "Chemical Reactions and Equations", as: "\u09F0\u09BE\u09B8\u09BE\u09AF\u09BC\u09A8\u09BF\u0995 \u09AC\u09BF\u0995\u09CD\u09F0\u09BF\u09AF\u09BC\u09BE \u0986\u09F0\u09C1 \u09B8\u09AE\u09C0\u0995\u09F0\u09A3" };
var CH_X_02_ACIDS_BASES = { en: "Acids, Bases and Salts", as: "\u0985\u09AE\u09CD\u09B2, \u0995\u09CD\u09B7\u09BE\u09F0\u0995 \u0986\u09F0\u09C1 \u09B2\u09F1\u09A3" };
var CH_X_03_METALS = { en: "Metals and Non-metals", as: "\u09A7\u09BE\u09A4\u09C1 \u0986\u09F0\u09C1 \u0985\u09A7\u09BE\u09A4\u09C1" };
var CH_X_04_CARBON = { en: "Carbon and its Compounds", as: "\u0995\u09BE\u09F0\u09CD\u09AC\u09A8 \u0986\u09F0\u09C1 \u0987\u09AF\u09BC\u09BE\u09F0 \u09AF\u09CC\u0997\u09B8\u09AE\u09C2\u09B9" };
var CH_X_06_LIFE_PROC = { en: "Life Processes", as: "\u099C\u09C8\u09F1\u09BF\u0995 \u09AA\u09CD\u09F0\u0995\u09CD\u09F0\u09BF\u09AF\u09BC\u09BE\u09B8\u09AE\u09C2\u09B9" };
var TOPIC_NUTRITION = { en: "Nutrition", as: "\u09AA\u09C1\u09B7\u09CD\u099F\u09BF" };
var TOPIC_RESPIRATION = { en: "Respiration", as: "\u09B6\u09CD\u09AC\u09B8\u09A8" };
var TOPIC_TRANSPORTATION = { en: "Transportation", as: "\u09AA\u09F0\u09BF\u09AC\u09B9\u09A8" };
var TOPIC_EXCRETION = { en: "Excretion", as: "\u09F0\u09C7\u099A\u09A8" };
var TOPIC_COMBINATION = { en: "Combination Reactions", as: "\u09B8\u0982\u09AF\u09CB\u0997 \u09AC\u09BF\u0995\u09CD\u09F0\u09BF\u09AF\u09BC\u09BE" };
var TOPIC_DECOMPOSITION = { en: "Decomposition Reactions", as: "\u09AC\u09BF\u09AF\u09CB\u099C\u09A8 \u09AC\u09BF\u0995\u09CD\u09F0\u09BF\u09AF\u09BC\u09BE" };
var TOPIC_DISPLACEMENT = { en: "Displacement Reactions", as: "\u09AA\u09CD\u09F0\u09A4\u09BF\u09B8\u09CD\u09A5\u09BE\u09AA\u09A8 \u09AC\u09BF\u0995\u09CD\u09F0\u09BF\u09AF\u09BC\u09BE" };
var TOPIC_DOUBLE_DISP = { en: "Double Displacement & Precipitation Reactions", as: "\u09A6\u09CD\u09AC\u09C8\u09A4 \u09AA\u09CD\u09F0\u09A4\u09BF\u09B8\u09CD\u09A5\u09BE\u09AA\u09A8 \u0986\u09F0\u09C1 \u0985\u09F1\u0995\u09CD\u09B7\u09C7\u09AA\u09A3 \u09AC\u09BF\u0995\u09CD\u09F0\u09BF\u09AF\u09BC\u09BE" };
var TOPIC_REDOX = { en: "Oxidation & Reduction (Redox) Reactions", as: "\u099C\u09BE\u09F0\u09A3 \u0986\u09F0\u09C1 \u09AC\u09BF\u099C\u09BE\u09F0\u09A3 \u09AC\u09BF\u0995\u09CD\u09F0\u09BF\u09AF\u09BC\u09BE" };
var TOPIC_IONIC_NEUTRAL = { en: "Ionic Dissociation & Neutralization", as: "\u0986\u09AF\u09BC\u09A8\u09BF\u0995 \u09AC\u09BF\u09AF\u09BC\u09CB\u099C\u09A8 \u0986\u09F0\u09C1 \u09AA\u09CD\u09F0\u09B6\u09AE\u09A8" };
var TOPIC_ACID_METAL_OXIDE = { en: "Acid-Base Interactions with Metals & Oxides", as: "\u09A7\u09BE\u09A4\u09C1 \u0986\u09F0\u09C1 \u0985\u0995\u09CD\u09B8\u09BE\u0987\u09A1\u09F0 \u09B8\u09C8\u09A4\u09C7 \u0985\u09AE\u09CD\u09B2-\u0995\u09CD\u09B7\u09BE\u09F0\u09F0 \u09AC\u09BF\u0995\u09CD\u09F0\u09BF\u09AF\u09BC\u09BE" };
var TOPIC_CARBONATES = { en: "Reactions with Carbonates & Hydrogen Carbonates", as: "\u0995\u09BE\u09F0\u09CD\u09AC\u09A8\u09C7\u099F \u0986\u09F0\u09C1 \u09B9\u09BE\u0987\u09A1\u09CD\u09F0'\u099C\u09C7\u09A8 \u0995\u09BE\u09F0\u09CD\u09AC\u09A8\u09C7\u099F\u09F0 \u09AC\u09BF\u0995\u09CD\u09F0\u09BF\u09AF\u09BC\u09BE" };
var TOPIC_INDUSTRIAL_SALTS = { en: "Industrial Chemicals from Common Salt", as: "\u09B8\u09BE\u09A7\u09BE\u09F0\u09A3 \u09B2\u09F1\u09A3\u09F0 \u09AA\u09F0\u09BE \u09B6\u09BF\u09B2\u09CD\u09AA\u09BF\u0995 \u09F0\u09B8\u09BE\u09AF\u09BC\u09A8" };
var TOPIC_METALS_AIR_H2O = { en: "Metals \u2014 Reactions with Oxygen & Water", as: "\u09A7\u09BE\u09A4\u09C1 \u2014 \u0985\u0995\u09CD\u09B8\u09BF\u099C\u09C7\u09A8 \u0986\u09F0\u09C1 \u09AA\u09BE\u09A8\u09C0\u09F0 \u09B8\u09C8\u09A4\u09C7 \u09AC\u09BF\u0995\u09CD\u09F0\u09BF\u09AF\u09BC\u09BE" };
var TOPIC_METALS_ACIDS = { en: "Metals \u2014 Reactions with Mineral Acids", as: "\u09A7\u09BE\u09A4\u09C1 \u2014 \u0996\u09A8\u09BF\u099C \u0985\u09AE\u09CD\u09B2\u09F0 \u09B8\u09C8\u09A4\u09C7 \u09AC\u09BF\u0995\u09CD\u09F0\u09BF\u09AF\u09BC\u09BE" };
var TOPIC_CARBON_COMPOUNDS = { en: "Combustion, Esterification, Saponification & Addition Reactions", as: "\u09A6\u09B9\u09A8, \u098F\u09B7\u09CD\u099F\u09BE\u09F0\u09C0\u0995\u09F0\u09A3, \u099B\u09C7\u09AA'\u09A8\u09BF\u09AB\u09BF\u0995\u09C7\u099A\u09A8 \u0986\u09F0\u09C1 \u09B8\u0982\u09AF\u09CB\u099C\u09A8 \u09AC\u09BF\u0995\u09CD\u09F0\u09BF\u09AF\u09BC\u09BE" };
var LAB_REGISTRY = {
  "biology-animal-cell": { experimentId: "biology-animal-cell", experimentTitle: { en: "Animal Cell", as: "\u09AA\u09CD\u09F0\u09BE\u09A3\u09C0 \u0995\u09CB\u09B7" }, subjectId: "biology", subjectName: SUBJECT_NAME_BIOLOGY, ncertClass: "IX", ncertChapterNumber: 5, ncertChapterKey: "class09-ch05", ncertChapterTitle: CH_IX_05_FUND_UNIT, bilingualReady: true, emoji: "\u{1F52C}" },
  "biology-plant-cell": { experimentId: "biology-plant-cell", experimentTitle: { en: "Plant Cell", as: "\u0989\u09A6\u09CD\u09AD\u09BF\u09A6 \u0995\u09CB\u09B7" }, subjectId: "biology", subjectName: SUBJECT_NAME_BIOLOGY, ncertClass: "IX", ncertChapterNumber: 5, ncertChapterKey: "class09-ch05", ncertChapterTitle: CH_IX_05_FUND_UNIT, bilingualReady: true, emoji: "\u{1F33F}" },
  "biology-digestive-system": { experimentId: "biology-digestive-system", experimentTitle: { en: "Human Digestive System", as: "\u09AE\u09BE\u09A8\u09C1\u09B9\u09F0 \u09AA\u09BE\u099A\u09A8 \u09A4\u09A8\u09CD\u09A4\u09CD\u09F0" }, subjectId: "biology", subjectName: SUBJECT_NAME_BIOLOGY, ncertClass: "X", ncertChapterNumber: 6, ncertChapterKey: "class10-ch06", ncertChapterTitle: CH_X_06_LIFE_PROC, ncertTopic: TOPIC_NUTRITION, bilingualReady: true, emoji: "\u{1FAC0}" },
  "biology-respiratory-system": { experimentId: "biology-respiratory-system", experimentTitle: { en: "Human Respiratory System", as: "\u09AE\u09BE\u09A8\u09C1\u09B9\u09F0 \u09B6\u09CD\u09AC\u09B8\u09A8 \u09A4\u09A8\u09CD\u09A4\u09CD\u09F0" }, subjectId: "biology", subjectName: SUBJECT_NAME_BIOLOGY, ncertClass: "X", ncertChapterNumber: 6, ncertChapterKey: "class10-ch06", ncertChapterTitle: CH_X_06_LIFE_PROC, ncertTopic: TOPIC_RESPIRATION, bilingualReady: true, emoji: "\u{1FAC1}" },
  "biology-heart-circulation": { experimentId: "biology-heart-circulation", experimentTitle: { en: "Human Heart & Blood Circulation", as: "\u09AE\u09BE\u09A8\u09C1\u09B9\u09F0 \u09B9\u09C3\u09A6\u09AA\u09BF\u09A3\u09CD\u09A1 \u0986\u09F0\u09C1 \u09F0\u0995\u09CD\u09A4\u09B8\u0982\u09AC\u09B9\u09A8" }, subjectId: "biology", subjectName: SUBJECT_NAME_BIOLOGY, ncertClass: "X", ncertChapterNumber: 6, ncertChapterKey: "class10-ch06", ncertChapterTitle: CH_X_06_LIFE_PROC, ncertTopic: TOPIC_TRANSPORTATION, bilingualReady: true, emoji: "\u2764\uFE0F" },
  "biology-excretory-system": { experimentId: "biology-excretory-system", experimentTitle: { en: "Human Excretory System & Nephron", as: "\u09AE\u09BE\u09A8\u09C1\u09B9\u09F0 \u09F0\u09C7\u099A\u09A8 \u09A4\u09A8\u09CD\u09A4\u09CD\u09F0 \u0986\u09F0\u09C1 \u09A8\u09C7\u09AB\u09CD\u09F0\u09A8" }, subjectId: "biology", subjectName: SUBJECT_NAME_BIOLOGY, ncertClass: "X", ncertChapterNumber: 6, ncertChapterKey: "class10-ch06", ncertChapterTitle: CH_X_06_LIFE_PROC, ncertTopic: TOPIC_EXCRETION, bilingualReady: true, emoji: "\u{1FAD8}" },
  "chem-combination-reactions": { experimentId: "chem-combination-reactions", experimentTitle: { en: "Combination Reactions", as: "\u09B8\u0982\u09AF\u09CB\u0997 \u09AC\u09BF\u0995\u09CD\u09F0\u09BF\u09AF\u09BC\u09BE" }, subjectId: "chemistry", subjectName: SUBJECT_NAME_CHEMISTRY, ncertClass: "X", ncertChapterNumber: 1, ncertChapterKey: "class10-ch01", ncertChapterTitle: CH_X_01_CHEM_RXN, ncertTopic: TOPIC_COMBINATION, bilingualReady: true, emoji: "\u2697\uFE0F" },
  "chem-decomposition-reactions": { experimentId: "chem-decomposition-reactions", experimentTitle: { en: "Decomposition Reactions", as: "\u09AC\u09BF\u09AF\u09CB\u099C\u09A8 \u09AC\u09BF\u0995\u09CD\u09F0\u09BF\u09AF\u09BC\u09BE" }, subjectId: "chemistry", subjectName: SUBJECT_NAME_CHEMISTRY, ncertClass: "X", ncertChapterNumber: 1, ncertChapterKey: "class10-ch01", ncertChapterTitle: CH_X_01_CHEM_RXN, ncertTopic: TOPIC_DECOMPOSITION, bilingualReady: true, emoji: "\u{1F525}" },
  "chem-displacement-reactions": { experimentId: "chem-displacement-reactions", experimentTitle: { en: "Displacement Reactions", as: "\u09AA\u09CD\u09F0\u09A4\u09BF\u09B8\u09CD\u09A5\u09BE\u09AA\u09A8 \u09AC\u09BF\u0995\u09CD\u09F0\u09BF\u09AF\u09BC\u09BE" }, subjectId: "chemistry", subjectName: SUBJECT_NAME_CHEMISTRY, ncertClass: "X", ncertChapterNumber: 1, ncertChapterKey: "class10-ch01", ncertChapterTitle: CH_X_01_CHEM_RXN, ncertTopic: TOPIC_DISPLACEMENT, bilingualReady: true, emoji: "\u{1F535}" },
  "chem-double-displacement": { experimentId: "chem-double-displacement", experimentTitle: { en: "Double Displacement & Precipitation Reactions", as: "\u09A6\u09CD\u09AC\u09C8\u09A4 \u09AA\u09CD\u09F0\u09A4\u09BF\u09B8\u09CD\u09A5\u09BE\u09AA\u09A8 \u0986\u09F0\u09C1 \u0985\u09F1\u0995\u09CD\u09B7\u09C7\u09AA\u09A3 \u09AC\u09BF\u0995\u09CD\u09F0\u09BF\u09AF\u09BC\u09BE" }, subjectId: "chemistry", subjectName: SUBJECT_NAME_CHEMISTRY, ncertClass: "X", ncertChapterNumber: 1, ncertChapterKey: "class10-ch01", ncertChapterTitle: CH_X_01_CHEM_RXN, ncertTopic: TOPIC_DOUBLE_DISP, bilingualReady: true, emoji: "\u{1F7E1}" },
  "chem-redox-reactions": { experimentId: "chem-redox-reactions", experimentTitle: { en: "Redox Reactions (Oxidation & Reduction)", as: "\u09F0\u09C7\u09A1\u0995\u09CD\u09B8 \u09AC\u09BF\u0995\u09CD\u09F0\u09BF\u09AF\u09BC\u09BE (\u099C\u09BE\u09F0\u09A3 \u0986\u09F0\u09C1 \u0985\u09AA\u099A\u09AF\u09BC\u09A8)" }, subjectId: "chemistry", subjectName: SUBJECT_NAME_CHEMISTRY, ncertClass: "X", ncertChapterNumber: 1, ncertChapterKey: "class10-ch01", ncertChapterTitle: CH_X_01_CHEM_RXN, ncertTopic: TOPIC_REDOX, bilingualReady: true, emoji: "\u{1F501}" },
  "chem-ionic-neutralization": { experimentId: "chem-ionic-neutralization", experimentTitle: { en: "Ionic Dissociation & Neutralization", as: "\u0986\u09AF\u09BC\u09A8\u09BF\u0995 \u09AC\u09BF\u09AF\u09CB\u099C\u09A8 \u0986\u09F0\u09C1 \u09A8\u09BF\u09F0\u09AA\u09C7\u0995\u09CD\u09B7\u09A3" }, subjectId: "chemistry", subjectName: SUBJECT_NAME_CHEMISTRY, ncertClass: "X", ncertChapterNumber: 2, ncertChapterKey: "class10-ch02", ncertChapterTitle: CH_X_02_ACIDS_BASES, ncertTopic: TOPIC_IONIC_NEUTRAL, bilingualReady: true, emoji: "\u2696\uFE0F" },
  "chem-acid-metal-oxide": { experimentId: "chem-acid-metal-oxide", experimentTitle: { en: "Acid Reactions with Metals & Metal Oxides", as: "\u09A7\u09BE\u09A4\u09C1 \u0986\u09F0\u09C1 \u09A7\u09BE\u09A4\u09C1 \u0985\u0995\u09CD\u09B8\u09BE\u0987\u09A1\u09F0 \u09B8\u09C8\u09A4\u09C7 \u0985\u09AE\u09CD\u09B2 \u09AC\u09BF\u0995\u09CD\u09F0\u09BF\u09AF\u09BC\u09BE" }, subjectId: "chemistry", subjectName: SUBJECT_NAME_CHEMISTRY, ncertClass: "X", ncertChapterNumber: 2, ncertChapterKey: "class10-ch02", ncertChapterTitle: CH_X_02_ACIDS_BASES, ncertTopic: TOPIC_ACID_METAL_OXIDE, bilingualReady: true, emoji: "\u{1F9EA}" },
  "chem-carbonate-reactions": { experimentId: "chem-carbonate-reactions", experimentTitle: { en: "Reactions with Metal Carbonates & Hydrogen Carbonates", as: "\u09A7\u09BE\u09A4\u09C1 \u0995\u09BE\u09F0\u09CD\u09AC\u09A8\u09C7\u099F \u0986\u09F0\u09C1 \u09B9\u09BE\u0987\u09A1\u09CD\u09F0'\u099C\u09C7\u09A8\u0995\u09BE\u09F0\u09CD\u09AC\u09A8\u09C7\u099F\u09F0 \u09B8\u09C8\u09A4\u09C7 \u09AC\u09BF\u0995\u09CD\u09F0\u09BF\u09AF\u09BC\u09BE" }, subjectId: "chemistry", subjectName: SUBJECT_NAME_CHEMISTRY, ncertClass: "X", ncertChapterNumber: 2, ncertChapterKey: "class10-ch02", ncertChapterTitle: CH_X_02_ACIDS_BASES, ncertTopic: TOPIC_CARBONATES, bilingualReady: true, emoji: "\u{1FAE7}" },
  "chem-industrial-chemicals": { experimentId: "chem-industrial-chemicals", experimentTitle: { en: "Industrial Chemicals from Common Salt", as: "\u09B8\u09BE\u09A7\u09BE\u09F0\u09A3 \u09B2\u09F1\u09A3\u09F0 \u09AA\u09F0\u09BE \u09B6\u09BF\u09B2\u09CD\u09AA \u09F0\u09BE\u09B8\u09BE\u09AF\u09BC\u09A8\u09BF\u0995" }, subjectId: "chemistry", subjectName: SUBJECT_NAME_CHEMISTRY, ncertClass: "X", ncertChapterNumber: 2, ncertChapterKey: "class10-ch02", ncertChapterTitle: CH_X_02_ACIDS_BASES, ncertTopic: TOPIC_INDUSTRIAL_SALTS, bilingualReady: true, emoji: "\u{1F9C2}" },
  "chem-mineral-acids": { experimentId: "chem-mineral-acids", experimentTitle: { en: "Metals \u2014 Reactions with Mineral Acids", as: "\u09A7\u09BE\u09A4\u09C1 \u2014 \u0996\u09A8\u09BF\u099C \u0985\u09AE\u09CD\u09B2\u09F0 \u09B8\u09C8\u09A4\u09C7 \u09AC\u09BF\u0995\u09CD\u09F0\u09BF\u09AF\u09BC\u09BE" }, subjectId: "chemistry", subjectName: SUBJECT_NAME_CHEMISTRY, ncertClass: "X", ncertChapterNumber: 3, ncertChapterKey: "class10-ch03", ncertChapterTitle: CH_X_03_METALS, ncertTopic: TOPIC_METALS_ACIDS, bilingualReady: true, emoji: "\u{1F9EA}" },
  "chem-reactive-metals": { experimentId: "chem-reactive-metals", experimentTitle: { en: "Reactive Metals \u2014 Reactions with Oxygen & Water", as: "\u0995\u09CD\u09F0\u09BF\u09AF\u09BC\u09BE\u09B6\u09C0\u09B2 \u09A7\u09BE\u09A4\u09C1 \u2014 \u0985\u0995\u09CD\u09B8\u09BF\u099C\u09C7\u09A8 \u0986\u09F0\u09C1 \u09AA\u09BE\u09A8\u09C0\u09F0 \u09B8\u09C8\u09A4\u09C7 \u09AC\u09BF\u0995\u09CD\u09F0\u09BF\u09AF\u09BC\u09BE" }, subjectId: "chemistry", subjectName: SUBJECT_NAME_CHEMISTRY, ncertClass: "X", ncertChapterNumber: 3, ncertChapterKey: "class10-ch03", ncertChapterTitle: CH_X_03_METALS, ncertTopic: TOPIC_METALS_AIR_H2O, bilingualReady: true, emoji: "\u2697\uFE0F" },
  "chem-organic-reactions": { experimentId: "chem-organic-reactions", experimentTitle: { en: "Organic Reactions (Combustion, Esterification, etc.)", as: "\u099C\u09C8\u09F1 \u09AC\u09BF\u0995\u09CD\u09F0\u09BF\u09AF\u09BC\u09BE (\u09A6\u09B9\u09A8, \u0987\u09B7\u09CD\u099F\u09BE\u09F0\u09BF\u09AB\u09BF\u0995\u09C7\u099A\u09A8 \u0987\u09A4\u09CD\u09AF\u09BE\u09A6\u09BF)" }, subjectId: "chemistry", subjectName: SUBJECT_NAME_CHEMISTRY, ncertClass: "X", ncertChapterNumber: 4, ncertChapterKey: "class10-ch04", ncertChapterTitle: CH_X_04_CARBON, ncertTopic: TOPIC_CARBON_COMPOUNDS, bilingualReady: true, emoji: "\u{1F351}" }
};
function getLabsForChapterKey(chapterKey) {
  return Object.values(LAB_REGISTRY).filter((l) => l.ncertChapterKey === chapterKey);
}
function buildChapterKey(ncertClass, chapterNumber) {
  const classNum = ncertClass === "IX" ? "09" : "10";
  const chNum = String(chapterNumber).padStart(2, "0");
  return `class${classNum}-ch${chNum}`;
}
function getLabRouteForExperimentId(experimentId) {
  if (experimentId.startsWith("biology-")) {
    const slug = experimentId.replace(/^biology-/, "");
    return `/virtual-lab/biology/${slug}`;
  }
  if (experimentId.startsWith("chem-")) {
    const slug = experimentId.replace(/^chem-/, "");
    return `/virtual-lab/${slug}`;
  }
  return `/virtual-lab/${experimentId}`;
}

// src/lib/next-recommendation.ts
var PASS_THRESHOLD = 60;
var ACTIVITY_LOOKBACK = 50;
var NARRATION_TTL_MS = 7 * 24 * 60 * 60 * 1e3;
function bi(en, as) {
  return { en, as };
}
function biSame(text) {
  return { en: text, as: text };
}
function chapterKeyForChapter(chapter) {
  if (!chapter.chapterNumber) return null;
  const cls = chapter.classLevel?.includes("10") || chapter.classLevel?.toLowerCase().includes("x") ? "X" : chapter.classLevel?.includes("9") || chapter.classLevel?.toLowerCase().includes("ix") ? "IX" : null;
  if (!cls) return null;
  return buildChapterKey(cls, chapter.chapterNumber);
}
function emptyRecommendation(message) {
  return {
    kind: "all_caught_up",
    rung: 99,
    target: { id: "none", title: biSame(""), ctaUrl: "/dashboard" },
    reason: bi(message, message),
    emoji: "\u{1F389}",
    bilingualReady: true,
    generatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
}
async function computeNextRecommendation(uid, db2) {
  const [
    profileSnap,
    chapterMasterySnap,
    experimentMasterySnap,
    activitySnap,
    studentSnap
  ] = await Promise.all([
    db2.collection("studentKnowledgeProfiles").doc(uid).get(),
    db2.collection("studentProgress").doc(uid).collection("chapterMastery").orderBy("lastStudiedAt", "desc").get(),
    db2.collection("studentProgress").doc(uid).collection("experimentMastery").get(),
    db2.collection("studentProgress").doc(uid).collection("activity").orderBy("at", "desc").limit(ACTIVITY_LOOKBACK).get(),
    db2.collection("students").doc(uid).get()
  ]);
  const profile = profileSnap.exists ? profileSnap.data() : null;
  const studentData = studentSnap.exists ? studentSnap.data() : {};
  const classLevel = profile?.classLevel || studentData.class || "10";
  const medium = profile?.medium || studentData.medium || "English";
  const isAssamese = medium === "Assamese";
  const expMasteryMap = /* @__PURE__ */ new Map();
  for (const d of experimentMasterySnap.docs) expMasteryMap.set(d.id, d.data());
  const activityIndex = /* @__PURE__ */ new Map();
  for (const d of activitySnap.docs) {
    const a = d.data();
    if (a.type && a.chapterId) {
      if (!activityIndex.has(a.chapterId)) activityIndex.set(a.chapterId, /* @__PURE__ */ new Set());
      activityIndex.get(a.chapterId).add(a.type);
    }
  }
  let focusChapterId = null;
  let focusMastery = null;
  if (!chapterMasterySnap.empty) {
    focusMastery = chapterMasterySnap.docs[0].data();
    focusChapterId = focusMastery.chapterId;
  }
  if (!focusChapterId) {
    const classChaptersSnap = await db2.collection("chapters").where("classLevel", "==", classLevel).get();
    if (classChaptersSnap.empty) {
      return emptyRecommendation("No chapters available for your class yet.");
    }
    const sorted = classChaptersSnap.docs.map((d) => ({ id: d.id, data: d.data() })).sort((a, b) => (a.data.chapterNumber ?? 0) - (b.data.chapterNumber ?? 0));
    const first = sorted[0];
    focusChapterId = first.id;
    focusMastery = {
      chapterId: first.id,
      chapterTitle: first.data.title ?? "",
      subjectId: first.data.subjectId ?? "",
      subjectName: "",
      notesCompleted: 0,
      mcqAttemptCount: 0,
      mcqBestScore: 0
    };
  }
  const chapterDocSnap = await db2.collection("chapters").doc(focusChapterId).get();
  if (!chapterDocSnap.exists) {
    return emptyRecommendation("Focus chapter no longer exists.");
  }
  const chapter = chapterDocSnap.data();
  const chapterKey = chapterKeyForChapter(chapter);
  const [notesSnap, mcqsSnap, qaSnap] = await Promise.all([
    db2.collection("notes").where("chapterId", "==", focusChapterId).get(),
    db2.collection("mcqs").where("chapterId", "==", focusChapterId).limit(1).get(),
    db2.collection("qa").where("chapterId", "==", focusChapterId).limit(1).get()
  ]);
  const notes = notesSnap.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const hasMcq = !mcqsSnap.empty;
  const hasQa = !qaSnap.empty;
  const notesCompleted = focusMastery.notesCompleted ?? 0;
  const mcqAttemptCount = focusMastery.mcqAttemptCount ?? 0;
  const mcqBestScore = focusMastery.mcqBestScore ?? 0;
  const chapterTitleBi = biSame(focusMastery.chapterTitle || chapter.title || "");
  const subjectNameBi = biSame(focusMastery.subjectName || "");
  if (notes.length > 0 && notesCompleted < notes.length) {
    const nextNote = notes[notesCompleted];
    const noteTitle = nextNote.title || "Untitled note";
    return {
      kind: "unread_note",
      rung: 1,
      target: {
        id: nextNote.id,
        title: biSame(noteTitle),
        chapterId: focusChapterId,
        chapterTitle: chapterTitleBi,
        subjectId: focusMastery.subjectId,
        subjectName: subjectNameBi,
        ctaUrl: `/chapters/${focusChapterId}?tab=notes&note=${nextNote.id}`,
        youtubeId: nextNote.youtubeId ?? void 0
      },
      reason: bi(
        `Continue with "${noteTitle}" \u2014 ${notesCompleted}/${notes.length} notes done in this chapter.`,
        `"${noteTitle}" \u09AA\u09A2\u09BC\u09BF \u09A5\u09BE\u0995\u0995 \u2014 \u098F\u0987 \u0985\u09A7\u09CD\u09AF\u09BE\u09AF\u09BC\u09A4 ${notesCompleted}/${notes.length} \u099F\u09BE \u099F\u09CB\u0995\u09BE \u09B6\u09C7\u09B7 \u09B9\u09C8\u099B\u09C7\u0964`
      ),
      emoji: "\u{1F4D6}",
      bilingualReady: true,
      generatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  const labs = chapterKey ? getLabsForChapterKey(chapterKey) : [];
  const recommendableLabs = isAssamese ? labs.some((l) => l.bilingualReady && !expMasteryMap.get(l.experimentId)?.completed) ? labs.filter((l) => l.bilingualReady) : labs : labs;
  const incompleteLab = recommendableLabs.find((l) => !expMasteryMap.get(l.experimentId)?.completed);
  if (incompleteLab) {
    return {
      kind: "lab",
      rung: 3,
      target: {
        id: incompleteLab.experimentId,
        title: incompleteLab.experimentTitle,
        chapterId: focusChapterId,
        chapterTitle: chapterTitleBi,
        subjectId: incompleteLab.subjectId,
        subjectName: incompleteLab.subjectName,
        ctaUrl: getLabRouteForExperimentId(incompleteLab.experimentId)
      },
      reason: bi(
        `Try the ${incompleteLab.experimentTitle.en} lab \u2014 it covers what you just read.`,
        `${incompleteLab.experimentTitle.as} \u09AA\u09F0\u09C0\u0995\u09CD\u09B7\u09BE\u0997\u09BE\u09F0\u099F\u09CB \u099A\u09C7\u09B7\u09CD\u099F\u09BE \u0995\u09F0\u0995 \u2014 \u098F\u0987\u099F\u09CB\u09F1\u09C7 \u0986\u09AA\u09C1\u09A8\u09BF \u098F\u09A4\u09BF\u09AF\u09BC\u09BE \u09AA\u09A2\u09BC\u09BE \u09AC\u09BF\u09B7\u09AF\u09BC\u099F\u09CB \u09AC\u09CD\u09AF\u09BE\u0996\u09CD\u09AF\u09BE \u0995\u09F0\u09C7\u0964`
      ),
      emoji: incompleteLab.emoji ?? "\u{1F52C}",
      bilingualReady: incompleteLab.bilingualReady,
      generatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  const untestedLab = recommendableLabs.find((l) => {
    const m = expMasteryMap.get(l.experimentId);
    return m?.completed && !m?.quizAttempts;
  });
  if (untestedLab) {
    return {
      kind: "lab_quiz",
      rung: 4,
      target: {
        id: untestedLab.experimentId,
        title: untestedLab.experimentTitle,
        chapterId: focusChapterId,
        chapterTitle: chapterTitleBi,
        subjectId: untestedLab.subjectId,
        subjectName: untestedLab.subjectName,
        ctaUrl: getLabRouteForExperimentId(untestedLab.experimentId)
      },
      reason: bi(
        `Take the ${untestedLab.experimentTitle.en} lab quiz to lock in what you learned.`,
        `\u09B6\u09BF\u0995\u09BF\u09A5\u0995\u09BE \u0995\u09A5\u09BE \u09AA\u0995\u09BE \u0995\u09F0\u09BF\u09AC\u09B2\u09C8 ${untestedLab.experimentTitle.as} \u09AA\u09F0\u09C0\u0995\u09CD\u09B7\u09BE\u0997\u09BE\u09F0\u09F0 \u0995\u09C1\u0987\u099C \u09A6\u09BF\u09AF\u09BC\u0995\u0964`
      ),
      emoji: "\u{1F3AF}",
      bilingualReady: untestedLab.bilingualReady,
      generatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  if (hasMcq && (mcqAttemptCount === 0 || mcqBestScore < PASS_THRESHOLD)) {
    const isRetry = mcqAttemptCount > 0;
    return {
      kind: "chapter_mcq",
      rung: 5,
      target: {
        id: focusChapterId,
        title: chapterTitleBi,
        chapterId: focusChapterId,
        chapterTitle: chapterTitleBi,
        subjectId: focusMastery.subjectId,
        subjectName: subjectNameBi,
        ctaUrl: `/chapters/${focusChapterId}?tab=mcq`
      },
      reason: isRetry ? bi(
        `Your chapter MCQ score is ${mcqBestScore}/100 \u2014 retry to push it past ${PASS_THRESHOLD}.`,
        `\u0985\u09A7\u09CD\u09AF\u09BE\u09AF\u09BC\u09F0 MCQ \u09B8\u09CD\u0995'\u09F0 ${mcqBestScore}/\u09E7\u09E6\u09E6 \u2014 ${PASS_THRESHOLD} \u09AA\u09BE\u09F0 \u0995\u09F0\u09BF\u09AC\u09B2\u09C8 \u0986\u0995\u09CC \u099A\u09C7\u09B7\u09CD\u099F\u09BE \u0995\u09F0\u0995\u0964`
      ) : bi(
        `You've covered the notes & lab \u2014 now try the chapter MCQ.`,
        `\u099F\u09CB\u0995\u09BE \u0986\u09F0\u09C1 \u09AA\u09F0\u09C0\u0995\u09CD\u09B7\u09BE\u0997\u09BE\u09F0 \u09B6\u09C7\u09B7 \u09B9\u09C8\u099B\u09C7 \u2014 \u098F\u09A4\u09BF\u09AF\u09BC\u09BE \u0985\u09A7\u09CD\u09AF\u09BE\u09AF\u09BC\u09F0 MCQ \u099A\u09C7\u09B7\u09CD\u099F\u09BE \u0995\u09F0\u0995\u0964`
      ),
      emoji: "\u{1F9E0}",
      bilingualReady: true,
      generatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  const seenForChapter = activityIndex.get(focusChapterId) ?? /* @__PURE__ */ new Set();
  if (hasQa && !seenForChapter.has("qa_viewed")) {
    return {
      kind: "qna",
      rung: 6,
      target: {
        id: focusChapterId,
        title: chapterTitleBi,
        chapterId: focusChapterId,
        chapterTitle: chapterTitleBi,
        subjectId: focusMastery.subjectId,
        subjectName: subjectNameBi,
        ctaUrl: `/chapters/${focusChapterId}?tab=qa`
      },
      reason: bi(
        `Review the Q&A section to sharpen exam-style answers.`,
        `\u09AA\u09F0\u09C0\u0995\u09CD\u09B7\u09BE\u09F0 \u0989\u09A4\u09CD\u09A4\u09F0\u09F0 \u09A7\u09BE\u0981\u099A \u099A\u09CB\u09F1\u09BE\u09F0 \u09AC\u09BE\u09AC\u09C7 Q&A \u0996\u09A3\u09CD\u09A1\u099F\u09CB \u099A\u09BE\u0993\u0995\u0964`
      ),
      emoji: "\u{1F4AC}",
      bilingualReady: true,
      generatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  const subjectChaptersSnap = await db2.collection("chapters").where("subjectId", "==", chapter.subjectId).where("classLevel", "==", chapter.classLevel).get();
  const currentChNum = chapter.chapterNumber ?? 0;
  const laterChapters = subjectChaptersSnap.docs.map((d) => ({ id: d.id, data: d.data() })).filter((c) => (c.data.chapterNumber ?? 0) > currentChNum).sort((a, b) => (a.data.chapterNumber ?? 0) - (b.data.chapterNumber ?? 0));
  if (laterChapters.length > 0) {
    const nextDoc = laterChapters[0];
    const next = nextDoc.data;
    const nextTitle = next.title || "Next chapter";
    return {
      kind: "next_chapter",
      rung: 8,
      target: {
        id: nextDoc.id,
        title: biSame(nextTitle),
        chapterId: nextDoc.id,
        chapterTitle: biSame(nextTitle),
        subjectId: next.subjectId,
        subjectName: subjectNameBi,
        ctaUrl: `/chapters/${nextDoc.id}`
      },
      reason: bi(
        `You've cleared "${chapter.title}" \u2014 start "${nextTitle}".`,
        `"${chapter.title}" \u09B6\u09C7\u09B7 \u09B9\u09C8\u099B\u09C7 \u2014 "${nextTitle}" \u0986\u09F0\u09AE\u09CD\u09AD \u0995\u09F0\u0995\u0964`
      ),
      emoji: "\u27A1\uFE0F",
      bilingualReady: true,
      generatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  return emptyRecommendation(
    `Excellent \u2014 you've cleared every chapter in ${chapter.subjectName ?? "this subject"}. Try another subject!`
  );
}
function safeKey(s) {
  return s.replace(/[^A-Za-z0-9_-]/g, "_").slice(0, 1e3);
}
async function narrateRecommendation(rec, uid, db2) {
  if (rec.kind === "all_caught_up") return rec;
  const targetId = rec.target.id || "_";
  const cacheKey = safeKey(`${rec.kind}__${targetId}`);
  const cacheRef = db2.collection("studentProgress").doc(uid).collection("aiNarrations").doc(cacheKey);
  try {
    const cached = await cacheRef.get();
    if (cached.exists) {
      const c = cached.data();
      const ageMs = Date.now() - (c.narratedAt instanceof Timestamp2 ? c.narratedAt.toMillis() : 0);
      if (ageMs < NARRATION_TTL_MS && c.en && c.as) {
        return { ...rec, reason: { en: c.en, as: c.as } };
      }
    }
    const studentSnap = await db2.collection("students").doc(uid).get();
    const fullName = (studentSnap.exists ? studentSnap.data().name : "") || "Student";
    const firstName = fullName.split(" ")[0];
    const prompt = `You are an AI Academic Mentor for TRUE CONCEPT, an educational app for Class 9-10 students in Assam, India.

Student: ${firstName}
Their next-best action is a "${rec.kind}" recommendation.
Target title (English): ${rec.target.title.en}
Chapter (English): ${rec.target.chapterTitle?.en ?? "\u2014"}
Subject (English): ${rec.target.subjectName?.en ?? "\u2014"}
The deterministic engine's base reason is: "${rec.reason.en}"

Write a warm, encouraging, ONE sentence reason that:
- Uses ${firstName}'s first name naturally (don't force it)
- Feels like a personal nudge from a friendly mentor
- Stays under 22 words
- Avoids generic phrases like "Let's dive in" or "Get started"
- References the specific subject/chapter/target where possible

Output BOTH English and Assamese versions. The Assamese version must:
- Use Assamese script (\u0985\u09B8\u09AE\u09C0\u09AF\u09BC\u09BE)
- Use simple, warm Assamese a Class 9-10 student in Assam will understand
- Keep technical subject names in English if they don't have natural Assamese equivalents

Return ONLY this JSON (no markdown fences, no commentary):
{
  "en": "English version here",
  "as": "Assamese version here"
}`;
    const raw = await callGemini(prompt);
    const parsed = parseGeminiJson(raw);
    if (!parsed.en || !parsed.as) {
      return rec;
    }
    void cacheRef.set({
      en: parsed.en,
      as: parsed.as,
      narratedAt: FieldValue3.serverTimestamp(),
      recKind: rec.kind,
      targetId
    });
    return { ...rec, reason: { en: parsed.en, as: parsed.as } };
  } catch (err) {
    console.warn("[narrator] AI narration failed, falling back to engine reason:", err.message);
    return rec;
  }
}

// src/routes/ai-mentor.ts
var GEMINI_API_KEY2 = defineSecret2("GEMINI_API_KEY");
var CACHE_TTL_MS2 = 6 * 60 * 60 * 1e3;
var aiMentor = onRequest12(
  { region: "asia-south1", invoker: "public", timeoutSeconds: 30, secrets: [GEMINI_API_KEY2] },
  async (req, res) => {
    if (handleCors(req, res)) return;
    const subPath = getSubPath(req, "/api/ai");
    try {
      if (req.method === "GET" && subPath === "/mentor") {
        const user = requireAuth(req);
        const uid = user.id;
        const cacheRef = db.collection("aiRecommendations").doc(uid);
        const cacheSnap = await cacheRef.get();
        if (cacheSnap.exists) {
          const cached = cacheSnap.data();
          const generatedMs = cached.generatedAt.toMillis();
          if (Date.now() - generatedMs < CACHE_TTL_MS2) {
            res.json(cached);
            return;
          }
        }
        const profileSnap = await db.collection("studentKnowledgeProfiles").doc(uid).get();
        if (!profileSnap.exists) {
          res.status(202).json({ pending: true, message: "Profile not ready yet. Study a bit first!" });
          return;
        }
        const profile = profileSnap.data();
        const studentSnap = await db.collection("students").doc(uid).get();
        const studentName = studentSnap.exists ? studentSnap.data().name ?? "Student" : "Student";
        const firstName = studentName.split(" ")[0];
        const weak = Object.values(profile.weakTopicMap ?? {});
        const strong = Object.values(profile.strongTopicMap ?? {});
        const subjectMastery = Object.values(profile.subjectMastery ?? {});
        const retry = profile.suggestedRetryQuestions ?? [];
        const revisionNeeded = profile.revisionProfile?.chaptersNeedingRevision ?? [];
        let recentActivityFormatted = "(no recent activity recorded)";
        try {
          const activitySnap = await db.collection("studentProgress").doc(uid).collection("activity").orderBy("at", "desc").limit(10).get();
          if (!activitySnap.empty) {
            recentActivityFormatted = activitySnap.docs.map((d) => {
              const a = d.data();
              const ago = a.at ? Math.round((Date.now() - a.at.toMillis()) / 6e4) : -1;
              const label = a.refTitle || a.chapterTitle || "(untitled)";
              const agoStr = ago < 0 ? "" : ago < 60 ? ` (${ago}m ago)` : ago < 1440 ? ` (${Math.round(ago / 60)}h ago)` : ` (${Math.round(ago / 1440)}d ago)`;
              return `- ${a.type ?? "event"}: ${label}${agoStr}`;
            }).join("\n");
          }
        } catch (err) {
          console.warn("[ai-mentor] could not read recent activity:", err);
        }
        const weakFormatted = weak.slice(0, 5).map((t) => `- ${t.chapterTitle}: mastery ${t.masteryScore}/100, MCQ accuracy ${t.mcqAccuracy}%, not studied in ${t.daysSinceStudy} days`).join("\n");
        const strongFormatted = strong.slice(0, 3).map((t) => `- ${t.chapterTitle}: mastery ${t.masteryScore}/100`).join("\n");
        const subjectFormatted = subjectMastery.map((s) => `- ${s.subjectName}: ${s.masteryScore}/100 (${s.trend})`).join("\n");
        const retryFormatted = retry.slice(0, 5).map((q) => `- ${q.chapterTitle}: accuracy ${q.accuracy}%, wrong ${q.consecutiveWrong} times in a row`).join("\n");
        const revisionFormatted = (await Promise.all(
          revisionNeeded.slice(0, 5).map(async (cid) => {
            const m = weak.find((t) => t.chapterId === cid) || strong.find((t) => t.chapterId === cid);
            if (m) return `- ${m.chapterTitle} (${m.daysSinceStudy} days ago)`;
            try {
              const chSnap = await db.collection("chapters").doc(cid).get();
              const title = chSnap.exists ? chSnap.data().title : null;
              if (title) return `- ${title} (not recently studied)`;
            } catch {
            }
            return null;
          })
        )).filter(Boolean).join("\n") || "None";
        const firstWeakChapterId = weak[0]?.chapterId ?? null;
        const firstRevisionChapterId = revisionNeeded[0] ?? null;
        const firstRetryChapterId = retry[0]?.chapterId ?? null;
        const isAssamese = (profile.medium ?? "English") === "Assamese";
        const langInstruction = isAssamese ? "Respond ENTIRELY in Assamese (Assamese script \u2014 \u0985\u09B8\u09AE\u09C0\u09AF\u09BC\u09BE). Use simple, warm Assamese that a Class 9-10 student from Assam can easily understand. Chapter names and subject names may stay in English." : "Respond in simple English.";
        const prompt = `You are an AI Academic Mentor for TRUE CONCEPT, an educational app for Class 9-10 students in Assam, India. Be warm, specific, encouraging and practical. ${langInstruction}

Student: ${firstName}
Class: ${profile.classLevel || "9"}, Medium: ${profile.medium || "English"}
Exam Readiness: ${profile.examReadinessScore ?? 0}/100
Confidence: ${profile.confidenceScore ?? 0}/100
Study Streak: ${profile.studyBehavior?.currentStreak ?? 0} days (longest: ${profile.studyBehavior?.longestStreak ?? 0})
Preferred study time: ${profile.studyBehavior?.preferredStudyHour ?? 20}:00
Active days this month: ${profile.studyBehavior?.activeDaysLast30 ?? 0}/30
Consistency: ${profile.studyBehavior?.consistencyScore ?? 0}/100
Overall MCQ Accuracy: ${profile.learningPattern?.averageMcqAccuracy ?? 0}%
Learning Trend: ${profile.learningPattern?.improvementTrend ?? "stable"}

Subject Mastery:
${subjectFormatted || "No data yet"}

Weak Topics (urgent attention needed):
${weakFormatted || "None identified yet"}

Strong Topics:
${strongFormatted || "None yet"}

Chapters not revised in 7+ days:
${revisionFormatted}

MCQ questions to retry (wrong multiple times):
${retryFormatted || "None yet"}

Recent activity (last 10 things this student did, newest first):
${recentActivityFormatted}

IMPORTANT GUIDANCE for picking recommendations:
- If the student JUST did the activity you were about to recommend (within the last hour), acknowledge their effort and shift to the NEXT-priority task instead. Do not repeat the same recommendation back.
- Each of the 3 topRecommendations MUST target a DIFFERENT chapter or a different activity type (revision / retry / study). No duplicates.
- The "retry" card is only worth showing if there are unresolved weak questions the student hasn't attempted in the last hour. Otherwise replace it with a different priority (e.g. a quick lab experiment, a Q&A review).
- **NEVER use raw chapter IDs** (anything that looks like an internal slug \u2014 for example "phys-ix-c01", "chem-x-04", numeric IDs). The chapter NAMES are the human-readable titles such as "Force and Laws of Motion", "Light \u2014 Reflection and Refraction", "\u09AE\u09C7\u099F\u09CD\u09F0\u09BF\u0995\u099B \u0986\u09F0\u09C1 \u0987\u09AF\u09BC\u09BE\u09F0 \u0997\u09C1\u09A3" etc. If a chapter's title is not provided in the data above, simply omit that chapter from your recommendation and pick a different one.

Return ONLY this JSON (no markdown):
{
  "greeting": "short warm greeting using first name, mention something specific like their streak or last activity",
  "examReadinessMessage": "specific message about their ${profile.examReadinessScore ?? 0}/100 score and top 1-2 things to improve it",
  "topRecommendations": [
    {
      "priority": 1,
      "type": "revision",
      "icon": "\u{1F504}",
      "title": "short title",
      "message": "specific actionable advice, mention exact chapter name",
      "actionLabel": "2-3 word CTA",
      "chapterId": "${firstRevisionChapterId ?? firstWeakChapterId}"
    },
    {
      "priority": 2,
      "type": "retry",
      "icon": "\u{1F3AF}",
      "title": "short title",
      "message": "specific actionable advice about MCQ retry",
      "actionLabel": "2-3 word CTA",
      "chapterId": "${firstRetryChapterId ?? firstWeakChapterId}"
    },
    {
      "priority": 3,
      "type": "study",
      "icon": "\u{1F4DA}",
      "title": "short title",
      "message": "specific advice about next chapter to study",
      "actionLabel": "2-3 word CTA",
      "chapterId": "${firstWeakChapterId}"
    }
  ],
  "weakTopicAlert": "one sentence about the biggest weakness subject/chapter",
  "revisionAlert": ${revisionNeeded.length > 0 ? '"one sentence about forgotten chapters"' : "null"},
  "motivationalMessage": "one sentence personal motivation based on streak/progress",
  "nextBestAction": {
    "message": "one sentence: the single most important thing to do RIGHT NOW",
    "chapterId": "${firstRevisionChapterId ?? firstWeakChapterId ?? null}",
    "tab": "notes"
  }
}`;
        const raw = await callGemini(prompt);
        const aiData = parseGeminiJson(raw);
        const result = {
          ...aiData,
          examReadinessScore: profile.examReadinessScore ?? 0,
          generatedAt: Timestamp3.now()
        };
        await cacheRef.set({ ...result, generatedAt: FieldValue4.serverTimestamp() });
        res.json(result);
        return;
      }
      if (req.method === "POST" && subPath === "/mentor/refresh") {
        const user = requireAuth(req);
        await db.collection("aiRecommendations").doc(user.id).delete();
        res.json({ ok: true });
        return;
      }
      if (req.method === "GET" && subPath === "/next-recommendation") {
        const user = requireAuth(req);
        const rec = await computeNextRecommendation(user.id, db);
        const narrated = await narrateRecommendation(rec, user.id, db);
        res.json(narrated);
        return;
      }
      if (req.method === "POST" && subPath === "/next-recommendation/refresh") {
        const user = requireAuth(req);
        const cacheCol = db.collection("studentProgress").doc(user.id).collection("aiNarrations");
        const snap = await cacheCol.get();
        const batch = db.batch();
        snap.docs.forEach((d) => batch.delete(d.ref));
        await batch.commit();
        res.json({ ok: true, cleared: snap.size });
        return;
      }
      res.status(404).json({ error: "Not found" });
    } catch (err) {
      const authErr = err;
      if (authErr.status && authErr.error) {
        res.status(authErr.status).json({ error: authErr.error });
        return;
      }
      console.error("[ai-mentor] error:", err);
      res.status(500).json({ error: "AI mentor temporarily unavailable" });
    }
  }
);
export {
  aiMentor,
  auth,
  broadcastNewContent,
  chapters,
  content,
  dashboard,
  experiments,
  health,
  progress,
  rebuildKnowledgeProfile,
  search,
  storage,
  students,
  subjects
};
//# sourceMappingURL=index.js.map
