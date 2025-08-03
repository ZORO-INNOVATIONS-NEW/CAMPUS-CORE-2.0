import { verify_user_email } from '#lib/db.ts';
import * as auth from '#lib/auth.ts';

export const verifyEmail = async (req: any, res: any) => {
  try {
    const { token } = req.query;

    if (!token || typeof token !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid token' });
    }

    const data = auth.jwt_decode(token);

    if (!data || !data.uid) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    const success = await verify_user_email(data.uid);
    if (success) {
      return res.send(`<h2>Email verified successfully!</h2><p>You can now log in.</p>`);
    } else {
      return res.send(`<h2>Email already verified or user not found.</h2>`);
    }
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
