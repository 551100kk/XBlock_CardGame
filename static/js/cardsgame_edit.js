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
    /*$.ajax({
        type: "POST",
        url: runtime.handlerUrl(element, 'prob_submit'),
        data: JSON.stringify({
            'Description': $(element).find('textarea[name=Description]').val(),
            'options': options,
        }),
        success: function(result) {
            console.log(result);
        }
    }); */
}
function bindans(runtime, element) {
    $(element).find('.ans').unbind('click').bind('click', function() {
        console.log(this.getAttribute('class'));
        console.log(this.getAttribute('value'));
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
}