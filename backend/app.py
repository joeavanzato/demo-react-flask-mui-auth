from flask import Flask, request
from pymongo import MongoClient
from flask_restful import Resource, Api
from bson.json_util import dumps
from passlib.hash import sha256_crypt
from flask_jwt_extended import create_access_token,create_refresh_token,get_jwt,get_jwt_identity, jwt_required, JWTManager
import datetime
import time

# py -m flask  --app app --debug run

# PyMongo DB/Collection Variable Setup
client = MongoClient()
db = client.example_db
demo_collection = db.demo_collection
user_collection = db.user_collection
token_collection = db.token_collection

app = Flask(__name__, template_folder='templates')

# For helping with Same-Origin requests from the React App
@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', '*')
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  return response


app.config['JWT_SECRET_KEY'] = 'jwt-secret-string-example'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(minutes=240)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = datetime.timedelta(days=30)
app.config["INITIAL_USERNAME"] = "admin@admin.com"
app.config["INITIAL_PASSWORD"] = sha256_crypt.encrypt("change_me")

api = Api(app)
jwt = JWTManager(app)



@jwt.token_in_blocklist_loader
def check_if_token_in_blacklist(jwt_header, jwt_payload: dict):
    jti = jwt_payload['jti']
    return is_jti_blacklisted(jti)


def is_jti_blacklisted(jti):
    if db.token_collection.count_documents({"jti": jti}) != 0:
        return True
    else:
        return False

# Create the Initial User specified in the configuration data
def create_initial_user():
    temp_dict = {"email": app.config["INITIAL_USERNAME"], "password": app.config["INITIAL_PASSWORD"]}
    if db.user_collection.count_documents({"email": app.config["INITIAL_USERNAME"]}) != 0:
        print("[*] Found Initial User")
        filter = {"email": app.config["INITIAL_USERNAME"]}
        record = user_collection.update_one(filter, {"$set": temp_dict})
    else:
        print("[*] Adding Initial User")
        user_collection.update_one(temp_dict, {'$set':temp_dict}, upsert=True)
create_initial_user()


# Verify the initial user was created and password functionality is working as expected
def verify_initial_user():
    temp_doc = user_collection.find_one({'email': app.config["INITIAL_USERNAME"]}, {})
    if sha256_crypt.verify("change_me", temp_doc['password']):
        print("[*] Successfully Verified Initial User")
verify_initial_user()

# REST API Specifications for retrieving and setting scan configurations
class Demo(Resource):
    @jwt_required()
    def get(self):
        time.sleep(1)
        scans = demo_collection.aggregate([{"$project": {'id': '$_id', 'name': 1, 'category': 1, 'test_object': 1, '_id': 0}}, ])
        return dumps(scans)
api.add_resource(Demo, '/api/demos')

# REST API Specifications for creating JSON Web Tokens (JWTs)
class Login(Resource):
    def post(self):
        email = request.json.get("email", None)
        password = request.json.get("password", None)
        if (email is None) or (password is None):
            return {"msg": "Wrong Email or Password!"}, 401
        temp_doc = user_collection.find_one({'email':email}, {})
        if db.user_collection.count_documents({"email": email}) != 0:
            if sha256_crypt.verify(password, temp_doc['password']):
                print("[*] Successfully Verified User")
                access_token = create_access_token(identity=email)
                refresh_token = create_refresh_token(identity=email)
                response = {"msg":"Successfully Authenticated", "access_token": access_token, "refresh_token": refresh_token}
                return response
            else:
                return {"msg": "Wrong Email or Password!"}, 401
        else:
            return {"msg": "Wrong Email or Password!"}, 401
api.add_resource(Login, '/api/login')

# Revoke an Active Token via adding to Block List
class Logout(Resource):
    @jwt_required()
    def get(self):
        time.sleep(1)
        jti_data = get_jwt()
        id = get_jwt_identity()
        jti = jti_data['jti']
        try:
            if is_jti_blacklisted(jti):
                pass
            else:
                revoked_token = RevokedToken(id, jti)
                revoked_token.add()
            return {'msg': 'Access Token has been Revoked'}
        except Exception as e:
            print(e)
            return {'msg': 'Something Went Wrong Revoking Access Token'}, 500
api.add_resource(Logout, '/api/logout')

class TokenRefresh(Resource):
    @jwt_required(refresh=True)
    def post(self):
        current_user = get_jwt_identity()
        access_token = create_access_token(identity = current_user)
        return {'access_token': access_token}
api.add_resource(TokenRefresh, '/api/refresh')

class ValidateToken(Resource):
    @jwt_required()
    def get(self):
        try:
            jti_data = get_jwt()
            jti = jti_data['jti']
            print(jti)
            if is_jti_blacklisted(jti):
                return {'msg': 'Revoked'}
            else:
                return {'msg': 'Not Revoked'}
        except Exception as e:
            print(e)
            return {'msg': 'Invalid JWT'}
api.add_resource(ValidateToken, '/api/validate')


class RevokedToken:
    def __init__(self, ident, jti):
        self.id = ident
        self.jti = jti
        self.temp_dict = {"id":self.id, "jti":self.jti}

    def add(self):
        token_collection.insert_one(self.temp_dict, {'$set':self.temp_dict})
