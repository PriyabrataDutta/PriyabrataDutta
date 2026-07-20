/**
 * use-toast — Lightweight global toast notification system.
 *
 * Inspired by shadcn/ui's toast pattern. A single in-memory store holds the
 * currently-visible toast(s); any component can call `toast(...)` to push
 * a new one, and any component using the `useToast()` hook will re-render
 * when the toast list changes.
 *
 * Architecture:
 *   1. `memoryState` — module-level state object (single source of truth).
 *   2. `listeners`   — array of React `setState` functions that want updates.
 *   3. `dispatch()`  — runs the reducer and notifies every listener.
 *   4. `useToast()`  — registers the component as a listener on mount,
 *                       unregisters on unmount.
 *
 * Why module-level state instead of Context? Toasts are imperative — fired
 * from event handlers. A global store keeps the API as simple as
 * `toast({ title: "Saved!" })` from anywhere.
 */

import * as React from "react";

import type { ToastActionElement, ToastProps } from "@/components/ui/toast";

/** Maximum number of toasts visible on screen at once. */
const TOAST_LIMIT = 1;
/** Delay (ms) before a dismissed toast is removed from state. Very high so
 *  dismissed toasts persist visually until the consumer manually removes them. */
const TOAST_REMOVE_DELAY = 1000000;

/**
 * A toast as stored in state — visual props plus internal metadata.
 */
type ToasterToast = ToastProps & {
  /** Unique auto-generated id used for updates / dismissals. */
  id: string;
  /** Bold title text shown at the top of the toast. */
  title?: React.ReactNode;
  /** Smaller description text below the title. */
  description?: React.ReactNode;
  /** Optional action button (e.g. "Undo"). */
  action?: ToastActionElement;
};

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type ActionType = typeof actionTypes;

type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: ToasterToast;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<ToasterToast>;
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      toastId?: ToasterToast["id"];
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      toastId?: ToasterToast["id"];
    };

interface State {
  toasts: ToasterToast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t)),
      };

    case "DISMISS_TOAST": {
      const { toastId } = action;

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t,
        ),
      };
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};

const listeners: Array<(state: State) => void> = [];

let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

/** Public toast input — same as `ToasterToast` minus the auto-generated `id`. */
type Toast = Omit<ToasterToast, "id">;

/**
 * Imperatively show a toast notification from anywhere (event handlers,
 * async callbacks, etc.). Does NOT need to be called inside a React component.
 *
 * @param props - Toast content. Common fields:
 *   - `title`       — bold heading (string or JSX)
 *   - `description` — secondary text (string or JSX)
 *   - `variant`     — `"default" | "destructive"` (visual styling)
 *   - `action`      — optional action button JSX (e.g. "Undo")
 * @returns An object with:
 *   - `id` — the unique id assigned to this toast
 *   - `dismiss()` — close this specific toast
 *   - `update(props)` — change title/description after it's already shown
 *
 * @example
 * ```ts
 * const t = toast({ title: "Saving..." });
 * await save();
 * t.update({ id: t.id, title: "Saved ✓" });
 * setTimeout(() => t.dismiss(), 2000);
 * ```
 */
function toast({ ...props }: Toast) {
  const id = genId();

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    });
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return {
    id: id,
    dismiss,
    update,
  };
}

/**
 * React hook that subscribes a component to the global toast store.
 * Use this when you need to *render* the current toast list (e.g. inside
 * `<Toaster />`) or programmatically dismiss toasts from a component.
 *
 * @returns An object with:
 *   - `toasts` — current array of visible toasts (re-renders on change)
 *   - `toast(props)` — same imperative function as the standalone `toast` export
 *   - `dismiss(toastId?)` — dismiss one toast by id, or ALL toasts if omitted
 *
 * @example
 * ```tsx
 * const { toast, dismiss, toasts } = useToast();
 * <button onClick={() => toast({ title: "Hi!" })}>Show toast</button>
 * <button onClick={() => dismiss()}>Dismiss all</button>
 * ```
 */
function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  // Subscribe this component's setState to the global listeners array on
  // mount, and clean up on unmount to avoid memory leaks / stale updates.
  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast,
    /**
     * Dismiss a specific toast by id, or ALL toasts if `toastId` is omitted.
     * @param toastId - Optional id of the toast to dismiss.
     */
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}

export { useToast, toast };
