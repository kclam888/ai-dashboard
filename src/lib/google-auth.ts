import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];

export const auth = new google.auth.JWT({
  email: process.env.GOOGLE_CLIENT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  scopes: SCOPES,
});

export const gmail = google.gmail({ version: 'v1', auth }); 