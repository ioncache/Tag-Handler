jQuery Tag Handler v1.3.1
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
    
```javascript
$("#basic_tag_handler").tagHandler();
```
    
Example 2: The Tag Handler will be initialized with preset tags from the
assignedTags and availableTags arrays, and autocomplete witll be
turned on:
    
```javascript
$("#array_tag_handler").tagHandler({
    assignedTags: [ 'Perl' ],
    availableTags: [ 'C', 'C++', 'C#', 'Java', 'Perl', 'PHP', 'Python' ],
    autocomplete: true
});
```
    
See https://ioncache.github.io/Tag-Handler/ for more examples
