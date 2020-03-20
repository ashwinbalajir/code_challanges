let session = msg.orbita.session;
let slots = msg.payload.request.intent.slots;

let documentCategory = slots.documentCategory;
let action = slots.action;

// option to give action item when prompting after fulfillment, delete session if action item not filled
if (session.followuptype === 'personprompt') {
	if ((action && !action.value) || !action) {
		delete session.dependent;
	}
}

let dependent = session.dependent;
let depArray = msg.payload.session.attributes.dependent ? msg.payload.session.attributes.dependent.length : 0;
let output = null,
	noneIntent = false;
let allset = session.allset;
let allsetRepromptSlots = [ 'dep_prompt', 'family_prompt', 'multipleRelationPrompt' ];
//context cleanup
delete session.idSvgImage;
delete session.allset;
// delete session.lastIntentType;

let queryResult = msg.payload.queryResult;
// if (!(queryResult && queryResult.queryText.indexOf('me') >-1 && !msg.orbita.session.intent)) {

// assigns dependent directly if intent session is filled or me is not there in query text
let depSlot = slots.dependent;
if ((queryResult && queryResult.queryText.indexOf('me') != -1) || msg.orbita.session.intent) {
	if (slots.dependent && slots.dependent.value) {
		dependent = slots.dependent.value;
	}
}

//check dependent slot values and assign ,if some other dependent filled with self take that as priority
if (depArray > 1) {
	let meLength = 0;
	for (let i = 0; i < msg.payload.session.attributes.dependent.length; i++) {
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
// node.warn('dependent value resolved' + dependent);

//person name dependency
let personName = slots.personName ? slots.personName : null;
//Handling as billing gets filled in person name slot
if (personName && personName.synonym && [ 'billing' ].indexOf(personName.synonym.toLowerCase()) > -1) {
	slots.documentCategory = { value: personName.synonym };
	personName = null;
} else if (personName.value && msg.payload.session.attributes.personName && msg.payload.session.attributes.personName.length > 0) {
	personName = msg.payload.session.attributes.personName[0].name;
	if (msg.payload.session.attributes.personName.length > 1) {
		personName += ` ${msg.payload.session.attributes.personName[1].name}`;
	}
	dependent = personName;
} else personName = null;

let intent = msg.payload.request.intent.name;

if ((!session.intent || (session.intent && session.followuptype === 'personprompt')) && intent !== 'Dependent') session.intent = intent;
if (!session.dependent) {
	let followUpEntities = global.get('followUpEntities');
	msg = followUpEntities(msg);
}
//If dependent variable is filled and checks for other scenerious of dependent
if (dependent && dependent !== session.dependent) {
	if (session.slot === 'doctor_name') {
		slots.doctorName = dependent;
	} else {
		// session.dependent = dependent;
		let multipleDependents_FN = [];
		session.userdetails.forEach(function(user) {
			if (user.relationship.toLowerCase() === dependent.toLowerCase()) multipleDependents_FN.push(user.fullname);
		});
		if (multipleDependents_FN.length && multipleDependents_FN.length > 1) {
			msg.payload.depPromptType = 'multiple_dependents';
			msg.payload.buttons = multipleDependents_FN;
		} else {
			let dependentIndex = session.dependentlist.lowercase.indexOf(dependent.toLowerCase());
			let relationIndex = session.relationship.indexOf(dependent.toLowerCase());
			session.dependent = relationIndex > -1 ? session.dependentlist.source[relationIndex] : dependentIndex > -1 ? session.dependentlist.source[dependentIndex] : null;
			if (!session.dependent) {
				msg.payload.depPromptType = dependent === 'dependent' ? 'family_prompt' : 'person_not_found';
			}
		}
	}
}

if (msg.payload.depPromptType) {
	switch (msg.payload.depPromptType) {
		case 'multiple_dependents':
			msg.payload.prompt = `There are multiple dependents listed as ${dependent}. Please choose the dependent of your choice from the list.`;
			session.slot = 'multipleRelationPrompt';
			break;
		case 'family_prompt':
			msg.payload.prompt = 'Please provide name or relationship of your dependents or you can select from the dependents below.';
			session.slot = 'family_prompt';
			msg.payload.buttons = session.relationship.filter((relation) => relation != 'self');
			break;
		case 'person_not_found':
			msg.payload.prompt = `Sorry I do not find the person in your dependents list. Here are the list of dependents mapped to your profile. Please choose from below.`;
			msg.payload.buttons = Object.assign([], session.dependentlist.source);
			msg.payload.buttons[0] = 'Self';
			session.slot = 'dep_prompt';
			session.allset = true;
			break;
	}
	delete session.dependent;
	// delete session.followuptype;
	output = [ msg, null, null ];
}
//if intent is main usecase and only one relation detail there in db response
if (intent !== 'Dependent' && session.relationship.length === 1) {
	session.dependent = session.dependentlist.source[0];
	msg.payload.personName = session.dependent;
}
//check for intent name in session otherwise fallback
if (!session.intent && intent === 'Dependent' && session.followuptype !== 'personprompt') {
	delete session.dependent;
	noneIntent = true;
} else if (!msg.payload.depPromptType && !session.dependent) {
	//slot not filled prompt
	let name = session.dependentlist.source[0];
	msg.payload.prompt =
		session.slot === 'dep_prompt'
			? 'Can you please select which member I can help you with?'
			: `Ok ${name}, I see there are additional members included on your policy. Which member can I help you with?`;
	session.slot = 'dep_prompt';
	// 	else if(session.intent && session.followuptype === 'personprompt') session.intent = msg.payload.request.intent.name
	msg.payload.buttons = Object.assign([], session.dependentlist.source);
	msg.payload.buttons[0] = 'Self';
	// delete session.followuptype;
	output = [ msg, null, null ];
} else if (session.dependent) {
	//fulfilled
	node.warn('fulfilled dep ' + dependent);
	output = [ null, msg ];
	delete session.followuptype;
}
if (!noneIntent) {
	delete session.count;
	delete session.buttonsFromNone;
	delete session.followuptype;
}
if (session.slot) {
	if (allsetRepromptSlots.indexOf(session.slot) != -1 && allset && msg.payload.buttons) {
		session.allset = true;
	}
	// session.lastIntentType = session.slot;
}

if (msg.payload.buttons) {
	let buttonsFunction = global.get('buttonsEFn');
	msg = buttonsFunction(msg);
}
if (noneIntent) {
	let noneintent = global.get('noneIntentEFn');
	msg = noneintent(msg);
	output = [ msg, null, null ];
}
return output;
