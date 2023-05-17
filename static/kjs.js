// 모달 열기
function openModal(cardId) {
    var modal = document.getElementById("myModal" + cardId);
    modal.style.display = "block";
}

// 모달 닫기
function closeModal(cardId) {
    var modal = document.getElementById("myModal" + cardId);
    modal.style.display = "none";
}

// 페이지 로드 시 모달 닫기 이벤트 처리
window.onload = function () {
    var modals = document.getElementsByClassName("modal");
    for (var i = 0; i < modals.length; i++) {
        modals[i].style.display = "none";
    }
}


//댓글 남기기
$(document).ready(function () {
    show_comment(1); 
    show_comment(2);
    show_comment(3);
    show_comment(4);
    show_comment(5);
});

function save_comment(cardId) {
    let name = $(`#myModal${cardId} #name${cardId}`).val();
    let comment = $(`#myModal${cardId} #comment${cardId}`).val();
    console.log(name,comment)

    let formData = new FormData();
    formData.append("name_give", name);
    formData.append("comment_give", comment);

    fetch('/guestbook', { method: "POST", body: formData, })
    .then((res) => res.json())
    .then((data) => {
        alert(data["msg"]);
        show_comment(cardId); 
        window.location.reload();
    });
}

function show_comment(cardId) {
    fetch('/guestbook')
    .then((res) => res.json())
    .then((data) => {
        let rows = data['result'];
        $(`#comment-box${cardId}`).empty();
        rows.forEach((a) => {
            let name = a['name'];
            let comment = a['comment'];

            let temp_html = `<tr>
                                <td>${name}</td>
                                <td>${comment}</td>
                            </tr>`;


            $(`#comment-box${cardId}`).append(temp_html); 
        });
    });
}


