# amazing-race-mobile
Mobile application for an amazing race application for my partner

## Access prompt

Set `VITE_RACE_PASSWORD` to the participant's password in the Vercel project environment variables, then rebuild and redeploy. The prompt stays open until the password is entered and remembers the unlock for the current browser tab.

This is a simple client-side prompt, not secure access control: the password is included in the public app bundle and can be discovered by a technically curious visitor.

## QR pages

- `/qr/1` asks for the name of the store the dog escaped from.
- `/qr/2` shows the Observatory Hill landmark question and photo.

Both pages use the same password prompt as the main app.
