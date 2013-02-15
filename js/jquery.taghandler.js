/*
 jQuery Tag Handler v2.0.0-alpha
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

 Modified By Westin Shafer - wshafer@relivinc.com
 Code re-write.  Added new features.

 Development time supported by:
 Reliv International
 http://www.reliv.com

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
            var tags = _getData(this, 'tags');
            return tags.assignedTags.join(',');
        },

        getTags: function () {
            var tags = _getData(this, 'tags');
            return tags.assignedTags;
        },

        addTag: function(value) {
            var opts = _getData(this, 'opts');

            if (!opts) {
                return null;
            }

            var tags = _getData(this, 'tags');
            var tagField = $(this).find(".tagInputField");

            tags.assignedTags.push(value);
            tags.availableTags = $(this).tagHandler('removeOption', value);

            $('<li data-tag="'+value+'">'+value+'</li>').addClass("tagItem").insertBefore($(tagField).parent());

            if (opts.sortTags) {
                tags = _sortTags(tags);
            }

            if (opts.autocomplete && typeof($.fn.autocomplete) == 'function' && opts.allowEdit) {
                $(this).find(".tagInputField").autocomplete("option", "source", tags.availableTags);
            }

            _saveData(this, 'tags', tags);

            return tags;
        },

        removeTag : function(value) {

            var opts = _getData(this, 'opts');

            if (!opts) {
                return null;
            }

            var tags = _getData(this, 'tags');

            $(this).find('[data-tag="'+value+'"]').remove();

            $.each(tags.assignedTags, function (i, e) {
                if (e === value) {
                    tags.assignedTags.splice(i, 1);
                }
            });

            tags.availableTags.push(value);

            if (opts.sortTags) {
                tags = _sortTags(tags);
            }

            if (opts.autocomplete && typeof($.fn.autocomplete) == 'function' && opts.allowEdit) {
                $(this).find(".tagInputField").autocomplete("option", "source", tags.availableTags);
            }

            _saveData(this, 'tags', tags);

            return tags;
        },

        // removes a tag from a tag list
        removeOption : function (value) {
            var tags = _getData(this, 'tags');

            $.each(tags.availableTags, function (i, e) {
                if (e === value) {
                    tags.availableTags.splice(i, 1);
                }
            });

            _saveData(this, 'tags', tags);

            return tags.availableTags;
        },

        addOption: function (value) {
            var opts = _getData(this, 'opts');

            if (!opts) {
                return null;
            }

            var tags = _getData(this, 'tags');

            tags.availableTags.push(value);

            if (opts.sortTags) {
                tags = _sortTags(tags);
            }

            if (opts.autocomplete && typeof($.fn.autocomplete) == 'function' && opts.allowEdit) {
                $(this).find(".tagInputField").autocomplete("option", "source", tags.availableTags);
            }

            _saveData(this, 'tags', tags);

            return tags.availableTags;
        },

        saveTags: function () {
            var opts = _getData(this, 'opts');

            if (!opts && !opts.updateURL) {
                return;
            }

            var tags = _getData(this, 'tags');
            var saveContainer = $("#" + this.id + "_save");
            var loadContainer = $("#" + this.id + "_loader");

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
                    if (saveContainer.length) {
                        $(saveContainer).fadeOut(200,
                            function () {
                                $(loadContainer).fadeIn(200);
                            });
                    }
                    else {
                        $(loadContainer).fadeIn(200);
                    }
                },
                complete: function () {
                    $(loadContainer).fadeOut(200,
                        function () {
                            if (saveContainer.length) {
                                $(saveContainer).fadeIn(200);
                            }
                        });
                }
            });
        },

        destroy : function() {
            var original = _getData(this, 'original');

            //Need to select wrapper div to replace the whole thing
            var parent = $(this).parent();

            $(parent).replaceWith(original);
        },

        reload : function() {
            var opts = _getData(this, 'opts');
            var original = _getData(this, 'original');

            if (!opts) {
                return;
            }

            $(this).tagHandler('destroy');
            $(original).tagHandler(opts);
        },

        version: function () {
            return "2.0.0-alpha";
        }
    };

    /**
     * Initialize the tag handler
     *
     * @param options
     * @private
     */
    var _initTagHandler = function(options) {

        /**
         * var to store the initial state of the tagger.
         * @type {Object}
         */
        var initialOpts = $.extend({}, _getDefaults(), options);

        //Output container and called options to debugger.
        _debug($(this), initialOpts);

        // processes each specified object and adds a tag handler to each
        $(this).each(function () {

            // checks to make sure the supplied element is a <ul>
            if (!$(this).is('ul')) {
                return;
            }

            //Save container initial state
            _saveData(this, 'original', $(this).get(0).cloneNode(true));
            _saveData(this, 'opts', initialOpts);
            _saveData(this, 'tags', {
                availableTags : [],
                originalTags : [],
                assignedTags : []
            });

            // adds an id to the tagContainer in case it doesn't have one
            //Not sure why this is here...  could this be something other then an ID?
            if ($(this).id) {
                $(this).id = _generateUUID();
            }

            _saveData(this, 'generatedId', $(this).id);

            //Modify the dom
            _addTaggerWrappers(this);
            _addSaveAndLoaderDivs(this);
            _initAutoLoad(this);
            _initInitialTags(this);
            _initBinds(this);
        });
    };

    var _addTaggerWrappers = function(tagContainer) {

        var opts = _getData(tagContainer, 'opts');

        // caches the container to avoid scope issues.
        var tagContainerObject = $(tagContainer);

        // wraps the <ul> element in a div mainly for use in positioning
        // the save button and loader image.
        tagContainerObject.wrap('<div class="' + opts.className + '" />');

        // adds the the tag class to the tagContainer and creates the tag
        // input field
        tagContainerObject.addClass(opts.className + "Container");

        var inputField = $('<li class="tagInput"></li>');
        inputField.append('<input class="tagInputField" type="text" />');

        if (opts.allowEdit) {
            tagContainerObject.append(inputField);
        }

    };

    var _addSaveAndLoaderDivs = function (tagContainer) {
        var opts = _getData(tagContainer, 'opts');

        // adds save/loader divs to the tagContainer if needed
        if (opts.updateURL !== '') {
            if (!opts.autoUpdate) {
                $("<div></div>").attr({ id: tagContainer.id + "_save", title: "Save Tags" }).addClass("tagUpdate").click(function () {
                    $(tagContainer).tagHandler('saveTags');
                }).appendTo($(tagContainer).parent());
            }
            $("<div />").attr({ id: tagContainer.id + "_loader", title: "Saving Tags" }).addClass("tagLoader").appendTo($(tagContainer).parent());
        }
    };

    /**
     * Initialize the Autocomplete feature.
     *
     * @param tagContainer
     * @private
     */
    var _initAutoLoad = function (tagContainer) {
        var opts = _getData(tagContainer, 'opts');

        if (!opts || !opts.autocomplete || typeof($.fn.autocomplete) != 'function') {
            return;
        }

        var tags = _getData(tagContainer, 'tags');

        var source = null;

        if (opts.initLoad) {
            source = tags.availableTags
        } else {
            source = []
        }

        var inputField = $(tagContainer).find(".tagInputField");

        $(inputField).autocomplete({
            source: source,
            select: function (event, ui) {
                var $el = $(this);
                if (!_checkTag($.trim(ui.item.value), tags.assignedTags)) {
                    if (opts.maxTags > 0 && tags.assignedTags.length >= opts.maxTags) {
                        throw new Error('Maximum tags allowed: ' + opts.maxTags);
                    }
                    else {
                        var newTag = $.trim(ui.item.value);
                        var rc = 1;
                        if (typeof(opts.onAdd) == "function") {
                            rc = opts.onAdd.call(this, newTag);
                        }
                        if (rc || typeof(rc) == "undefined") {
                            tags = $(tagContainer).tagHandler('addTag', newTag);
                            if (opts.updateURL !== '' && opts.autoUpdate) {
                                $(tagContainer).tagHandler('saveTags');
                            }

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
    };

    var _initInitialTags = function(tagContainer) {

        var opts = _getData(tagContainer, 'opts');

        if (!opts) {
            return;
        }

        var tags = _getData(tagContainer, 'tags');

        // initializes the tag lists
        // tag lists will be pulled from a URL
        if (opts.getURL !== '' && opts.initLoad) {
            $.ajax({
                url: opts.getURL,
                cache: false,
                data: opts.getData,
                dataType: 'json',
                success: function (data) {
                    _processTags(tagContainer, data)
                },
                error: function (xhr, text, error) {
                    _debug(xhr, {text : text, error : error });
                    throw new Error(opts.msgError);
                }
            });
        } else {
            _processTags(tagContainer, opts)
        }
    };

    var _initBinds = function (tagContainer) {
        var opts = _getData(tagContainer, 'opts');

        if (!opts) {
            return;
        }

        var tags = _getData(tagContainer, 'tags');

        var inputField = $(tagContainer).find(".tagInputField");

        if (opts.allowEdit) {
            // checks the keypress event for enter or comma, and adds a new tag
            // when either of those keys are pressed
            $(inputField).keypress($(tagContainer), _tagKeyPressHandler);

            $(inputField).keydown($(tagContainer),_tagKeyDownHandler);

            $(tagContainer).click(function () {
                $(inputField).focus();
                $(inputField).trigger('focus');
            });

            $(inputField).focus(function () {
                if ( $(inputField).val() === '' && opts.autocomplete && typeof($.fn.autocomplete) == 'function' && opts.initLoad && tags.availableTags.length > 0) {
                    $(inputField).autocomplete("search", "");
                }
            });

            $(tagContainer).delegate("li.tagItem", "click", $(tagContainer), _tagClickHandler);
        }
    };

    var _tagClickHandler = function(e) {

        var tagContainer = e.data;

        var opts = _getData(tagContainer, 'opts');

        if (!opts) {
            return;
        }

        var tags = _getData(tagContainer, 'tags');
        var $el = $(this);
        var rc = 1;

        if (typeof(opts.onDelete) == "function") {
            rc = opts.onDelete.call(this, $.trim($el.text()));
        }

        if (rc) {
            $(tagContainer).tagHandler('removeTag', $el.text());

            if (opts.updateURL !== '' && opts.autoUpdate) {
                $(tagContainer).tagHandler('saveTags');
            }
        }

        if (typeof(opts.afterDelete) == "function") {
            opts.afterDelete.call(this, $.trim($el.text()));
        }

    };

    var _tagKeyPressHandler = function (e) {
        var tagContainer = e.data;

        var opts = _getData(tagContainer, 'opts');

        if (!opts) {
            return;
        }

        var tags = _getData(tagContainer, 'tags');

        var keyCode = e.keyCode || e.which;

        var $el = $(this);
        if (keyCode === 13 || keyCode === 44 || keyCode === 9 || keyCode === opts.delimiter.charCodeAt(0)) {
            e.preventDefault();
            e.stopImmediatePropagation();

            if ($el.val() !== "" && !_checkTag($.trim($el.val()), tags.assignedTags)) {

                // check if the tag is in availableTags
                if (!opts.allowAdd && !_checkTag($.trim($el.val()), tags.availableTags)) {
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
                        tags = $(tagContainer).tagHandler('addTag', newTag);
                        if (opts.updateURL !== '' && opts.autoUpdate) {
                            $(tagContainer).tagHandler('saveTags');
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
    };

    var _tagKeyDownHandler = function(e) {
        var tagContainer = e.data;

        var opts = _getData(tagContainer, 'opts');

        if (!opts) {
            return;
        }

        var tags = _getData(tagContainer, 'tags');

        var keyCode = e.keyCode || e.which;

        var $el = $(this);

        //Fix for tab hotkey, disables tab defaults.  Can not be disabled through keypress.
        if (keyCode === 9) {
            e.preventDefault();
            e.stopImmediatePropagation();
        }

        if (e.which === 8 && $el.val() === "") {
            var deleted_tag = tags.assignedTags.slice(-1)[0];

            if (typeof(opts.onDelete) == "function") {
                opts.onDelete.call(this, $.trim(deleted_tag));
            }

            $(tagContainer).tagHandler('removeTag', deleted_tag);

            if (opts.updateURL !== '' && opts.autoUpdate) {
                $(tagContainer).tagHandler('saveTags');
            }
            if (typeof(opts.afterDelete) == "function") {
                opts.afterDelete.call(this, $.trim(deleted_tag));
            }
            $el.focus();
        }


    };

    // adds any already assigned tags to the tag box
    var _processTags = function (tagContainer, tagsToAdd) {
        $(tagsToAdd.availableTags).each(function(i, e){
            $(tagContainer).tagHandler('addOption', e);
        });

        $(tagsToAdd.assignedTags).each(function (i, e) {
            $(tagContainer).tagHandler('addTag', e);
        });
    };

    // checks to to see if a tag is already found in a list of tags
    var _checkTag = function (value, tags) {
        var check = false;

        jQuery.each(tags, function (i, e) {
            if (e === value) {
                check = true;
                return false;
            }
            return true;
        });

        return check;
    };

    // sorts each of the sets of tags
    var _sortTags = function(tags) {
        tags.availableTags = tags.availableTags.sort();
        tags.assignedTags = tags.assignedTags.sort();
        tags.originalTags = tags.originalTags.sort();

        return tags;
    };



    var _saveData = function (container, keyName, saveData) {
        var data = $(container).data('tagHandlerState');

        if (!data) {
            data = {};
        }

        data[keyName] = saveData;

        $(container).data('tagHandlerState', data);
    };

    var _getData = function (container, keyName) {
        var data = $(container).data('tagHandlerState');

        if (!data || data[keyName] == undefined) {
            return null;
        }

        return data[keyName];
    };

    var _getDefaults = function() {
        return {
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
    };

    var _debug = function (tagContainer, options) {
        if (options.debug && window.console && window.console.log) {
            window.console.log(tagContainer);
            window.console.log(options);
            window.console.log($.fn.tagHandler.defaults);
        }
    };

    /**
     * Generates RFC4122 v4 compliant random ids
     * @return {String}
     */
    var _generateUUID = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
            /[xy]/g,
            function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            }
        );
    };

    /**
     * Extends Jquery.  Adds method tagHandler to Jquery
     *
     * @param options
     * @return {*}
     */
    jQuery.fn.tagHandler = function (options) {
        if (typeof(options) == "string" && methods[options]) {
            return methods[options].apply(this, Array.prototype.slice.call(arguments, 1));
        } else {
            return _initTagHandler.apply(this, arguments);
        }
    };
})(jQuery);