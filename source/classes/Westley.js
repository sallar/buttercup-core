(function(module) {

	"use strict";

	var Inigo = require("__buttercup/classes/InigoGenerator.js"),
		commandTools = require("__buttercup/tools/command.js"),
		searching = require("__buttercup/tools/searching.js"),
		entry = require("__buttercup/tools/entry.js");

	var VALID_COMMAND_EXP = 			/^[a-z]{3}[ ].+$/;

	var commandClasses = {
		cen: require("__buttercup/classes/commands/command.cen.js"),
		cgr: require("__buttercup/classes/commands/command.cgr.js"),
		cmm: require("__buttercup/classes/commands/command.cmm.js"),
		dea: require("__buttercup/classes/commands/command.dea.js"),
		dem: require("__buttercup/classes/commands/command.dem.js"),
		den: require("__buttercup/classes/commands/command.den.js"),
		dga: require("__buttercup/classes/commands/command.dga.js"),
		dgr: require("__buttercup/classes/commands/command.dgr.js"),
		fmt: require("__buttercup/classes/commands/command.fmt.js"),
		men: require("__buttercup/classes/commands/command.men.js"),
		mgr: require("__buttercup/classes/commands/command.mgr.js"),
		pad: require("__buttercup/classes/commands/command.pad.js"),
		sea: require("__buttercup/classes/commands/command.sea.js"),
		sem: require("__buttercup/classes/commands/command.sem.js"),
		sep: require("__buttercup/classes/commands/command.sep.js"),
		sga: require("__buttercup/classes/commands/command.sga.js"),
		tgr: require("__buttercup/classes/commands/command.tgr.js")
	};

	/**
	 * Westley. Archive object dataset and history manager. Handles parsing and
	 * revenge for the princess.
	 * @class Westley
	 */
	var Westley = function() {
		this.clear();
	};

	/**
	 * Clear the dataset and history
	 * @returns {Westley} Returns self
	 * @memberof Westley
	 */
	Westley.prototype.clear = function() {
		this._dataset = {};
		this._history = [];
		this._cachedCommands = {};
		return this;
	};

	/**
	 * Execute a command - stored in history and modifies the dataset
	 * @param {String} command The command to execute
	 * @returns {Westley} Returns self
	 * @memberof Westley
	 */
	Westley.prototype.execute = function(command) {
		if (!VALID_COMMAND_EXP.test(command)) {
			throw new Error("Invalid command");
		}
		var commandComponents = commandTools.extractCommandComponents(command),
			commandKey = commandComponents.shift();

		var commandObject = this._getCommandForKey(commandKey);
		this._history.push(command);
		commandObject.execute.apply(commandObject, [this._dataset].concat(commandComponents));
		return this;
	};

	/**
	 * Gets a command by its key from the cache with its dependencies injected
	 * @param {String} commandKey The key of the command
	 * @returns {Command} Returns the command
	 * @memberof Westley
	 */
	Westley.prototype._getCommandForKey = function(commandKey) {
		// If the command doesn't exist in the cache
		if (this._cachedCommands[commandKey] === undefined) {
			// Get the command object and inject its dependencies
			var requirement = new (commandClasses[commandKey])();

			if (requirement.injectSearching !== undefined) {
				requirement.injectSearching(searching);
			}

			if (requirement.injectEntry !== undefined) {
				requirement.injectEntry(entry);
			}

			// Store it in the cache
			this._cachedCommands[commandKey] = requirement;
		}

		return this._cachedCommands[commandKey];
	};

	/**
	 * Insert a padding in the archive (used for delta tracking)
	 * @returns {Westley} Returns self
	 * @memberof Westley
	 */
	Westley.prototype.pad = function() {
		this.execute(Inigo.generatePaddingCommand());
		return this;
	};

	/**
	 * Get the core dataset
	 * @returns {Object}
	 * @memberof Westley
	 */
	Westley.prototype.getDataset = function() {
		return this._dataset;
	};

	/**
	 * Get the history (deltas)
	 * @returns {String[]}
	 * @memberof Westley
	 */
	Westley.prototype.getHistory = function() {
		return this._history;
	};

	module.exports = Westley;

})(module);
