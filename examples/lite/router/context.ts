import * as React from "react";

import type { History, To, Location, Action as NavigationType } from './history'
import type { Router, StaticHandlerContext } from './router'
import type { AgnosticIndexRouteObject, AgnosticNonIndexRouteObject, AgnosticRouteMatch } from './utils'

/**
 * A Navigator is a "location changer"; it's how you get to different locations.
 *
 * Every history instance conforms to the Navigator interface, but the
 * distinction is useful primarily when it comes to the low-level <Router> API
 * where both the location and a navigator must be provided separately in order
 * to avoid "tearing" that may occur in a suspense-enabled app if the action
 * and/or location were to be read directly from the history instance.
 */
 export interface Navigator {
  createHref: History["createHref"];
  // Optional for backwards-compat with Router/HistoryRouter usage (edge case)
  encodeLocation?: History["encodeLocation"];
  go: History["go"];
  push(to: To, state?: any, opts?: NavigateOptions): void;
  replace(to: To, state?: any, opts?: NavigateOptions): void;
}

export interface NavigateOptions {
  replace?: boolean;
  state?: any;
  preventScrollReset?: boolean;
  relative?: RelativeRoutingType;
}

export type RelativeRoutingType = "route" | "path";

export type DataRouteObject = RouteObject & {
  children?: DataRouteObject[];
  id: string;
};

export type RouteObject = IndexRouteObject | NonIndexRouteObject;


// Create react-specific types from the agnostic types in @remix-run/router to
// export from react-router
export interface IndexRouteObject {
  caseSensitive?: AgnosticIndexRouteObject["caseSensitive"];
  path?: AgnosticIndexRouteObject["path"];
  id?: AgnosticIndexRouteObject["id"];
  // loader?: AgnosticIndexRouteObject["loader"];
  // action?: AgnosticIndexRouteObject["action"];
  // hasErrorBoundary?: AgnosticIndexRouteObject["hasErrorBoundary"];
  // shouldRevalidate?: AgnosticIndexRouteObject["shouldRevalidate"];
  handle?: AgnosticIndexRouteObject["handle"];
  index: true;
  children?: undefined;
  element?: React.ReactNode | null;
  errorElement?: React.ReactNode | null;
}

export interface NonIndexRouteObject {
  caseSensitive?: AgnosticNonIndexRouteObject["caseSensitive"];
  path?: AgnosticNonIndexRouteObject["path"];
  id?: AgnosticNonIndexRouteObject["id"];
  // loader?: AgnosticNonIndexRouteObject["loader"];
  // action?: AgnosticNonIndexRouteObject["action"];
  // hasErrorBoundary?: AgnosticNonIndexRouteObject["hasErrorBoundary"];
  // shouldRevalidate?: AgnosticNonIndexRouteObject["shouldRevalidate"];
  handle?: AgnosticNonIndexRouteObject["handle"];
  index?: false;
  children?: RouteObject[];
  element?: React.ReactNode | null;
  errorElement?: React.ReactNode | null;
}

export interface RouteMatch<
  ParamKey extends string = string,
  RouteObjectType extends RouteObject = RouteObject
> extends AgnosticRouteMatch<ParamKey, RouteObjectType> {}

export interface DataRouteMatch extends RouteMatch<string, DataRouteObject> {}


// export type RouteObject = IndexRouteObject | NonIndexRouteObject;

// export type DataRouteObject = RouteObject & {
//   children?: DataRouteObject[];
//   id: string;
// };

// export interface RouteMatch<
//   ParamKey extends string = string,
//   RouteObjectType extends RouteObject = RouteObject
// > extends AgnosticRouteMatch<ParamKey, RouteObjectType> {}

// export interface DataRouteMatch extends RouteMatch<string, DataRouteObject> {}



interface LocationContextObject {
  location: Location;
  navigationType: NavigationType;
}

export const LocationContext = React.createContext<LocationContextObject>(
  null!
);

if (__DEV__) {
  LocationContext.displayName = "Location";
}

// export interface RouteContextObject {
//   outlet: React.ReactElement | null;
//   matches: RouteMatch[];
// }

// export const RouteContext = React.createContext<RouteContextObject>({
//   outlet: null,
//   matches: [],
// });

// if (__DEV__) {
//   RouteContext.displayName = "Route";
// }

interface NavigationContextObject {
  basename: string;
  navigator: Navigator;
  static: boolean;
}

export const NavigationContext = React.createContext<NavigationContextObject>(
  null!
);

if (__DEV__) {
  NavigationContext.displayName = "Navigation";
}

export interface DataRouterContextObject extends NavigationContextObject {
  router: Router;
}

export const DataRouterContext =
  React.createContext<DataRouterContextObject | null>(null);
if (__DEV__) {
  DataRouterContext.displayName = "DataRouter";
}

export interface RouteContextObject {
  outlet: React.ReactElement | null;
  matches: RouteMatch[];
}

export const RouteContext = React.createContext<RouteContextObject>({
  outlet: null,
  matches: [],
});

if (__DEV__) {
  RouteContext.displayName = "Route";
}

export const DataRouterStateContext = React.createContext<
  Router["state"] | null
>(null);
if (__DEV__) {
  DataRouterStateContext.displayName = "DataRouterState";
}

// Contexts for data routers
export const DataStaticRouterContext =
  React.createContext<StaticHandlerContext | null>(null);
if (__DEV__) {
  DataStaticRouterContext.displayName = "DataStaticRouterContext";
}
