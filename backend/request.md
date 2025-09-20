curl -X POST http://localhost:8080/api/login \
 -H "Content-Type: application/json" \
 -d '{"email":"test@example.com","password":"password123"}'


curl -X POST http://localhost:8080/api/register \
-H "Content-Type: application/json" \
-d '{
  "display_name": "Your Name",
  "email": "23610119yt@stu.yamato-u.ac.jp",
  "password": "0513Yuuki"
}'

curl -X GET http://localhost:8080/api/protected \
-H "Authorization: Bearer <YOUR_JWT_TOKEN>"


curl -X GET http://localhost:8080/api/health