Node.js Quick Start Guide
=========================

This guide will get you up and running with Node.js using OpDemand.

Prerequisites
--------------
* A free OpDemand account with active AWS credentials
* The OpDemand Command Line Interface
* A Node.js application hosted on GitHub

Clone your Application
----------------------
The simplest way to get started is by forking OpDemand's sample Node.js application located at:
<https://github.com/opdemand/example-nodejs-express>

After forking the project, clone it to your local workstation using the SSH-style URL:

    $ git clone git@github.com:gabrtv/example-nodejs-express.git example-nodejs-express
    $ cd example-nodejs-express

Prepare Your Application
------------------------
To use a Node.js application with OpDemand, you will need to conform to 3 basic requirements:

 * Use **NPM** to manage dependencies
 * Use **Foreman** to manage processes
 * Use **Environment Variables** to manage configuration

If you're deploying the example application, it already conforms to these requirements.  If you're in a rush, skip to [Create a Platform](#create).

### Use NPM to manage dependencies

On every deploy action, OpDemand will run an `npm install` on all application workers to ensure dependencies are up to date.  NPM requires that you explicitly declare your dependencies using a `package.json` file.  Here is an example `package.json`:

	{
    	"name": "example-nodejs-express"
	  , "version": "0.0.1"
	  , "engines": {
	      "node": "0.6.11",
	      "npm":  "1.1.1"
	    }
	  , "private": true
	  , "dependencies": {
	      "express": "2.5.4"
	  }
	  , "devDependencies": {
	  }
	}

You can install your dependencies locally using an `npm install`:

	$ npm install
	express@2.5.4 ./node_modules/express 
	├── mkdirp@0.0.7
	├── mime@1.2.5
	├── qs@0.5.0
	└── connect@1.8.7

### Use Foreman to manage processes

OpDemand uses a Foreman Procfile to manage the processes that serve up your application.  The `Procfile` is how you define the command(s) used to run your application.  Here is an example `Procfile`:

	web: node server.js

This tells OpDemand to run one web process using the command `node server.js`.  You can test this out locally by running `foreman start`.

	$ foreman start
	11:48:48 web.1     | started with pid 67810
	11:48:48 web.1     | Server listening on port 3000 in development mode

### Use Environment Variables to manage configuration

OpDemand uses environment variables to manage your application's configuration.  For example, the application listener must use the value of the `APPLICATION_PORT` environment variable.  The following code snippet demonstrates how this can work inside your application:

	/* Use APPLICATION_PORT environment variable if it exists */
	try {
	  var port = process.env.APPLICATION_PORT
	} catch(err) {
	  var port = 3000
	}

The same is true for external services like databases, caches and queues.  Here is an example in CoffeeScript that shows how to connect to a MongoDB database using the `DATABASE_HOST` environment variable:

	app.configure "development", ->
	  db_host = process.env.DATABASE_HOST || 'localhost'
	  db_url = "mongodb://#{db_host}/mydb"
	  console.log "connecting to database at %s", db_url
	  mongoose.connect db_url
	  app.use express.errorHandler(
	    dumpExceptions: true
	    showStack: true
	  )

Create a new Platform <a id="create"></a>
---------------------
Use the `opdemand list` command to list the available infrastructure templates:

	$ opdemand list | grep nodejs
	app/nodejs/1node: Node.js Application (1-node)
	app/nodejs/2node: Node.js Application (2-node with ELB)
	app/nodejs/4node: Node.js Application (4-node with ELB)
	app/nodejs/Nnode: Node.js Application (Auto Scaling)

Use the `opdemand create` command to create a new platform based on one of the templates listed.  To create an `app/nodejs/1node` platform with `app` as its handle/nickname.

	$ opdemand create app --template=app/nodejs/1node

Configure the Platform
----------------------
To quickly configure a platform from the command-line use `opdemand config [handle] --repository=detect`.  This will attempt to detect and install repository configuration including:

* Detecting your GitHub repository URL, project and username
* Generating and installing a secure SSH Deploy Key

More detailed configuration can be done using:

	$ opdemand config app					   # the entire config wizard (all sections)
	$ opdemand config app --section=provider   # only the "provider" section

Detailed configuration changes are best done via the web console, which exposes additional helpers, drop-downs and overrides.

Start the Platform
------------------
To start your platform use the `opdemand start` command:

	$ opdemand start app
	
You will see real-time streaming log output as OpDemand orchestrates the platform's infrastructure and triggers the necessary SSH deployments.  Once the platform has finished starting you can access its services using an `opdemand show`.

    $ opdemand show app

	Application URL (URL used to access this application)
	http://ec2-23-20-231-188.compute-1.amazonaws.com

Open the URL and you should see "Powered by OpDemand" in your browser.  To check on the status of your platforms, use the `opdemand status` command:

	$ opdemand status
	app: Node.js Application (1-node) (status: running)

Deploy the Platform
----------------------
As you make changes to your application code, push those to GitHub as you would normally.  When you're ready to deploy those changes, use the `opdemand deploy` command:

	$ opdemand deploy app

This will trigger an OpDemand deploy action which will -- among other things -- update configuration settings, pull down the latest source code, install new dependencies and restart services where necessary.


Additional Resources
====================
* <http://www.opdemand.com>

