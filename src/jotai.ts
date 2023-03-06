import { useSyncExternalStore } from "react";

interface Atom<AtomType> {
  get: () => AtomType;
  set: (newValue: AtomType) => void;
  subscribe: (callback: (newValue: AtomType) => void) => () => void;
}

type AtomGetter<AtomType> = (
  get: <Target>(a: Atom<Target>) => Target
) => AtomType;

export function atom<AtomType>(
  initialValue: AtomType | AtomGetter<AtomType>
): Atom<AtomType> {
  let value =
    typeof initialValue === "function" ? (null as AtomType) : initialValue;

  const subscribers = new Set<(newValue: AtomType) => void>();

  function get<Target>(atom: Atom<Target>) {
    let currentValue = atom.get();

    atom.subscribe((newValue) => {
      if (currentValue === newValue) return;

      currentValue = newValue;
      computeValue();
      subscribers.forEach((callback) => callback(value));
    });

    return currentValue;
  }

  function computeValue() {
    const newValue =
      typeof initialValue === "function"
        ? (initialValue as AtomGetter<AtomType>)(get)
        : value;

    if (newValue && typeof (newValue as any).then === "function") {
      value = null as AtomType;
      (newValue as any as Promise<AtomType>).then((resolvedValue) => {
        value = resolvedValue;
        subscribers.forEach((callback) => callback(value));
      });
    } else {
      value = newValue;
    }
  }
  computeValue();

  return {
    get: () => value,
    set: (newValue: AtomType) => {
      value = newValue;
      subscribers.forEach((callback) => callback(value));
    },
    subscribe: (callback) => {
      subscribers.add(callback);
      return () => {
        subscribers.delete(callback);
      };
    },
  };
}

export function useAtom<AtomType>(atom: Atom<AtomType>) {
  return [useSyncExternalStore(atom.subscribe, atom.get), atom.set];
}

export function useAtomValue<AtomType>(atom: Atom<AtomType>) {
  return [useSyncExternalStore(atom.subscribe, atom.get)];
}
