import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

//---- routing------------------

Router.configure({
	layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function () {
	console.log(this);
	this.render('welcome', {
		to:"main"
	});
});

Router.route("/images", function(){
	this.render("navbar", {
		to:"nav1"
	});
	this.render("image_add_form", {
		to:"nav2"
	});
	this.render("images", {
		to:"main"
	});
});

Router.route("/image/:_id", function(){
	this.render("navbar", {
		to:"nav1"
	});
	this.render("image", {
		to:"main",
		data: function(){
			console.log(this.params._id);
			return Images.findOne({_id:this.params._id});
		}
	});
});
// Router.route('/images', function () {
//   this.render('images');
// });

//---- infinit scroll------------------

Session.set("imageLimit", 8);
lastScrollTop = 0;

$(window).scroll(function(event){
	// test if we are near the bottom of the window
	if ($(window).height() + $(window).scrollTop() > $(document).height() - 100 ){
		// where we are in the page?
		var scrollTop = $(this).scrollTop();
		// test if we are going down.
		if (scrollTop > lastScrollTop){
			// yes we are heading down
			lastScrollTop = scrollTop;
			Session.set("imageLimit", Session.get("imageLimit")+ 4);
		}
	 }
});


//---- accounts config------------------

Accounts.ui.config({
	passwordSignupFields:"USERNAME_AND_EMAIL"
});

//---- helpers functions------------------

Template.body.helpers({ username: function(){
	if (Meteor.user()){
		// return Meteor.user().emails[0].address;
		return Meteor.user().username;
	}
	else{
		return "anonymous user";
	}
	
	}

});

Template.images.helpers({
	pics: function(){
		if (Session.get("userFilter")){ //they set a filter
			return Images.find({createdBy:Session.get("userFilter")},{sort:{createdOn:-1,rating:-1}});
		}//if
		else{
			return Images.find({},{sort:{createdOn:-1,rating:-1}, limit:Session.get("imageLimit")});
		}//else
		
	}, //helper
	filtering_images: function(){
		if (Session.get("userFilter")){ //they set a filter
			return true;
		}//if
		else{
			return false;
		}//else
				

	}, //helper
	getfilterUser: function(){
		if (Session.get("userFilter")){ //they set a filter
			var user = Meteor.users.findOne({_id:Session.get("userFilter")});
			return user.username;
		}//if
		else{
			return "anonymous";
		}//else
	},//helper
	getUser: function(user_id){
		// console.log(user_id);
		var user = Meteor.users.findOne({_id:user_id});
		if(user){
			return user.username;
		}//if
		else{
			return "anonymous";
		}//else
	}//helper
});//helpers function

Template.images.events({
	// "click .js-image":function(event){
	// 	$(event.target).css("width","250px");
	// 	return false;
	// },
	"click .js-del-image":function(event){
		var image_id = this._id;
		console.log(this);
		$("#"+image_id).hide('slow', function(){
			Images.remove({"_id":image_id});

		// console.log(event);
		// console.log(event.target);
		// console.log(event.currentTarget);
		});
	},
	"click .js-rate-image":function(event){
		console.log(event);
		console.log(this);
		var rating = $(event.currentTarget).data('userrating');
		console.log(rating);
		var image_id = this.data_id;
		console.log(image_id);
		// Images.update({_id:image_id}, { $set:{rating:rating} });
		// Images.update({_id:image_id},
		// 			  {$set: {rating:rating}}
		// );

		$("#"+image_id).hide('slow', function(){
			// Images.remove({"_id":image_id});
				Images.update({_id:image_id},
					  {$set: {rating:rating}}
				);
		});

		$("#"+image_id).show('slow', function(){
			// Images.remove({"_id":image_id});
				// Images.update({_id:image_id},
				// 	  {$set: {rating:rating}}
				// );
		});
		// return false;

	},

	"click .js-show-image-form":function(event){
		$("#exampleModal").modal("show");
	},

	"click .js-set-image-filter":function(event){
		Session.set("userFilter", this.createdBy);
	},

	"click .js-unset-image-filter":function(event){
		Session.set("userFilter", undefined);
	},
	
	

});

Template.image_add_form.events({
	// "click .js-add-image":function(event){
	"submit .js-add-image":function(event){
		var img_src, img_alt;
		img_src = event.target.img_src.value;
		img_alt = event.target.img_alt.value;
		// img_src = $("#img_src").val();
		// img_alt = $("#img_alt").val();
		console.log(img_src);
		console.log(img_alt);
		if (Meteor.user()){
			Images.insert({
				img_src:img_src,
				img_alt:img_alt,
				createdOn: new Date(),
				createdBy: Meteor.user()._id
			}); //Image.insert
		}// if
		// console.log(Meteor.User());
		$("#exampleModal").modal("hide");
		return false;

	},

	// "click .js-show-image-form":function(event){
	// 	$("#exampleModal").modal("show");		
	// 	return false;
	// },
});
