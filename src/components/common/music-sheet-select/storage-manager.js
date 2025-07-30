// localStorage에 업로드한 악보 관리하는 기능 모음

import { LOCAL_STORAGE_KEY } from "./constants.js";

// localStorage에서 사용자가 업로드한 악보 데이터 불러오기
export function loadUserMusicSheets() {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

// localStorage에 사용자가 업로드한 악보 데이터 저장하기
export function saveUserMusicSheets(musicSheets) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(musicSheets));
}
