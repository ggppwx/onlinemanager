var nodemailer = require('nodemailer');
var Git = require("nodegit");
var path = require('path');


var Tasks = (function() {
	var smtpConfig = {
    	host: 'smtp.gmail.com',
    	port: 465,
    	secure: true, // use SSL 
    	auth: {
        	user: 'sirgujingwei@gmail.com',
        	pass: '!ggppwx1016'
    	}
	};

	var absPath = path.resolve(__dirname, '../tmp/note');

	this.transporter = nodemailer.createTransport(smtpConfig);


	var pushNoteViaMail = function() {
		console.log('--- running task1 -----');		
		console.log(absPath);

		// github downloader 
		Git.Clone("https://github.com/ggppwx/note.git", absPath).then(function(repository) {
	  		// Work with the repository object here.
	  		console.log('clone....');
	  		// console.log(repository.getBranchCommit("master"));
	  		return repository.getMasterCommit();
		})
		.then(function(commit) {
		  	return commit.getEntry('scratch.md');
		})
		.then(function(entry) {
			return entry.getBlob();
		})
		.then(function(blob) {
			_pushContent(blob.toString());
		})
		.catch( function(err) { 
			console.log(err); 
		})


		console.log('------- open repository ---------');

		Git.Repository.open(absPath).then(function (repo) {
	  	// Inside of this function we have an open repo
	  		console.log('open.....')
	  		repository = repo;
	  		return repository.fetchAll({
	  			callbacks: {
	        		credentials: function(url, userName) {
	          		return Git.Cred.sshKeyFromAgent(userName);
	        	},
	        	certificateCheck: function() {
	          		return 1;
	        	}
	      	}
	  		})
	  		.then(function() {
	  			console.log('merging .....');
	  			repository.mergeBranches("master", "origin/master");
	  			return repository.getMasterCommit();
	  		})
	  		.then(function(commit) {

	  			console.log(commit.message());
	  			return commit.getEntry('agenda.html');

	  		})
	  		.then(function(entry) {
	  			console.log(entry.name());
	  			return entry.getBlob();

	  		})
	  		.then(function(blob){
	  			// console.log(blob.toString());
	  			_pushContent(blob.toString());

	  		})
	  		.done();

		});



	}


	var retrieveContent = function(fileName, callback) {
		Git.Repository.open(absPath)
  		.then(function(repository){
			return repository.getBranchCommit("master");
  		})
  		.then(function(commit){
	  		console.log(commit.message());
	  		return commit.getEntry('agenda.html');
  		})
  		.then(function(entry) {
  			return entry.getBlob();
  		})
  		.then(function(blob){
  			callback(blob.toString());
  		})
  		.done()

	};

	// process the conent 
	function _pushContent(content) {
			console.log('pushing content....');
			var mailOptions = {
				from: 'sirgujingwei@gmail.com', // sender address 
		    	to: 'sirgujingwei@gmail.com', // list of receivers 
		    	subject: 'DAILY PUSH', // Subject line 
		    	html: content,
			};

			this.transporter.sendMail(mailOptions, function(error, info) {
				if (error) {
					return console.log(error);
				}
				console.log('Message sent: ' + info.response);

			});
		
	}


	return {
		pushNoteViaMail : pushNoteViaMail,
		retrieveContent : retrieveContent

	};

} )() // class



module.exports = Tasks;  // exports objects 



