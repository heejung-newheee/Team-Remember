$(document).ready(function () {
  toShowShortInfo();
});

// 포스팅박스 토글
$('#add-team-crew').click(function () {
  $('#posting-box').toggle();
});

function posting() {
  let name = $('#crew-name').val();
  let img = $('#crew-img').val();
  let mbti = $('#crew-mbti').val();
  let address = $('#crew-address').val();
  let email = $('#crew-email').val();
  let github = $('#crew-github').val();
  let hobby = $('#crew-hobby').val();

  let formData = new FormData();
  formData.append('name_give', name);
  formData.append('img_give', img);
  formData.append('mbti_give', mbti);
  formData.append('address_give', address);
  formData.append('email_give', email);
  formData.append('github_give', github);
  formData.append('hobby_give', hobby);

  fetch('/post', { method: 'POST', body: formData })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      alert(data['msg']);
      location.reload();
    });
}

// 카드에 간단히 불러올 crew info
function toShowShortInfo() {
  fetch('/post')
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      let rows = data['result'];
      $('#crew-cards').empty();
      for (let i = 0; i < rows.length; i++) {
        let p_id = rows[i]['p_id'];
        let mbti = rows[i]['crew_mbti'];
        let img = rows[i]['crew_img'];
        let name = rows[i]['crew_name'];
        let temp_html = `
        <div class="crew-card" id="sp${p_id}" onclick="toShowMoreInfo(this.id)">
          <h2 id="crew_mbti">${mbti}</h2>
          <div class="crew-card-img">
            <img id="crew-card-img" src="${img}" alt="crew image" />
          </div>
          <h2 id="crew-card-name">${name}</h2>
        </div>
        `;
        $('#crew-cards').append(temp_html);
      }
    });
}

