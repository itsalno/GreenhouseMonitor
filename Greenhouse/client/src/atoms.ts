import {atom} from 'jotai';
import {SensorData} from "./generated-client.ts";
import {Thresholds} from  "./generated-client.ts"

export const JwtAtom = atom<string>(localStorage.getItem('jwt') || '')

export const SensorDataAtom = atom<SensorData[]>([]);

export const TresholdsAtom = atom<Thresholds[]>([]);

export const MobileSidebarOpenAtom = atom(false);