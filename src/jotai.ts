export function atom<AtomType>(initialValue: AtomType): {
  get: () => AtomType;
  set: (newValue: AtomType) => void;
  subscribe: (callback: (newValue: AtomType) => void) => () => void;
} {
  let value = initialValue;

  const subscribers = new Set<(newValue: AtomType) => void>();

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

export function useAtom(atom: Atom<any>) {
  const [state, setState] = useState(atom.value);
  useEffect(() => {
    const unsubscribe = atom.subscribe(setState);
    return () => {
      unsubscribe();
    };
  }, [atom]);
  return [state, atom.set];
}
