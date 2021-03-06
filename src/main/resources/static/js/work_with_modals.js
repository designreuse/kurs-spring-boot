var modal = $('.modal');
var modalInvoker;
var currentModal;

$(modal).on('show.bs.modal', function (e) {
    currentModal = $(this);
    if(currentModal.id == 'table') {renderModalTable()}
    if(currentModal.id == 'line') {renderLineModalTable()}
    if (e.relatedTarget.parentNode.className != 'my-element') return;
    modalInvoker = $(e.relatedTarget.parentNode);
    if(modalInvoker.children('iframe').length != 0){
        var iframe = modalInvoker.children('iframe');
        var sourceLink = iframe.attr('src');
        currentModal.find('#video-url').val(sourceLink);
        currentModal.find('#video-width').val(iframe.attr('width'));
        currentModal.find('#video-height').val(iframe.attr('height'));
        currentModal.find('#video-autoplay').prop('checked', sourceLink.indexOf('autoplay=') != -1);
        currentModal.find('#video-loop').prop('checked', sourceLink.indexOf('loop=') != -1);
    }
    if(modalInvoker.children('.markdown').length != 0){
        // populate modal for text
        var element = modalInvoker.find('input');
        currentModal.find('textarea').val(element.val());
    }
});

$(modal).on('hidden.bs.modal', function () {
    var self = $(this);
    if(self.attr('id') == 'site-opts-modal') {return;}
    if(self.attr('id') == 'siteHolder-opts-modal') {return;}
    clearModal(self);
});

function clearModal(modal) {
    $.each(modal.find('input'), function (index, item) {
        if(item.id == 'white') {item.checked = true; return;}
        if(item.id == 'horizontal') {item.checked = true; return;}
        item.checked = false;
        item.value = '';
    });
    $.each(modal.find('textarea'), function (index, item) {
        item.value = '';
    });
    $('.tag-editor').val('');
}

$('.modal-data').on('click', function () {
    saveModalData(this);
});

function saveModalData() {
    setTimeout(function () {
        fncs[currentModal.attr('id')]();
    }, 100)
}

fncs = {'film': function() {
    var videoUrl = $('#video-url').val().replace('watch?v=', 'embed/');
    var videoAutoplay = $('#video-autoplay').is(':checked');
    var videoLoop = $('#video-loop').is(':checked');
    var videoWidth = $('#video-width').val() || 300;
    var videoHeight = $('#video-height').val() || 200;

    if( (videoUrl.indexOf('?') == -1) && (videoAutoplay || videoLoop)){
        videoUrl += '?';
    }
    if(videoAutoplay){
        videoUrl += '&autoplay=1'
    }
    if(videoLoop){
        videoUrl += '&loop=1'
    }

    addVideo(modalInvoker, videoWidth, videoHeight, videoUrl);
},

    'font': function () {
        var text = $('#text').val();

        addText(modalInvoker, text);
    },

    'table': function () {
        addTable(modalInvoker, collectModalTableData());
    },

    'line': function () {
        addLines(modalInvoker, collectLineModalTableData())
    }};

function addVideo(element, videoWidth, videoHeight, videoUrl, id) {
    if(element.children('.my-tool').length != 0) {
        element.children('.my-tool').remove();
        element.prepend('<iframe width="' + videoWidth + '" height="' + videoHeight + '" src="' + videoUrl +
            '" frameborder="0" allowfullscreen="allowfullscreen"></iframe>');
        element.append('<input type="hidden" class="id" value="' + (id || 0) + '" />');
    } else {
        var iframe = element.children('iframe');
        iframe.prop('width', videoWidth);
        iframe.prop('height', videoHeight);
        iframe.prop('src', videoUrl)
    }
}

function addText(element, text, id) {
    if(element.children('.my-tool').length != 0) {
        element.children('.my-tool').remove();
    } else {
        element.children('.markdown').remove();
    }
    element.prepend(markdownToHtml(text));
    element.append('<input type="hidden" class="id" value="' + (id || 0) + '" />')
}

