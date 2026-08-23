# Assignment 3: MVC + Service Layer - Answers & Explanations

## Soch ke batao

### 1. Kal ko tumhe ek CRON job likhni hai jo har raat purane review delete kare. Original code (sab kuch route me) se wo logic reuse kar paate? Kyun nahi?
**Answer:**
Nahi, original code se hum logic ko reuse **nahi** kar paate. 
Kyunki original code me DB logic HTTP route handler (`router.post` / `router.get`) ke andar tightly coupled (bandha hua) tha. CRON jobs CLI environment ya server lifecycle me run hoti hain aur wahan par Express ke HTTP `req` aur `res` objects available nahi hote. Agar logic service layer me separated hai (`reviewService.js`), toh CRON script bina kisi HTTP context ke direct service function ko call kar sakti hai (e.g. `await reviewService.deleteOldReviews()`).

---

### 2. Service me `res.status(400).send()` likh doge to kya problem hogi?
**Answer:**
Service layer me `res` object use karne se architectural boundary break ho jayegi.
1. **Tight Coupling to HTTP Protocol**: Agar hum kal ko Express se Fastify, NestJS, GraphQL, Socket.io, ya CLI environment pe migrate karein, toh service layer fail ho jayegi kyunki wahan standard HTTP `res` object nahi milega.
2. **Testing Limitations**: Service layer ki unit testing ke liye hume mock HTTP request/response objects generate karne padenge, jo testing ko unnecessary complex bana dega.

---

### 3. Duplicate review wala check 400 deta hai. Tumhe kya lagta hai — 400 sahi hai ya 409 ? Apna jawab kyun ke saath likho.
**Answer:**
Hume lagta hai ki **409 (Conflict)** status code duplicate review ke liye zyada sahi hai.
- **400 (Bad Request)** tab use hota hai jab request syntax me koi error ho (e.g., fields missing hon ya invalid formats hon).
- **409 (Conflict)** tab use hota hai jab request client state ke valid parameters send kar rahi hai, par database ke static state ke sath conflict ho raha hai (jaise already existing resource, unique constraint violations, etc.). Kyunki review path and data syntax sahi hai but database validation conflict (already reviewed) ho raha hai, 409 best practices ke anusaar accurate hai.

---

## Bonus (Optional) Details

Humne `getReviews` query function me custom allowed sorting validation rules lagaye hain:
```javascript
const sort = {};
if (sortBy) {
  const parts = sortBy.split(":");
  const sortField = parts[0];
  const sortOrder = parts[1] === "desc" ? -1 : 1;

  if (["rating", "createdAt"].includes(sortField)) {
    sort[sortField] = sortOrder;
  }
}
```
Isse query validation ensure ho jaati hai ki user random fields (jaise `password`, `_id`, etc.) bhejkar DB query slow down ya leak resources na kar sake.
