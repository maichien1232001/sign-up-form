function Validator(formSelector){

    function getParent(element, selector){
        while (element.parentElement){
            if(element.parentElement.matches(selector)){
                return element.parentElement;
            }
            else{
                element = element.parentElement
            }
        }
    }

    var formRules = {};

    var validatorRules = {
        required: function(value){
            return value ? undefined : 'Vui lòng nhập trường này'
        },
        email: function(value){
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : 'Email không hợp lệ'
        },
        
        min: function(min){
            return function(value){
                return value.length >= min ? undefined : `Vui lòng nhập ít nhất ${min} kí tự`
            }
        },
        max: function(max){
            return function(value){
                return value.length <= max ? undefined : `Vui lòng nhập tối đa ${max} kí tự`
            }
        },
    };

    var formElement = document.querySelector(formSelector);
    if(formElement){
        

        var inputs = formElement.querySelectorAll('[name][rules]');
        for(var input of inputs){

            var rules = input.getAttribute('rules').split('|');
            for(var rule of rules){

                var ruleInfo;
                var isRuleHasValue = rule.includes(':')
                if(isRuleHasValue){

                    ruleInfo = rule.split(':');
                    rule = ruleInfo[0];
                }

                var ruleFunc = validatorRules[rule];

                if(isRuleHasValue){
                    ruleFunc = ruleFunc(ruleInfo[1]);
                }

                if(Array.isArray(formRules[input.name])){
                    formRules[input.name].push(ruleFunc);
                }
                else{

                    formRules[input.name] = [ruleFunc];
                }
            }
            input.onblur = handleValidate;
            input.oninput = handleClearErr;
        }
        function handleValidate(event) {
            var rules = formRules[event.target.name];
            var errorMessage;
            
            for(var rule of rules){
                errorMessage = rule(event.target.value);
                if(errorMessage){
                    break;
                }
            }

            
            if(errorMessage){
                var formGroup = getParent(event.target, '.form-group')
                if(formGroup){
                    formGroup.classList.add('invalid')
                    var formMessage = formGroup.querySelector('.form-message')
                    if(formMessage){
                        formMessage.innerText = errorMessage;
                    }
                }
            }
            return !errorMessage;
        }  

        function handleClearErr(e){
            var formGroup = getParent(e.target, '.form-group')
            if(formGroup.classList.contains('invalid')){
                formGroup.classList.remove('invalid')
                var formMessage = formGroup.querySelector('.form-message')
                if(formMessage){
                    formMessage.innerText = '';
                }
            }
        }
    }
    formElement.onsubmit = function(e){
        e.preventDefault();

        var inputs = formElement.querySelectorAll('[name][rules]');
        var isValid = true;
        for(var input of inputs){
            if(!handleValidate({target: input})){
                isValid =  false;
            }

        }
        if(isValid){
            formElement.submid();
            
        }
    }
}