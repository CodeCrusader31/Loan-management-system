fetch('http://localhost:5000/api/auth/register', { 
  method: 'POST', 
  headers: { 'Content-Type': 'application/json' }, 
  body: JSON.stringify({
    "name":"John Doe",
    "email":"borrower8@example.com",
    "password":"password123",
    "role":"BORROWER"
  }) 
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
