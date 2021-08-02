import { ROOM_ID_LENGTH, ROOM_ID_CHARACTERS } from '../constants/Global';

export const isNumber = (value) => /^[0-9]+$/.test(value);
export const isNumberEntered = (value) => /^[0-9\b]+$/.test(value);
export const isValidRoomId = (roomId) => roomId.length === 6 && isNumber(roomId);

export const generateRoomId = () => {
    let roomId = '';
    for (let i = 0; i < ROOM_ID_LENGTH; i++) {
        roomId += ROOM_ID_CHARACTERS.charAt(Math.floor(Math.random() * ROOM_ID_CHARACTERS.length));
    }
    return roomId;
};