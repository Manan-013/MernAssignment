# Assignment 2: Joi Validation Layer - Answers & Explanations

## Soch ke batao

### 1. Mongoose me validation hai hi — Joi ki alag se kya zaroorat? Do solid reason likho.
**Answer:**
1. **Separation of Concerns & Early Rejection (Controller/Routing level vs DB level)**: Joi validation HTTP request level (controller pipeline entering threshold) par check hoti hai. Agar incoming payload galat hai, toh DB call hone se pehle hi request reject ho jaati hai, jisse database/network pool par unnecessary load nahi padta.
2. **Flexible & Context-Specific Validation**: Ek hi database model ke liye different APIs me different validation rules ho sakte hain. For example, register karte waqt `password` required hai, par login karte waqt aur password change karte waqt validation conditions badal sakti hain (ya patch update me fields optional ho jaati hain). Mongoose schema-level validations statically apply hoti hain aur easily request-context override support nahi karti, jabki Joi schemas ko hum alag-alag routes ke liye dynamically adapt kar sakte hain.

---

### 2. `?limit=5` bhejne pe `req.query.limit` string aati hai ya number? Kyun?
**Answer:**
Agar Joi schema me `limit: Joi.number()` specify kiya hai, toh middleware se validation hone ke baad controller me ye **number** (`5`) milega. 
Kyunki Joi type conversion/coercion automatically perform karta hai jab valid numeric string aati hai. 
*Note:* Agar validation middleware na ho, toh Express query parser use default string `"5"` ke roop me read karega. Joi validation response object ko sanitise karke updated object `req.query` me write karta hai, isliye type number ho jaata hai.

---

### 3. `stripUnknown: true` na lagayein to `{"status": "approved"}` bhejne pe kya hoga?
**Answer:**
Agar `stripUnknown: true` na lagayein toh target schema me status na hone ke bawajood body me extra parameters pass ho jayenge. Iske baad agar hum simple mass assignment (`ReviewModel.create(req.body)`) use karein, toh user database me directly `status` override karke use `"approved"` kar dega bina admin approval ke. 
`stripUnknown: true` unknown keys ko request parameter se remove kar deta hai, jo mass assignment vulnerability ko prevent karta hai.

---

### 4. Ek user `{"rating": 6, "title": "x"}` bhejta hai — dono galat hain. Kya user ko dono errors ek saath milenge? Kaunsi Joi setting decide karti hai?
**Answer:**
Haan, user ko dono errors ek saath milenge. Joi ki `{ abortEarly: false }` setting decide karti hai ki checks tab tak terminate na hon jab tak saare errors collect na ho jayein. Default behavior `abortEarly: true` hota hai jahan pehla validation fail hote hi response return ho jaata hai.

---

## Bonus (Optional) Details

Humne query parameters validation schema (`getReviewsSchema`) me `minRating` aur `maxRating` dono add kiye hain aur reference comparison implement kiya hai:
```javascript
minRating: Joi.number().min(1).max(5).optional(),
maxRating: Joi.number()
  .min(1)
  .max(5)
  .optional()
  .greater(Joi.ref("minRating"))
  .messages({
    "number.greater": "maxRating must be strictly greater than minRating",
  })
```
Joi checks dynamically that if both are present, `maxRating` must be strictly greater than `minRating`.
