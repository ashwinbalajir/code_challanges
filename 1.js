let session = msg.orbita.session;
let slots = msg.payload.request.intent.slots;
let action = slots.action;
//added-> changed the condition and removed delete session.followuptype;
if (session.followuptype === 'personprompt') {
	if ((action && !action.value) || !action) {
		delete session.dependent;
	}
}
//end add
let dependent = session.dependent;
let depArray = msg.payload.session.attributes.dependent ? msg.payload.session.attributes.dependent.length : 0;
let output = null;
let none_intent = false;
let allset = session.allset;

session.currentFlow = 'Emblem';

//context cleanup
delete session.prompts;
delete session.allset;
delete session.lastIntentType;

let queryResult = msg.payload.queryResult;
if ((queryResult && queryResult.queryText.indexOf('me') != -1) || session.intent) {
	if (slots.dependent && slots.dependent.value) {
		dependent = slots.dependent.value;
	}
}

//check dependent slot values and assign ,if some other dependent filled with self take that as priority
if (depArray > 1) {
	let meLength = 0;
	for (let i = 0; i < depArray; i++) {
		if (msg.payload.session.attributes.dependent[i] != 'self') {
			dependent = msg.payload.session.attributes.dependent[i];
			break;
		} else {
			meLength += 1;
		}
	}
	if (!dependent && meLength > 1) {
		dependent = session.dependentlist.source[0];
	}
}
let personName = null;
if (slots.personName && slots.personName.value) {
	personName = slots.personName.synonym;
	node.warn(personName + ' personName');
	dependent = personName;
}

if (dependent) {
	session.dependent = dependent;
	let relation_index = session.relationship.indexOf(session.dependent.toLowerCase());
	let relationship_fullnames = [];
	session.userdetails.forEach((user) => {
		if (user.relationship.toLowerCase() === dependent.toLowerCase()) relationship_fullnames.push(user.fullname);
	});
	if (relationship_fullnames.length && relationship_fullnames.length > 1) {
		msg.payload.relation = dependent;
		msg.payload.button = relationship_fullnames;
	} else {
		let dependent_index = session.dependentlist.lowercase.indexOf(session.dependent.toLowerCase());
		msg.payload.personName = relation_index > -1 ? session.dependentlist.source[relation_index] : dependent_index > -1 ? session.dependentlist.source[dependent_index] : session.dependent;
	}
	node.warn(msg.payload.personName + 'person name');
}
if (action && action.value) {
	session.action = action.value;
}

let intent = msg.payload.request.intent.name;
if (msg.payload.request.intent.name === 'GetId' && session.relationship.length === 1) {
	session.dependent = session.dependentlist.source[0];
	msg.payload.personName = session.dependent;
}
if (!session.intent && intent === 'Dependent' && session.followuptype !== 'personprompt') {
	none_intent = true;
} else if (!dependent && !personName) {
	let name = session.dependentlist.source[0];
	msg.payload.prompt =
		session.slot === 'dep_prompt'
			? 'Can you please select which member I can help you with?'
			: `Ok ${name}, I see there are additional members included on your policy. Which member can I help you with?`;
	session.slot = 'dep_prompt';
	if (!session.intent) session.intent = intent;
	msg.payload.button = Object.assign([], session.dependentlist.source);
	msg.payload.button[0] = 'Self';
	output = [ msg, null, null ];
} else if (dependent) {
	delete session.followuptype;
	if (!session.intent) {
		session.intent = intent;
	}
	if (dependent === 'dependent') {
		session.slot = 'family_prompt';
		msg.payload.prompt = 'Please provide name or relationship of your dependents or you can select from the dependents below.';
		msg.payload.button = session.relationship.filter((relation) => relation != 'self');
		output = [ msg, null, null ];
	} else if (msg.payload.relation) {
		msg.payload.prompt = `There are multiple dependents listed as ${session.dependent}. Please choose the dependent of your choice from the list.`;
		output = [ msg, null, null ];
	} else {
		node.warn('fulfilled dep ' + dependent);
		let dependent_lc = dependent.toLowerCase();
		var argRegEx = new RegExp(dependent_lc);
		const match = session.dependentlist.lowercase.filter((value) => argRegEx.test(value));
		if ((match && match.length) || session.relationship.indexOf(dependent) != -1) {
			if (session.action) {
				output = [ null, msg, null ];
			} else {
				msg.payload.prompt =
					session.slot === 'action'
						? 'Please select an option from below which you want me to help with'
						: `Sure, I can help you with ${msg.payload.personName}'s ID Card. How would you like me to help?`;
				// msg.payload.button = [ 'View Medical ID card', 'Download/Print Medical ID card', 'Mail Medical ID card', 'All set' ];
				session.prompts = { prompts: [ 'View Medical ID card', 'Download/Print Medical ID card', 'Mail Medical ID card', 'All set' ] };
				msg.payload.orbita.multiagent.buttons = { type: '', name: 'buttons', choices: [ 'View Medical ID card', 'Download/Print Medical ID card', 'Mail Medical ID card', 'All set' ] };
				var choices = [];
				let buttons = session.prompts;
				if (buttons.length > 0) {
					for (var i = 0; i < buttons.length; i++) {
						choices[i] = { value: buttons[i], text: buttons[i] };
					}
					msg.payload.orbita.multiagent.buttons = { type: '', name: 'buttons', choices: choices };
					session.buttonsFromNone = msg.payload.orbita.multiagent.buttons;
				}
				session.allset = true;
				//remove session.lastIntentType='allset';
				session.slot = 'action';
				output = [ msg, null, null ];
			}
		} else {
			msg.payload.prompt = `Sorry I do not find the person in your dependents list. Here are the list of dependents mapped to your profile. Please choose from below.`;
			msg.payload.button = Object.assign([], session.dependentlist.source);
			msg.payload.button[0] = 'Self';
			if (allset) {
				msg.payload.button.push('All Set');
				session.allset = true;
			}
			session.slot = 'dep_prompt';
			delete session.dependent;
			output = [ msg, null, null ];
		}
		node.warn('prompt' + msg.payload.prompt);
	}
}
if (!none_intent) {
	delete session.count;
	delete session.buttonsFromNone;
}
if (session.slot) {
	session.lastIntentType = session.slot;
}
if (msg.payload.button) {
	var choices = [];
	let buttons = msg.payload.button;
	if (buttons.length > 0) {
		for (var i = 0; i < buttons.length; i++) {
			choices[i] = { value: buttons[i], text: buttons[i] };
		}
		msg.payload.orbita.multiagent.buttons = { type: '', name: 'buttons', choices: choices };
		session.buttonsFromNone = msg.payload.orbita.multiagent.buttons;
	}
}

if (none_intent) {
	output = [ null, null, msg ];
}
return output;
