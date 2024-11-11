// @ts-nocheck
import Cookies from 'js-cookie';
import { writable } from 'svelte/store';

export const currentTheme = writable(getTheme());
let newTheme = 'light'
let themes = ['dark', 'light']

export function setCookie(name, args){
	Cookies.set(name, args, { expires: 365, sameSite: 'Strict' });
}

export function getCookie(name){
	return Cookies.get(name);
}

export function setTheme() {
  let current = Cookies.get('theme') || 'light';
  let newTheme = current === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = newTheme;
  currentTheme.set(newTheme);
  Cookies.set('theme', newTheme);
}
export function getTheme() {
  return getCookie('theme');
}

export function loadTheme() {
  if (getCookie('theme') != null) {
    newTheme = getCookie('theme');
    document.documentElement.dataset.theme == newTheme;
  }
}