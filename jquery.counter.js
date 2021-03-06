;(function($) {

$.widget("ui.counter", {
	version : '1.0',
	name    : 'jQuery counter',
	options : {
		debug            : false,
		maxLength        : null,   // Max length of the message
		typedElem        : null,
		maxLengthElem    : null,
		autoDetect       : true,  // Autodetect the typed/maxChars elements
		handleFormSubmit : true,  // If the plugin should disable submit button on length 0
		inverse          : false, // Substract the length of message from maxLength instead of just counting the length
		classes          : {selected: 'selected', length: 'length'},
		onBeforeCreate   : null,
		onAfterCreate    : null,
		onBeforeUpdate   : null,
		onAfterUpdate    : null,
		onBeforeReset    : null,
		onAfterReset     : null,
		onBlur           : null,
		onFocus          : null
	},

	_typedElem     : null,
	_maxLengthElem : null,
	_parentForm    : null,

	_create : function() {
		this._log('Starting plugin ' + this.name);

		var self         = this;
		var options      = self.options;
		self._parentForm = self.element.parents('form');

		if (!self._trigger('onBeforeCreate', null, {options: options, widget: self}))
		{
			self._log('onBeforeCreate triggered');
			return false;
		}

		if (options.autoDetect === true)
		{
			self._log('AutoDetect enabled');

			self._typedElem     = self._parentForm.length != 0 && self._parentForm.find('.typed').length    != 0 ? self._parentForm.find('.typed')    : null;
			self._maxLengthElem = self._parentForm.length != 0 && self._parentForm.find('.maxChars').length != 0 ? self._parentForm.find('.maxChars') : null;
		}
		else
		{
			self._typedElem     = options.typedElem     !== null ? $(options.typedElem)     : null;
			self._maxLengthElem = options.maxLengthElem !== null ? $(options.maxLengthElem) : null;
		}

		if (self._maxLengthElem == null)
		{
			throw "Please define maxLengthElem";
		}
		else
		{
			self.options.maxLength = self.options.maxLength !== null ? self.options.maxLength : parseInt(self._maxLengthElem.text());
		}

		self._maxLengthElem.text(options.maxLength);
		self.update();

		self.element
			.focus(function() {
				$(this).toggleClass(self.options.classes.selected);
				self._trigger('onFocus', null, {elem: $(this), widget: self});
			})
			.blur(function(){
				$(this).toggleClass(self.options.classes.selected);
				self._trigger('onBlur', null, {elem: $(this), widget: self});
			})
			.keyup(function(){
				self.update();
			});

		self._log('onAfterCreate triggered');
		self._trigger('onAfterCreate', null, {options: options, widget: self});
	},

	update : function() {
		var self    = this;
		var content = self.element.val();
		var length  = content.length;

		if (!self._trigger('onBeforeUpdate', null, {content: content, length: length, widget: self}))
		{
			self._log('onBeforeUpdate triggered');
			return false;
		}

		if (length > self.options.maxLength)
		{
			self._log('MaxLength exceeded. Truncating');
			length  = self.options.maxLength;
			content = content.substring(0, self.options.maxLength);
			self.element.val(content);
		}

		if (self._typedElem !== null)
		{
			self._typedElem.text(length);
		}

		if (self.options.inverse)
		{
			self._maxLengthElem.text(self.options.maxLength - length);
		}

		if (length > 0)
		{
			self.element.addClass(self.options.classes.length);
		}
		else
		{
			self.element.removeClass(self.options.classes.length);
		}

		// Disable or enable form submission depending on the content length
		if (self.options.handleFormSubmit === true)
		{
			if (length == 0)
			{
				self._parentForm.find(':submit').addClass('disabled').attr('disabled', true);
			}
			else
			{
				self._parentForm.find(':submit').removeClass('disabled').attr('disabled', false);
			}
		}

		self._log('onAfterUpdate triggered');
		self._trigger('onAfterUpdate', null, {content: content, length: length, widget: self});
	},

	reset : function() {
		var self    = this;
		var element = self.element;
		var content = element.val();
		var length  = content.length;

		if (!self._trigger('onBeforeReset', null, {content: content, length: length, widget: self}))
		{
			self._log('onBeforeReset triggered');
			return false;
		}

		element.val('');
		self.update();

		self._log('onAfterReset triggered');
		self._trigger('onAfterReset', null, {content: content, length: length, widget: self});
	},

	_isPlaceholderSupported : function() {
		var input = document.createElement("input");
		return ('placeholder' in input);
	},

	_log : function(message) {
		if (this.options.debug == true && window.console != undefined)
		{
			console.log('jQuery.counter: ' + message);
		}
	}
});
})( jQuery );

