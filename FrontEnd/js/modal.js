jQuery(document).ready(function() {
	$('.launch-modal').on('click', function(e){
		e.preventDefault();
		$( '#' + $(this).data('modal-id') ).modal();
	});
        
        $("#modal-video").on("hidden.bs.modal", function () {
                var url = $('#video-frame').attr('src');
                $('#video-frame').attr('src', '');
                $('#video-frame').attr('src', url);
        });
});