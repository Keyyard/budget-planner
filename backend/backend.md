### `__init__.py`

**init**.py is used to define a Python package. That means that it is a file that tells Python that this directory should be considered a Python package. It is often empty, but can be used to export selected portions of the package under more convenient names, hold convenience functions, etc.

```bash
cd D:\\Github\\budget-planner
>> python -m backend.app

```

backend/app.py is the entry point for the application. It is the file that is run when you start the application. The -m flag tells Python to run a module as a script.

### app.py

we use `flask_jwt_extended` as the authentication library, for the token refresh, revoke,..
for the cases that we need to use the token, we can use `get_jwt_identity()` to get the current user's identity.
also `jwt_required` is used to protect the route that need the token to access, which means that the user need to login to access the route.

`Blue Prints` is used to organize the routes in the application. It is a way to separate the routes into different files. This is useful when the application grows and you have a lot of routes. It is also useful when you want to reuse the routes in another application.

for eg you have a route that is used to get the user's information, you can put it in the [user.py](http://user.py/) file, and import it in the [app.py](http://app.py/) file.

#eg [user.py](http://user.py/)

```
from flask import Blueprint
user = Blueprint('user', __name__)
@user.route('/user', methods=['GET'])
def get_user():

```

#eg [app.py](http://app.py/)

```
from flask import Flask
from backend.user import user

app = Flask(__name__)
app.register_blueprint(user)

```

Key Differences
Single File: All routes and logic are contained within a single [app.py](http://app.py/) file.
No Modularization: There is no separation of concerns; all routes are defined in one place.
Maintenance: As the application grows, this file can become very large and difficult to manage.

### init_db.py

Initialize the database, tables,..

### [db.py](http://db.py/)

`from flask import g, current_appg` is a special object that is unique for each request. It is used to store data that might be used during the request. It is also used to store the database connection so that it can be reused during the request.
`current_app` is another special object that points to the Flask application handling the request. It is used to access the application configuration and other application-specific data.

so simply, we use `g` to store the database connection, and `current_app` to access the app (app.config['DATABASE'])

### routes/auth.py

we will use `flask_jwt_extended` to handle the authentication.
`werkzeug.security` is used to hash the password.

#### Initialize JWT

using a JWTManager(app) to initialize the JWTManager. This will set up the JWTManager to work with the Flask application.

#### Register

we use password hashing via `werkzeug.security` with method 'pdkdf2:sha256' to hash.

#### Login

after logining, we will create an access token for the user with data `create_access_token(identity=username)`. The identity is the username of the user.
and a refresh token with data `create_refresh_token(identity=username)`.

#### Refresh

we use `jwt_refresh_token_required` to make sure user loggined, and then we will create a new access token for the user.

Usually, the access token will expire in a short time, and the refresh token will expire in a longer time. When the access token expires, the user can use the refresh token to get a new access token.

#### Protected

we use `jwt_required` to protect the route that need the token to access, which means that the user need to login to access the route.

#### Logout

we import the `get_jwt()` to get the entire JWT payload from (headers, claims, signature) instead of `get_jwt_identity()` to get the current user's identity (username from the payload).
`blacklist` is a set that stores the revoked tokens. When a token is revoked, it is added to the blacklist set. if a token is in blacklist reject the token.
And dont worry, every session, user has a new token, and the blacklist will be cleared anyways.