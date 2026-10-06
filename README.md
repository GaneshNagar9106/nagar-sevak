# Gram Sevak (Jan Awaaz) - Citizen Initiative

## 1. Kya chahiye
- Node.js 20.6 ya usse naya (https://nodejs.org se LTS)

## 2. Free Gemini API key (SIRF YEHI CHAHIYE)
1. https://aistudio.google.com/apikey kholo, Google se login karo
2. "Create API key" dabao, key copy karo
3. Project folder me `.env.example` ko copy karke `.env` naam do
4. `.env` me `GEMINI_API_KEY=` ke aage key paste karo
5. (Optional) `CONTACT_EMAIL` me apna email likho (Nominatim ke liye)
6. Model naam AI Studio me check kar lo, `GEMINI_MODEL` me daal sakte ho

## 3. Chalane ke commands
```
npm install
npm start
```
Browser me http://localhost:3000 kholo. Pehli baar demo reports apne aap ban jaati hain.
Reset: `server/data.json` file delete kar do.

## 4. Home background image
ChatGPT wali image ko `client/bg.jpg` naam se save karo (purani replace kar do). Bas! Image nahi hogi to blue-green gradient dikhega.

## 5. Phone par camera test
Camera ke liye HTTPS chahiye (localhost pe chalta hai). Phone par test: `npx localtunnel --port 3000` ya Render pe deploy karo.

## 6. Free deploy (Render)
GitHub pe code daalo, Render.com > New Web Service. Build: `npm install`, Start: `npm start`. Env variables me GEMINI_API_KEY, GEMINI_MODEL, CONTACT_EMAIL daalo.
(Note: Render free tier pe data.json/uploads restart par mit sakte hain.)

## Privacy
Free Gemini tier ka data Google use kar sakta hai. Photos me chehre/number plate ho sakte hain (blur = future scope).

## Priority formula
score = severity(high 30, medium 20, low 10) + reposts x 2 + din (age)

## Future scope
Supabase DB + login, authority panel, after-photo verification, dashboard, fund transparency, DigiLocker, face blur, phone OTP.
