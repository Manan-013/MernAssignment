# Assignment 4: Poori CRUD API Banao - Answers & Explanations

## Soch ke batao

### 1. PUT use karke `{"rating": 4}` bhejo — title aur comment ka kya hoga? PATCH me kya hoga? Ek line me fark likho.
**Answer:**
- **PUT**: Resource ko completely replace/overwrite kar deta hai, isliye `title` aur `comment` parameters remove/null ho jayenge (unless default values set hon).
- **PATCH**: Partial update perform karta hai, isliye database me `title` aur `comment` unchanged (jaise hain waise hi) rahenge, sirf `rating` update hoga.
- **Fark in one line**: **PUT** poore resource ko replace karta hai jabki **PATCH** sirf change kiye gaye fields ko update karta hai.

---

### 2. Create pe 201 kyun, 200 kyun nahi? Frontend ko isse kya fayda?
**Answer:**
`201 Created` status code explicitly indicate karta hai ki request successful rahi aur database me ek **naya resource successfully create** ho gaya hai. 
**Frontend ko fayda**: Frontend response headers/status code ko read karke directly specific UI updates (jaise screen redirect, list state refresh, ya specific success toast showing "Item Created") trigger kar sakta hai without reading the response body payload.

---

### 3. Delete safal hone pe deleted review wapas bhejna chahiye ya nahi? Apni raay do.
**Answer:**
Deleted review wapas bhejna **achhi practice** (beneficial) hai.
- **Why**: Agar client/frontend ko local state management (jaise React/Redux) se deleted item remove karna hai, toh response me object ki complete details (jaise `_id`) hone se data sync karna aasaan hota hai.
- **Alternative**: Kuch systems security/network optimization ke liye sirf empty body ke sath status `204 No Content` return karte hain. But during standard app workflows, deleted record metadata bhejna frontend debugging aur synchronization ke liye useful hai.

---

### 4. `findByIdAndUpdate` me validators by default chalte hain ya nahi? Nahi chalte to chalane ke liye kya likhna padta hai?
**Answer:**
`findByIdAndUpdate` me validators by default **nahi chalte**.
Inhe chalane ke liye update options configuration me explicitely `{ runValidators: true }` property pass karni padti hai:
```javascript
await ReviewModel.findByIdAndUpdate(id, updateData, { runValidators: true });
```

---

## Bonus (Optional) Details

### Why design a separate `PATCH /reviews/:id/approve` API instead of modifying status in `updateReview`?
1. **Security & Authorization**: Review approval status change karna admin-only operation hai, jabki `updateReview` user/customer khud ke write-up ko change karne ke liye use karta hai. Alag endpoints hone se authorization middleware (`checkAdmin`) add karna safe aur intuitive ho jaata hai.
2. **Business Logic separation (Domain Events)**: Approval status transition complex workflows trigger kar sakta hai (jaise merchant notification bhejni ho, rewards credit karne hon). Alag action-specific endpoint (`/approve`) par code likhna robust aur clean domain architecture (CQRS pattern) follow karta hai.
