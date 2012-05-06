/*
jQuery Tag Handler v1.3.0
Copyright (C) 2010-2011 Mark Jubenville
Mark Jubenville - ioncache@gmail.com
http://ioncache.github.com/Tag-Handler
    
Development time supported by:
Raybec Communications
http://www.raybec.com
http://www.mysaleslink.com
    
Modified by Javier Fernandez Escribano - fesjav@gmail.com
Added autocomplete queries as the user writes
    
Development time supported by:
Tourist Eye
http://www.touristeye.com
    
Based heavily on:
Tag it! by Levy Carneiro Jr (http://levycarneiro.com/)
http://levycarneiro.com/projects/tag-it/example.html
http://github.com/levycarneiro/tag-it
http://plugins.jquery.com/project/tag-it
    
Tag icons/cursors converted from:
From the famfamfam.com Silk icon set:
http://www.famfamfam.com/lab/icons/silk/
    
Loader image created at:
Preloaders.net
http://preloaders.net/
    
------------------------------------------------------------------------------
Description 
------------------------------------------------------------------------------
    
Tag Handler is a jQuery plugin used for managing tag-type metadata. 
    
------------------------------------------------------------------------------
Basic Usage Instructions
------------------------------------------------------------------------------
    
* Tag Handler must be attached to one or more <ul> tags in your HTML.
    
* To add a tag, click on the tag box, type in a name, and hit enter or comma.
    
* Tags may be removed from the tag box by hitting backspace inside the box or
by clicking on the tag.
    
* The list of tags may be initialized in 1 of 3 ways:
    
1. By passing arrays of tag names as options to the plugin
("availableTags" and "assignedTags"); or,
    
2. By supplying a "getURL" for the tags to be retrieved via AJAX.
    
When using this method, the server must supply a JSON formatted array
named "availableTags" and optionally an additional array named
"assignedTags".

3. By supplying a "getURL" and initLoad: false.
    
When using this method, it will get the "assignedTags" from the array as in 
method 1. When the user writes a tag, it will query the server searching for
similar tags.        

Either way, the information from these 3 methods will be used in the
following manner:
    
availableTags: each item in this array will populate the autocomplete
drop-down list
    
assignedTags: each item this array will become a tag in the tag box
    
* Tags may be sent back to the server by supplying an "updateURL". In this case,
an array will be sent back to the server named "tags".
    
* You can define whether the user can create new tags or select tags only.
    
* You can define if the user can edit the tags.
    
* A sample CSS file is included that can be used to help with formatting tags.
    
------------------------------------------------------------------------------
Plugin Examples
------------------------------------------------------------------------------
    
Example 1: The Tag Handler will be initialized with no options and no default
tags:
    
$("#basic_tag_handler").tagHandler();
    
Example 2: The Tag Handler will be initialized with preset tags from the
assignedTags and availableTags arrays, and autocomplete witll be
turned on:
    
$("#array_tag_handler").tagHandler({
assignedTags: [ 'Perl' ],
availableTags: [ 'C', 'C++', 'C#', 'Java', 'Perl', 'PHP', 'Python' ],
autocomplete: true
});
    
See http://ioncache.github.com/Tag-Handler for more examples
    
------------------------------------------------------------------------------
Plugin Options
------------------------------------------------------------------------------
    
Tag data specific options:
--------------------------
    
Option          Description                                     Default Value
--------------  ----------------------------------------------  --------------
assignedTags    array to pass a list of already assigned tags   []
availableTags   array to pass a list of all available tags      []
getData         data field with info for getURL                 ''
getURL          URL for retrieving tag lists via ajax           {}
initLoad        indicates if all tags should be loaded on init  true
updateData      data field with additional info for updtateURL  {}
updateURL       URL for saving tags via ajax                    ''

Callback options:
-----------------
Option          Description                                     Default Value
--------------  ----------------------------------------------  --------------
onAdd           function to be called when a new tag is added   {}
onDelete        function to be called when a tag is deleted     {}
afterAdd        function to be called after a new tag is added  {}
afterDelete     function to be called after a tag is deleted    {}
    
Miscellaneous options:
----------------------
    
Option          Description                                     Default Value
--------------  ----------------------------------------------  --------------
allowAdd        indicates whether the user can add new tags     true
allowEdit       indicates whether the tag list is editable      true
autocomplete    requires jqueryui autocomplete plugin           false
autoUpdate      indicates whether updating occurs automatically false
whenever a tag is added/deleted - if set true,
the save button will not be shown
className       base class name that will be added to the tag   'tagHandler'
container 
debug           will turn on some console logging debug info    false
delimiter       extra delimiter to use to separate tags         ''
note 'enter' and 'comma' are always allowed 
maxTags         sets a limit to the number of allowed tags, set 0
to 0 to allow unlimited
minChars        minimum number of chars to type before starting 0
autocomplete
msgError        message shown when there is an error loading    'There was an
the tags                                        error getting
the tag list.'
msgNoNewTag     message shown when the user cannot add a new    'You don't have
tag                                             permission to
create a new
tag.'
queryname       query term used to send user typed data         'q'
sortTags        sets sorting of tag names alphabetically        true

Methods
----------------------
    
Name               Description               Usage
-----------------  -----------------------  --------------------------------
getTags            returns an array of tags .tagHandler("getTags")
getSerializedTags  returns comma separated  .tagHandler("getSerializedTags")
string of tags
    
------------------------------------------------------------------------------
License
------------------------------------------------------------------------------
    
This program is free software: you can redistribute it and/or modify
it under the terms of the Lesser GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
    
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
Lesser GNU General Public License for more details.
    
You should have received a copy of the Lesser GNU General Public License
along with this program.  If not, see < http://www.gnu.org/licenses/ >.

*/

