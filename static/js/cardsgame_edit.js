function add_option(runtime, element) {
    var cnt = parseInt($(element).find('input[name=count]').val());
    var template = '\
        <div class="list-group-item prob_option" style="padding:0;">\
            <input class="input setting-input" type="text" name="option(optioncnt)" style="width: 100%;">\
        </div>\
    ';
    var new_option = template.replace('(optioncnt)', String(cnt));
    $(element).find('.all_option').append(new_option);
    $(element).find('input[name=count]').val(cnt + 1);
}
function remove_option(runtime, element) {
    var cnt = parseInt($(element).find('input[name=count]').val());
    if(cnt == 1) return;
    var tag = 'input[name=option' + String(cnt - 1) + ']';
    console.log(tag);
    $(element).find(tag)[0].remove();
    $(element).find('input[name=count]').val(cnt - 1);
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
}