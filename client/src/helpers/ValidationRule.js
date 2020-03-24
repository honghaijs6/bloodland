
// Validate text input
export default{
    ValidationRules
};

function ValidationRules(props) {
    //console.log(props);
}

ValidationRules.prototype.checkExistString = function(value,self,stringListForCheck,message){
    // console.log(stringListForCheck);
    // console.log('stringListForCheck.includes(value) && value !== self',stringListForCheck.includes(value) && value !== self);
    return stringListForCheck.includes(value) && value !== self ? message : null;
};


ValidationRules.prototype.checkExistName = function(value,stringListForCheck,message){
    // console.log(stringListForCheck);
    // console.log('stringListForCheck.includes(value) && value !== self',stringListForCheck.includes(value) && value !== self);
    return stringListForCheck.includes(value) ? message : null;
};

ValidationRules.prototype.checkEmpty = function(value,message){
    return value === '' ? message : null;
};

ValidationRules.prototype.checkLength = function(value,length,message){
    return value.length > length ? message : null;
};

ValidationRules.prototype.checkMinMaxLength = function(value,minLength,maxLength,message){
    return value.length > maxLength || value.length < minLength ? message : null;
};