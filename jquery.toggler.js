/*!
 * jQuery Toggler Plugin
 * Original author: Landon Durnan
 */

;(function ( $, window, document, undefined ) {

	"use strict"; 

	function Toggler ( element, options ) {
		this.element = $(element);
		this.options = $.extend({}, $.fn.toggler.defaults, options);
		this.init();
	}

	Toggler.prototype = {

		init : function() {
			var $this = this.element
				,	listen =  $this[0].tagName + '[name=' + $this.attr('name') + ']';

			this.process( listen );
			this.bind( listen );

			return this;
		},

		bind : function ( listen ) {
			var that = this;

			$(listen).on('change', null, function() {	
				that.process(listen);
				that.clearHiddenValues();
				that.options.callback.call(this);
			});
		},

		process : function ( listen ) {
			var elem = this.element
				,	trigger = this.getTrigger(elem);

			// First thing we want to do is hide all toggleable elements
			this.hide( this.getId( elem ) );

			if ($(elem).is(':radio')){ listen += ':checked'; } // Get the checked value of radio button

			if ( $(elem).is(':checkbox:checked') || (!$(elem).is(':checkbox') && trigger.indexOf($(listen).val()) > -1 )) {
				this.show( this.getToggle( elem ) );
			}

			return true;
		},

		// Every time the element is changed, get and return the IDs we need to show
		getToggle : function ( elem ) {

			if ( !$(elem).data('toggle') ) {
					return $(elem).find(':selected').data('toggle').split(" ").map(this.addHash);
			} else {
				return $(elem).data('toggle').split(" ").map(this.addHash);
			}
		},

		getId : function ( elem ) {
			var id = [] 
				,	data;

			if ( !$(elem).data('toggle') ) {
				$(elem).children('[data-toggle]').each(function(i) {
					data = $(this).data('toggle').split(" ");
					id = id.concat(data);
				});
				id = $.unique(id);
			} else {
				data = $(elem).data('toggle').split(" ");
				id = id.concat(data);
			}

			return id.map(this.addHash);
		},

		addHash : function ( id ) {
			return '#' + id;
		},

		getTrigger : function ( elem ) {
			var trigger = [];
			
			if ( !$(elem).data('toggle') ) {
				$(elem).children('[data-toggle]').each(function() {
					trigger.push( $(this).val() );
				});
			} else {
				trigger.push( $(elem).val() );
			}
			return trigger;
		},

		clearHiddenValues: function() {
			var id = this.getId(this.element).toString();

			$(id)
				.find('input:text:hidden,select:hidden')
					.val('')
				.end()
				.find('input:hidden:checked')
					.removeAttr('checked')
				.end()
				.find('input:radio:first')
					.attr('checked', true);
		},

		show : function ( id ) {
			id = id.toString();
			//$(id).find('input:radio:first').attr('checked', true);
			$(id).show();
		},

		hide : function ( id ) {
			id = id.toString();
			$(id).hide();
		}
	};

	$.fn.toggler = function ( option ) {
		return this.each(function () {
			var $this = $(this)
				, data = $this.data('toggler')
				, options = typeof option === 'object' && option;
			if (!data){ $this.data('toggler', (data = new Toggler(this, option))); }
		});
	};

	$.fn.toggler.defaults = {
		callback : function(){}
	}

})( jQuery, window, document );