(function ($) {

    // some helper methods
    var methods = {
        getSerializedTags: function () {
            var currentTags = [];
            $(this).find("li.tagItem").each(function (i, e) {
                currentTags.push($(e).text());
            });
            return currentTags.join(',');
        },
        getTags: function () {
            var currentTags = [];
            $(this).find("li.tagItem").each(function (i, e) {
                currentTags.push($(e).text());
            });
            return currentTags;
        },
        version: function () {
            return "1.3.0";
        }
    };

    // main plugin initialization
    $.fn.tagHandler = function (options) {
        if (typeof(options) == 'object' || typeof(options) == 'undefined') {

            var opts = $.extend({}, $.fn.tagHandler.defaults, options);
            debug($(this), opts);

            // processes each specified object and adds a tag handler to each
            return this.each(function () {

                // checks to make sure the supplied element is a <ul>
                if (!$(this).is('ul')) {
                    return true;
                }

                // caches the container to avoid scope issues.
                var tagContainer = this;
                var tagContainerObject = $(tagContainer);

                // adds an id to the tagContainer in case it doesn't have one
                if (!tagContainer.id) {
                    var d = new Date();
                    tagContainer.id = d.getTime();
                }

                // wraps the <ul> element in a div mainly for use in positioning
                // the save button and loader image.
                tagContainerObject.wrap('<div class="' + opts.className + '" />');

                // adds the the tag class to the tagContainer and creates the tag
                // input field
                tagContainerObject.addClass(opts.className + "Container");
                if (opts.allowEdit) {
                    tagContainerObject.html('<li class="tagInput"><input class="tagInputField" type="text" /></li>');
                }
                var inputField = tagContainerObject.find(".tagInputField");

                // master tag list, will contain 3 arrays of tags
                var tags = [];
                tags.availableTags = [];
                tags.originalTags = [];
                tags.assignedTags = [];

                // adds save/loader divs to the tagContainer if needed
                if (opts.updateURL !== '') {
                    if (!opts.autoUpdate) {
                        $("<div />").attr({ id: tagContainer.id + "_save", title: "Save Tags" }).addClass("tagUpdate").click(function () {
                            saveTags(tags, opts, tagContainer.id);
                        }).appendTo(tagContainerObject.parent());
                    }
                    $("<div />").attr({ id: tagContainer.id + "_loader", title: "Saving Tags" }).addClass("tagLoader").appendTo(tagContainerObject.parent());
                }

                // initializes the tag lists
                // tag lists will be pulled from a URL
                if (opts.getURL !== '' && opts.initLoad) {
                    $.ajax({
                        url: opts.getURL,
                        cache: false,
                        data: opts.getData,
                        dataType: 'json',
                        success: function (data, text, xhr) {
                            if (data.availableTags.length) {
                                tags.availableTags = data.availableTags.slice();
                                tags.originalTags = tags.availableTags.slice();
                            }
                            if (opts.sortTags) {
                                tags = sortTags(tags);
                            }
                            if (data.assignedTags.length) {
                                tags.assignedTags = data.assignedTags.slice();
                                if (opts.sortTags) {
                                    tags = sortTags(tags);
                                }

                                tags = addAssignedTags(opts, tags, inputField, tagContainer);

                            }
                            if (opts.autocomplete && typeof($.fn.autocomplete) == 'function' && opts.allowEdit) {
                                $(inputField).autocomplete("option", "source", tags.availableTags);
                            }
                        },
                        error: function (xhr, text, error) {
                            debug(xhr, text, error);
                            alert(opts.msgError);
                        }
                    });

                    // show assigned tags only if we load the data as we write
                }
                else if (opts.getURL !== '') {

                    tags.assignedTags = opts.assignedTags.slice();
                    if (opts.sortTags) {
                        tags = sortTags(tags);
                    }

                    tags = addAssignedTags(opts, tags, inputField, tagContainer);

                    // or load the lists of tags   
                }
                else {

                    if (opts.availableTags.length) {
                        tags.availableTags = opts.availableTags.slice();
                        tags.originalTags = tags.availableTags.slice();
                    }
                    if (opts.sortTags) {
                        tags = sortTags(tags);
                    }
                    if (opts.assignedTags.length) {
                        tags.assignedTags = opts.assignedTags.slice();
                        if (opts.sortTags) {
                            tags = sortTags(tags);
                        }

                        tags = addAssignedTags(opts, tags, inputField, tagContainer);
                    }
                    if (opts.autocomplete && typeof($.fn.autocomplete) == 'function' && opts.allowEdit && opts.initLoad) {
                        $(inputField).autocomplete("option", "source", tags.availableTags);
                    }
                }

                // all tag editing functionality only activated if set in options
                if (opts.allowEdit) {
                    // delegates a click event function to all future <li> elements with
                    // the tagItem class that will remove the tag upon click
                    tagContainerObject.delegate("li.tagItem", "click", function () {
                        var $el = $(this);
                        var rc = 1;

                        if (typeof(opts.onDelete) == "function") {
                            rc = opts.onDelete.call(this, $.trim($el.text()));
                        }

                        if (rc) {
                            tags = removeTag($el, tags, opts.sortTags);
                            if (opts.updateURL !== '' && opts.autoUpdate) {
                                saveTags(tags, opts, tagContainer.id);
                            }
                        }

                        if (typeof(opts.afterDelete) == "function") {
                            opts.afterDelete.call(this, $.trim($el.text()));
                        }

                        if (opts.autocomplete && typeof($.fn.autocomplete) == 'function' && opts.initLoad) {
                            $(inputField).autocomplete("option", "source", tags.availableTags);
                        }
                    });

                    // checks the keypress event for enter or comma, and adds a new tag
                    // when either of those keys are pressed
                    $(inputField).keypress(function (e) {
                        var $el = $(this);
                        if (e.which === 13 || e.which === 44 || e.which === opts.delimiter.charCodeAt(0)) {
                            e.preventDefault();
                            if ($el.val() !== "" && !checkTag($.trim($el.val()), tags.assignedTags)) {

                                // check if the tag is in availableTags
                                if (!opts.allowAdd && !checkTag($.trim($el.val()), tags.availableTags)) {
                                    alert(opts.msgNoNewTag);
                                    return;
                                }

                                if (opts.maxTags > 0 && tags.assignedTags.length >= opts.maxTags) {
                                    alert('Maximum tags allowed: ' + opts.maxTags);
                                }
                                else {
                                    var newTag = $.trim($el.val());

                                    // allow addition onAdd return code to control whether
                                    // addition is allowed to go through
                                    var rc = 1;
                                    if (typeof(opts.onAdd) == "function") {
                                        rc = opts.onAdd.call(this, newTag);
                                    }

                                    if (rc || typeof(rc) == "undefined") {
                                        tags = addTag(this, newTag, tags, opts.sorttags);
                                        if (opts.updateurl !== '' && opts.autoupdate) {
                                            saveTags(tags, opts, tagContainer.id);
                                        }
                                        if (opts.autocomplete && typeof($.fn.autocomplete) == 'function' && opts.initload) {
                                            $(inputField).autocomplete("option", "source", tags.availableTags);
                                        }
                                        if (typeof(opts.afterAdd) == "function") {
                                            opts.afterAdd.call(this, newTag);
                                        }
                                    }
                                }
                                $el.val("");
                                $el.focus();
                            }
                        }
                    });

                    // checks the keydown event for the backspace key as checking the
                    // keypress event doesn't work in IE
                    $(inputField).keydown(function (e) {
                        var $el = $(this);
                        if (e.which === 8 && $el.val() === "") {
                            var deleted_tag = tagContainerObject.find(".tagItem:last").text();
                            if (typeof(opts.onDelete) == "function") {
                                opts.onDelete.call(this, $.trim(deleted_tag));
                            }
                            tags = removeTag(tagContainerObject.find(".tagItem:last"), tags, opts.sortTags);
                            if (opts.updateURL !== '' && opts.autoUpdate) {
                                saveTags(tags, opts, tagContainer.id);
                            }
                            if (typeof(opts.afterDelete) == "function") {
                                opts.afterDelete.call(this, $.trim(deleted_tag));
                            }
                            if (opts.autocomplete && typeof($.fn.autocomplete) == 'function' && opts.initLoad) {
                                $(inputField).autocomplete("option", "source", tags.availableTags);
                            }
                            $el.focus();
                        }
                    });

                    // adds autocomplete functionality for the tag names
                    if (opts.autocomplete && typeof($.fn.autocomplete) == 'function' && opts.initLoad) {
                        $(inputField).autocomplete({
                            source: tags.availableTags,
                            select: function (event, ui) {
                                var $el = $(this);
                                if (!checkTag($.trim(ui.item.value), tags.assignedTags)) {
                                    if (opts.maxTags > 0 && tags.assignedTags.length >= opts.maxTags) {
                                        alert('Maximum tags allowed: ' + opts.maxTags);
                                    }
                                    else {
                                        var newTag = $.trim(ui.item.value);
                                        var rc = 1;
                                        if (typeof(opts.onAdd) == "function") {
                                            rc = opts.onAdd.call(this, newTag);
                                        }
                                        if (rc || typeof(rc) == "undefined") {
                                            tags = addTag(this, newTag, tags, opts.sortTags);
                                            if (opts.updateURL !== '' && opts.autoUpdate) {
                                                saveTags(tags, opts, tagContainer.id);
                                            }
                                            $(inputField).autocomplete("option", "source", tags.availableTags);
                                            if (typeof(opts.afterAdd) == "function") {
                                                opts.afterAdd.call(this, newTag);
                                            }
                                        }
                                    }
                                    $el.focus();
                                }
                                $el.val("");
                                return false;
                            },
                            minLength: opts.minChars
                        });
                    }
                    // Make an AJAX request to get the list of tags based on typed data
                    else if (opts.autocomplete && typeof($.fn.autocomplete) == 'function') {
                        $(inputField).autocomplete({
                            source: function (request, response) {
                                opts.getData[opts.queryname] = request.term;
                                var lastXhr = $.getJSON(opts.getURL, opts.getData, function (data, status, xhr) {
                                    response(data.availableTags);
                                });
                            },
                            select: function (event, ui) {
                                var $el = $(this);
                                if (!checkTag($.trim(ui.item.value), tags.assignedTags)) {
                                    if (opts.maxTags > 0 && tags.assignedTags.length >= opts.maxTags) {
                                        alert('Maximum tags allowed: ' + opts.maxTags);
                                    }
                                    else {
                                        var newTag = $.trim(ui.item.value);
                                        var rc = 1;
                                        if (typeof(opts.onAdd) == "function") {
                                            opts.onAdd.call(this, newTag);
                                        }
                                        if (rc || typeof(rc) == "undefined") {
                                            tags = addTag(this, $.trim(ui.item.value), tags, opts.sortTags);
                                            if (opts.updateURL !== '' && opts.autoUpdate) {
                                                saveTags(tags, opts, tagContainer.id);
                                            }
                                            if (typeof(opts.afterAdd) == "function") {
                                                opts.afterAdd.call(this, newTag);
                                            }
                                        }
                                    }
                                    $el.focus();
                                }
                                $el.val('');
                                return false;
                            },
                            minLength: opts.minChars
                        });
                    }

                    // sets the input field to show the autocomplete list on focus
                    // when there is no value
                    $(inputField).focus(function () {
                        if ($(inputField).val() === '' && opts.autocomplete && typeof($.fn.autocomplete) == 'function' && opts.initLoad) {
                            $(inputField).autocomplete("search", "");
                        }
                    });

                    // sets the focus to the input field whenever the user clicks
                    // anywhere on the tagContainer -- since the input field by default
                    // has no border it isn't obvious where to click to access it
                    tagContainerObject.click(function () {
                        $(inputField).focus();
                    });
                }
                this.getTags = function () {
                    return tags.assignedTags;
                };
                return 1;
            });
        }
        else if (typeof(options) == "string" && methods[options]) {
            return methods[options].apply(this, Array.prototype.slice.call(arguments, 1));
        }
    };

    // plugin option defaults
    $.fn.tagHandler.defaults = {
        allowEdit: true,
        allowAdd: true,
        assignedTags: [],
        autocomplete: false,
        autoUpdate: false,
        availableTags: [],
        className: 'tagHandler',
        debug: false,
        delimiter: '',
        getData: {},
        getURL: '',
        initLoad: true,
        maxTags: 0,
        minChars: 0,
        msgNoNewTag: "You don't have permission to create a new tag.",
        msgError: "There was an error getting the tag list.",
        onAdd: {},
        onDelete: {},
        afterAdd: {},
        afterDelete: {},
        queryname: 'q',
        sortTags: true,
        updateData: {},
        updateURL: ''
    };

    // checks to to see if a tag is already found in a list of tags
    function checkTag(value, tags) {
        var check = false;
        jQuery.each(tags, function (i, e) {
            if (e === value) {
                check = true;
                return false;
            }
        });

        return check;
    }

    // removes a tag from a tag list
    function removeTagFromList(value, tags) {
        jQuery.each(tags, function (i, e) {
            if (e === value) {
                tags.splice(i, 1);
            }
        });

        return tags;
    }

    // adds a tag to the tag box and the assignedTags list
    function addTag(tagField, value, tags, sort) {
        tags.assignedTags.push(value);
        tags.availableTags = removeTagFromList(value, tags.availableTags);
        $("<li />").addClass("tagItem").text(value).insertBefore($(tagField).parent());

        if (sort) {
            tags = sortTags(tags);
        }
        return tags;
    }

    // removes a tag from the tag box and the assignedTags list
    function removeTag(tag, tags, sort) {
        var value = $(tag).text();
        tags.assignedTags = removeTagFromList(value, tags.assignedTags);
        if (checkTag(value, tags.originalTags)) {
            tags.availableTags.push(value);
        }
        $(tag).remove();

        if (sort) {
            tags = sortTags(tags);
        }
        return tags;
    }

    // sorts each of the sets of tags
    function sortTags(tags) {
        tags.availableTags = tags.availableTags.sort();
        tags.assignedTags = tags.assignedTags.sort();
        tags.originalTags = tags.originalTags.sort();

        return tags;
    }

    // saves the tags to the server via ajax
    function saveTags(tags, opts, tcID) {
        var sendData = {
            tags: tags.assignedTags
        };
        $.extend(sendData, opts.updateData);
        $.ajax({
            type: 'POST',
            url: opts.updateURL,
            cache: false,
            data: sendData,
            dataType: 'json',
            beforeSend: function () {
                if ($("#" + tcID + "_save").length) {
                    $("#" + tcID + "_save").fadeOut(200,
                    function () {
                        $("#" + tcID + "_loader").fadeIn(200);
                    });
                }
                else {
                    $("#" + tcID + "_loader").fadeIn(200);
                }
            },
            complete: function () {
                $("#" + tcID + "_loader").fadeOut(200,
                function () {
                    if ($("#" + tcID + "_save").length) {
                        $("#" + tcID + "_save").fadeIn(200);
                    }
                });
            }
        });
    }

    // adds any already assigned tags to the tag box
    function addAssignedTags(opts, tags, inputField, tagContainer) {
        $(tags.assignedTags).each(function (i, e) {
            if (opts.allowEdit) {
                $("<li />").addClass("tagItem").text(e).insertBefore($(inputField).parent());
            }
            else {
                $("<li />").addClass("tagItem").css("cursor", "default").text(e).appendTo($(tagContainer));
            }
            tags.availableTags = removeTagFromList(e, tags.availableTags);
        });

        return tags;
    }

    // some debugging information
    function debug(tagContainer, options) {
        if (options.debug && window.console && window.console.log) {
            window.console.log(tagContainer);
            window.console.log(options);
            window.console.log($.fn.tagHandler.defaults);
        }
    }

})(jQuery);
