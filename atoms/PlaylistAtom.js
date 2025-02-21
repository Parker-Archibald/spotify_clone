import { atom } from "recoil";

export const playlistState = atom({
    key: 'playlistState',
    default: null
})

export const playlistIdState = atom({
    key: 'playlistIdState',
    default: null
})

export const deviceIdState = atom({
    key: 'deviceIdState',
    default: null
})

export const currentSongState = atom({
    key: 'currentSongState',
    default: null
})

export const isPlayingState = atom ({
    key: 'isPlayingState',
    default: false
})

export const queueState = atom({
    key: 'queueState',
    default: false
})

export const searchState = atom({
    key: 'searchState',
    default: false
})
