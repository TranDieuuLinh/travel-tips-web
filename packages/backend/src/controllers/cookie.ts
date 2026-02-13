
import crypto from 'crypto';

export function hashCookie(userId: string, cookieCreatedTime: number) {
  const hkey = process.env.HMACKEY as string;
  const combined = `${userId.toString()} ${cookieCreatedTime.toString()}`;
  const hashedCombined = crypto.createHmac('sha512', hkey).update(combined).digest('base64');
  return hashedCombined;
}

export function validateHashcookie(parsedCombined: string, hashedCombined: string) {
  const buffParsedCombined = Buffer.from(parsedCombined, `base64`);
  const buffCombined = Buffer.from(hashedCombined, `base64`);
  if (buffParsedCombined.length !== buffCombined.length) return false;
  return crypto.timingSafeEqual(buffParsedCombined, buffCombined);
}

export function validateUsersCookie(cookie:string, userIdURI?:string){
  if (!cookie) return null;
  let parsed;
    try {
        parsed = JSON.parse(cookie);
    } catch (error: unknown) {
        return null;
    }
    const {userId, cookieCreatedTime, combine } = parsed;
    if (!cookieCreatedTime || !combine) return null;
  
    const hashedCombined = hashCookie(userIdURI? userIdURI:userId, cookieCreatedTime);

    if (!validateHashcookie(combine, hashedCombined)) return null;
    return parsed;
}