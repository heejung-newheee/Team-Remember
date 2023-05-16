// 포스팅박스 토글
$('#add-team-crew').click(function () {
  $('#posting-box').toggle();
});

function toShowMoreInfo(p_id) {
  // fetch로 post 내용 가져오고,
  // 모달창 empty하고
}

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
