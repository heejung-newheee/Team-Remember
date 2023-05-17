# python backend server
from pymongo import MongoClient
import certifi
# certifi패키지 사용하려면 터미널에 pip install certifi 입력해줘야해.

ca = certifi.where()

client = MongoClient('mongodb+srv://sparta:test@cluster0.stsxpsg.mongodb.net/?retryWrites=true&w=majority', tlsCAFile=ca)
db = client.dbsparta


from flask import Flask, render_template, request, jsonify
app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index_jieun.html')

@app.route("/post", methods=["POST"])
def crewInfo_post():
    # * 문제상황(해결해야할 문제) | 게시물에 고유 id부여 ↴
    # get요청을 받을 때 p_id를 붙여주면 매번 같은 게시물에도 다른 p_id가 생성되고,
    # 결과적으로 댓글 저장시 함께 저장되어야하는 p_id값이 달라져서 게시물과 댓글의 연결이 힘들 수 있으니
    # 'db에 넣을 때'!! p_id를 설정해주어야 함.

    # * 어떻게 풀어낼 것인가?
    # list에 p_id가 없으면 => p_id = 1
    # 만약에 listdp p_id가 있으면 => new p_id = '(p_id중 제일 큰 수)+1'

    # * 해결방법(순서)
    # 1. DB에서 모든 p_id가져온다.
    # 2. 가져온 p_id 존재하는지 확인
    # 3-1. 존재하지 않으면 'p_id = 1'
    # 3-2. 존재하면  (1) p_id 숫자로 변경  (2) p_id 큰 수 찾기
    # <p_id 큰 수 찾기 1> : 1)  num = 숫자로 변경한 p_id1  2) 숫자로 변경한 (p_id2 >= num) 이면 num = 숫자로 변경한 p_id2
    # <p_id 큰 수 찾기 2> : 1) 내림차순 내장함수(있으면!) => 내림차순 정렬 후 'index0' 가져오기
    # 4. new p_id에 '큰 수 + 1' 부여! 
    # 5. 부여한 수 doc에 넣어주기!

    all_crewdata = list(db.crewdata.find({},{'_id':False}))
    p_ids = []  # p_ids 변수를 반복문 이전에 초기화
    for crewdata in all_crewdata:
      p_ids.append(crewdata['p_id'])
    
    if len(p_ids) == 0:
      p_id = 1
    else:  
      p_ids.sort(reverse=True)
      pre_p_id = p_ids[0]
      p_id = int(pre_p_id) + 1


    name_receive = request.form['name_give']
    img_receive = request.form['img_give']
    mbti_receive = request.form['mbti_give']
    address_receive = request.form['address_give']
    email_receive = request.form['email_give']
    github_receive = request.form['github_give']
    hobby_receive = request.form['hobby_give']


    doc = {
        'p_id' : p_id,
        'crew_name' : name_receive,
        'crew_img' : img_receive,
        'crew_mbti' : mbti_receive,
        'crew_address' : address_receive,
        'crew_email' : email_receive,
        'crew_github' : github_receive,
        'crew_hobby' : hobby_receive,
    }
    db.crewdata.insert_one(doc)
    return jsonify({'msg':'게시물 등록 완료!'})

@app.route("/post", methods=["GET"])
def crewInfo_get():
    result = list(db.crewdata.find({},{'_id':False}))
    return jsonify({'result': result})

# ! 약식 게시물 해결하고 2번째로 처리예정.
@app.route("/post-one/<p_id>", methods=["GET"])
def crewMoreInfo_get(p_id):
    print(p_id)
    # print('하잉')
    # 위에 print('하잉')은 p_id 값이 문자열일 확률을 보기 위해 시험해본것임. 문자열 같아서 아래에 int()를 사용하여 정수로 변환해줌
    result = db.crewdata.find_one({'p_id' : int(p_id)},{'_id':False})
    print(result)
    return jsonify({'result': result})
    # return "Success"
    # 위에 return "Success"는 print()만 확인하고 싶어서 사용한 것

@app.route("/comment", methods=["POST"])
def commentInfo_post():
    
    p_id = int(request.form['p_id'])
    comment_name_receive = request.form['comment-name_give']
    comment_receive = request.form['comment_give']

    all_commentdata = list(db.commentdata.find({'p_id':p_id},{'_id':False}))
    r_ids = []
    for commentdata in all_commentdata:
      r_ids.append(commentdata['r_id'])
    if len(r_ids) == 0:
      r_id = 1
    else:
      r_ids.sort(reverse=True)
      r_id = int(r_ids[0]) + 1

    doc = {
        'p_id' : p_id,
        'r_id' : r_id,
        'comment_name' : comment_name_receive,
        'comment' : comment_receive,
    }
    db.commentdata.insert_one(doc)
    return jsonify({'msg':'댓글 등록 완료!'})

@app.route("/comment/<p_id>", methods=["GET"])
def commentInfo_get(p_id):
    all_commentdata = list(db.commentdata.find({'p_id' : int(p_id)},{'_id':False}))
    print(all_commentdata)
    return jsonify({'result': all_commentdata})

@app.route("/comment/<p_id>/<r_id>", methods=["DELETE"])
def commentInfo_delete(p_id, r_id):

    db.commentdata.delete_one({'p_id':int(p_id), 'r_id':int(r_id)})
    return jsonify({'msg': '댓글 삭제 완료'})


if __name__ == '__main__':
    app.run('0.0.0.0', port=5001, debug=True)