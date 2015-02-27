chrome.storage.sync.get({
    token: ''
}, function(items) {
    var cache = {};
    $(function() {
        function apiUrl(sha) {
            var ownerRepo = document.location.pathname.match(/([^\/]+)\/([^\/]+)\//);
            return 'https://api.github.com/repos/' + ownerRepo[1] +
                '/' + ownerRepo[2] +
                '/statuses/' + sha;
        }

        function pageUpdate() {
            $('button[aria-label="Copy the full SHA"]').each(function(index, el) {
                var sha = $(el).data('clipboard-text');
                if (cache[sha]) return showStatuses(el, cache[sha]);
                $.ajax({
                    url: apiUrl(sha),
                    headers: {
                        Authorization: 'Bearer ' + items.token
                    },
                    success: function(data) {
                        cache[sha] = data;
                        showStatuses(el, cache[sha]);
                    }
                });
            });
        }

        function showStatuses(el, data) {
            var wrapper = $(el).parent().parent();
            wrapper.find('.statuses').remove();
            var statuses = $('<div></div>')
                .attr('class', 'statuses');
            wrapper.append(statuses);
            data.forEach(function(status) {
                var colors = {
                    success: 'green',
                    failure: 'red',
                    pending: 'gray',
                    error: 'yellow'
                };
                $('<a></a>')
                    .css('color', colors[status.state])
                    .attr('href', status.target_url)
                    .text('$')
                    .appendTo(wrapper);
            });
        }

        // trigger a pageUpdate for the initial page load and for pjax load
        $(document)
            .on('ready', pageUpdate);
    });
});
