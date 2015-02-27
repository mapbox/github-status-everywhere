chrome.storage.sync.get({
    token: ''
}, function(items) {
    var cache = {};
    function apiUrl(sha) {
        var ownerRepo = document.location.pathname.match(/([^\/]+)\/([^\/]+)\//);
        return 'https://api.github.com/repos/' + ownerRepo[1] +
            '/' + ownerRepo[2] + '/statuses/' + sha;
    }

    function pageUpdate() {
        $('button[aria-label="Copy the full SHA"]:not(.added-status)').each(function(index, el) {
            $(el).addClass('added-status');
            var sha = $(el).data('clipboard-text');
            if (cache[sha]) return showStatuses(el, cache[sha]);
            $.ajax({
                url: apiUrl(sha),
                headers: { Authorization: 'Bearer ' + items.token },
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
            .css('padding', '5px 0');
        wrapper.append(statuses);
        data.reverse().forEach(function(status) {
            var icons = {
                success: 'octicon-check',
                pending: 'octicon-primitive-dot',
                error: 'octicon-alert',
                failure: 'octicon-bug'
            };
            var colors = {
                success: 'green',
                failure: 'red',
                pending: 'gray',
                error: 'yellow'
            };
            $('<a></a>')
                .css('color', colors[status.state])
                .css('padding', '1px 2px')
                .attr('class', 'tooltipped tooltipped-s')
                .attr('href', status.target_url)
                .attr('aria-label', status.state + ': ' + status.description)
                .append($('<span></span>')
                    .attr('class', 'octicon ' + icons[status.state]))
                .appendTo(statuses);
        });
    }

    $(function() {
        $(document)
            .on('ready', pageUpdate)
            .bind('DOMSubtreeModified', pageUpdate);
        pageUpdate();
    });
});
