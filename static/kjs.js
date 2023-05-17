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
    show_comment();
});

function save_comment() {
    let name = $('#name').val()
    let comment = $('#comment').val()

    let formData = new FormData();
    formData.append("name_give", name);
    formData.append("comment_give", comment);

    fetch('/guestbook', { method: "POST", body: formData, }).then((res) => res.json()).then((data) => {             
        alert(data["msg"]);
        window.location.reload()
    });
}
function show_comment() {
    fetch('/guestbook').then((res) => res.json()).then((data) => {
        let rows = data['result']
        $('#comment-list').empty()
        rows.forEach((a)=> {
            let name = a['name']
            let comment = a['comment']

            let temp_html = `<div class="comments">
                                <div class="row">
                                    <li>
                                        <p>${name}</p><p>${comment}</p>
                                    </li>
                                </div>
                            </div>`
                 

            $('#comment-list').append(temp_html)
        })
    })
}