from flask import Flask, render_template, request, jsonify
app = Flask(__name__)

import certifi
ca = certifi.where()

from pymongo import MongoClient
client = MongoClient('mongodb+srv://sparta:test@cluster0.jytwxr9.mongodb.net/?retryWrites=true&w=majority', tlsCAFile=ca)
db = client.dbsparta

@app.route('/')
def home():
    return render_template('sg.html')

@app.route("/intro", methods=["POST"])
def intro_post():
    url_receive = request.form['url_give']
    name_receive = request.form['name_give']
    mbti_receive = request.form['mbti_give']
    blog_receive = request.form['blog_give']

    doc={
        'image':url_receive,
        'name':name_receive,
        'mbti':mbti_receive,
        'blog':blog_receive
    }
    db.introduce.insert_one(doc)

    return jsonify({'msg':'저장 완료!'})

@app.route("/intro", methods=["GET"])
def intro_get():
    all_introduce = list(db.introduce.find({},{'_id':False}))
    return jsonify({'result':all_introduce})



@app.route("/comment", methods=["POST"])
def comment_post():
    user_name_receive = request.form['user_name_give']
    user_comment_receive = request.form['user_comment_give']

    doc={
        'user_name':user_name_receive,
        'user_comment':user_comment_receive
    }
    db.comments.insert_one(doc)

    return jsonify({'msg':'댓글 저장 완료!'})

@app.route("/comment", methods=["GET"])
def comment_get():
    all_introduce = list(db.comments.find({},{'_id':False}))
    return jsonify({'result':all_introduce})



if __name__ == '__main__':
	app.run('0.0.0.0', port=5001, debug=True)