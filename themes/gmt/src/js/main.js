import '../../../../../gmt-theme/dist/js/_matches.polyfill.js';
import mailchimp from '../../../../../gmt-theme/dist/js/mailchimp.js';

// Mailchimp form
if (document.querySelector('#mailchimp-form')) {
	mailchimp(function (data) {
		if (data.code === 200) {
			window.location.href = 'https://gomakethings.com/newsletter-success';
		}
	});
}