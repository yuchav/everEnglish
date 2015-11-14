//Box
var Box = function(options){
    this.word = '';
    this.position = {};
    this.backgroundColor = '#';
    this.id = '';
    this.dom = null;
    this.isShow = false;
    this.isShowDetail = false;
    this.isPin = false;
}
Box.prototype = {
    show : function(){},
    hide : function(){},
    showDetail : function(){},
    showDetail : function(){},
    pin:function(){},
    unPin:function(){},
    add:function(){}
}


var mouseDownX = 0;
var mouseDownY = 0;
var mouseUpX = 0;
var mouseUpY = 0;

//选中的文字区域
var computedTextRange = {
    'xStart': 0,
    'yStart': 0,
    'xEnd': 0,
    'yEnd': 0
}

//如果选中多个,可能需要不同的底色
var boardBackgroundColors = [
    '#000000',
    '#ae0b0b',
    '#d53f04',
    '#bab010'
]

var textLineHeight = 0;
var textParentNodeOffsetTop = 0;


var body = document.getElementsByTagName('body')[0];

window.addEventListener('load',function(){
    new Monitor();
})

var Monitor = function(){

    document.addEventListener('mousedown', function(eventObject) {
        mouseDownX = eventObject.clientX;
        mouseDownY = eventObject.clientY;
    });

    document.addEventListener('mouseup',function(eventObject) {
        var selectedText = '';
        mouseUpX = eventObject.clientX;
        mouseUpY = eventObject.clientY;
        console.log(
            '从' + mouseDownX + ':' + mouseDownY + '到' + mouseUpX + ':' + mouseUpY
        );
        if (document.selection) {
            /*IE*/
            console.log(document.selection)
            selectedText = document.selection.createRange().text
        } else {
            /*Chrome*/
            selectedText = window.getSelection() + '';
            console.log(window.getSelection())
        }
        if (selectedText) {
            computedTextRange = computedRange();
            var position = computedPosition(computedTextRange);

            var board = new Board({
                selectedText:selectedText,
                position:position
            });
        }
    })


}


function Board(options) {

    this.word = options.selectedText;
    this.id = 'everEnglishMod_'+ (new Date().getTime());
    this.translation = getTranslation(this.word);
    this.position = options.position;
    this.init(this.position);

}

Board.prototype.init = function(position) {
    //那模板
    //塞进去
    //绑事件
    var template = [
        '<div class="everenglish-mod" id="'+this.id+'">',
            '<div class="everenglish-head">',
                '<ul class="everenglish-control"><li class="everenglish-add" title="add the word">+</li><li class="everenglish-detail" title="detail">详</li><li class="everenglish-replace" title="replace the word">换</li><li class="everenglish-hold" title="hold">钉</li></ul>',
                '<div class="everenglish-translation"></div>',
            '</div>',
            '<div class="everenglish-body" style="display:none;">',
                '<ul class="everenglish-body-ul"></ul>',
            '</div>',
        '</div>'
    ];
    var vitureDom = document.createElement('div');
    vitureDom.innerHTML = template.join('');
    vitureDom = vitureDom.children[0];

    $(vitureDom).css({
        left:this.position.left,
        top:this.position.top
    });

    var translationed = getTranslation(this.word);
    var coreTranslation = translationed.translation && translationed.translation[0] || '';
    var otherTranslation = [];
    var i = 1;
    var l = translationed.translation.length;
    for(i=1;i<l;i++){
        var tempString = '<li>'+translationed.translation[i]+'</li>'
        otherTranslation.push(tempString)
    }
    $(vitureDom).find('.everenglish-translation').html(coreTranslation);
    $(vitureDom).find('.everenglish-body-ul').html(otherTranslation.join(''));
    //.styleText = 'position{left:'+this.position.left+'px;top:'+this.position.top+'px;}';
    body.appendChild(vitureDom);
    this.parent = document.getElementById(this.id);
    this.isShow = true;
    this.bindEvent();
}

Board.prototype.bindEvent = function(){
    var that = this;
    this.parent.addEventListener('mousedown',function(eventObject){
        eventObject.stopPropagation();

    });

    this.parent.addEventListener('mouseup',function(eventObject){
        console.log(eventObject);
        if(eventObject.target.className == 'everenglish-add'){
            console.log('添加入库');
            that.add();
        }
        eventObject.stopPropagation();
    });

    document.addEventListener('mouseup',function(){
        if(that.isShow){
            that.destroy();
        }
    })
}

Board.prototype.destroy = function(){
    if(this.parent){
        body.removeChild(this.parent);
    }
}

Board.prototype.add = function(){
    //this.word;
    //this.translation;
    console.log('ajax the word and translation');
}

var getTranslation = function(txt) {
    return {
        'language': 'chinese',
        'txt': txt,
        'translation': [
            '你好',
            '你好吗?',
            '妈你好'
        ]
    }
}

function computedRange() {
    return {
        'xStart': mouseDownX,
        'yStart': mouseDownY,
        'xEnd': mouseUpX,
        'yEnd': mouseUpY
    }
}

function computedPosition(range){
    return {
        left : range.xStart + (range.xEnd - range.xStart)/2,
        top: Math.min(range.yStart,range.yEnd) - 30 -15
    }
}
function randomColor(){

}
