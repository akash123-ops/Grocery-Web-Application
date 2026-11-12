import multer from 'multer';

export const upload =multer({storge: multer.diskStorage({})})