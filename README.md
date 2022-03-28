# Secure Recipes API
## Host - https://secure-recipes-backend.herokuapp.com/
Backend API for Secret Family Recipes
## Description
Implements a full authentication/authorization system with endpoints to produce each CRUD operation into a persistant database.
### Stack
- Node.JS
- Express.JS
- JWT (JSON Web Tokens)
- BCrypt
- KnexJS
- PostgreSQL
## Summary
There are two users in the database for testing.
```
username:  johndoe123, password: 123
username:  janedoe123, password: 123
```
## API Endpoints
#### [GET] /api/users
Expects password to keep anyone from viewing. Returns every user in the database. Used for testing purposes.
##### Request
```
{
    "password": "admin"
}
```
##### Response
```
[
    {
        "id": 1,
        "first_name": "john",
        "last_name": "doe",
        "email": "johndoe123@example.com",
        "username": "johndoe123",
        "password": "$2b$08$Izdfqr6tXXwQSZz0PEsaqOfTw/mbTr6ipETMLv8uAFgzq8CZ9Buqi",
        "confirmed": true,
        "token": "eac2f37a0f",
        "created_at": "2022-03-25T05:59:45.505Z",
        "updated_at": "2022-03-25T05:59:45.505Z"
    },
    {
        "id": 2,
        "first_name": "jane",
        "last_name": "doe",
        "email": "janedoe123@example.com",
        "username": "janedoe123",
        "password": "$2b$08$Izdfqr6tXXwQSZz0PEsaqOfTw/mbTr6ipETMLv8uAFgzq8CZ9Buqi",
        "confirmed": true,
        "token": "f9345add22",
        "created_at": "2022-03-25T05:59:45.505Z",
        "updated_at": "2022-03-25T05:59:45.505Z"
    }
]
```
#### [GET] /api/users/:id
Expects password to keep anyone from viewing. Returns user by their ID in the database. Used for testing purposes.
##### Request 
```
{
    "password": "admin"
}
```
##### Response
```
[
    {
        "id": 1,
        "first_name": "john",
        "last_name": "doe",
        "email": "johndoe123@example.com",
        "username": "johndoe123",
        "password": "$2b$08$Izdfqr6tXXwQSZz0PEsaqOfTw/mbTr6ipETMLv8uAFgzq8CZ9Buqi",
        "confirmed": true,
        "token": "eac2f37a0f",
        "created_at": "2022-03-25T05:59:45.505Z",
        "updated_at": "2022-03-25T05:59:45.505Z"
    }
]
```
#### [POST] /auth/register
Expects first_name, last_name, username, email, and password to be in body for request to be successful. Last name is not required.
In response, a newly registered user will also have a "confirmed" and "token" column.
-   "confirmed" is used to check whether or not the user has confirmed their account using their e-mail. Defaults to false
-   "token" is a randomly generated string using the Node.JS Crypto module. This is used to share between people so they can add each other as friends.
##### Request
```
{
    "first_name":"Ricardo",
    "last_name":"Castillo",
    "email":"rcastillo2022@gmail.com",
    "username": "ric123",
    "password": "123"
}
```
##### Response
```
{
    "id": 3,
    "first_name": "Ricardo",
    "last_name": "Castillo",
    "email": "rcastillo2022@gmail.com",
    "username": "ric123",
    "password": "$2b$08$cfbPDFhHKym9iDMfYtqfOOFiP9xORJc.HgGr1OMbs0ZgY2uXV7udy",
    "confirmed": false,
    "token": "eb900c8145",
    "created_at": "2022-03-25T08:13:41.770Z",
    "updated_at": "2022-03-25T08:13:41.770Z"
}
```
#### [POST] /auth/login
Expects username and password. Credentials must match someone within the database for request to be successful. Returns JWT with data from logged in user.
##### Request
```
{
    "username": "johndoe123",
    "password": "123"
}
```
##### Response
```
{
    "user": {
        "id": 1,
        "first_name": "john",
        "last_name": "doe",
        "email": "johndoe123@example.com",
        "username": "johndoe123",
        "password": "$2b$08$Izdfqr6tXXwQSZz0PEsaqOfTw/mbTr6ipETMLv8uAFgzq8CZ9Buqi",
        "confirmed": true,
        "token": "fe0b2d2328",
        "created_at": "2022-03-25T08:12:30.419Z",
        "updated_at": "2022-03-25T08:12:30.419Z"
    },
    "token": "jwt"
}
```
#### [POST] /api/users/confirmation
Expects JWT sent to user e-mail after successful registration.
##### Request
```
{
    "emailToken":"jwt"
}
```
##### Response
```
{
    "message": "Confirmed! Please log in to continue."
}
```
#### [GET] /api/users/resetpassword/:email
Sends e-mail with link to reset password to e-mail in params.
##### Response
```
{
    "info": "<e823cfb1-a8d3-6ff7-4aaa-0b1116eaf136@gmail.com>",
    "message": "E-mail has been sent."
}
```
#### [POST] /api/users/resetpassword
Accepts token sent in e-mail. If token is valid, "newPassword" becomes the new password.
##### Request
```
{
    "emailToken": "jwt",
    "newPassword": "pass"
}
```
##### Response
```
[
    {
        "id": 3,
        "first_name": "Ricardo",
        "last_name": "Castillo",
        "email": "rcastillo2022@gmail.com",
        "username": "ric123",
        "password": "$2b$08$YnuKQZ.yyTFbhhQVEHuQ.eN1dDAtOian/hdC6AmZ74IGkbYTzVo/a",
        "confirmed": false,
        "token": "eb6a38ed5d",
        "created_at": "2022-03-25T15:49:32.893Z",
        "updated_at": "2022-03-25T15:49:32.893Z"
    }
]
```
#### [POST] /api/recipes
Expects JWT within body. Responds with recipes as array of objects for specific user.
##### Request
```
{
    "token": "jwt"
}
```
##### Response
```
[
    {
        "recipe_id": 2,
        "created_at": "2022-03-25T15:46:57.796Z",
        "title": "Quesadilla",
        "ingredients": [
            "Tortilla",
            "Cheese"
        ],
        "instructions": "Butter pan before heating. Place tortilla on pan with cheese on top.",
        "prep_time": 10,
        "description": "Homemade cheap quesadilla :)",
        "category": "Lunch",
        "source": "Online",
        "pic_url": "https://res.cloudinary.com/diampwv1v/image/upload/v1647910211/oc2tnoh0auifz8knjta9.webp",
        "username": "johndoe123"
    },
    {
        "recipe_id": 1,
        "created_at": "2022-03-25T15:46:57.796Z",
        "title": "Grilled Cheese",
        "ingredients": [
            "Bread",
            "Cheese",
            "Butter"
        ],
        "instructions": "Butter pan before heating. Place bread on pan with cheese on top of one side. Stack when toasted.",
        "prep_time": 10,
        "description": "Homemade grilled cheese.",
        "category": "Snack",
        "source": "Family Recipe",
        "pic_url": "https://res.cloudinary.com/diampwv1v/image/upload/v1647909722/yfnmgmvoz3x08uivv86t.jpg",
        "username": "johndoe123"
    }
]
```
#### [POST] /api/recipes/create
Creates new recipe in database. Title, instructions, and ingredients required.
##### Request
```
{
    "token": "jwt",
    "title": "Milkshake",
    "prep_time": 3,
    "source": "Grannys Recipe",
    "pic_url": "",
    "category": "Drink",
    "instructions":"Get ingredients. Make it.",
    "description":"Smoothie",
    "ingredients": [
        "milk",
        "banana",
        "oats"
    ]
}
```
##### Response
```
{
    "message": "Recipe created."
}
```
#### [PUT] /api/recipes/edit/:id
Expects the exact same body that the create recipe endpoint above expects. Returns ID of recipe edited within object.
##### Request
```
{
    "token": "jwt",
    "title": "Change",
    "prep_time": 3,
    "source": "Grannys Recipe",
    "pic_url": "",
    "category": "Drink",
    "instructions":"Get ingredients. Make it.",
    "description":"Smoothie",
    "ingredients": [
        "milk",
        "banana",
        "oats"
    ]
}
```
##### Response
```
{
    "id": 1
}
```

