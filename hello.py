from app import app
from flask_cors import CORS


if __name__ == "__main__":
   app.run(debug=True)
   # app.config['SECRET_KEY'] = 'the quick brown fox jumps over the lazy   dog'
   # cors = CORS(app, resources={r"/foo": {"origins": "http://localhost:port"}})
