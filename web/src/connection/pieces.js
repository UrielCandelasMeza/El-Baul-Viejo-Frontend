import axios from "./axios";

export const createPiece        = (data) => axios.post("/piece/create", data);
export const getAvailablePieces = ()     => axios.get("/piece/get/available");
export const getPieceById       = (id)   => axios.get(`/piece/get/${id}`);