#### [DELETE] /api/recipes/delete/:id
Expects JWT only.
##### Request
```
{
    "token": "jwt"
}
```
##### Response
```
"Successfully deleted recipe."
```
#### [POST] /api/friends
Expects JWT only. Returns object with array of user friends, and the user sharable token.
##### Request
```
{  
    "token":"jwt"
}
```
##### Response
```
{
    "usersFriends": [
        {
            "id": 2,
            "username": "janedoe123",
            "first_name": "jane",
            "last_name": "doe"
        }
    ],
    "shareToken": "f6b5255077"
}
```
#### [POST] /api/friends/addfriend
Expects JWT and share token of friend to be added. Returns array of what changed within the friends table
##### Request
```
{
    "token":"jwt",
    "shareToken": "f9345add22"
}
```
##### Response
```
[
    {
        "id": 1,
        "user_id": 98,
        "friend_id": 99
    },
    {
        "id": 2,
        "user_id": 99,
        "friend_id": 98
    },
    {
        "id": 3,
        "user_id": 1,
        "friend_id": 2
    },
    {
        "id": 4,
        "user_id": 2,
        "friend_id": 1
    }
]
```
#### [POST] /api/friends/delete/:id
Expects JWT and share token of friend to be added. Returns 0 or 1 depending on whether or not it was successful. 
##### Request
```
{
    "token":"jwt"
}
```
##### Response
```
    1
```
#### [POST] /api/friends/recipes/:username
Expects JWT and sharable token of friend. Also retrives username of friend from params. Returns array of objects with each of that friends recipes. 
##### Request
```
{
    "token":"jwt",
    "shareToken": "b0fadddeb0"

}
```
##### Response
```
[
    {
        "recipe_id": 1,
        "created_at": "2022-03-25T19:28:03.212Z",
        "title": "Grilled Cheese",
        "ingredients": [
            "Bread",
            "Cheese",
            "Butter"
        ],
        "instructions": "Butter pan before heating. Place bread on pan with cheese on top of one side. Stack when toasted.",
        "prep_time": 10,
        "description": "Homemade grilled cheese.",
        "category": "Snack",
        "source": "Family Recipe",
        "pic_url": "https://res.cloudinary.com/diampwv1v/image/upload/v1647909722/yfnmgmvoz3x08uivv86t.jpg",
        "username": "johndoe123"
    },
    {
        "recipe_id": 2,
        "created_at": "2022-03-25T19:28:03.212Z",
        "title": "Quesadilla",
        "ingredients": [
            "Tortilla",
            "Cheese"
        ],
        "instructions": "Butter pan before heating. Place tortilla on pan with cheese on top.",
        "prep_time": 10,
        "description": "Homemade cheap quesadilla :)",
        "category": "Lunch",
        "source": "Online",
        "pic_url": "https://res.cloudinary.com/diampwv1v/image/upload/v1647910211/oc2tnoh0auifz8knjta9.webp",
        "username": "johndoe123"
    }
]
```
