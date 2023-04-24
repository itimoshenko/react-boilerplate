import {
  AtomEffect, DefaultValue, atom, selector,
} from 'recoil';

const localStorageEffect = <T>(
  key: string,
  localStorage?: Storage,
) => {
  const effect: AtomEffect<T> = ({ setSelf, onSet }) => {
    if (!localStorage) {
      return;
    }

    const savedValue = localStorage.getItem(key);

    if (savedValue != null) {
      try {
        const parsedValue = JSON.parse(savedValue);

        // SSR Hack
        setTimeout(() => setSelf(parsedValue), 0);
      } catch (e) {
        setSelf(new DefaultValue());
      }
    }

    onSet((newValue, _, isReset) => {
      if (isReset) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(newValue));
      }
    });
  };

  return effect;
};
