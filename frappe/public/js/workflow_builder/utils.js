export function get_workflow_elements(workflow) {
	let elements = [];
	let states = {};
	let x = 150;
	let y = 100;

	function state_obj(id, data) {
		let state = {
			id: id.toString(),
			type: "state",
			position: { x: x, y: y },
			data: data,
		};
		if (!states[data.state]) {
			states[data.state] = [id, { x: x, y: y }];
		}
		return state;
	}

	function action_obj(id, data, position) {
		return {
			id: "action-" + id,
			type: "action",
			position: position,
			data: data,
		};
	}

	function transition_obj(id, source, target) {
		return {
			id: "edge-" + id,
			type: "transition",
			source: source.toString(),
			target: target.toString(),
			sourceHandle: "right",
			targetHandle: "left",
			updatable: true,
			animated: true,
		};
	}

	workflow.states.forEach((state, i) => {
		x += 400;
		elements.push(
			state_obj(i + 1, {
				state: state.state,
				doc_status: state.doc_status,
				allow_edit: state.allow_edit,
				update_field: state.update_field,
				update_value: state.update_value,
				is_optional_state: state.is_optional_state,
				next_action_email_template: state.next_action_email_template,
				message: state.message,
			})
		);
	});

	workflow.transitions.forEach((transition, i) => {
		let source = states[transition.state];
		let target = states[transition.next_state];
		let position = { x: source[1].x + 250, y: y + 20 };
		let data = {
			from: transition.state,
			to: transition.next_state,
			action: transition.action,
			allowed: transition.allowed,
			allow_self_approval: transition.allow_self_approval,
			condition: transition.condition,
		};

		let action = "action-" + (i + 1);

		elements.push(action_obj(i + 1, data, position));
		elements.push(transition_obj(source[0] + "-" + action, source[0], action));
		elements.push(transition_obj(action + "-" + target[0], action, target[0]));
	});

	return elements;
}
