# Restaurant-Menu-Dish App

## Description

This App was created as a final assignment while learning in Baltic institute of Technology. It has two parts: backend - API created with Laravel and frontend - React.js part with all crud operations for models which only admin can do and READ functionality for all users.

## Launch procedure

* Open command line in any folder and type git clone https://github.com/alinapak/Restaurant-exam-react.git;
* Open project with VSCode;
* Type in terminal `npm install`;
* In `package.json` add proxy value to `http://127.0.0.1:8000/api` to run this app in development mode. For now it is set fetching from heroku.
* For image render you may need to change url in `Dish.js` src and `Restaurant.js` src. Note that images doesn't render from heroku even if the image source url is correct.
* Type in terminal `npm start` and check this App.


## How to use

You can look up at this app via this link: https://react-app-restaurant.herokuapp.com/login.

* For CRUD operations you may log in as administrator : **email** `admin@x.lt`, **password** `qwertyui` .
* For look up you can log in as user: **email** `user@user.lt` **password** `qwertyui` .
* Registration also works, so you can try to sign up as a new user too.

## Author

This App was created by me [Alina Pakamorytė](https://www.linkedin.com/in/alina-pakamoryt%C4%97-73a66377/).