# Secret Family Recipes API

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

Returns every user in the database. Used for testing purposes.

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

Returns user by their ID in the database. Used for testing purposes.
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
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJqb2huZG9lMTIzIiwiY29uZmlybWVkIjp0cnVlLCJpYXQiOjE2NDgxOTYyNDMsImV4cCI6MTY0ODI4MjY0M30.OYVqseK_84aM0P94__2gMAsnro5Shsa0exRZvz_DwME"
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
Sends e-mail with link to reset password to e-mail in params.

##### Request
```
{
    "emailToken": "jwt",
    "password": "pass"
}
```



#### [POST] /api/recipes

Expects token to be in body. The token used here should be the token given out by the login endpoint. If proper token is received, client should get an array of objects with all their recipes like so:

```
[
    {
        "title": "grilled cheese",
        "username": "johndoe123",
        "source": "family recipe",
        "pic_url": "",
        "category": "snack",
        "ingredients": [
            "bread",
            "cheese",
            "butter"
        ]
    },
    {
        "title": "quesadilla",
        "username": "johndoe123",
        "source": "online",
        "pic_url": "",
        "category": "lunch",
        "ingredients": [
            "cheese",
            "tortilla"
        ]
    }
]

```

#### [POST] /api/recipes/create

Expects a body with a token from that user, a title, source, pic_url, category, and an ingredients array.

```
{
    "token": "token",
    "title": "milkshake",
    "source": "grannys recipe",
    "pic_url": "",
    "category": "drink",
    "ingredients": [
        "milk",
        "banana",
        "oats"
    ]
}
```

#### [PUT] /api/recipes/edit/:id

Expects the exact same body that the create endpoint above expects.

#### [DELETE] /api/recipes/delete/:id

Expects body to have token for the users information.
# secret_recipes_backend
