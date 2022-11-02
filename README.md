# demo-react-flask-mui-auth

Example React app utilizing MaterialUI & react-query with Flask JWT-authed API backend using flask-restful and flask-jwt-extended.  Additionally the Flask back-end is using MongoDB to store users, token and application example data.

I also utilize react-spring for some animations, react-router for pathing/navigation and react-query for asynchronous query management/data refresh.

I am by no means an expert in these technologies - in learning, I found there was many different implementation techniques for both Flask and React when considering how to protect resources - I wanted to demonstrate one methodology I found particularly easy to implement while also providing a decent authentication mechanism for users.  Keep in mind I am not paying any mind to 'authorization' in this demo and am considering all users to have the same level of permissions in both the front-end and back-end implementations.

![Demonstration](img/apptest.gif?raw=true "Demonstration")

### To Start / Requirements
Ensure MongoDB is installed / running (or modify to use an Atlas instance,etc). (https://www.mongodb.com/try/download/community)


Ensure NPM and Python are installed and available in your command-interpreter as appropriate and follow the steps below to install requirements and start both the Flask and the React server locally for testing.
```
py -m pip install requirements.txt
cd backend
py -m flask  --app app --debug run
cd ../frontend
npm i react-use react-bootstrap bootstrap @mui/icons-material @mui/material @emotion/styled @emotion/react @tanstack/react-query axios react-router react-spring react-router-dom react-loader-spinner
```