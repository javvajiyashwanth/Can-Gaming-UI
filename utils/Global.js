export const isNumber = (value) => /^[0-9]+$/.test(value);
export const isNumberEntered = (value) => /^[0-9\b]+$/.test(value);
export const isValidRoomId = (roomId) => roomId.length === 6 && isNumber(roomId); 