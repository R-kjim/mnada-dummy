# run.py

from __init__ import create_app,db

app = create_app()
db.init_app(app)

# Create the app context and perform the database operation
with app.app_context():
    db.drop_all()
    db.create_all()    


