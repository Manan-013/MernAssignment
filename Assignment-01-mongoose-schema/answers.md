# Assignment 1: Mongoose Schema & Validation - Answers & Explanations

## Soch ke batao (likh ke laana)

### 1. Frontend pe already validation laga di hai. Phir schema me dobara kyun?
**Answer:**
Frontend validation user experience (UX) ko smooth banane ke liye hoti hai taaki user ko dynamic instant feedback mile. Lekin frontend code ko bypass karna bohot aasaan hota hai (e.g., API testing tools like Postman, curl, browser dev tools, ya custom scripts se direct request bhejkar). 
Database (schema-level) validation humari **Last Line of Defense** hai. Ye ensure karti hai ki data consistency aur database integrity kabhi kharab na ho, chahe API request kahin se bhi aaye.

---

### 2. `trim: true` na lagao to `" Rahul "` aur `"Rahul"` ko DB alag maanega ya same?
**Answer:**
Database (MongoDB) in dono ko **alag (different)** maanega. MongoDB strings ke leading aur trailing spaces ko text content ka hissa maanta hai. 
Agar `trim: true` nahi lagaya aur unique check lagaya, toh `" Rahul "` aur `"Rahul"` dono alag save ho jayenge, aur search/filtering queries bhi fail ho jayengi kyunki string matches exact hote hain.

---

### 3. `default: "pending"` aur `required: true` — dono ek saath lagana theek hai kya? Kya hoga agar dono laga do?
**Answer:**
Dono ek saath lagana redundant (double logic) hai. Jab humne `default: "pending"` set kiya hai, toh agar user input me ye field na bhi bhejega, toh Mongoose use automatically `"pending"` value de dega. Is vajah se `required: true` validation trigger hi nahi hogi kyunki field kabhi empty rahegi hi nahi.
Lekin agar user explicitely `null` ya empty string `""` pass karta hai, toh `required: true` check trigger hokar error de sakta hai (depending on the type and schema options). 
**Recommendation:** General practice me, agar default value de rahe hain toh `required: true` lagane ki zaroorat nahi hai.

---

## Bonus (Optional) Details

1. **`helpfulCount`**: Added to the schema as a `Number` with `default: 0` and a custom min validator `min: [0, "Helpful count cannot be negative"]`.
2. **Empty space validator for `comment`**: Added a custom `validate` function checking if the comment trimmed length is greater than 0:
   ```javascript
   validate: {
     validator: function(v) {
       return v && v.trim().length > 0;
     },
     message: "Comment cannot be empty or consist only of whitespace"
   }
   ```
