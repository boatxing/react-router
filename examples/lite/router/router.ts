import type { To } from './history'
import type { RouteData, AgnosticRouteObject, AgnosticDataRouteObject, AgnosticDataRouteMatch } from './utils'
import type { Action as HistoryAction, Path } from './history'

// import {
//   createLocation,
//   createPath,
//   createURL,
//   parsePath,
// } from "./history";

/**
 * Initialization options for createRouter
 */
 export interface RouterInit {
  basename?: string;
  routes: AgnosticRouteObject[];
  history: History;
  //  hydrationData?: HydrationState;
}

/**
 * Options for a navigate() call for a Link navigation
 */
 type LinkNavigateOptions = {
  replace?: boolean;
  state?: any;
  preventScrollReset?: boolean;
};

/**
 * Options to pass to navigate() for either a Link or Form navigation
 */
 export type RouterNavigateOptions =
 | LinkNavigateOptions;
//  | SubmissionNavigateOptions;

/**
 * A Router instance manages all navigation and data loading/mutations
 */
 export interface Router {
  /**
   * @internal
   * PRIVATE - DO NOT USE
   *
   * Return the basename for the router
   */
  get basename(): RouterInit["basename"];

  /**
   * @internal
   * PRIVATE - DO NOT USE
   *
   * Return the current state of the router
   */
  get state(): RouterState;

  /**
   * @internal
   * PRIVATE - DO NOT USE
   *
   * Return the routes for this router instance
   */
  get routes(): AgnosticDataRouteObject[];

  /**
   * @internal
   * PRIVATE - DO NOT USE
   *
   * Initialize the router, including adding history listeners and kicking off
   * initial data fetches.  Returns a function to cleanup listeners and abort
   * any in-progress loads
   */
  initialize(): Router;

  /**
   * @internal
   * PRIVATE - DO NOT USE
   *
   * Subscribe to router.state updates
   *
   * @param fn function to call with the new state
   */
  subscribe(fn: RouterSubscriber): () => void;

  /**
   * @internal
   * PRIVATE - DO NOT USE
   *
   * Enable scroll restoration behavior in the router
   *
   * @param savedScrollPositions Object that will manage positions, in case
   *                             it's being restored from sessionStorage
   * @param getScrollPosition    Function to get the active Y scroll position
   * @param getKey               Function to get the key to use for restoration
   */
  // enableScrollRestoration(
  //   savedScrollPositions: Record<string, number>,
  //   getScrollPosition: GetScrollPositionFunction,
  //   getKey?: GetScrollRestorationKeyFunction
  // ): () => void;

  /**
   * @internal
   * PRIVATE - DO NOT USE
   *
   * Navigate forward/backward in the history stack
   * @param to Delta to move in the history stack
   */
  navigate(to: number): void;

  /**
   * Navigate to the given path
   * @param to Path to navigate to
   * @param opts Navigation options (method, submission, etc.)
   */
  navigate(to: To, opts?: RouterNavigateOptions): void;

  /**
   * @internal
   * PRIVATE - DO NOT USE
   *
   * Trigger a fetcher load/submission
   *
   * @param key     Fetcher key
   * @param routeId Route that owns the fetcher
   * @param href    href to fetch
   * @param opts    Fetcher options, (method, submission, etc.)
   */
  fetch(
    key: string,
    routeId: string,
    href: string,
    opts?: RouterNavigateOptions
  ): void;

  /**
   * @internal
   * PRIVATE - DO NOT USE
   *
   * Trigger a revalidation of all current route loaders and fetcher loads
   */
  revalidate(): void;

  /**
   * @internal
   * PRIVATE - DO NOT USE
   *
   * Utility function to create an href for the given location
   * @param location
   */
  createHref(location: Location | URL): string;

  /**
   * @internal
   * PRIVATE - DO NOT USE
   *
   * Utility function to URL encode a destination path according to the internal
   * history implementation
   * @param to
   */
  encodeLocation(to: To): Path;

  /**
   * @internal
   * PRIVATE - DO NOT USE
   *
   * Get/create a fetcher for the given key
   * @param key
   */
  // getFetcher<TData = any>(key?: string): Fetcher<TData>;

  /**
   * @internal
   * PRIVATE - DO NOT USE
   *
   * Delete the fetcher for a given key
   * @param key
   */
  // deleteFetcher(key?: string): void;

  /**
   * @internal
   * PRIVATE - DO NOT USE
   *
   * Cleanup listeners and abort any in-progress loads
   */
  dispose(): void;

  /**
   * @internal
   * PRIVATE - DO NOT USE
   *
   * Internal fetch AbortControllers accessed by unit tests
   */
  // _internalFetchControllers: Map<string, AbortController>;

  /**
   * @internal
   * PRIVATE - DO NOT USE
   *
   * Internal pending DeferredData instances accessed by unit tests
   */
  // _internalActiveDeferreds: Map<string, DeferredData>;
}

