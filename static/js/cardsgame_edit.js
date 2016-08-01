function add_option(runtime, element) {
    var cnt = parseInt($(element).find('input[name=count]').val());
    var template = '\
        <div class="list-group-item prob_option">\
            <a for="option_optioncnt" type="button" class="btn btn-default ans" name="ans_optioncnt" value="0">False</a>\
            <input class="input setting-input" type="text" name="option_optioncnt" style="width: 92%">\
        </div>\
    ';
    var new_option = template.replace(/optioncnt/g, String(cnt));
    $(element).find('.all_option').append(new_option);
    $(element).find('input[name=count]').val(cnt + 1);
    bindans(runtime, element);
}
function remove_option(runtime, element) {
    var cnt = parseInt($(element).find('input[name=count]').val());
    if(cnt == 1) return;
    var tag = 'input[name=option_' + String(cnt - 1) + ']';
    $(element).find(tag)[0].remove();
    tag = 'a[name=ans_' + String(cnt - 1) + ']';
    $(element).find(tag)[0].remove();
    $(element).find('input[name=count]').val(cnt - 1);
}
function prob_submit(runtime, element) {
    var cnt = parseInt($(element).find('input[name=count]').val());
    ;
    var options = [];
    var ans = [];
    for(var i = 0; i < cnt; i++){
        var tag = 'input[name=option_' + String(i) + ']';
        options.push( $(element).find(tag).val() );
        tag = 'a[name=ans_' + String(i) + ']';
        ans.push( $(element).find(tag)[0].getAttribute('value') );
    }
    console.log(ans);
    console.log(options);
    console.log('start');
    $.ajax({
        type: "POST",
        url: runtime.handlerUrl(element, 'prob_submit'),
        data: JSON.stringify({
            'Description': $(element).find('textarea[name=Description]').val(),
            'options': options,
            'ans': ans,
        }),
        success: function(result) {
            get_all_prob(runtime, element);
        }
    }); 
}
function get_all_prob(runtime, element) {
    $.ajax({
        type: "POST",
        url: runtime.handlerUrl(element, 'get_all_prob'),
        data: JSON.stringify({
        }),
        success: function(result) {
            var html = '';
            var template = '\
                <div class="panel panel-default">\
                    <div class="panel-heading">\
                         <a class="panel-title show_prob" data-toggle="collapse" data-parent="problem_pools" value="cardid">Card cardid</a>\
                    </div>\
                    <div id="card_cardid" class="panel-collapse collapse">\
                        <div class="panel-body">\
                            <pre>innerText...</pre>\
                            <a type="button" class="btn btn-danger delete_prob" value="cardid" style="width: 100%">Delete</a>\
                        </div>\
                    </div>\
                </div>\
            ';
            for(var i = 0; i < result.data.length; i++){
                var prob = template.replace(/cardid/g, String(i));
                var text = 'Description:\n';
                text += result.data[i][0] + '\n';
                text += 'Options:\n';
                for(var j = 0; j < result.data[i][1].length; j++){
                    text += '(' + result.data[i][2][j] + ') ' + result.data[i][1][j] + '\n';
                }
                prob = prob.replace('innerText...', text);
                html += prob;
            }
            $(element).find('div[id=problem_pools]')[0].innerHTML = html;
            //bind problem pools
            $(element).find('.show_prob').unbind('click').bind('click', function() {
                var cnt = this.getAttribute('value');
                var block = $(element).find('div[id=card_' + cnt + ']')[0];
                if(block.getAttribute('class') == 'panel-collapse collapse in'){
                    block.setAttribute('class', 'panel-collapse collapse');
                }
                else{
                    block.setAttribute('class', 'panel-collapse collapse in');
                }
            });
            //bind del btn
            $(element).find('.delete_prob').unbind('click').bind('click', function() {
                var id = this.getAttribute('value');
                $.ajax({
                    type: "POST",
                    url: runtime.handlerUrl(element, 'delete_prob'),
                    data: JSON.stringify({
                        'id': id,
                    }),
                    success: function(result) {
                        get_all_prob(runtime, element);
                    }
                }); 
            });
        }
    }); 
}
function bindans(runtime, element) {
    $(element).find('.ans').unbind('click').bind('click', function() {
        if(this.getAttribute('value') == 0){
            this.setAttribute('value', 1);
            this.setAttribute('class', 'btn btn-success ans');
            this.innerText = "True";
        }
        else{
            this.setAttribute('value', 0);
            this.setAttribute('class', 'btn btn-default ans');
            this.innerText = "False";
        }
    });
}
function main(runtime, element) {
    
    $(element).find('.save-button').bind('click', function() {
        var handlerUrl = runtime.handlerUrl(element, 'studio_submit');
        var data = {
            //Description: $(element).find('textarea[name=Description]').val(),
        };
        runtime.notify('save', {state: 'start'});
        $.post(handlerUrl, JSON.stringify(data)).done(function(response) {
            runtime.notify('save', {state: 'end'});
            console.log(response)
        });
    });
    $(element).find('.cancel-button').bind('click', function() {
        runtime.notify('cancel', {});
    });
    $(element).find('.add_option').bind('click', function() {
        add_option(runtime, element);
    });
    $(element).find('.remove_option').bind('click', function() {
        remove_option(runtime, element);
    });
    $(element).find('.prob_submit').bind('click', function() {
        prob_submit(runtime, element);
    });
    bindans(runtime, element);
    get_all_prob(runtime, element);
}