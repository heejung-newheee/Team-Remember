$(document).ready(function () {
  listing();
});

//카드 불러오기
function listing() {
  fetch('/intro')
    .then((res) => res.json())
    .then((data) => {
      let rows = data['result'];
      $('#cards-box').empty();

      let n = 0;

      rows.forEach((a) => {
        let image = a['image'];
        let name = a['name'];
        let mbti = a['mbti'];
        let blog = a['blog'];

        n++;

        let temp_html = `
        <div class="col">
         <img src="${image}" alt="">
          <div class="info">
            <h3>${name}</h3>
            <a role="button" onclick="open_modal('${name}+${n - 1}')">
              <img src="../static/image/icon01.png" alt="">
            </a>
          </div>
        </div>
        <div class="introduce">
        <button onclick="close_modal()">x</button>
        <div class="wrap">
          <img src="${image}" alt="">
          <div class="contents">
            <div>
              <h3>Name</h3>
              <p>${name}</p>
            </div>
            <div>
              <h3>MBTI</h3>
              <p>${mbti}</p>
            </div>
            <div>
              <h3>Blog</h3>
              <p>${blog}</p>
            </div>
          </div>
          <div id="comment">
            <div class="comment_input">
              <h3>Comment</h3>
              <div>
                <input class="name_input" for="" placeholder="Name"></input>
                <input class="user_comment_input" for="" placeholder="Comment"></input>
                <button onclick="comment_post()" type="button" class="btn btn-primary ">작성</button>
              </div>
            </div>
            <div id="comments">
            </div>
          </div>
        </div>
      </div>`;
        $('#cards-box').append(temp_html);
      });
    });

  //댓글 작성 후 reload 된 뒤 모든 모달창 숨기기
  //$("#cards-box .introduce").hide();

  //댓글 작성 후 reload 된 뒤 카드에 마우스를 올리면 버튼보이기
  $('#cards-box .col .info').on({
    mouseenter: function () {
      $(this).animate({ opacity: 1 }, 200);
    },
    mouseleave: function () {
      $(this).animate({ opacity: 0 }, 200);
    },
  });

  //댓글 불러오기
  fetch('/comment')
    .then((res) => res.json())
    .then((data) => {
      let rows = data['result'];
      console.log(rows);
      rows.forEach((b) => {
        let name = b['user_name'];
        console.log(name);
        let comment = b['user_comment'];

        let temp_html = `<div class="comment_user">
                              <p class="comment_name">${name}</p>
                              <p class="comment_review">${comment}</p>
                            </div>`;
        console.log(temp_html);
        $('#comments').append(temp_html);
      });

      //초기 모달창 전부 숨기기
      //$("#cards-box .introduce").hide();

      //카드에 마우스를 올리면 버튼보이기
      $('#cards-box .col .info').on({
        mouseenter: function () {
          $(this).animate({ opacity: 1 }, 200);
        },
        mouseleave: function () {
          $(this).animate({ opacity: 0 }, 200);
        },
      });
    });
}

//모달창 열기
function open_modal(name) {
  let str = name.split('+');
  let str_end = str[1];
  let el = document.getElementsByClassName('introduce')[str_end];
  $(el).show();
}

//모달창 닫기
function close_modal() {
  $('#cards-box .introduce').hide();
}

//웹에서 포스팅 부분(쓰기)
function posting() {
  let url = $('#url').val();
  let name = $('#name').val();
  let mbti = $('#mbti').val();
  let blog = $('#blog').val();

  let formData = new FormData();
  formData.append('url_give', url);
  formData.append('name_give', name);
  formData.append('mbti_give', mbti);
  formData.append('blog_give', blog);

  fetch('/intro', { method: 'POST', body: formData })
    .then((res) => res.json())
    .then((data) => {
      alert(data['msg']);
      window.location.reload();
    });
}

//포스팅 박스 열기
function open_box() {
  $('#open_form').toggleClass('open_post');
}

//포스팅 박스 닫기
function close_box() {
  $('#open_form').removeClass('open_post');
}

//댓글 쓰기
function comment_post() {
  let user_name = $('.name_input').val();
  let user_comment = $('.user_comment_input').val();
  console.log(user_comment);

  let formData = new FormData();
  formData.append('user_name_give', user_name);
  formData.append('user_comment_give', user_comment);

  fetch('/comment', { method: 'POST', body: formData })
    .then((res) => res.json())
    .then((data) => {
      alert(data['msg']);
      window.location.reload();
    });
}