function addTable(element, tableData, id) {
    id = 'tableId' + (id || tableDivIdCounter--);
    if(element.children('.my-tool').length != 0) {
        element.children('.my-tool').remove();
    } else {
        element.children('.table').remove();
    }
    element.children('.cog').attr('data-target','#table');
    element.children('.cog').attr('onclick','renderModalTable(JSON.parse($(this).siblings(\'.jsonTable\').text()))');
    tableData.id = parseInt(id.substr(7));
    element.find('.jsonTable').remove();
    element.prepend('<div id="' + id + '" class="table"></div><div class="jsonTable" style="display: none;">'
        + JSON.stringify(tableData) + '</div>');
    drawTable(tableData, id);
}

function addLines(element, linesData, id) {
    id = 'lineId' + (id || lineDivIdCounter--);
    if(element.children('.my-tool').length != 0) {
        element.children('.my-tool').remove();
    } else {
        element.children('.line').remove();
    }
    element.children('.cog').attr('data-target','#line');
    element.children('.cog').attr('onclick','renderLineModalTable(JSON.parse($(this).siblings(\'.jsonLineTable\').text()))');
    linesData.id = parseInt(id.substr(6));
    element.find('.jsonLineTable').remove();
    element.prepend('<div id="' + id + '" class="line"></div><div class="jsonLineTable" style="display: none;">'
        + JSON.stringify(linesData) + '</div>');
    drawLine(linesData, id);
}

function markdownToHtml(text) {
    var converter = new showdown.Converter();
    var element = converter.makeHtml(text);
    var wrapper = $('<div class="markdown"></div>');
    wrapper.append(element);
    wrapper.append($('<input type="hidden"/>').val(text));
    return wrapper;
}

function renderConstructorPage(layout) {
    
    reActivateTagsField();

    var toolbar = $('.my-toolbar');

    $('.my-tool').draggable({
        revert: 'invalid',
        helper: 'clone',
        containment: 'body',
        cancel: false
    });

    createGrid(layout);

    var editField = $('.my-content');

    editField.droppable({
        accept: '.my-tool',
        drop: function (event, ui) {
            addElement(ui.draggable, $(this));
        }
    });

    var shouldDelete = false;
    editField.sortable({
        cursor: 'move',
        connectWith: editField,
        containment: 'body',
        tolerance: 'pointer',
        over: function () {
            shouldDelete = false;
        },
        out: function () {
            shouldDelete = true;
        },
        beforeStop: function (event, ui) {
            if (shouldDelete == true) {
                ui.item.remove();
            }
        }
    });

}

function createGrid(rows) {
    var container = $('.my-container');
    container.empty();
    if(!rows) rows = [[12], [6,6], [12]];
    rows.forEach(function (row) {
        var rowTemplate = $('<div class="row"></div>');
        row.forEach(function (col) {
            rowTemplate.append('<div class="my-content col-md-' + col + '"></div>');
        });
        container.append(rowTemplate);
    }) ;
}

function addElement(item, container) {
    var id = item.attr('id');
    container.append(createElement(id.substr(5)));
}

function createElement(text) {
    var wrapper = $('<div class="my-element"></div>');
    var icon;
    if(text == 'chart'){
        icon = 'fa fa-bar-chart';
    } else {
        icon = 'glyphicon glyphicon-' + text;
    }
    wrapper.append('<button type="button" class="my-tool btn btn-default btn-lg ' +
        'tn-lg"><span class="' + icon + '"></span></button>');
    if(text == 'camera'){
        paramsForWidget['thumbnails'] = '#uploadedImages' + widgets.length;
        widgets.push(cloudinary.createUploadWidget(paramsForWidget, callbackOfWidget));
        wrapper.append($('<input type="hidden" />').val(widgets.length - 1));
        wrapper.append('<button onclick="' +
            'widgets[$(this).siblings(\'input\').val()].open()" class="btn btn-primary btn-xs">' +
            '<span class="glyphicon glyphicon-cog"></span></button>');
        wrapper.prepend('<div class="uploadedImages" id="uploadedImages' + (widgets.length - 1) + '"></div>');
    } else {
        wrapper.append('<button class="btn btn-primary btn-xs cog" data-toggle="modal" data-target="#' +
            text + '"><span class="glyphicon glyphicon-cog"></span></button>');
    }
    wrapper.append('<button onclick="parentNode.remove()" class="btn btn-danger btn-xs">' +
        '<span class="glyphicon glyphicon-remove"></span></button>');

    return wrapper;
}
