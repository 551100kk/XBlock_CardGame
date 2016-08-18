var show_problem = 0;
var problem_status = 0;
function getscore(){
    $.ajax({
        type: "POST",
        url: main.prototype.runtime.handlerUrl(main.prototype.element, 'getscore'),
        data: JSON.stringify({
        }),
        success: function(result) {
            $(main.prototype.element).find('span[name=hashid]')[0].innerText = 'HashID: ' + result.id;
            var scores = 'Scores: ' + result.score + '/1200 pts';
            if(result.score >= 1200) scores += ' ( PASSED )';
            $(main.prototype.element).find('span[name=perscore]')[0].innerText = scores;
            console.log(result.users);
            var html = '';
            for(var i = 0; i < result.users.length; i++){
                var template = '\
                    <tr(type)>\
                        <td>rank</td>\
                        <td>hash</td>\
                        <td>scores</td>\
                    </tr>';
                if(i % 2) template = template.replace('(type)', ' class="active"');
                else template = template.replace('(type)', '');
                template = template.replace('rank', i + 1);
                template = template.replace('hash', result.users[i][0]);
                template = template.replace('scores', result.users[i][1]);
                html += template;
                console.log(template);
            }
            $(main.prototype.element).find('.ranking')[0].innerHTML = html;
        }
    }); 
}
function modifyscore(val){
    $.ajax({
        type: "POST",
        url: main.prototype.runtime.handlerUrl(main.prototype.element, 'modifyscore'),
        data: JSON.stringify({
            'val': val,
        }),
        success: function(result) {
            console.log(result);
            getscore();
        }
    }); 
}
function opacity(cnt){
    $(main.prototype.element).find('.show').css('opacity', 0.01*(100-cnt));
    $(main.prototype.element).find('.problem').css('opacity', 0.01*(100-cnt));
    if(cnt == 0){
        return;
    }
    setTimeout(function(){opacity(cnt-1)}, 20);
}
function appear(cnt){
    $(main.prototype.element).find('.show').css('width',1.5 * (50 - cnt) + '%');
    if(cnt == 0){
        $(main.prototype.element).find('.problem').show();
        opacity(100);
        return;
    }
    setTimeout(function(){appear(cnt - 1)}, 10);
}
function showproblem(probid){
    console.log('on');
    show_problem = 1;
    $(main.prototype.element).find('.check_ans').bind('click', function(){
        checkans();
    });
    $.ajax({
        type: "POST",
        url: main.prototype.runtime.handlerUrl(main.prototype.element, 'get_rand_prob'),
        data: JSON.stringify({
            'probid': probid,
        }),
        success: function(result) {
            $(main.prototype.element).find('.show')[0].setAttribute('src', '/xblock/resource/cardsgame/public/img/allcards/allcards [www.imagesplitter.net]-' + (result.probid % 4) + '-' + parseInt(result.probid / 4) + '.png');
            $(main.prototype.element).find('.show').css('opacity', 0);
            $(main.prototype.element).find('.description')[0].innerText = result.prob[0];
            var template = '<a type="button" class="btn btn-default stu_ans" name="ansoptioncnt">option</a><br>';
            //reset
            $(main.prototype.element).find('.show').css('width', 0);
            $(main.prototype.element).find('.problem').hide();
            $(main.prototype.element).find('.option')[0].innerHTML = '';
            $(main.prototype.element).find('.prob_status')[0].setAttribute('src', '');
            //
            for(var i = 0; i < result.prob[1].length; i++){
                var newtag = template.replace(/optioncnt/g, i);
                newtag = newtag.replace('option', result.prob[1][i]);
                $(main.prototype.element).find('.option').append(newtag);
            }
            $(main.prototype.element).find('.stu_ans').bind('click', function(){
                if(this.getAttribute('class') == 'btn btn-default stu_ans'){
                    this.setAttribute('class', 'btn btn-success stu_ans');
                }
                else{
                    this.setAttribute('class', 'btn btn-default stu_ans');
                }
            });
            appear(50);
        }
    }); 
}
function score(point, cnt=50){
    if(cnt == 50) $(main.prototype.element).find('.score').show();
    $(main.prototype.element).find('.score')[0].innerText = point;
    $(main.prototype.element).find('.score').css('font-size', (200 + 2 * cnt) + 'px');
    $(main.prototype.element).find('.score').css('opacity', 0.02 * cnt);
    if(cnt == 0){
        $(main.prototype.element).find('.score').css('display', 'none');
        return;
    }
    setTimeout(function(){score(point, cnt - 1)}, 10);
}
function worng(element, cnt){
    if(cnt % 2 == 0){
        element.css('width','90%');
    }
    else{
        element.css('width','80%');
    }
    if(cnt == 0){
        checkans.prototype.finish();
        return;
    }
    setTimeout(function(){worng(element, cnt - 1)}, 200);
}
function correct(element, cnt){
    element.css('width', 90 - cnt + '%');
    if(cnt == 0){
        return;
    }
    setTimeout(function(){correct(element, cnt - 1)}, 5);
}
function checkans(){
    $(main.prototype.element).find('.check_ans').unbind('click');
    var ans = [];
    for(var i = 0; i < 1000; i++){
        var tmp = $(main.prototype.element).find('a[name=ans' +  i + ']');
        if(!tmp[0]){
            break;
        }
        var check = (tmp[0].getAttribute('class') == 'btn btn-success stu_ans');
        ans.push(+check);
        //break;
    }
    //console.log(ans);
    $.ajax({
        type: "POST",
        url: main.prototype.runtime.handlerUrl(main.prototype.element, 'checkans'),
        data: JSON.stringify({
            'ans': ans,
        }),
        success: function(result) {
            //console.log(result);
            var status = $(main.prototype.element).find('.prob_status')[0];
            if(result.result == 'pass'){
                score('+500');
                modifyscore(500);
                show_problem = 0;
                status.setAttribute('src', '/xblock/resource/cardsgame/public/img/correct.png');
                correct($(main.prototype.element).find('.prob_status'), 50);
            }
            else{
                score('-50');
                modifyscore(-50);
                status.setAttribute('src', '/xblock/resource/cardsgame/public/img/cross.png');
                worng($(main.prototype.element).find('.prob_status'), 4);
            }
            checkallcard();
        }
    }); 
    checkans.prototype.finish = function () {
        $(main.prototype.element).find('.check_ans').bind('click', function(){
            checkans();
        });
    };
}
function checkunsolve(){
    $.ajax({
        type: "POST",
        url: main.prototype.runtime.handlerUrl(main.prototype.element, 'checkunsolve'),
        data: JSON.stringify({
        }),
        success: function(result) {
            if(result.result != -1){
                showproblem(result.result);
            }
        }
    }); 
}
function checkallcard(){
    $.ajax({
        type: "POST",
        url: main.prototype.runtime.handlerUrl(main.prototype.element, 'checkallcard'),
        data: JSON.stringify({
        }),
        success: function(result) {
            var html = '';
            for(var i = 0; i < result.result.length; i++){
                var url = '/xblock/resource/cardsgame/public/img/allcards/allcards [www.imagesplitter.net]-' + (result.result[i] % 4) + '-' + parseInt(result.result[i] / 4) + '.png';
                html += '<img class="card_list" src="url">'.replace('url', url);
            }
            $(main.prototype.element).find('.allcard')[0].innerHTML = html;
            //console.log(result.result);
        }
    }); 
}
function main(runtime, element){
    main.prototype.runtime = runtime;
    main.prototype.element = element;
    checkunsolve();
    checkallcard();
    getscore();
    $(element).find('.card').bind('click', function(){
        if(show_problem){
            $(element).find("span[id=message]").css('color','red');
            $(element).find("span[id=message]")[0].innerText = 'Please solve the current problem!';
            return;
        }
        else{
            $(element).find("span[id=message]")[0].innerText = '';
        }
        showproblem(-1);
    });
}
