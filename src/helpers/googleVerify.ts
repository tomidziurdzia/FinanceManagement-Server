import { OAuth2Client } from "google-auth-library";

async function googleVerify(id_token = "") {
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  const ticket = await client.verifyIdToken({
    idToken: id_token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return {
    name: payload?.given_name,
    surname: payload?.family_name,
    picture: payload?.picture,
    email: payload?.email,
  };
}

export { googleVerify };
