$(function () {
    $(document).ready(function () {
        listing();
    });

    function listing() {
        //list Load
        fetch('/post').then((res) => res.json()).then((data) => {
            let rows = data['result'];
            $('#columns').empty();
            rows.forEach((a) => {
                let image = a['img'];
                let name = a['name'];
                let mbti = a['mbti'];
                let _id = a['_id']; 

                let temp_html = ` <figure class="content" data-num="${_id}">
                                      <img src="${image}" />
    
                                      <figcaption class="name">
                                            ${name}
                                      </figcaption>
                                      <figcaption class="mbti">
                                            ${mbti}
                                      </figcaption>
                                      <button class="detail">
                                          자세히
                                      </button>
                                  </figure>`;
                $('#columns').append(temp_html);
            
            });

            //  detail-Modal , Get ,Modal close status
            $('.content').click(function () {
                let detail_modal = $('.detail-overlay');

                let id = $(this).data('num');

                $('.detail').attr('data-num', id);

                let all_id = rows.map(rows => rows['_id']);

                let indexNum = $.inArray(id, all_id);

                let this_data = rows[indexNum]
                
                let $image =this_data['img']
                let $name = this_data['name'];
                let $mbti = this_data['mbti'];
                let $blog = this_data['blog'];
                let $advantages = this_data['advantages'];
                let $collaboration = this_data['collaboration'];
                let _id = this_data['num'];
                
                $('.info-image img').attr('src', $image);
                $('.info-name').text($name);
                $('.info-mbti').text($mbti);
                $('.info-blog').text($blog);
                $('.info-advantages').text($advantages);
                $('.info-collaboration').text($collaboration);

                $('.info-overlay').attr('data-num', _id);

                detail_modal.css({
                    'display': 'block'
                });
            });
        });

        //   open detail-Modal

        $('.detail').click(function () {
            let detail_modal = $('.detail-overlay');

            detail_modal.css({
                'display': 'block'
            });
        });

        //  close detail-Modal
        $(document).click(function (e) {
            if ($('#detail').is(e.target)) {
                $('.detail-overlay').css({
                    'display': 'none'
                });
            }
        });
        //  info-Modal edit/delete icon hover
        $('.edit-icons .edit').hover(function () {
            $(this).attr('src', '../static/icon/pencil-filled.svg');
        }, function () {
            $(this).attr('src', '../static/icon/pencil-lined.svg');
        });

        $('.edit-icons .del').hover(function () {
            $(this).attr('src', '../static/icon/trash-can-filled.svg');
        }, function () {
            $(this).attr('src', '../static/icon/trash-can-lined.svg');
        });

    }

    //join Modal Open, Close

    $('.join').click(function () {
        let join_modal = $('.join-overlay');

        join_modal.css({
            'display': 'block'
        });
    });

    $('.cancel').click(function () {
        let $modal = $('.join-overlay');

        $modal.css({
            'display': 'none'
        });
    });

    //join Modal Post
    function save_remember() {
        let img = $('#img').val();
        let name = $('#aname').val();
        let mbti = $('#mbti').val();
        let blog = $('#blog').val();
        let advantages = $('#edit-advantages').val();
        let collaboration = $('#edit-collaboration').val();
        let pw = $('#pw').val();

        let formData = new FormData();
        formData.append("img_give", img);
        formData.append("name_give", name);
        formData.append("mbti_give", mbti);
        formData.append("blog_give", blog);
        formData.append("advantages_give", advantages);
        formData.append("collaboration_give", collaboration);
        formData.append("pw_give", pw);

        fetch('/post', { method: "POST", body: formData }).then((res) => res.json()).then((data) => {
            alert(data['msg']);
            window.location.reload();
        });
    }

    // edit Modal update

    $('.edit-submit').click(update);
    
    function info_load() {   //  게시글 정보 input에 불러오기
        let this_data = $('.detail-overlay').data('num');

        let $image =this_data['img']
                let $name = this_data['name'];
                let $mbti = this_data['mbti'];
                let $blog = this_data['blog'];
                let $advantages = this_data['advantages'];
                let $collaboration = this_data['collaboration'];
                
                $('.edit-image img').attr('src', $image);
                $('.edit-name').text($name);
                $('.edit-mbti').text($mbti);
                $('.edit-blog').text($blog);
                $('.edit-advantages').text($advantages);
                $('.edit-collaboration').text($collaboration);

            

        // let $img = $('.info-image img').attr('src');
        // let $name = $('.info-name').text();
        // let $comment = $('.info-comment').text();

        // $('#edit-name').attr('value', $name);
        // $('#edit-comment').text($comment);
        // $('#edit-img').attr('value', $img);
    }

    function update() {     //  미완
        let check_info = new Array();
        fetch('/post/update').then((res) => res.json()).then((data) => {
            let remember = data['result'];

            for(let i in remember) {
                let $pw = remember[i]['pw'];
                check_info[i] = {
                    'id' : $id, 
                    'pw': $pw
                };
            }
        });

        let detail = $('.detail-overlay');
        let edit = $('.edit-overlay');

        detail.css('display', 'none');
        edit.css('display', 'block');

        // let check_pw = 1;
        let $check_pw = $('#edit-pw').val();
        let $id = $('.detail-overlay').data('num');

        if( 1 == $check_pw ) {
            let img = $('#img').val();
            let name = $('#aname').val();
            let mbti = $('#mbti').val();
            let blog = $('#blog').val();
            let advantages = $('#edit-advantages').val();
            let collaboration = $('#edit-collaboration').val();
            let pw = $('#pw').val();

            let id = $id;

            let formData = new FormData();
            formData.append("img_give", img);
            formData.append("name_give", name);
            formData.append("mbti_give", mbti);
            formData.append("blog_give", blog);
            formData.append("advantages_give", advantages);
            formData.append("collaboration_give", collaboration);
            formData.append("pw_give", pw);
            
            fetch(`/post/update`, { method: "POST", 
                body: formData
            })
            .then((res) => res.json())
            .then((data) => {
                alert(data['msg']);
                window.location.reload();
            });
        }
        
    }
     //  edit-submit button
    $('.detail-flex .edit').click(function() {    
        let detail = $('.detail-overlay');
        let edit = $('.edit-overlay');
        let _id = $('.detail-overlay').data('id');

        $('.edit-overlay').attr('data-id', _id);

        detail.css('display', 'none');
        edit.css('display', 'block');

        info_load();
    });

    // edit-cancel button
    $('.edit-cancel').click(function() {
        let $modal = $('.edit-overlay');
        
        $modal.css({
            'display' : 'none'
        });
    });



    //  작성하기 유효성 검사
    $('.submit').click(post_check);
     $('.edit-submit').click(edit_check);    


    function post_check() {
        const checkImg = $('#overlay #img');
        const checkName = $('#overlay #aname');
        const checkMbti = $('#overlay #mbti');
        const checkBlog = $('#overlay #blog');
        const checkAdvantages = $('#overlay #edit-advantages');
        const checkCollaboration = $('#overlay #edit-collaboration');
        const checkPw = $('#overlay #pw');

        if (!checkImg.val()) {      //  frn의 product의 value값이 없을 때 = input에 입력한 값이 없을 때
            alert('이미지url을 입력해 주세요');
            checkImg.focus();
            return false;   //  경고창을 확인한 후 페이지가 넘어가지 않고 그대로 유지하기 위함, method빼면 못넘어감.
        } else if (!checkName.val()) {
            alert('이름을 입력해 주세요');
            checkName.focus();
            return false;
        } else if (!checkMbti.val()) {
            alert('MBTI를 입력해 주세요');
            checkMbti.focus();
            return false;
        } else if (!checkBlog.val()) {
            alert('블로그 주소를 입력해 주세요');
            checkBlog.focus();
            return false;
        } else if (!checkAdvantages.val()) {
            alert('자신의 장점을 입력해 주세요');
            checkAdvantages.focus();
            return false;
        } else if (!checkCollaboration.val()) {
            alert('협력 스타일을 입력해 주세요');
            checkCollaboration.focus();
            return false;
        } else if (!checkPw.val()) {
            alert('비밀번호를 입력해 주세요');
            checkPw.focus();
            return false;
        } else {
            save_remember();
        }
    }
    //수정하기 유효성 검사
    function edit_check() {
        const checkImg = $('#overlay #img');
        const checkName = $('#overlay #aname');
        const checkMbti = $('#overlay #mbti');
        const checkBlog = $('#overlay #blog');
        const checkAdvantages = $('#overlay #edit-advantages');
        const checkCollaboration = $('#overlay #edit-collaboration');
        const checkPw = $('#overlay #pw');

        if (!checkImg.val()) {      //  frn의 product의 value값이 없을 때 = input에 입력한 값이 없을 때
            alert('이미지url을 입력해 주세요');
            checkImg.focus();
            return false;   //  경고창을 확인한 후 페이지가 넘어가지 않고 그대로 유지하기 위함, method빼면 못넘어감.
        } else if (!checkName.val()) {
            alert('이름을 입력해 주세요');
            checkName.focus();
            return false;
        } else if (!checkMbti.val()) {
            alert('MBTI를 입력해 주세요');
            checkMbti.focus();
            return false;
        } else if (!checkBlog.val()) {
            alert('블로그 주소를 입력해 주세요');
            checkBlog.focus();
            return false;
        } else if (!checkAdvantages.val()) {
            alert('자신의 장점을 입력해 주세요');
            checkAdvantages.focus();
            return false;
        } else if (!checkCollaboration.val()) {
            alert('협력 스타일을 입력해 주세요');
            checkCollaboration.focus();
            return false;
        } else if (!checkPw.val()) {
            alert('비밀번호를 입력해 주세요');
            checkPw.focus();
            return false;
        } else {
            update();
        }
    }

});

