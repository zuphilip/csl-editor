"use strict";

define(
		[	'src/genericPropertyPanel',
			'src/ConditionalPropertyPanel',
			'src/infoPropertyPanel',
			'src/sortPropertyPanel',
			'src/controller'
		],
		function (
			CSLEDIT_genericPropertyPanel,
			CSLEDIT_ConditionalPropertyPanel,
			CSLEDIT_infoPropertyPanel,
			CSLEDIT_sortPropertyPanel,
			CSLEDIT_controller
		) {
	var suppressUpdates = false; // used to prevent panel updates triggered the panel itself

	// property panels should use this instead of calling CSLEDIT_controller.exec
	// directly to prevent updates to the panel
	var executeCommand = function (command, args) {
		suppressUpdates = true;
		CSLEDIT_controller.exec(command, args);
		suppressUpdates = false;
	};

	var setup = function (propertyPanelElement, node, elementString) {
		var dataType,
			schemaAttributes;

		if (suppressUpdates) {
			return;
		}

		// show appropriate property panel
		switch (node.name) {
		case "sort":
			propertyPanelElement.children().remove();
			propertyPanelElement.append(
				"<p>This node allows you to sort your references depending on their " +
				"metadata.</p>" +
				'<p>Create new sort keys using the "+" add node button at the top left.</p>'
				);

		/* TODO: Re-enable sort property panel if:
		 *         1. bug is fixed where re-ordering the sort keys causes crash
		 *         2. ascending/descending option is added for each sort key
		 *
			CSLEDIT_sortPropertyPanel.setupPanel(propertyPanelElement, node, executeCommand);
		*/
			break;
		case "info":
			CSLEDIT_infoPropertyPanel.setupPanel(propertyPanelElement, executeCommand);
			break;
		case "if":
		case "else-if":
			new CSLEDIT_ConditionalPropertyPanel(propertyPanelElement, node, executeCommand);
			break;
		case "choose":
			propertyPanelElement.children().remove();
			propertyPanelElement.append(
				"<p>This node allows you to customise the formatting " +
				"depending on the properties of the reference being cited.</p>" +
				"<p>e.g. To show the volume number <em>only</em> " +
				"if the document type is article-journal:</p>" +
				'<ol>' +
				'<li>1. Use the "+" add node button at the top left to add an "if" node</li>' +
				'<li>2. Edit the "if" node to say "The document type is article-journal"</li>' +
				'<li>3. Within the "if" node, add a "number" node and set it\'s ' +
				'variable to "volume"</li>' +
				'</ol>'
				);
			break;
		default:
			dataType = CSLEDIT_schema.elementDataType(elementString);
			schemaAttributes = CSLEDIT_schema.attributes(elementString);

			CSLEDIT_genericPropertyPanel.setupPanel(
				propertyPanelElement, node, dataType, schemaAttributes,
				CSLEDIT_schema.choices(elementString), executeCommand);
		}
	};

	return {
		setup : setup
	};
});