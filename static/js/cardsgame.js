var show_problem = 0;
var problem_status = 0;

function opacity(cnt, runtime, element){
    $(element).find('.show').css('opacity', 0.01*(100-cnt));
    $(element).find('.problem').css('opacity', 0.01*(100-cnt));
    if(cnt == 0){
        return;
    }
    setTimeout(function(){opacity(cnt-1, runtime, element)}, 20);
}
function appear(cnt, runtime, element){
    $(element).find('.show').css('width',1.5 * (50 - cnt) + '%');
    if(cnt == 0){
        $(element).find('.problem').show();
        opacity(100, runtime, element);
        return;
    }
    setTimeout(function(){appear(cnt - 1, runtime, element)}, 10);
}
function showproblem(probid, runtime, element){
    show_problem = 1;
    $.ajax({
        type: "POST",
        url: runtime.handlerUrl(element, 'get_rand_prob'),
        data: JSON.stringify({
            'probid': probid,
        }),
        success: function(result) {
            console.log(result.probid);
            console.log(result.prob);
            $(element).find('.show')[0].setAttribute('src', '/xblock/resource/cardsgame/public/img/allcards/allcards [www.imagesplitter.net]-' + (result.probid % 4) + '-' + parseInt(result.probid / 13) + '.png');
            $(element).find('.show').css('opacity', 0);
            $(element).find('.description')[0].innerText = result.prob[0];
            var template = '<a type="button" class="btn btn-default stu_ans" name="ansoptioncnt">option</a><br>';
            for(var i = 0; i < result.prob[1].length; i++){
                var newtag = template.replace(/optioncnt/g, i);
                newtag = newtag.replace('option', result.prob[1][i]);
                $(element).find('.option').append(newtag);
            }
            $(element).find('.stu_ans').bind('click', function(){
                if(this.getAttribute('class') == 'btn btn-default stu_ans'){
                    this.setAttribute('class', 'btn btn-success stu_ans');
                }
                else{
                    this.setAttribute('class', 'btn btn-default stu_ans');
                }
            });
            appear(50, runtime, element);
        }
    }); 
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
        checkans.prototype.finish();
        return;
    }
    setTimeout(function(){correct(element, cnt - 1)}, 5);
}
function checkans(runtime, element){
    $(element).find('.check_ans').unbind('click');
    var ans = [];
    for(var i = 0; i < 1000; i++){
        var tmp = $(element).find('a[name=ans' +  i + ']');
        if(!tmp[0]){
            break;
        }
        var check = (tmp[0].getAttribute('class') == 'btn btn-success stu_ans');
        ans.push(+check);
        //break;
    }
    console.log(ans);
    $.ajax({
        type: "POST",
        url: runtime.handlerUrl(element, 'checkans'),
        data: JSON.stringify({
            'ans': ans,
        }),
        success: function(result) {
            console.log(result);
            var status = $(element).find('.prob_status')[0];
            if(result.result == 'pass'){
                status.setAttribute('src', '/xblock/resource/cardsgame/public/img/correct.png');
                correct($(element).find('.prob_status'), 50);
            }
            else{
                status.setAttribute('src', '/xblock/resource/cardsgame/public/img/cross.png');
                worng($(element).find('.prob_status'), 4);
            }
        }
    }); 
    checkans.prototype.finish = function () {
        console.log('1111111111');
        $(element).find('.check_ans').bind('click', function(){
            checkans(runtime, element);
        });
    };
}
function checkunsolve(runtime, element){
    $.ajax({
        type: "POST",
        url: runtime.handlerUrl(element, 'checkunsolve'),
        data: JSON.stringify({
        }),
        success: function(result) {
            if(result.result != -1){
                showproblem(result.result, runtime, element);
            }
        }
    }); 
}
function main(runtime, element){
    checkunsolve(runtime, element);
    
    $(element).find('.card').bind('click', function(){
        if(show_problem){
            $(element).find("span[id=message]").css('color','red');
            $(element).find("span[id=message]")[0].innerText = 'Please solve the current problem!';
            return;
        }
        showproblem(-1, runtime, element);
    });
    $(element).find('.check_ans').bind('click', function(){
        checkans(runtime, element);
    });
}
