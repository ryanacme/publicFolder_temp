import { Meteor } from 'meteor/meteor';

// Meteor.startup(() => {
//   // code to run on server at startup
// });

Meteor.startup(function(){
	if (Images.find().count() == 0){
		for (var i=1; i < 23; i++){
			Images.insert({
				img_src:"img_"+i+".jpg",
				img_alt:"Image "+i
			});
		}
		console.log("main-server.js says: "+Images.find().count());	
	}
	
});
