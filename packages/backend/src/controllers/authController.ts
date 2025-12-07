import { Buffer } from 'node:buffer';
import { getTokenExpiryByURI } from '../database/TokenService.ts';
import { hashCookie } from '../controllers/cookie.ts';
import { getUserIdByURI } from '../database/UserService.ts';
import crypto from 'crypto';

export async function verifyMagicCookie(req, res) {

}