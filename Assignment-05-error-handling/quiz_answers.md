# Assignment 5: Error Handling & Status Codes - Answers & Explanations

## Part C: buggy.js — 5 Galtiyan and their Fixes

| # | Bug | Kya Galat Hai? | Kya hoga agar theek na karein? |
|---|---|---|---|
| **1** | `app.use(errorHandler);` defined before router | Error handler middleware route declarations ke **pehle** declare kiya gaya hai. | incoming requests routes tak check hone se pehle error handler par ruk jayengi ya validation check process control bypass karengi. Custom routing error throw hone par handle nahi hoga. |
| **2** | `const getReview = async (req, res) => { ... }` missing catch | Async route handler me execution wrap-up ya error catching sequence (`try/catch` or wrapper) nahi hai. | Agar database queries fail ho jayein (e.g. invalid ObjectId CastError), toh request response hang (pending status) ho jayegi aur pure node server process crash kar sakta hai. |
| **3** | `res.status(200).json({ success: false, message: "not found" });` | Item not found check ke liye success code `200` return kiya gaya hai aur return statement missing hai. | HTTP protocol layer is request ko safe target status manegi jisse telemetry rules and CDNs data mismatch logic error trigger karenge. Aur bina `return` ke runtime niche run hota rahega. |
| **4** | Missing return in conditional block | Resource check condition block ke execution body ke end me `return` call nahi kiya hai, isliye code validation handler bypass karke `res.json(review)` call karega. | Node throw karega: `Cannot set headers after they are sent to the client` runtime execution error because multiple responses send hone ki koshish ki ja rahi hai. |
| **5** | `app.use((err, req, res) => { ... })` has 3 parameters | Error catcher function ke dynamic signature properties me 3 parameters define kiye hain. | Express is signature sequence ko standard application route configuration manega. Custom runtime errors catch nahi honge. |

---

## Part D: Status Code Quiz

| # | Situation | Sahi HTTP Code |
|---|---|---|
| 1 | Naya review ban gaya | **201 Created** |
| 2 | rating: 15 bheja | **400 Bad Request** |
| 3 | Token bheja hi nahi | **401 Unauthorized** |
| 4 | Token sahi hai par role user hai, delete admin-only hai | **403 Forbidden** |
| 5 | `/getSingleReview/<id jo exist nahi karti>` | **404 Not Found** |
| 6 | Wahi email se dobara register | **409 Conflict** |
| 7 | Search me kuch nahi mila | **200 OK** |
| 8 | Mongoose connection tut gaya | **500 Internal Server Error** (or **503 Service Unavailable**) |

---

## Soch ke batao

### 1. 401 aur 403 me fark ek line me. Kaunsa "login karne se theek ho jaayega"?
**Answer**: 
- **401 Unauthorized** ka matlab hai credentials mismatch ya missing hain (Identity unknown). **403 Forbidden** ka matlab hai identity validated hai par user roles authorization permissions matches fail ho rahe hain (Identity known but not allowed).
- **401 Unauthorized** login karne se theek ho jaayega.

---

### 2. Search me kuch na mile to 404 kyun galat hai?
**Answer**: 
Search api endpoints and database collections exists karte hain. Agar matches empty array `[]` de rahe hain, toh ye search query execution ka successfully completed empty result hai (valid response). Isliye status `200 OK` return hona chahiye, kyuki 404 client router configurations issues ya missing routes ke error indicators block ke liye reserve hota hai.

---

### 3. Ye kyun galat hai — 2 problem batao: `res.status(200).json({ success: false, message: "Product not found" });`
**Answer**:
1. **Semantic status mismatch**: client networking and APM toolings call sequence success check ko track karti hain. `200` response successful action ke parameters read karega, jabki actual process fail ho chuka hai.
2. **Standardisation override**: standard API development systems rules specify karte hain ki non-existing components response models hamesha standard status classifications parameter `404` ke control standard structure follow karein.

---

### 4. Error middleware me 4 parameter kyun likhte hain jab next use hi nahi hota?
**Answer**:
Express framework Javascript runtime arity inspect karta hai (using `function.length` check). Jab code runtime setup middleware signatures compile karta hai, toh **exactly 4 arguments** structure identify karke use global error pipeline register ke liye lock karta hai. Agar parameters count reduce karein, toh regular routing context register error state pipeline ignore kar dega.

---

## Bonus (Optional) JWT error mappings

Humne central error handler validation rules config me dynamic check systems add kiye hain:
- **`JsonWebTokenError`**: sends 401 with standard "Invalid token".
- **`TokenExpiredError`**: sends 401 with token expired message parameters.
Frontend can read these details to either automatically trigger a silent token refresh (for expired token) or hard logout the user (for invalid/hacked token).
