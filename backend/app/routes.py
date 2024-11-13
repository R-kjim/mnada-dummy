from flask import  request,make_response
from __init__ import db
from models import User, Item, Auction, Bid, Notification, Report, AuditLog,Image
from datetime import timedelta
from werkzeug.security import check_password_hash,generate_password_hash
from functools import wraps
from flask_restful import Api,Resource
from run import app
from flask_jwt_extended import JWTManager,jwt_required,get_jwt_identity,create_access_token,create_refresh_token
import datetime

api=Api(app=app)
jwt=JWTManager(app=app)

class Home(Resource):
    def get(self):
        return make_response({"msg":"Homepage here"},200)
api.add_resource(Home,'/')

class Signup(Resource):
    def post(self): #post method to add a new user to the database
        data=request.get_json()
        if 'username' in data and 'email' in data and 'password' in data:
            user=User.query.filter_by(email=data.get("email")).first()
            user1=User.query.filter_by(username=data.get("username")).first()
            if user or user1:
                return make_response({"msg":"User exists. Proceed to login"},400)
            new_user=User(username=data.get("username"),email=data.get("email"),password=generate_password_hash(data.get("password")),
                          created_at=datetime.datetime.now(),role="Client")
            db.session.add(new_user)
            db.session.commit()
            return make_response(new_user.to_dict(),201)
        return make_response({"msg":"Missing required data"},400)
api.add_resource(Signup,'/signup')

class Login(Resource):
    def post(self):#post method to login an existing user and handle errors for failed attempts
        data=request.get_json()
        if 'email' and 'password' in data:
            user=User.query.filter_by(email=data.get("email")).first()
            if user:
                if check_password_hash(user.password,data.get("password")):
                    access_token=create_access_token(identity=user.user_id)
                    refresh_token=create_refresh_token(identity=user.user_id)
                    return make_response({"access_token":access_token,"refresh_token":refresh_token,"user_data":user.to_dict()},200)
                return make_response({"msg":"Wrong password"},400)
            return make_response({"msg":"User does not exist"},400)
        return make_response({"msg":"Required data is missing"},400)
api.add_resource(Login,'/login')

class Create_Get_Auction(Resource):
    #creates an auction and retrieves all existing auctions
    @jwt_required()
    def get(self):#retrieves all auctions
        auctions=Auction.query.all()
        return make_response([auction.to_dict() for auction in auctions],200)
    
    @jwt_required()
    def post(self):
        user_id=get_jwt_identity()
        if user_id:
            user=User.query.filter_by(user_id=user_id).first()
            if user.role in ["Admin"]: #restricts creation of a new auction to admins and their assistants only 
                data=request.get_json()
                if "name" in data and "start_time" in data and 'end_time' in data:
                    new_auction=Auction(name=data.get("name"),start_time=data.get("start_time"),end_time=data.get("end_time"))
                    db.session.add(new_auction)
                    db.session.commit()
                    return make_response(new_auction.to_dict(),201)
                return make_response({"msg":"Required data is missing"},400)
            return make_response({"msg":"You are not authorized"},400)
        return make_response({"msg":"Identity processing failed"},412)
api.add_resource(Create_Get_Auction,'/auctions')

class Auction_By_Id(Resource):
    #retrieves an individual auction based on its id and deletes or updates its details
    def get(self,id):
        auction=Auction.query.filter_by(id=id).first()
        if auction:
            return make_response(auction.to_dict(),200)
        return make_response({"msg":"Auction not found"},400)

    @jwt_required()
    def delete(self,id):
        user_id=get_jwt_identity()
        user=User.query.filter_by(user_id=user_id).first()
        if user.role in ["Admin"]: #restricts deleting action to admins only
            auction=Auction.query.filter_by(id=id).first()
            if auction:
                db.session.delete(auction)
                db.session.commit
                return make_response({"msg":"Auction deleted successfully"},200)
            return make_response({"msg":"Auction not found"},400)
        return make_response({"msg":"Not authorised"},400)

    @jwt_required()
    def patch(self,id):
        user_id=get_jwt_identity()
        user=User.query.filter_by(user_id=user_id).first()
        if user.role in ["Admin"]: #restricts updating action to admins only
            auction=Auction.query.filter_by(id=id).first()
            if auction:
                data=request.get_json()
                for item in ["name","start_time","end_time"]: #allow updates only for entries that exist in the database
                    if item in data:
                        setattr(auction,item,data.get(item))
                db.session.add(auction)
                db.session.commit()
                return make_response(auction.to_dict(),200)
            return make_response({"msg":"Auction not found"},400)
        return make_response({"msg":"Authorisation failed"},400)
api.add_resource(Auction_By_Id,'/auction/<int:id>')

class Create_Get_Items(Resource):
    #class responsible for adding an item to an auction and getting all items
    def get(self):
        items=Item.query.all()
        return make_response([item.to_dict() for item in items],200)
    
    @jwt_required()
    def post(self):#adds an item to an auction
        data=request.get_json()
        if all(attr in data for attr in ["title",'description','starting_price','category','images','auction_id']):#ascertains that all the listed attributes are in data
            new_item=Item(title=data.get("title"),description=data.get("description"),
                          starting_price=data.get("starting_price"),category=data.get("category"),
                          posted_by=get_jwt_identity(),auction_id=data.get("auction_id"))
            db.session.add(new_item)
            db.session.commit()
            #proceed to post image urls for that newly created product
            #image urls are an array of strings--loop through the array to post each 
            images=data.get("images")
            for item in images:
                new_image=Image(image_url=item,item_id=new_item.id)
                db.session.add(new_image)
                db.session.commit()
            return make_response(new_item.to_dict(),201)
        return make_response({"msg":"Required data is missing"})
api.add_resource(Create_Get_Items,'/items')

class Item_By_Id(Resource):
    def get(self,id):#retrieve an item from database
        item=Item.query.filter_by(item_id=id).first()
        if item:
            return make_response(item.to_dict(),200)
        return make_response({"msg":"Item not found"},400)
    
    @jwt_required()
    def delete(self,id):#deletes an item from the database
        item=Item.query.filter_by(item_id=id).first()
        if item:
            db.session.delete(item)
            db.session.commit()
            return make_response({"msg":"Item deleted successfully"},204)
        return make_response({"msg":"Item not found"},400)
    
    @jwt_required()
    def patch(self,id):
        item=Item.query.filter_by(item_id=id).first()
        if item:
            data=request.get_json()
            for attr in data:
                if attr in ["title",'description','starting_price','category','auction_id']:
                    setattr(item,attr,data.get(attr)) #updates values to the new values
                    db.session.commit()
                if attr=='images' and len(data.get("images"))>0:
                    images=data.get("images")
                    for url in images: #adds the images to the database
                        new_image=Image(image_url=url,item_id=item.id)
                        db.session.add(new_image)
                        db.session.commit()
            return make_response(item.to_dict(),200)
        return make_response({"msg":"Item not found"},400)
api.add_resource(Item_By_Id,'/item/<int:id>')


if __name__ == '__main__':
    app.run(debug=True)
