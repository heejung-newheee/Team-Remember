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
      // console.log(rows);
      $('#modal-darkness').removeClass('modal-darkness');
      $('#heytopPost').empty();

      // ! 가지고온 더미가 하나밖에 없어서 for문 안돌려도 되고, 돌리면 오히려 안나오더라
      // for (let i = 0; i < rows.length; i++) {
      let p_id = rows['p_id'];
      // console.log(p_id);
      let img = rows['crew_img'];
      let name = rows['crew_name'];
      let mbti = rows['crew_mbti'];
      let address = rows['crew_address'];
      let email = rows['crew_email'];
      let github = rows['crew_github'];
      let hobby = rows['crew_hobby'];
      let temp_html = `
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

      <!-- 댓글 입력하기 -->
      <!-- comment-bg는 toggle형태로 숨기고 보이게 하고 싶다 -->
      <!-- 접히는 부분 id=comment-toggle box -->
      <!-- ! 수정필요 아래 백그라운드 배경 수정 필요한가 -->
      <div class="detail-post comment-post-wrapper comment-bg">

            <div><input id="comment-name" placeholder="이름" /></div>
            <textarea
              name="comment"
              id="comment"
              placeholder="궁금하거나 하실 말씀이 있으면 댓글을 입력해주세요!"></textarea>
            <div><button id="pForC${p_id}" onclick="commentPosting(this.id)">등록</button></div>
            <div width="100%" height="60px"; style="background-color: white"></div>
      </div>

      `;
      $('#heytopPost').append(temp_html);
      // }
    });
  fetch(`/comment/${p_id}`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      let comments = data['result'];
      console.log(comments);
      $('#comment-list').empty();
      comments.forEach((a) => {
        let p_id = a['p_id'];
        console.log(p_id);
        let r_id = a['r_id'];
        let comment_name = a['comment_name'];
        let comment = a['comment'];
        let temp_html = `
        <div id="r${r_id}" class="comment-list-item">
          <div class="comment-get-items comment-get-top">
            <span>${comment_name}</span>
            <div>
              <button onclick="commentEditShow(${p_id}, '#cp${r_id}', '#ec${r_id}')" id="comment-edit-start" style="font-weight: 500">수정 </button>
              <button onclick="commentEdit(${p_id}, '#ec${r_id}')"
                class="comment-edit"
                id="cp${r_id}" 
                style="font-weight: 500"> 수정완료</button>
              <button onclick="commentDelete(${p_id}, ${r_id})"
                id="comment-delete"
                style="font-weight: 500"> 삭제</button>
            </div>
          </div>
          <div class="comment-get-items comment-get-mid">
            <textarea id="ec${r_id}" 
              class="sbcomment" 
              disabled>${comment}</textarea>
          </div>
          <div class="comment-get-items comment-get-bottom"><span>2023.05.15. 11:48</span></div>
        </div>
        `;
        $('#comment-list').append(temp_html);
      });
    });
}

function killModal() {
  $('#modal-darkness').addClass('modal-darkness');
}
// $('#kill-modal-darkness').click(function () {
// $('#modal-darkness').addClass('modal-darkness');
// });

function commentPosting(pre_p_id) {
  console.log(pre_p_id);
  // substr은 함수로 문자열 자르는 방법.(참고 자료 'https://gent.tistory.com/414')
  // 약식 게시물 post id값이 sp1, sp2, sp3.. 이라 sp 잘라주고 서버로 보내기 위해 substr사용
  let p_id = pre_p_id.substr(5);
  let comment_name = $('#comment-name').val();
  let comment = $('#comment').val();
  console.log(p_id, comment_name, comment);

  let formData = new FormData();
  formData.append('p_id', p_id);
  formData.append('comment-name_give', comment_name);
  formData.append('comment_give', comment);

  fetch('/comment', { method: 'POST', body: formData })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      alert(data['msg']);
      $('#comment-name').val('');
      $('#comment').val('');
    });
}

// 댓글 삭제
function commentDelete(p_id, r_id) {
  fetch(`/comment/${p_id}/${r_id}`, { method: 'DELETE' })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      alert(data['msg']);
      location.reload();
    });
}

// 댓글 수정
function commentEdit(p_id, ecr_id) {
  // ecr_id는 'editted comment r_id'의 약자..?로 씀
  let r_id = ecr_id.substr(2);
  let editted_comment = $(ecr_id).val();

  let formData = new FormData();
  formData.append('comment_give', editted_comment);
  fetch(`/comment/${p_id}/${r_id}`, { method: 'PUT', body: formData })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      alert(data['msg']);
      location.reload();
    });
}

// 댓글 수정버튼 클릭시 행동
// $('#comment-edit-start').on('click', function () {
//   console.log('하잉');
//   $('#comment-edit').show();
// });
function commentEditShow(p_id, cpr_id, ecr_id) {
  console.log('💙');
  $(cpr_id).toggle();
  console.log(ecr_id);

  // ? prop 찾아서 공부하기
  if ($(ecr_id).prop('disabled')) {
    $(ecr_id).prop('disabled', false);
  } else {
    $(ecr_id).prop('disabled', true);
  }

  // if ($(ecr_id).css('border') === 'none') {
  //   $(ecr_id).css('border', '1px solid lightgray');
  // } else {
  //   $(ecr_id).css('border', 'none');
  // }
  //* 실패시도2
  // trans_id = ecr_id.substr(1);
  // if (trans_id.disabled == true) {
  //   $(ecr_id).prop('disabled', false);
  // } else {
  //   $(ecr_id).prop('disabled', true);
  // }

  //* 실패시도1
  // if (disabled) {
  // $(ecr_id).prop('disabled', false);
  // } else {
  // $(ecr_id).prop('disabled', true);
  // }
}
