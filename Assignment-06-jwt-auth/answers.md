# Assignment 6: JWT Auth (bcrypt + cookie) - Answers & Explanations

## Soch ke batao

### 1. DB me password ka hash pada hai. Login ke waqt user plain password bhejta hai. `bcrypt.compare` match kaise kar leta hai jab hash se wapas password nikal hi nahi sakte?
**Answer**: 
`bcrypt.compare` database ke store kiye gaye hash ko decrypt/reverse-engineer nahi karta.
Bcrypt hash string ke shuruat me hi password hashing ke liye use kiya gaya **salt** (aur algorithm metadata) store hota hai. `bcrypt.compare` plain password aur usi salt parameter ko use karke naya temporary hash generate karta hai. Agar dono hashes identical matching structure ke hain, toh user validation pass ho jaata hai.

---

### 2. Service me bhi `bcrypt.hash()` kar do (jab hook already kar raha hai) — kya hoga? Ye galti bahut log karte hain.
**Answer**:
Password **double hash** ho jayega.
1. Pehli baar `bcrypt.hash()` service layer me password ko hash karke (e.g. `"$2a$10$...xyz"`) object database models ko bhejega.
2. Saving pipeline chalte waqt, pre-save hook check karega `isModified("password")`. Kyunki value change hui hai, hook us hashed password `"$2a$10$...xyz"` ko fir se hash kar dega.
Is double hashing ki vajah se login check fail ho jayega kyunki user ka original password verify checks validation match nahi karega.

---

### 3. JWT ka payload encrypted hota hai ya sirf encoded? Iska matlab kya — payload me kya cheezein kabhi nahi daalni chahiye?
**Answer**:
JWT ka payload standard signature format me sirf **Base64Url encoded** hota hai, **encrypted nahi**. Koi bhi user ise simple decode website (jaise jwt.io) pe paste karke metadata details inspect kar sakta hai.
**Kya nahi daalna chahiye**: Payload me sensitive information jaise credentials, bank cards details, system-specific secure keys, ya passwords kabhi nahi daalne chahiye.

---

### 4. `httpOnly: true` na lagayein to kaunsa attack possible ho jaata hai?
**Answer**:
**XSS (Cross-Site Scripting)** attack.
Agar `httpOnly: true` option active nahi hai, toh client-side browser JavaScript (`document.cookie`) token parameter read kar sakti hai. Kisi injection vulnerability (XSS) se hacker token leak kar sakta hai. Setting `httpOnly: true` cookies ko script engine standard calls ke access scope se remove kar deta hai.

---

### 5. Logout me cookie hata di. Kya wo token ab mar gaya? Agar kisi ne wo token pehle copy kar liya ho to?
**Answer**:
Nahi, stateless JWT tokens database me lookups use nahi karte. Logout karne se sirf client application se cookie delete hoti hai.
Agar kisi ne vo active token copy kiya hai, toh expiration timestamp (e.g., 1 hour) completion tak wo token user identity verification calls access kar sakega. Server-side security blacklist mechanisms (like Redis invalidation check) ke bina stateless tokens instant terminate nahi ho sakte.

---

## Bonus (Optional) Details

### Cookie delete behaviour in logout `/staff/logout`:
Logout implementation me cookie delete command clear settings options match karne chahiye:
```javascript
res.clearCookie("token", { httpOnly: true })
```
Agar `httpOnly: true` option delete command me nahi denge, toh client browser delete transaction request execute nahi karega (kyuki security context matches fail ho jayenge).
