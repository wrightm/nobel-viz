define(function (require) {

	var self = this;
	self.shareUrl = shareUrl;

	var jquery = require('jquery');

	return {
		shareUrl : self.shareUrl
	};

	function shareUrl(){
		jquery('#facebook-share').click(function (e) {
	    	var url = encodeURIComponent(document.location.href);
	    	var title = 'Data Visualisation';
	    	window.open('http://www.facebook.com/share.php?u='+url+'&title='+title, '_blank');
	    });
	    
	    jquery('#google-share').click(function (e) {
	    	var url = encodeURIComponent(document.location.href);
	    	var title = 'Data Visualisation';
	    	window.open('https://plus.google.com/share?url='+url, '_blank');
	    });
	    
	    jquery('#linkedin-share').click(function (e) {
	    	var url = encodeURIComponent(document.location.href);
	    	var title = 'Data Visualisation';
	    	window.open('http://www.linkedin.com/shareArticle?mini=true&url='+url+'&title='+title, '_blank');
	    });
	    
	    jquery('#pinterest-share').click(function (e) {
	    	var url = encodeURIComponent(document.location.href);
	    	var title = 'Data Visualisation';
	    	window.open('http://pinterest.com/pin/create/bookmarklet/?url='+url+'&is_video=false&description='+title, '_blank');
	    });
	    
	    jquery('#reddit-share').click(function (e) {
	    	var url = encodeURIComponent(document.location.href);
	    	var title = 'Data Visualisation';
	    	window.open('http://www.reddit.com/submit?url='+url+'&title='+title, '_blank');
	    });
	    
	    jquery('#twitter-share').click(function (e) {
	    	var url = encodeURIComponent(document.location.href);
	    	var title = 'Data Visualisation';
	    	window.open('http://twitter.com/intent/tweet?status='+title+'+'+url, '_blank');
	    });
	}
});