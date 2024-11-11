import { writable } from "svelte/store";

export function capitalizeFirstLetter(val: string) {
    return String(val)[0].toUpperCase() + String(val).toLowerCase().slice(1);
}

export function capitalizeNames(val: string) {
    return val
      .split(' ')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
}
