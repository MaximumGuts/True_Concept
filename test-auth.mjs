import { google } from 'googleapis';
import fs from 'fs';

async function testAuth() {
  try {
    const keyStr = Buffer.from(process.env.TRUE_CONCEPT_SERVICE_KEY, 'base64').toString('utf8');
    const credentials = JSON.parse(keyStr);
    
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });
    
    const client = await auth.getClient();
    const token = await client.getAccessToken();
    console.log("SUCCESS! Token received:", token.token.substring(0, 10) + "...");
  } catch (err) {
    console.error("AUTH FAILED:");
    console.error(err);
  }
}

testAuth();
