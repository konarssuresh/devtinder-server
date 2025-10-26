# devtinder apis

## authRouter

- POST /signup
- POST /login
- POST /logout

## profileRouter

- PATCH /profile/edit
- GET /profile/view
- PATCH /profile/password

## connectionRequestRouter

- POST /request/send/interested/:profileid
- POST /request/seng/ignore/:profileid
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

## userRouter

- GET /user/connections
- GET /user/requests/received
- GET /user/feed - gets you profiles of other users on platform - paginated