/**
 * State maintained internally by the router.  During a navigation, all states
 * reflect the the "old" location unless otherwise noted.
 */
export interface RouterState {
  /**
   * The action of the most recent navigation
   */
  historyAction: HistoryAction;

  /**
   * The current location reflected by the router
   */
  location: Location;

  /**
   * The current set of route matches
   */
  matches: AgnosticDataRouteMatch[];

  /**
   * Tracks whether we've completed our initial data load
   */
  initialized: boolean;

  /**
   * Current scroll position we should start at for a new view
   *  - number -> scroll position to restore to
   *  - false -> do not restore scroll at all (used during submissions)
   *  - null -> don't have a saved position, scroll to hash or top of page
   */
  // restoreScrollPosition: number | false | null;

  /**
   * Indicate whether this navigation should skip resetting the scroll position
   * if we are unable to restore the scroll position
   */
  // preventScrollReset: boolean;

  /**
   * Tracks the state of the current navigation
   */
  // navigation: Navigation;

  /**
   * Tracks any in-progress revalidations
   */
  // revalidation: RevalidationState;

  /**
   * Data from the loaders for the current matches
   */
  // loaderData: RouteData;

  /**
   * Data from the action for the current matches
   */
  // actionData: RouteData | null;

  /**
   * Errors caught from loaders for the current matches
   */
  errors: RouteData | null;

  /**
   * Map of current fetchers
   */
  // fetchers: Map<string, Fetcher>;
}

/**
 * Subscriber function signature for changes to router state
 */
 export interface RouterSubscriber {
  (state: RouterState): void;
}

/**
 * State returned from a server-side query() call
 */
 export interface StaticHandlerContext {
  basename: Router["basename"];
  location: RouterState["location"];
  matches: RouterState["matches"];
  // loaderData: RouterState["loaderData"];
  // actionData: RouterState["actionData"];
  // errors: RouterState["errors"];
  statusCode: number;
  loaderHeaders: Record<string, Headers>;
  actionHeaders: Record<string, Headers>;
  _deepestRenderedBoundaryId?: string | null;
}

/**
 * A StaticHandler instance manages a singular SSR navigation/fetch event
 */
export interface StaticHandler {
  dataRoutes: AgnosticDataRouteObject[];
  query(request: Request): Promise<StaticHandlerContext | Response>;
  queryRoute(request: Request, routeId?: string): Promise<any>;
}

/**
 * Potential states for state.navigation
 */
// export type NavigationStates = {
//   Idle: {
//     state: "idle";
//     location: undefined;
//     formMethod: undefined;
//     formAction: undefined;
//     formEncType: undefined;
//     formData: undefined;
//   };
//   Loading: {
//     state: "loading";
//     location: Location;
//     formMethod: FormMethod | undefined;
//     formAction: string | undefined;
//     formEncType: FormEncType | undefined;
//     formData: FormData | undefined;
//   };
//   Submitting: {
//     state: "submitting";
//     location: Location;
//     formMethod: FormMethod;
//     formAction: string;
//     formEncType: FormEncType;
//     formData: FormData;
//   };
// };

// export type Navigation = NavigationStates[keyof NavigationStates];

// export type RevalidationState = "idle" | "loading";
