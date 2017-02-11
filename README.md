# ajaxLoader

<b>SAMPLE CODE</b>

JS object for asynchronous partial loading of web pages.  
Input parameters: settings (JS object)  

<b>Dependencies</b>  
jQuery >= 1.5 
History API  
Google Analytics  

Usage  
-------------------------
var asyncLoader = new AsyncLoader();  
var settings = { ... };    
asyncLoader.load(settings);  

Settings  
-------------------------
<b>link</b>  
A jQuery object representing the clicked link, e.g. ``$(<a href="#"></a>)``  
*default value*: ``null``

<b>loadWrapper</b>  
Selector class for the wrapper that contains the code that needs to be updated. Does not get changed in the process.   
*default value*: ``#asyncWrapper``   

<b>loadContent</b>  
Selector class for the part of the HTML that needs to be changed.  
Every partial HTML has to be wrapped in a div with this class and a div with the loadWrapper class.  
*default value*: ``.asyncContent``

<b>partial</b>  
Is the HTML returned partial, or a full web page, head and all?  
*default value*: ``true``  

<b>pathname</b>  
*default value*: ``window.location.pathname``  

<b>production</b>  
Is the code in production? Matters for Google Analytics.  
*default value*: ``false``  

Methods
-------------------------
<b>load</b>  
Main function to be called to load content  
*parameters*: ``settings (JS object)``

<b>preloadAction</b>  
Function to be run before the loading, e.g. preloading animation; corresponds to jQuery ajax `beforeSend`  
Change the function on the prototype before calling the load function to use it  
 
<b>postloadAction</b>  
Function to be run after the loading; corresponds to jQuery ajax `complete`   
Change the function on the prototype before calling the load function to use it  

<b>errorAction</b>  
Function to be run if an error occurs; corresponds to jQuery ajax `error`  