// ! 약식 게시물 해결하고 2번째로 처리예정.
// 세부 crewInfo가져오기
function toShowMoreInfo(pre_p_id) {
  // substr은 함수로 문자열 자르는 방법.(참고 자료 'https://gent.tistory.com/414')
  // 약식 게시물 post id값이 sp1, sp2, sp3.. 이라 sp 잘라주고 서버로 보내기 위해 substr사용
  let p_id = pre_p_id.substr(2);
  // console.log(p_id);

  // fetch로 post 내용 가져오고,
  fetch(`/post-one/${p_id}`)
    .then((res) => res.json())
    .then((data) => {
      rows = data['result'];
      console.log(rows);
      $('#modal-darkness').removeClass('modal-darkness');
      $('#modal-darkness').empty();

      // ! 가지고온 더미가 하나밖에 없어서 for문 안돌려도 되고, 돌리면 오히려 안나오더라
      // for (let i = 0; i < rows.length; i++) {
      let p_id = rows['p_id'];
      console.log(p_id);
      let img = rows['crew_img'];
      let name = rows['crew_name'];
      let mbti = rows['crew_mbti'];
      let address = rows['crew_address'];
      let email = rows['crew_email'];
      let github = rows['crew_github'];
      let hobby = rows['crew_hobby'];
      let temp_html = `
        <!-- detail-post-bg 안에 comment 전체 box도 포함 -->
        <div id="detail-post" class="detail-post-bg">
          <!-- ! mother...뭐선일이고 -->
          <div class="detail-post-wrapper-mother">
            <div id="p${p_id}" class="detail-post detail-post-wrapper">
              <div class="detail-post-img">
                <img src="${img}" alt="" />
              </div>
              <div class="detail-post1-info">
                <div>
                  <i class="fa-solid fa-user"></i>
                  <span style="margin-left: 20px">${name}</span>
                </div>
                <div>
                  <i class="fa-solid fa-star"></i>
                  <span style="margin-left: 20px">${mbti}</span>
                </div>
                <div>
                  <i class="fa-solid fa-location-dot"></i>
                  <span style="margin-left: 20px">${address}</span>
                </div>
                <div>
                  <i class="fa-solid fa-envelope"></i>
                  <span style="margin-left: 20px">${email}</span>
                </div>
                <div>
                  <i class="fa-brands fa-github"></i>
                  <span style="margin-left: 20px">${github}</span>
                </div>
                <div>
                  <i class="fa-solid fa-plane"></i>
                  <span style="margin-left: 20px">${hobby}</span>
                </div>
              </div>
            </div>
  
            <!-- 토글 발동 버튼 id="comment-toggle-btn" -->
            <!-- <div class="detail-post comment-toggle-wrapper" style="background-color: white">
              <button id="comment-toggle-btn" class="comment-toggle-btn1">
                <i class="fa-regular fa-comment-dots fa-flip-horizontal" style="margin-right: 5px"></i>댓글
                <i class="fa-solid fa-angle-down toggle-arrow"></i>
              </button>
            </div> -->
  
            <!-- comment-bg는 toggle형태로 숨기고 보이게 하고 싶다 -->
            <!-- 접히는 부분 id=comment-toggle box -->
            <!-- ! 수정필요 아래 백그라운드 배경 수정 필요한가 -->
            <div id="comment-toggle-box" class="detail-post comment-bg" style="background-color: white">
              <div class="comment-post-wrapper">
                <div><input id="comment-name" placeholder="이름" /></div>
                <textarea
                  name="comment"
                  id="comment"
                  placeholder="궁금하거나 하실 말씀이 있으면 댓글을 입력해주세요!"></textarea>
                <div><button>등록</button></div>
              </div>
  
              <!-- 댓글 입력하기 -->
              <!-- 댓글 전체보기 -->
              <!-- 각 comment 감싸고 있는게 id="comment-list"  -->
              <!-- ! height 130px(보통댓글 3개 정도) 이상 => 더 보이는 댓글이 흘러넘치면 스크롤 될 수 있도록 -->
              <!-- 스크롤 기능은 class="comment-get-wrapper"에 추가! -->
              <div id="comment-list" class="comment-get-wrapper" style="margin-top: 30px">
                <div id="comment-list-item">
                  <div class="comment-get-items comment-get-top">
                    <span>신짱구</span>
                    <div>
                      <button id="comment-edit" style="font-weight: 500">수정</button>/<button
                        id="comment-delete"
                        style="font-weight: 500">
                        삭제
                      </button>
                    </div>
                  </div>
                  <div class="comment-get-items comment-get-mid">
                    <span
                      >comment 내용 Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid autem saepe suscipit
                      omnis eveniet vero ducimus ex tempora, animi dicta eligendi inventore amet praesentium mollitia
                      reprehenderit doloremque dolor tenetur doloribus!</span
                    >
                  </div>
                  <div class="comment-get-items comment-get-bottom"><span>2023.05.15. 11:48</span></div>
                </div>
                <div id="comment-list-item">
                  <div class="comment-get-items comment-get-top">
                    <span>신짱구</span>
                    <div>
                      <button id="comment-edit" style="font-weight: 500">수정</button>/<button
                        id="comment-delete"
                        style="font-weight: 500">
                        삭제
                      </button>
                    </div>
                  </div>
                  <div class="comment-get-items comment-get-mid">
                    <span
                      >comment 내용 Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid autem saepe suscipit
                      omnis eveniet vero ducimus ex tempora, animi dicta eligendi inventore amet praesentium mollitia
                      reprehenderit doloremque dolor tenetur doloribus!</span
                    >
                  </div>
                  <div class="comment-get-items comment-get-bottom"><span>2023.05.15. 11:48</span></div>
                </div>
                <div id="comment-list-item">
                  <div class="comment-get-items comment-get-top">
                    <span>신짱구</span>
                    <div>
                      <button id="comment-edit" style="font-weight: 500">수정</button>/<button
                        id="comment-delete"
                        style="font-weight: 500">
                        삭제
                      </button>
                    </div>
                  </div>
                  <div class="comment-get-items comment-get-mid">
                    <span
                      >comment 내용 Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid autem saepe suscipit
                      omnis eveniet vero ducimus ex tempora, animi dicta eligendi inventore amet praesentium mollitia
                      reprehenderit doloremque dolor tenetur doloribus!</span
                    >
                  </div>
                  <div class="comment-get-items comment-get-bottom"><span>2023.05.15. 11:48</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      $('#modal-darkness').append(temp_html);
      // }
    });
}

$('#modal-darkness').click(function () {
  $('#modal-darkness').addClass('modal-darkness');
});
