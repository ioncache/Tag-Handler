/*
    jQuery Tag Handler v1.1.0
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
    
    Example 3: The Tag Handler will be initialized and pull data via ajax, also
               sending some data to the server:
    
        $("#ajaxget_tag_handler").tagHandler({
            getData: { id: 'user123', type: 'user' },
            getURL: '/ajaxtest/get',
            autocomplete: true
        });
    
    Example 4: Same as Example 3, but a different user is set in the getData /
               UpdateData options and now the tags will save when clicking the save
               button:
               
        $("#ajaxupdate_tag_handler").tagHandler({
            getData: { id: 'user234', type: 'user' },
            getURL: '/ajaxtest/get',
            updateData: { id: 'user234', type: 'user' },
            updateURL: '/ajaxtest/update',
            autocomplete: true
        });
    
    Example 5: Same as Example 4, but autoUpdate is true, tags will save
               automatically (no save button will be shown):
    
        $("#ajaxautoupdate_tag_handler").tagHandler({
            getData: { id: 'user234', type: 'user' },
            getURL: '/ajaxtest/get',
            updateData: { id: 'user234', type: 'user' },
            updateURL: '/ajaxtest/update',
            autocomplete: true,
            autoUpdate: true
        });
    
    Example 6: The Tag Handler will be initialized but it will request the tag list
    when the user writes more than 2 chars, also sending some data to the server:
    
        $("#ajaxget_tag_handler").tagHandler({
            getData: { id: 'user123', type: 'user' },
            initLoad: false,
            getURL: '/ajaxtest/get',
            autocomplete: true,
            minChars: 2
        });
    
    Example 7: Same as example 6, but the user cannot create new tags:
    
        $("#ajaxget_tag_handler").tagHandler({
            getData: { id: 'user123', type: 'user' },
            initLoad: false,
            getURL: '/ajaxtest/get',
            autocomplete: true,
            minChars: 2,
            allowAdd: false
        });
        
            
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
    getURL          URL for retrieving tag lists via ajax           ''
    initLoad        indicates if all tags should be loaded on init  true
    updatetData     data field with additional info for updtateURL  ''
    updateURL       URL for saving tags via ajax                    ''
    
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

(function($) {

    $.fn.tagHandler = function(options) {
        var opts = $.extend({}, $.fn.tagHandler.defaults, options);
        debug($(this), opts);

        // processes each specified object and adds a tag handler to each
        return this.each(function() {
            // checks to make sure the supplied element is a <ul>
            if (!$(this).is('ul')) {
                return true;
            }

            // caches the container to avoid scope issues.
            var tagContainer = this;
            var tagContainerObject = $(tagContainer);

            // adds an id to the tagContainer in case it doesn't have one
            if ( !tagContainer.id ) {
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

            // adds a save/loader divs to the tagContainer if needed
            if (opts.updateURL !== '') {
                if (!opts.autoUpdate) {
                    $("<div />").attr({ id: tagContainer.id + "_save", title: "Save Tags" }).addClass("tagUpdate").click(function() {
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
                    success: function(data, text, xhr) {
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
                    error: function(xhr, text, error) {
                        debug(xhr, text, error);
                        alert(opts.msgError);
                    }
                });              
            
            // show assigned tags only if we load the data as we write
            } else if( opts.getURL !== '' ) {

                tags.assignedTags = opts.assignedTags.slice();
                if (opts.sortTags) {
                  tags = sortTags(tags);
                }

                tags = addAssignedTags(opts, tags, inputField, tagContainer);

            // or load the lists of tags   
            } else {
                
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
                tagContainerObject.delegate("li.tagItem", "click", function() {
                    tags = removeTag($(this), tags, opts.sortTags);
                    if (opts.updateURL !=='' && opts.autoUpdate) {
                        saveTags(tags, opts, tagContainer.id);
                    }
                    if (opts.autocomplete && typeof($.fn.autocomplete) == 'function' && opts.initLoad) {
                      $(inputField).autocomplete("option", "source", tags.availableTags);
                    }
                });

                // checks the keypress event for enter or comma, and adds a new tag
                // when either of those keys are pressed
                $(inputField).keypress(function(e) {
                    if (e.which === 13 || e.which === 44 || e.which === opts.delimiter.charCodeAt(0)) {
                        e.preventDefault();
                        if ($(this).val() !=="" && !checkTag($.trim($(this).val()), tags.assignedTags)) {
                            
                            // check if the tag is in availableTags
                            if( !opts.allowAdd && !checkTag($.trim($(this).val()), tags.availableTags)){
                              alert(opts.msgNoNewTag);
                              return;
                            }
                            
                            if ( opts.maxTags > 0 && tags.assignedTags.length >= opts.maxTags ) {
                                alert('Maximum tags allowed: ' + opts.maxTags);
                            } else {
                                tags = addTag(this, $.trim($(this).val()), tags, opts.sortTags);
                                if (opts.updateURL !=='' && opts.autoUpdate) {
                                    saveTags(tags, opts, tagContainer.id);
                                }
                                if (opts.autocomplete && typeof($.fn.autocomplete) == 'function' && opts.initLoad) {
                                    $(inputField).autocomplete("option", "source", tags.availableTags);
                                }
                            }
                            $(this).val("");
                            $(this).focus();
                        }
                    }
                });

                // checks the keydown event for the backspace key as checking the
                // keypress event doesn't work in IE
                $(inputField).keydown(function(e) {
                    if (e.which === 8 && $(this).val() === "") {
                        tags = removeTag(tagContainerObject.find(".tagItem:last"), tags, opts.sortTags);
                        if (opts.updateURL !=='' && opts.autoUpdate) {
                            saveTags(tags, opts, tagContainer.id);
                        }
                        if (opts.autocomplete && typeof($.fn.autocomplete) == 'function' && opts.initLoad) {
                            $(inputField).autocomplete("option", "source", tags.availableTags);
                        }
                        $(this).focus();
                    }
                });

                // adds autocomplete functionality for the tag names
                if  ( opts.autocomplete && typeof($.fn.autocomplete) == 'function' && opts.initLoad ) {
                    
                    $(inputField).autocomplete({
                        source: tags.availableTags,
                        select: function(event, ui) {
                            if (!checkTag($.trim(ui.item.value), tags.assignedTags)) {
                                if ( opts.maxTags > 0 && tags.assignedTags.length >= opts.maxTags ) {
                                    alert('Maximum tags allowed: ' + opts.maxTags);
                                } else {
                                    tags = addTag(this, $.trim(ui.item.value), tags, opts.sortTags);
                                    if (opts.updateURL !=='' && opts.autoUpdate) {
                                        saveTags(tags, opts, tagContainer.id);
                                    }
                                    $(inputField).autocomplete("option", "source", tags.availableTags);
                                }
                                $(this).focus();
                            }
                            $(this).val("");
                            return false;
                        },
                        minLength: opts.minChars
                    });

                // Make an AJAX request to get the list of tags
                } else if ( opts.autocomplete && typeof($.fn.autocomplete) == 'function' ) {

                    var cache = {};

                    $(inputField).autocomplete({
                        source: function( request, response ) {
                            var term = request.term;
                            if ( term in cache ) {
                              response( cache[ term ] );
                              return;
                            }
                            // Add term to search on the server
                            opts.getData[opts.queryname] = term;
                            lastXhr = $.getJSON( opts.getURL, opts.getData, function( data, status, xhr ) {
                                cache[ term ] = data;
                                if ( xhr === lastXhr ) {
                                    response( data );
                                }
                            });
                        },
                        select: function(event, ui) {
                            if ( !checkTag($.trim(ui.item.value), tags.assignedTags) ) {
                                if ( opts.maxTags > 0 && tags.assignedTags.length >= opts.maxTags ) {
                                    alert('Maximum tags allowed: ' + opts.maxTags);
                                } else {
                                    tags = addTag(this, $.trim(ui.item.value), tags, opts.sortTags);
                                    if (opts.updateURL !=='' && opts.autoUpdate) {
                                        saveTags(tags, opts, tagContainer.id);
                                    }
                                }
                                $(this).focus();
                            }
                            $(this).val('');
                            return false;
                        },
                        minLength: opts.minChars
                    });
                }

                // sets the input field to show the autocomplete list on focus
                // when there is no value
                $(inputField).focus(function() {
                    if ($(inputField).val() === '' && opts.autocomplete && typeof($.fn.autocomplete) == 'function' && opts.initLoad) {
                        $(inputField).autocomplete("search", "");
                    }
                });

                // sets the focus to the input field whenever the user clicks
                // anywhere on the tagContainer -- since the input field by default
                // has no border it isn't obvious where to click to access it
                tagContainerObject.click(function() {
                    $(inputField).focus();
                });
            }
        });
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
        getData: '',
        getURL: '',
        initLoad: true,
        maxTags: 0,
        minChars: 0,
        msgNoNewTag: "You don't have permission to create a new tag.",
        msgError: "There was an error getting the tag list.",
        queryname: 'q',
        sortTags: true,
        updatetData: '',
        updateURL: ''
    };
    
    // checks to to see if a tag is already found in a list of tags
    function checkTag(value, tags) {
        var check = false;
        $(tags).each(function(i, e) {
            if ( e === value ) {
                check = true;
                return false;
            }
        });

        return check;
    }

    // removes a tag from a tag list
    function removeTagFromList(value, tags) {
        $(tags).each(function(i, e) {
            if ( e === value )  {
                tags.splice(i, 1);
            }
        });

        return tags;
    }

    // adds a tag to the tag box and the assignedTags list
    function addTag(tagField, value, tags, sort) {
        tags.assignedTags.push(value);
        tags.availableTags = removeTagFromList(value, tags.availableTags);
        $("<li />").addClass("tagItem").html(value).insertBefore($(tagField).parent());

        if (sort) {
            tags = sortTags(tags);
        }
        return tags;
    }

    // removes a tag from the tag box and the assignedTags list
    function removeTag(tag, tags, sort) {
        var value = $(tag).html();
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
        sendData = {
            tags: tags.assignedTags
        };
        $.extend(sendData, opts.updateData);
        $.ajax({
            type: 'POST',
            url: opts.updateURL,
            cache: false,
            data: sendData,
            dataType: 'json',
            beforeSend: function() {
                if ($("#" + tcID + "_save").length) {
                    $("#" + tcID + "_save").fadeOut(200,
                    function() {
                        $("#" + tcID + "_loader").fadeIn(200);
                    });
                } else {
                    $("#" + tcID + "_loader").fadeIn(200);
                }
            },
            complete: function() {
                $("#" + tcID + "_loader").fadeOut(200,
                function() {
                    if ($("#" + tcID + "_save").length) {
                        $("#" + tcID + "_save").fadeIn(200);
                    }
                });
            }
        });
    }

    // adds any already assigned tags to the tag box
    function addAssignedTags(opts, tags, inputField, tagContainer) {
        $(tags.assignedTags).each(function(i, e) {
            if (opts.allowEdit) {
                $("<li />").addClass("tagItem").html(e).insertBefore($(inputField).parent());
            } else {
                $("<li />").addClass("tagItem").css("cursor", "default").html(e).appendTo(tagContainerObject);
            }
            tags.availableTags = removeTagFromList(e, tags.availableTags);
        });

        return tags;
    }

    // some debugging information
    function debug(tagContainer, options) {
        if (window.console && window.console.log && options.debug) {
            window.console.log(tagContainer);
            window.console.log(options);
            window.console.log($.fn.tagHandler.defaults);
        }
    }

})(jQuery);
